"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ShieldCheck, AlertCircle, TrendingUp } from "lucide-react";
import { Document, Fund, DocStatus } from "@/types";
import {
  useViewport,
  adaptiveGrid,
  gridColumns,
} from "@/lib/responsive-helpers";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  documents: Document[];
  funds: Fund[];
}

export function StatsCards({ documents, funds }: StatsCardsProps) {
  const viewport = useViewport();
  const totalDocs = documents.length;
  const approvedDocs = documents.filter(
    (d) => d.status === DocStatus.APPROVED
  ).length;
  const pendingDocs = documents.filter(
    (d) => d.status === DocStatus.PENDING || d.status === DocStatus.IN_REVIEW
  ).length;
  const activeFunds = funds.length;

  const complianceRate =
    totalDocs > 0 ? ((approvedDocs / totalDocs) * 100).toFixed(1) : "0";

  const gridClass = adaptiveGrid(viewport);
  const cols = gridColumns(viewport);

  return (
    <div
      className={cn(
        "grid gap-4",
        cols,
        !viewport.isMobile && "md:grid-cols-2 lg:grid-cols-4"
      )}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDocs}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          <ShieldCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{complianceRate}%</div>
          <p className="text-xs text-muted-foreground">Approved documents</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingDocs}</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Funds</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeFunds}</div>
          <p className="text-xs text-muted-foreground">managed on platform</p>
        </CardContent>
      </Card>
    </div>
  );
}
