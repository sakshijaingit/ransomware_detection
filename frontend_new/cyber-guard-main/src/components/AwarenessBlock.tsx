import { motion } from "framer-motion";
import { Shield, Lock, AlertTriangle, Eye } from "lucide-react";
import { useState } from "react";
const speakText = (text: string) => {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};

const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

const AwarenessBlock = () => {
  const [showDetails, setShowDetails] = useState(false);

  const handleKnowMore = () => {
    if (showDetails) {
      // Closing the section
      stopSpeech();
      setShowDetails(false);
    } else {
      // Opening the section
      setShowDetails(true);
      speakText(narrationText);
    }
  };

  const narrationText = `
  Ransomware attacks occur every eleven seconds globally.
  The average ransom payment exceeds two hundred thousand dollars.
  Behavioral detection stops ninety five percent of zero day attacks.
  RANSENTRY monitors file access patterns in real time.

  How ransomware works.
  Once ransomware enters a system, it rapidly encrypts files and restricts user access,
  forcing victims to pay for recovery.

  Why traditional security fails.
  Signature based tools only detect known threats,
  allowing new ransomware variants to bypass defenses.

  How RANSENTRY helps.
  RANSENTRY identifies suspicious behavior such as mass file encryption
  and abnormal process activity to stop attacks early.
  `;


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="cyber-card p-8 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="relative z-10">
        <h3 className="text-xl font-display font-bold text-foreground mb-6 text-center">
          Awareness Animation Block
        </h3>

        {/* Animation Area */}
        <div className="flex justify-center mb-8">
          <div className="relative w-44 h-44 flex items-center justify-center">

            {/* OUTER DASHED RING */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
            />

            {/* INNER STATIC RING */}
            <div className="absolute w-28 h-28 rounded-full border border-primary/40" />

            {/* CENTER SHIELD */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-card neon-border flex items-center justify-center"
            >
              <Shield className="w-10 h-10 text-primary glow-pulse" />
            </motion.div>

            {/* INNER ORBIT — ALERT */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="-translate-x-14">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
            </motion.div>

            {/* OUTER ORBIT — LOCK */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="translate-x-20">
                <Lock className="w-5 h-5 text-green-500" />
              </div>
            </motion.div>

          </div>
        </div>

        <p className="text-center text-foreground/80 mb-6">
          Stay informed. Stay secure.
        </p>

        {/* Button */}
        <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (showDetails) {
              stopSpeech();
              setShowDetails(false);
            } else {
              window.speechSynthesis.cancel();
              setShowDetails(true);
              speakText(narrationText);
            }
          }}
          className="neon-button-solid px-8 py-3 font-display"
        >
          KNOW MORE
        </motion.button>
      </div>


        {/* Expandable Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mt-6 p-6 bg-card/50 rounded-lg neon-border overflow-hidden"
          >
            <h4 className="font-display font-bold text-primary mb-4">
              Ransomware Awareness
            </h4>

            {/* EXISTING BULLETS (UNCHANGED) */}
            <ul className="space-y-3 text-sm text-foreground/80 mb-5">
              <li className="flex items-start gap-2">
                <span className="text-primary">▹</span>
                Ransomware attacks occur every 11 seconds globally
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▹</span>
                Average ransom payment exceeds $200,000
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▹</span>
                Behavioral detection stops 95% of zero-day attacks
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▹</span>
                RANSENTRY monitors file access patterns in real-time
              </li>
            </ul>
            <div className="mt-6 space-y-4 text-sm text-foreground/75 leading-relaxed">

              <p>
                <span className="text-primary font-medium">
                  How ransomware works:
                </span>{" "}
                Once ransomware enters a system, it rapidly encrypts files and restricts
                user access, forcing victims to pay for recovery.
              </p>

              <p>
                <span className="text-primary font-medium">
                  Why traditional security fails:
                </span>{" "}
                Signature-based tools only detect known threats, allowing new ransomware
                variants to bypass defenses.
              </p>

              <p>
                <span className="text-primary font-medium">
                  How RANSENTRY helps:
                </span>{" "}
                RANSENTRY identifies suspicious behavior such as mass file encryption and
                abnormal process activity to stop attacks early.
              </p>

            </div>

            {/* ➕ ADDITIONAL INFORMATION (NEW) */}
            {/* VISUAL EXPLANATION ANIMATION */}
            <div className="mt-8 flex items-center justify-center gap-6">

              {/* Threat */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center"
              >
                <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
                <span className="text-xs text-foreground/70">Ransomware</span>
              </motion.div>

              {/* Arrow */}
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-primary"
              >
                ➜
              </motion.div>

              {/* Detection */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <Eye className="w-8 h-8 text-cyan-400 mb-2" />
                <span className="text-xs text-foreground/70">Behavioral Detection</span>
              </motion.div>

              {/* Arrow */}
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-primary"
              >
                ➜
              </motion.div>

              {/* Protection */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                <Shield className="w-8 h-8 text-green-500 mb-2" />
                <span className="text-xs text-foreground/70">System Protected</span>
              </motion.div>

            </div>


            {/* STOP VOICE BUTTON (UNCHANGED) */}
            <button
              onClick={stopSpeech}
              className="mt-5 px-4 py-2 text-sm rounded-md border border-primary/40 text-primary hover:bg-primary/10"
            >
              ⏹ Stop Voice
            </button>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};

export default AwarenessBlock;
