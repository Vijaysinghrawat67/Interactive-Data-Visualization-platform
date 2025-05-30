import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { UserIcon, ClockIcon, FileBarChartIcon } from "lucide-react";

const actionColorMap = {
  create: "green",
  update: "blue",
  delete: "red",
  export: "purple",
  share: "yellow",
  login: "gray",
  register: "gray",
};

export default function ActivityLogCard({ log }) {
  const { userId, actiontype, visualizationId, createdAt, meta } = log;

  return (
    <Card className="w-full shadow-md mb-4 rounded-2xl">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span>{userId?.name ?? "Unknown User"}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            <span>{format(new Date(createdAt), "PPPpp")}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`text-${actionColorMap[actiontype]}-600 border`}>
            {actiontype.toUpperCase()}
          </Badge>
          {visualizationId?.title && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <FileBarChartIcon className="w-4 h-4" />
              <span>"{visualizationId.title}"</span>
            </div>
          )}
        </div>

        {meta && Object.keys(meta).length > 0 && (
          <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-w-full">
            {JSON.stringify(meta, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
