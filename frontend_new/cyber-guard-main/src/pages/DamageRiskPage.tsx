import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface RiskItem {
  name: string;
  value: number;
  color: string;
}

const attackVectors = [
  {
    name: "Honeypot Damage",
    description: "Early detection damage absorbed by decoy files",
    color: "text-primary",
  },
  {
    name: "Real File Damage",
    description: "Actual production data affected by ransomware",
    color: "text-secondary",
  },
  {
    name: "CPU Stress",
    description: "System resource strain during attack",
    color: "text-accent",
  },
  {
    name: "Lockdown",
    description: "Mitigation and containment activation level",
    color: "text-success",
  },
];

const DamageRiskPage = () => {
  const [riskData, setRiskData] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        const response = await fetch("http://localhost:5000/status");
        const data = await response.json();

        const metrics = data.metrics || {};

        setRiskData([
          {
            name: "Honeypot Damage",
            value: metrics.honeypot_damage ?? 0,
            color: "#ec4899",
          },
          {
            name: "Real File Damage",
            value: metrics.real_file_damage ?? 0,
            color: "#38bdf8",
          },
          {
            name: "CPU Stress",
            value: metrics.cpu_stress ?? 0,
            color: "#a855f7",
          },
          {
            name: "Lockdown",
            value: metrics.lockdown ?? 0,
            color: "#22c55e",
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch backend metrics", error);
      }
    };

    fetchRiskData();
    const interval = setInterval(fetchRiskData, 2000);

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
          className="text-3xl md:text-4xl font-display font-bold neon-text-purple text-center mb-12"
        >
          Risk Distribution Analysis
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card-purple p-8"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-8">
            Live Damage Risk Distribution
          </h2>

          <div className="h-80">
            {loading ? (
              <p className="text-center text-muted-foreground">
                Fetching backend metrics...
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="transparent"
                  >
                    {riskData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{
                          filter: `drop-shadow(0 0 10px ${entry.color}50)`,
                        }}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 8%)",
                      border: "1px solid hsl(271, 81%, 56%)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Impact"]}
                  />

                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <p className="text-center text-muted-foreground mt-6">
            Real-time ransomware impact derived from backend detection engine
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-card-purple p-8 mt-8"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            Metric Breakdown
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {attackVectors.map((vector, idx) => (
              <motion.div
                key={vector.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="p-4 bg-card/30 rounded-lg"
              >
                <h3 className={`font-display font-bold ${vector.color} mb-2`}>
                  {vector.name}
                </h3>
                <p className="text-sm text-foreground/70">
                  {vector.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DamageRiskPage;
