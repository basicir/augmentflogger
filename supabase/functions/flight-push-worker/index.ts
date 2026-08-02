import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import webpush from "https://esm.sh/web-push@3.6.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let reqBody: any = {};
    if (req.method === 'POST') {
      const text = await req.text();
      if (text) {
        try { reqBody = JSON.parse(text); } catch(e) {}
      }
    }

    // 1. Initialize Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Setup web-push
    webpush.setVapidDetails(
      'mailto:admin@augmentflogger.com',
      Deno.env.get('VAPID_PUBLIC_KEY')!,
      Deno.env.get('VAPID_PRIVATE_KEY')!
    );

    // 2. Test Notification Mode
    if (reqBody.test_user_id) {
       const { data: subscriptions, error: subsError } = await supabase
         .from('push_subscriptions')
         .select('*')
         .eq('user_id', reqBody.test_user_id);

       if (subsError) throw subsError;
       if (!subscriptions || subscriptions.length === 0) {
         return new Response(JSON.stringify({ error: "Nincs push token mentve (frissíts rá az appra)!" }), { 
           status: 400,
           headers: { ...corsHeaders, 'Content-Type': 'application/json' }
         });
       }
       
       const payload = JSON.stringify({
          title: "Sikeres Teszt! 🎉",
          body: "A Supabase szerver sikeresen elküldte a háttér push értesítést a telefonodra!",
          url: "/"
       });

       const sendPromises = subscriptions.map(sub => webpush.sendNotification({
         endpoint: sub.endpoint,
         keys: { p256dh: sub.p256dh, auth: sub.auth }
       }, payload).catch(e => console.error(e)));

       await Promise.all(sendPromises);
       return new Response(JSON.stringify({ success: true, message: "Értesítés elküldve!" }), { 
         status: 200, 
         headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
       });
    }

    // 3. Normal Cron Mode: Query active flights that haven't been notified yet
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const now = new Date();
    const flightsToNotify = flights.filter(flight => {
      if (!flight.desired_flight_time || !flight.start_time) return false;
      const startTime = new Date(flight.start_time);
      const [hours, minutes] = flight.desired_flight_time.split(':').map(Number);
      
      const desiredDurationMs = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
      const targetNotificationTimeMs = startTime.getTime() + desiredDurationMs - (10 * 60 * 1000);
      
      return now.getTime() >= targetNotificationTimeMs;
    });

    if (flightsToNotify.length === 0) {
      return new Response(JSON.stringify({ message: "No flights match the time condition yet" }), { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const notifiedFlightIds: string[] = [];
    
    for (const flight of flightsToNotify) {
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
            keys: { p256dh: sub.p256dh, auth: sub.auth }
          };
          return webpush.sendNotification(pushSubscription, payload)
            .catch(async (err) => {
               console.error("Push error for sub:", sub.id, err);
               if (err.statusCode === 410 || err.statusCode === 404) {
                 await supabase.from('push_subscriptions').delete().eq('id', sub.id);
               }
            });
        });

        await Promise.all(sendPromises);
      }
      
      notifiedFlightIds.push(flight.id);
    }
    
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
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
