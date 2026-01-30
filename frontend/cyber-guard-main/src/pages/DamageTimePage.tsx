import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DamagePoint {
  time: number;
  withProtection: number;
  withoutProtection: number;
}

const DamageTimePage = () => {
  const [damageData, setDamageData] = useState<DamagePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDamageHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/history");
        const history = await response.json();

        /*
          Backend history format:
          [
            { time: 1, honeypot: 5, real: 0 },
            { time: 2, honeypot: 10, real: 0 },
            ...
          ]
        */

        const transformedData = history.map((point: any) => ({
          time: point.time,
          withProtection: point.honeypot,
          // Simulated worst-case curve for "no protection"
          withoutProtection: Math.min(point.time * 15, 100),
        }));

        setDamageData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch damage history", error);
      }
    };

    fetchDamageHistory();
    const interval = setInterval(fetchDamageHistory, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-display font-bold neon-text-cyan text-center mb-12"
        >
          Damage Over Time Analysis
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-8"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-8">
            Live Damage vs Time
          </h2>

          <div className="h-80">
            {loading ? (
              <p className="text-center text-muted-foreground">
                Loading damage timeline...
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={damageData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(56, 189, 248, 0.1)"
                  />

                  <XAxis
                    dataKey="time"
                    stroke="#94a3b8"
                    label={{
                      value: "Time (seconds)",
                      position: "bottom",
                      fill: "#94a3b8",
                    }}
                  />

                  <YAxis
                    stroke="#94a3b8"
                    domain={[0, 100]}
                    label={{
                      value: "Damage %",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#94a3b8",
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 8%)",
                      border: "1px solid hsl(199, 60%, 25%)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#38bdf8" }}
                  />

                  <Legend wrapperStyle={{ paddingTop: "20px" }} />

                  <Line
                    type="monotone"
                    dataKey="withProtection"
                    name="With RANSENTRY"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: "#22c55e", strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="withoutProtection"
                    name="No Protection (Simulated)"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <p className="text-center text-muted-foreground mt-6">
            Real-time behavioral detection significantly limits ransomware damage
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-card p-8 mt-8"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            Key Insights
          </h2>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-success">▸</span>
              <span className="text-foreground/80">
                Honeypot-based early detection caps damage below 20%
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-destructive">▸</span>
              <span className="text-foreground/80">
                Without protection, ransomware reaches full encryption rapidly
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">▸</span>
              <span className="text-foreground/80">
                OS-level behavioral monitoring detects attacks in near real-time
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default DamageTimePage;
