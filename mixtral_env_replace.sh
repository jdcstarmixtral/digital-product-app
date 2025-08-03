#!/bin/bash

# Remove existing .env.local
rm -f .env.local

# Write new Mixtral-only environment config
cat <<MIX > .env.local
# MIXTRAL ONLY
OPENROUTER_API_KEY=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
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_HTTP_REFERER=https://jdcstar.com
OPENROUTER_X_TITLE=JDC Super AI

SUPABASE_URL=https://vutukjndonhrzvhthgni.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dHVram5kb25ocnp2aHRoZ25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzNTEzNjcsImV4cCI6MjAxMTkyNzM2N30.CfUflQDGhWObnNiUu9ItIE0_bK1waLUn2xFaF-xZq6I

NEXT_PUBLIC_SUPABASE_URL=https://vutukjndonhrzvhthgni.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dHVram5kb25ocnp2aHRoZ25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzNTEzNjcsImV4cCI6MjAxMTkyNzM2N30.CfUflQDGhWObnNiUu9ItIE0_bK1waLUn2xFaF-xZq6I
MIX

chmod 600 .env.local
echo ".env.local has been replaced with Mixtral-only config ✅"
