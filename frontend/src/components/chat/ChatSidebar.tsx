import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Trash2, Plus, X } from "lucide-react";
import { format } from "date-fns";

interface ChatSidebarProps {
  sessions: any[];
  currentSessionId: string | null;
  loadSession: (id: string) => void;
  deleteSession: (id: string) => void;
  stats: any;
  selectedDocIds: string[];
  selectedDocs: any[];
  // Doc modal props
  docModalOpen: boolean;
  setDocModalOpen: (open: boolean) => void;
  allDocuments: any[];
  toggleDocSelection: (id: string) => void;
  saveDocSelection: () => void;
  removeDoc: (id: string) => void;
  isLoadingStats?: boolean;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  loadSession,
  deleteSession,
  stats,
  selectedDocIds,
  selectedDocs,
  docModalOpen,
  setDocModalOpen,
  allDocuments,
  toggleDocSelection,
  saveDocSelection,
  removeDoc,
}: ChatSidebarProps) {
  return (
    <div className="space-y-4 h-full overflow-y-auto pr-1">
      {/* Chat History */}
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-base">Chat History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4 pb-4">
          {sessions?.length === 0 ? (
            <p className="text-xs text-muted-foreground">No chat history yet</p>
          ) : (
            <div className="max-h-[200px] overflow-y-auto space-y-1">
              {sessions?.map((session) => (
                <div
                  key={session.id}
                  className={`p-2 rounded text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                    currentSessionId === session.id ? 'bg-blue-50 dark:bg-blue-950 font-medium' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0" onClick={() => loadSession(session.id)}>
                      <p className="truncate">{session.title}</p>
                      <p className="text-muted-foreground text-[10px]">{format(new Date(session.createdAt), 'MMM d, h:mm a')}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-base">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm px-4 pb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Docs:</span>
            <Badge variant="outline">{stats?.totalDocs || 0}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pending:</span>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800">{stats?.pending || 0}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Approved:</span>
            <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-800">{stats?.approved || 0}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rejected:</span>
            <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-800">{stats?.rejected || 0}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Referenced Documents */}
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Referenced Docs
          </CardTitle>
          <CardDescription className="text-xs">AI can see these documents</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <Dialog open={docModalOpen} onOpenChange={setDocModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="w-full mb-2">
                <Plus className="h-3 w-3 mr-1" />
                Select Documents ({selectedDocIds.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Select Documents to Reference</DialogTitle>
                <DialogDescription>
                  Choose which documents the AI should analyze and reference in responses
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-4">
                {allDocuments?.map((doc: any) => (
                  <div key={doc.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                    <Checkbox
                      checked={selectedDocIds.includes(doc.id)}
                      onCheckedChange={() => toggleDocSelection(doc.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} • {doc.fund?.name}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDocModalOpen(false)}>Cancel</Button>
                <Button onClick={saveDocSelection}>Save Selection</Button>
              </div>
            </DialogContent>
          </Dialog>

          {selectedDocs && selectedDocs.length > 0 && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {selectedDocs?.map((doc: any) => (
                <div key={doc.id} className="flex items-start justify-between gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.title}</p>
                    <p className="text-muted-foreground truncate">{doc.type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeDoc(doc.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
