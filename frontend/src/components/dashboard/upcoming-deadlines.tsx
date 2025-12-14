import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function UpcomingDeadlines() {
  const deadlines = [
    { fund: "Global Tech Fund", doc: "Annual Report 2024", due: "2 days", urgent: true },
    { fund: "Green Energy ETF", doc: "Q4 Factsheet", due: "5 days", urgent: false },
    { fund: "Alpha Opportunities", doc: "Prospectus Update", due: "1 week", urgent: false },
  ];

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Upcoming Deadlines</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Regulatory submissions due soon.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deadlines.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4 last:border-0 last:pb-0">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.doc}</p>
                <p className="text-xs text-muted-foreground">{item.fund}</p>
              </div>
              <Badge variant={item.urgent ? "destructive" : "secondary"} className="self-start sm:self-auto">
                Due in {item.due}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
