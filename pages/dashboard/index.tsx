import React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MixtralChat = dynamic(() => import("@/components/MixtralChat"), { ssr: false });

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">🧠 JDC AI Control Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🧠 AI Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <MixtralChat />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🛠️ System Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full mb-2">Run Self-Healing AI</Button>
            <Button className="w-full mb-2">Force Rebuild Funnels</Button>
            <Button className="w-full mb-2">Trigger Emergency Campaign</Button>
            <Button className="w-full mb-2">Restart Backend Logic</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>📊 System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">• Funnels Live: ✅ 250</p>
            <p className="text-sm text-gray-700">• AI Uptime: ✅ 100%</p>
            <p className="text-sm text-gray-700">• Error Logs: 🚫 None</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
