#!/bin/bash
# AugmentFlogger Deployment Script
# Run this once to set up Supabase, GitHub, and Vercel

set -e

echo "🛫 AugmentFlogger Deployment Setup"
echo "===================================="

# ── STEP 1: GitHub ──────────────────────────────────────────────────────────
echo ""
echo "📦 Step 1: Creating GitHub Repository..."
gh auth status 2>/dev/null || gh auth login
gh repo create augmentflogger --public --source=. --remote=origin --push
echo "✅ GitHub repo created and code pushed!"

# ── STEP 2: Supabase ────────────────────────────────────────────────────────
echo ""
echo "🗄  Step 2: Setting up Supabase..."
npx supabase@latest login
npx supabase@latest projects create augmentflogger --org-id $(npx supabase@latest orgs list --output json | python3 -c "import sys,json; orgs=json.load(sys.stdin); print(orgs[0]['id'])") --region eu-central-1 --db-password "$(openssl rand -base64 32)" 2>&1
echo "✅ Supabase project created!"
echo ""
echo "⚠️  ACTION REQUIRED:"
echo "   1. Go to https://supabase.com/dashboard"
echo "   2. Open your 'augmentflogger' project"
echo "   3. Go to SQL Editor"
echo "   4. Run the contents of: supabase/schema.sql"
echo "   5. Go to Authentication → Settings → Disable email confirmation"
echo "   6. Copy your Project URL and anon key from Settings → API"
echo ""
read -p "   Press Enter when you've completed the Supabase setup... "

read -p "   Enter your Supabase Project URL: " SUPABASE_URL
read -p "   Enter your Supabase Anon Key: " SUPABASE_ANON_KEY

# ── STEP 3: Vercel ──────────────────────────────────────────────────────────
echo ""
echo "🚀 Step 3: Deploying to Vercel..."
vercel login
vercel --yes \
  --env NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL" \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
  --prod 2>&1

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "Your app is live on Vercel. Check the URL above."
echo "Don't forget to:"
echo "  1. Set the Site URL in Supabase: Authentication → URL Configuration"
echo "     → Site URL = your Vercel deployment URL"
