import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import webpush from "https://esm.sh/web-push@3.6.7";

serve(async (req) => {
  try {
    // 1. Initialize Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Query active flights that haven't been notified yet
    const { data: flights, error: flightsError } = await supabase
      .from('flights')
      .select('*')
      .is('end_time', null)
      .not('desired_flight_time', 'is', null)
      .is('push_notified_at', null);

    if (flightsError) throw flightsError;
    if (!flights || flights.length === 0) {
      return new Response(JSON.stringify({ message: "No active flights need notification" }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const now = new Date();
    const flightsToNotify = flights.filter(flight => {
      if (!flight.desired_flight_time || !flight.start_time) return false;
      const startTime = new Date(flight.start_time);
      const [hours, minutes] = flight.desired_flight_time.split(':').map(Number);
      
      const desiredDurationMs = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
      const targetNotificationTimeMs = startTime.getTime() + desiredDurationMs - (10 * 60 * 1000);
      
      // If we are at or past the notification time, we need to notify
      return now.getTime() >= targetNotificationTimeMs;
    });

    if (flightsToNotify.length === 0) {
      return new Response(JSON.stringify({ message: "No flights match the time condition yet" }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 3. Setup web-push
    webpush.setVapidDetails(
      'mailto:admin@augmentflogger.com',
      Deno.env.get('VAPID_PUBLIC_KEY')!,
      Deno.env.get('VAPID_PRIVATE_KEY')!
    );

    const notifiedFlightIds: string[] = [];
    
    for (const flight of flightsToNotify) {
      // 4. Get push subscriptions for the instructor
      const { data: subscriptions, error: subsError } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', flight.instructor_id);
        
      if (subsError) {
        console.error(`Error fetching subscriptions for user ${flight.instructor_id}:`, subsError);
        continue;
      }

      if (subscriptions && subscriptions.length > 0) {
        const payload = JSON.stringify({
          title: "Flight Time Warning",
          body: `Less than 10 minutes remaining of the planned flight time! (${flight.desired_flight_time})`,
          url: "/"
        });

        const sendPromises = subscriptions.map(sub => {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          };
          return webpush.sendNotification(pushSubscription, payload)
            .catch(async (err) => {
               console.error("Push error for sub:", sub.id, err);
               // If subscription is gone/invalid, we could delete it from DB here
               if (err.statusCode === 410 || err.statusCode === 404) {
                 await supabase.from('push_subscriptions').delete().eq('id', sub.id);
               }
            });
        });

        await Promise.all(sendPromises);
      }
      
      // Mark as processed even if they had no subscriptions to prevent infinite retries
      notifiedFlightIds.push(flight.id);
    }
    
    // 5. Update notified flights in the database
    if (notifiedFlightIds.length > 0) {
      const { error: updateError } = await supabase
        .from('flights')
        .update({ push_notified_at: new Date().toISOString() })
        .in('id', notifiedFlightIds);
        
      if (updateError) throw updateError;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      notifiedFlightsCount: notifiedFlightIds.length 
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
});
