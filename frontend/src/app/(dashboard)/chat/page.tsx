"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Code, Zap } from "lucide-react";
import { useTheme } from "next-themes";

export default function ChatPage() {
  const { theme } = useTheme();
  const pageStyle = { colorScheme: "light" as const };

  return (
    <div
      className="h-[calc(100vh-6rem)] flex items-center justify-center p-4"
      style={pageStyle}
    >
      <Card className="bg-white border-gray-200 max-w-3xl w-full shadow-lg">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Icon */}
            <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <MessageSquare className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Chat Feature
              </h2>
              <p className="text-lg text-gray-600 max-w-xl">
                Implement the chat feature with open router as per instruction
                given.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <Code className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Open Router</p>
                <p className="text-xs text-gray-600 mt-1">API Integration</p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <MessageSquare className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Chat Interface
                </p>
                <p className="text-xs text-gray-600 mt-1">User Experience</p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <Zap className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Real-time</p>
                <p className="text-xs text-gray-600 mt-1">Responsive</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
