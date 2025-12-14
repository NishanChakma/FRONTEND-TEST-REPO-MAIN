"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Document } from "@/types";
import { formatDistanceToNow } from "date-fns";
import {
  useViewport,
  getPaddingClasses,
  shouldStackVertically,
} from "@/lib/responsive-helpers";
import { cn } from "@/lib/utils";

export function RecentActivity({ documents }: { documents: Document[] }) {
  const viewport = useViewport();
  const recentDocs = documents.slice(0, 5);
  const paddingClass = getPaddingClasses(viewport);
  const stackVertical = shouldStackVertically(viewport);

  return (
    <Card className={cn("col-span-1", viewport.isMobile ? "w-full" : "")}>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Latest document submissions and updates.
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(paddingClass)}>
        <div
          className={cn(
            "space-y-6 sm:space-y-8",
            stackVertical ? "space-y-4" : ""
          )}
        >
          {recentDocs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent activity.</p>
          ) : (
            recentDocs.map((doc, i) => (
              <div
                key={doc.id}
                className={cn(
                  "flex gap-3 sm:gap-4",
                  stackVertical
                    ? "flex-col items-start"
                    : "items-start sm:items-center"
                )}
              >
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                  <AvatarImage
                    src={`/avatars/0${(i % 5) + 1}.png`}
                    alt="Avatar"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Document <span className="font-bold">{doc.status}</span>
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      - {doc.title}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(doc.createdAt), {
                      addSuffix: true,
                    })}{" "}
                    in {doc.fund?.code}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
