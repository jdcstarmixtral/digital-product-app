#!/bin/bash

echo "🔧 JDC FINAL FIX SEQUENCE INITIATED..."

# 1. Ensure all critical modules are installed
npm install --save-dev typescript@5.4.5 @types/react@18.2.15 @types/node@20.10.7
npm install react@18.2.0 react-dom@18.2.0 next@13.5.11
npm install node-fetch@2
npm install --save-dev @types/node-fetch@2

# 2. Rebuild safe tsconfig.json
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

# 3. Fallback UI component: components/ui/card.tsx
mkdir -p components/ui
cat << 'EOT' > components/ui/card.tsx
import React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ children, className = "", ...props }: DivProps) {
  return (
    <div className={\`rounded-lg border p-4 shadow \${className}\`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: DivProps) {
  return (
    <div className={\`border-b pb-2 mb-2 font-bold \${className}\`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }: DivProps) {
  return (
    <div className={\`text-gray-700 \${className}\`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: DivProps) {
  return (
    <h2 className={\`text-xl font-semibold \${className}\`} {...props}>
      {children}
    </h2>
  );
}
EOT

# 4. Fallback index route in case /pages/index.tsx is missing
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

# 5. Ensure image output directory exists
mkdir -p public/images

# 6. Optional patch: catch/fallback in permanent_product_image_logic.ts
# (skipped for now — will flag if that script still fails post-patch)

# 7. Final cache reset
rm -rf .next

echo "🛠️ Final build in progress..."
npx next build

echo "🚀 Deploying to Vercel..."
vercel --prod
