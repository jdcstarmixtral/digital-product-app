#!/bin/bash
echo "🚀 Staging and pushing latest API changes to production..."
git add pages/api/gen-image.ts
git commit -m "🔥 Final prod push with Replicate live image generation endpoint"
git push origin main

echo "⏳ Waiting for Vercel build to deploy..."
sleep 30

echo "📸 Testing image generation endpoint..."
curl -X POST https://jdcstar.com/api/gen-image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A glowing blue wolf under a full moon"}'
