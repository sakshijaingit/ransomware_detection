import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

interface LogItem {
  date: string;
  time: string;
  fileName: string;
  event: string;
}

const ForensicsLogReport = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getEventColor = (event: string) => {
    if (event.includes("Ransomware") || event.includes("terminated"))
      return "text-destructive";
    if (event.includes("Detected") || event.includes("Suspicious"))
      return "text-warning";
    return "text-success";
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/logs");
        const backendLogs = await response.json();

        const parsedLogs = backendLogs.map((log: any) => {
          const [date, time] = log.time.split(" ");

          return {
            date,
            time,
            fileName: log.file || "N/A",
            event: log.event,
          };
        });

        setLogs(parsedLogs);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch forensic logs", error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
      className="space-y-4"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full cyber-card p-4 flex items-center justify-between transition-all ${
          isExpanded ? "animate-glow" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-foreground">
            FORENSICS LOG REPORT
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-primary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-primary" />
        )}
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="cyber-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              {loading ? (
                <p className="text-center py-6 text-muted-foreground">
                  Loading forensic logs...
                </p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-display text-sm text-primary">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left font-display text-sm text-primary">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left font-display text-sm text-primary">
                        File
                      </th>
                      <th className="px-4 py-3 text-left font-display text-sm text-primary">
                        Event
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-border/50 hover:bg-card/50"
                      >
                        <td className="px-4 py-3 text-sm text-foreground/80">
                          {log.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground/80 font-mono">
                          {log.time}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground/80 font-mono">
                          {log.fileName}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm font-medium ${getEventColor(
                            log.event
                          )}`}
                        >
                          {log.event}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ForensicsLogReport;
