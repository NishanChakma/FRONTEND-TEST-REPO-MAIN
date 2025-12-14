"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Document, DocStatus } from "@/types";

const COLORS = {
  [DocStatus.APPROVED]: "#16a34a",
  [DocStatus.PENDING]: "#ca8a04",
  [DocStatus.IN_REVIEW]: "#2563eb",
  [DocStatus.REJECTED]: "#dc2626",
  [DocStatus.ARCHIVED]: "#6b7280",
};

export function ComplianceChart({ documents }: { documents: Document[] }) {
  const counts = documents.reduce((acc, doc) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(counts).map((status) => ({
    name: status.replace("_", " "),
    value: counts[status],
    fill: COLORS[status as DocStatus] || "#8884d8",
  }));

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          Document Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
