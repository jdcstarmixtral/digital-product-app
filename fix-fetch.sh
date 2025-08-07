#!/bin/bash

echo "🛠️ Installing missing node-fetch@2 + types..."

npm install node-fetch@2
npm install --save-dev @types/node-fetch@2

echo "✅ node-fetch installed correctly. Rebuilding..."
npx next build

echo "🚀 Re-deploying..."
vercel --prod
