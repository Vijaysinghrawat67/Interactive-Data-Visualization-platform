import { useEffect, useState } from "react";
import { getActivityLogs } from "@/services/apiServices.js";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const actionColorMap = {
  create: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300",
  update: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300",
  delete: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300",
  export: "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-300",
  share: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300",
  login: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  register: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await getActivityLogs();
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">📊 Activity Logs</h2>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : logs.length === 0 ? (
        <p className="text-muted-foreground text-center mt-8 dark:text-gray-400">
          No activity logs found.
        </p>
      ) : (
        <div className="rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="min-w-full bg-white dark:bg-gray-900 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr className="text-left text-xs uppercase tracking-wider text-gray-700 dark:text-gray-400">
                <th className="px-4 py-3 border border-gray-200 dark:border-gray-700">User</th>
                <th className="px-4 py-3 border border-gray-200 dark:border-gray-700">Action</th>
                <th className="px-4 py-3 border border-gray-200 dark:border-gray-700">Title</th>
                <th className="px-4 py-3 border border-gray-200 dark:border-gray-700">Time</th>
                <th className="px-4 py-3 border border-gray-200 dark:border-gray-700">Meta</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                    {log.userId?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 dark:border-gray-700">
                    <Badge
                      className={`${actionColorMap[log.actiontype] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
                    >
                      {log.actiontype.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                    {log.visualizationId?.title || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                    {format(new Date(log.createdAt), "PPPpp")}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 dark:border-gray-700">
                    {log.meta && Object.keys(log.meta).length > 0 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(log._id)}
                        className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300"
                      >
                        {expanded[log._id] ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            View
                          </>
                        )}
                      </Button>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Meta Expanded Rows */}
          {logs.map(
            (log) =>
              expanded[log._id] && log.meta && (
                <div
                  key={`${log._id}-meta`}
                  className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-sm text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-700 overflow-auto"
                >
                  <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-200 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-1 text-left">Key</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-1 text-left">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(log.meta).map(([key, value]) => (
                        <tr key={key} className="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-1 align-top font-mono">{key}</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-1 font-mono whitespace-pre-wrap">
                            {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
          )}

        </div>
      )}
    </div>
  );
}
