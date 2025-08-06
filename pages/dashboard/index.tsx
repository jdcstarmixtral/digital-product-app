import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SystemControls from "@/components/SystemControls";

const MixtralChat = dynamic(() => import("@/components/MixtralChat"), { ssr: false });

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Card className="shadow-xl border rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">💡 JDC AI Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <MixtralChat />
          <SystemControls />
        </CardContent>
      </Card>
    </div>
  );
}
