import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck } from "lucide-react";

const GlobalRansomAlert = () => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"SAFE" | "ATTACK">("SAFE");
  const [alertKey, setAlertKey] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/status");
        const data = await res.json();

        setStatus(data.system);

        if (data.ransom_alert === true) {
          // 🔥 FORCE replay every time
          setVisible(false);

          setTimeout(() => {
            setAlertKey((k) => k + 1);
            setVisible(true);
          }, 50);
        } else {
          setVisible(false);
        }
      } catch (err) {
        console.error("Failed to fetch ransomware status");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={alertKey}
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="fixed top-0 left-0 right-0 z-[9999] bg-destructive text-white px-6 py-4 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <div>
                <h3 className="font-display font-bold tracking-wide">
                  🚨 RANSOMWARE ACTIVITY DETECTED
                </h3>
                <p className="text-sm opacity-90">
                  Malicious encryption behavior detected. Automated mitigation
                  is in progress.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-semibold">
                System Status: {status}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalRansomAlert;
