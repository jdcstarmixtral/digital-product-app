import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type HealthReport = {
  status: "OK" | "ISSUES_DETECTED";
  report: {
    chat: boolean;
    corelaws: boolean;
    dashboard: boolean;
    fallbackRoutes: boolean;
    paymentEngine: boolean;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<HealthReport>) {
  const checkPath = (filePath: string) => {
    return fs.existsSync(path.join(process.cwd(), filePath));
  };

  const report = {
    chat: checkPath("pages/chat.tsx"),
    corelaws: checkPath("pages/api/corelaws.ts"),
    dashboard: checkPath("pages/dashboard/index.tsx"),
    fallbackRoutes: checkPath("pages/products/lowtier/[slug].tsx"),
    paymentEngine: checkPath("pages/api/payment/square.ts"),
  };

  const healthy = Object.values(report).every(Boolean);

  res.status(200).json({
    status: healthy ? "OK" : "ISSUES_DETECTED",
    report,
  });
}
