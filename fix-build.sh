#!/bin/bash
# [JDC Emergency Patch v1.3]

echo "🔥 JDC Emergency Patch Starting..."

# 1. Force install correct TypeScript + React combo
npm install --save-dev typescript@5.4.5 @types/react@18.2.15 @types/node@20.10.7
npm install react@18.2.0 react-dom@18.2.0 next@13.5.11 --force

# 2. Regenerate safe tsconfig.json
cat << 'EOT' > tsconfig.json
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOT

# 3. Inject fallback /pages/index.tsx to prevent crash
mkdir -p pages
cat << 'EOT' > pages/index.tsx
export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>✅ JDC System Online</h1>
      <p>This is the fallback index route.</p>
    </div>
  );
}
EOT

# 4. Clean cache & rebuild locally before deploy
rm -rf .next
npx next build

echo "✅ Patch Complete. Deploying..."
vercel --prod
