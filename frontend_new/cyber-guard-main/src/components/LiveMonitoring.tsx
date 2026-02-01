// import { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { Activity, Shield, AlertTriangle } from "lucide-react";

// type SystemState = "secure" | "attack" | "recovery";

// const LiveMonitoring = () => {
//   const [state, setState] = useState<SystemState>("secure");

//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const animationRef = useRef<number>();
//   const timeRef = useRef(0);
//   const transitionRef = useRef(0);
//   const prevStateRef = useRef<SystemState>("secure");

//   /* ---------------- BACKEND STATE FETCH ---------------- */
//   useEffect(() => {
//     const fetchSystemState = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/status");
//         const data = await res.json();

//         let newState: SystemState = "secure";

//         if (data.system === "ATTACK") {
//           newState = data.mitigation ? "recovery" : "attack";
//         }

//         if (newState !== state) {
//           prevStateRef.current = state;
//           transitionRef.current = 0;
//           setState(newState);
//         }
//       } catch (err) {
//         console.error("Failed to fetch system status", err);
//       }
//     };

//     fetchSystemState();
//     const interval = setInterval(fetchSystemState, 2000);

//     return () => clearInterval(interval);
//   }, [state]);

//   /* ---------------- CANVAS ANIMATION ---------------- */
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const resize = () => {
//       canvas.width = canvas.offsetWidth * 2;
//       canvas.height = canvas.offsetHeight * 2;
//       ctx.setTransform(2, 0, 0, 2, 0, 0);
//     };

//     resize();
//     window.addEventListener("resize", resize);

//     const width = canvas.offsetWidth;
//     const height = canvas.offsetHeight;
//     const centerY = height / 2;

//     const sineWave = (x: number, t: number) =>
//       Math.sin(x * 0.02 + t * 2) * 30;

//     const triangleWave = (x: number, t: number) => {
//       const period = 50;
//       const phase = ((x + t * 100) % period) / period;
//       const value = phase < 0.5 ? phase * 2 : 2 - phase * 2;
//       return (value * 2 - 1) * 50;
//     };

//     const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

//     const getWaveValue = (x: number, t: number) => {
//       const prev =
//         prevStateRef.current === "attack"
//           ? triangleWave(x, t)
//           : sineWave(x, t);

//       const curr =
//         state === "attack"
//           ? triangleWave(x, t)
//           : sineWave(x, t);

//       const ease =
//         transitionRef.current < 1
//           ? (1 - Math.cos(transitionRef.current * Math.PI)) / 2
//           : 1;

//       return lerp(prev, curr, ease);
//     };

//     const getColor = () => {
//       switch (state) {
//         case "attack":
//           return "#ef4444";
//         case "recovery":
//           return "#38bdf8";
//         default:
//           return "#22c55e";
//       }
//     };

//     const animate = () => {
//       timeRef.current += 0.016;
//       transitionRef.current = Math.min(transitionRef.current + 0.02, 1);

//       ctx.clearRect(0, 0, width, height);

//       ctx.strokeStyle = "rgba(56,189,248,0.1)";
//       for (let y = 0; y < height; y += 20) {
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(width, y);
//         ctx.stroke();
//       }

//       const color = getColor();
//       ctx.strokeStyle = color;
//       ctx.lineWidth = 2;
//       ctx.shadowColor = color;
//       ctx.shadowBlur = 10;

//       ctx.beginPath();
//       for (let x = 0; x < width; x++) {
//         const y = centerY + getWaveValue(x, timeRef.current);
//         x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
//       }
//       ctx.stroke();

//       ctx.shadowBlur = 0;
//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       window.removeEventListener("resize", resize);
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [state]);

//   /* ---------------- UI CONFIG ---------------- */
//   const statusConfig = {
//     secure: {
//       label: "SECURE",
//       icon: Shield,
//       color: "text-success",
//       bg: "bg-success/20",
//     },
//     attack: {
//       label: "THREAT DETECTED",
//       icon: AlertTriangle,
//       color: "text-destructive",
//       bg: "bg-destructive/20",
//     },
//     recovery: {
//       label: "RECOVERING",
//       icon: Activity,
//       color: "text-primary",
//       bg: "bg-primary/20",
//     },
//   };

//   const config = statusConfig[state];
//   const Icon = config.icon;

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.6, delay: 0.9 }}
//       className="flex flex-col"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="font-display font-semibold text-primary flex items-center gap-2">
//           <Activity className="w-5 h-5" />
//           LIVE MONITORING
//         </h3>

//         <motion.div
//           key={state}
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}
//         >
//           <Icon className={`w-4 h-4 ${config.color}`} />
//           <span className={`text-xs font-display font-semibold ${config.color}`}>
//             {config.label}
//           </span>
//         </motion.div>
//       </div>

//       <div className="relative h-32 rounded-lg overflow-hidden bg-background/50">
//         <canvas ref={canvasRef} className="w-full h-full" />
//       </div>

//       <div className="mt-2 flex justify-between text-xs text-muted-foreground">
//         <span>Real-time system activity</span>
//         <span className="flex items-center gap-1">
//           <span
//             className={`w-2 h-2 rounded-full ${
//               state === "attack"
//                 ? "bg-destructive animate-pulse"
//                 : "bg-success"
//             }`}
//           />
//           {state === "attack" ? "High Activity" : "Normal"}
//         </span>
//       </div>
//     </motion.div>
//   );
// };

// export default LiveMonitoring;








// import { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { Activity, Shield, AlertTriangle } from "lucide-react";

// type SystemState = "secure" | "attack" | "recovery";

// const ATTACK_DISPLAY_MS = 1500; // 🔥 FORCE threat visibility

// const LiveMonitoring = () => {
//   const [state, setState] = useState<SystemState>("secure");

//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const animationRef = useRef<number>();
//   const timeRef = useRef(0);
//   const transitionRef = useRef(0);
//   const prevStateRef = useRef<SystemState>("secure");
//   const attackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   /* ---------------- BACKEND STATE FETCH ---------------- */
//   useEffect(() => {
//     const fetchSystemState = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/status");
//         const data = await res.json();

//         // 🔴 ATTACK detected (always show spike)
//         if (data.system === "ATTACK") {
//           if (attackTimeoutRef.current) return;

//           prevStateRef.current = state;
//           transitionRef.current = 0;
//           setState("attack");

//           attackTimeoutRef.current = setTimeout(() => {
//             prevStateRef.current = "attack";
//             transitionRef.current = 0;

//             setState(data.mitigation ? "recovery" : "secure");
//             attackTimeoutRef.current = null;
//           }, ATTACK_DISPLAY_MS);

//           return;
//         }

//         // Normal SAFE state
//         if (!attackTimeoutRef.current && state !== "secure") {
//           prevStateRef.current = state;
//           transitionRef.current = 0;
//           setState("secure");
//         }
//       } catch (err) {
//         console.error("Failed to fetch system status", err);
//       }
//     };

//     fetchSystemState();
//     const interval = setInterval(fetchSystemState, 2000);

//     return () => clearInterval(interval);
//   }, [state]);

//   /* ---------------- CANVAS ANIMATION ---------------- */
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const resize = () => {
//       canvas.width = canvas.offsetWidth * 2;
//       canvas.height = canvas.offsetHeight * 2;
//       ctx.setTransform(2, 0, 0, 2, 0, 0);
//     };

//     resize();
//     window.addEventListener("resize", resize);

//     const width = canvas.offsetWidth;
//     const height = canvas.offsetHeight;
//     const centerY = height / 2;

//     const sineWave = (x: number, t: number) =>
//       Math.sin(x * 0.02 + t * 2) * 30;

//     const triangleWave = (x: number, t: number) => {
//       const period = 40;
//       const phase = ((x + t * 120) % period) / period;
//       const value = phase < 0.5 ? phase * 2 : 2 - phase * 2;
//       return (value * 2 - 1) * 55;
//     };

//     const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

//     const getWaveValue = (x: number, t: number) => {
//       const prev =
//         prevStateRef.current === "attack"
//           ? triangleWave(x, t)
//           : sineWave(x, t);

//       const curr =
//         state === "attack"
//           ? triangleWave(x, t)
//           : sineWave(x, t);

//       const ease =
//         transitionRef.current < 1
//           ? (1 - Math.cos(transitionRef.current * Math.PI)) / 2
//           : 1;

//       return lerp(prev, curr, ease);
//     };

//     const getColor = () => {
//       switch (state) {
//         case "attack":
//           return "#ef4444";
//         case "recovery":
//           return "#38bdf8";
//         default:
//           return "#22c55e";
//       }
//     };

//     const animate = () => {
//       timeRef.current += 0.016;
//       transitionRef.current = Math.min(transitionRef.current + 0.025, 1);

//       ctx.clearRect(0, 0, width, height);

//       ctx.strokeStyle = "rgba(56,189,248,0.08)";
//       for (let y = 0; y < height; y += 20) {
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(width, y);
//         ctx.stroke();
//       }

//       const color = getColor();
//       ctx.strokeStyle = color;
//       ctx.lineWidth = state === "attack" ? 2.5 : 2;
//       ctx.shadowColor = color;
//       ctx.shadowBlur = state === "attack" ? 15 : 8;

//       ctx.beginPath();
//       for (let x = 0; x < width; x++) {
//         const y = centerY + getWaveValue(x, timeRef.current);
//         x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
//       }
//       ctx.stroke();

//       ctx.shadowBlur = 0;
//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       window.removeEventListener("resize", resize);
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [state]);

//   /* ---------------- UI CONFIG ---------------- */
//   const statusConfig = {
//     secure: {
//       label: "SECURE",
//       icon: Shield,
//       color: "text-success",
//       bg: "bg-success/20",
//     },
//     attack: {
//       label: "THREAT DETECTED",
//       icon: AlertTriangle,
//       color: "text-destructive",
//       bg: "bg-destructive/20",
//     },
//     recovery: {
//       label: "RECOVERING",
//       icon: Activity,
//       color: "text-primary",
//       bg: "bg-primary/20",
//     },
//   };

//   const config = statusConfig[state];
//   const Icon = config.icon;

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.6, delay: 0.9 }}
//       className="flex flex-col"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="font-display font-semibold text-primary flex items-center gap-2">
//           <Activity className="w-5 h-5" />
//           LIVE MONITORING
//         </h3>

//         <motion.div
//           key={state}
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}
//         >
//           <Icon className={`w-4 h-4 ${config.color}`} />
//           <span className={`text-xs font-display font-semibold ${config.color}`}>
//             {config.label}
//           </span>
//         </motion.div>
//       </div>

//       <div className="relative h-32 rounded-lg overflow-hidden bg-background/50">
//         <canvas ref={canvasRef} className="w-full h-full" />
//       </div>

//       <div className="mt-2 flex justify-between text-xs text-muted-foreground">
//         <span>Real-time system activity</span>
//         <span className="flex items-center gap-1">
//           <span
//             className={`w-2 h-2 rounded-full ${
//               state === "attack"
//                 ? "bg-destructive animate-pulse"
//                 : state === "recovery"
//                 ? "bg-primary"
//                 : "bg-success"
//             }`}
//           />
//           {state === "attack"
//             ? "High Activity"
//             : state === "recovery"
//             ? "Stabilizing"
//             : "Normal"}
//         </span>
//       </div>
//     </motion.div>
//   );
// };

// export default LiveMonitoring;
















import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Activity, Shield, AlertTriangle } from "lucide-react";

type SystemState = "secure" | "attack" | "recovery";

// ⏱️ CONTROL VISUAL DURATIONS HERE
const ATTACK_DISPLAY_MS = 1500;   // red threat spike duration
const RECOVERY_DISPLAY_MS = 3000; // 🔵 longer recovery phase

const LiveMonitoring = () => {
  const [state, setState] = useState<SystemState>("secure");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const transitionRef = useRef(0);
  const prevStateRef = useRef<SystemState>("secure");

  const attackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- BACKEND STATE FETCH ---------------- */
  useEffect(() => {
    const fetchSystemState = async () => {
      try {
        const res = await fetch("http://localhost:5000/status");
        const data = await res.json();

        // 🔴 FORCE THREAT VISIBILITY
        if (data.system === "ATTACK") {
          if (attackTimeoutRef.current) return;

          prevStateRef.current = state;
          transitionRef.current = 0;
          setState("attack");

          attackTimeoutRef.current = setTimeout(() => {
            prevStateRef.current = "attack";
            transitionRef.current = 0;
            setState("recovery");

            // 🔵 HOLD RECOVERY STATE
            recoveryTimeoutRef.current = setTimeout(() => {
              prevStateRef.current = "recovery";
              transitionRef.current = 0;
              setState("secure");

              recoveryTimeoutRef.current = null;
            }, RECOVERY_DISPLAY_MS);

            attackTimeoutRef.current = null;
          }, ATTACK_DISPLAY_MS);

          return;
        }
      } catch (err) {
        console.error("Failed to fetch system status", err);
      }
    };

    fetchSystemState();
    const interval = setInterval(fetchSystemState, 2000);

    return () => clearInterval(interval);
  }, [state]);

  /* ---------------- CANVAS ANIMATION ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerY = height / 2;

    const sineWave = (x: number, t: number) =>
      Math.sin(x * 0.02 + t * 2) * 30;

    const triangleWave = (x: number, t: number) => {
      const period = 40;
      const phase = ((x + t * 120) % period) / period;
      const value = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      return (value * 2 - 1) * 55;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const getWaveValue = (x: number, t: number) => {
      const prev =
        prevStateRef.current === "attack"
          ? triangleWave(x, t)
          : sineWave(x, t);

      const curr =
        state === "attack"
          ? triangleWave(x, t)
          : sineWave(x, t);

      const ease =
        transitionRef.current < 1
          ? (1 - Math.cos(transitionRef.current * Math.PI)) / 2
          : 1;

      return lerp(prev, curr, ease);
    };

    const getColor = () => {
      switch (state) {
        case "attack":
          return "#ef4444";
        case "recovery":
          return "#38bdf8";
        default:
          return "#22c55e";
      }
    };

    const animate = () => {
      timeRef.current += 0.016;
      transitionRef.current = Math.min(transitionRef.current + 0.02, 1);

      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(56,189,248,0.08)";
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const color = getColor();
      ctx.strokeStyle = color;
      ctx.lineWidth = state === "attack" ? 2.5 : 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = state === "attack" ? 15 : 8;

      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = centerY + getWaveValue(x, timeRef.current);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [state]);

  /* ---------------- UI CONFIG ---------------- */
  const statusConfig = {
    secure: {
      label: "SECURE",
      icon: Shield,
      color: "text-success",
      bg: "bg-success/20",
    },
    attack: {
      label: "THREAT DETECTED",
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/20",
    },
    recovery: {
      label: "RECOVERING",
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/20",
    },
  };

  const config = statusConfig[state];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-primary flex items-center gap-2">
          <Activity className="w-5 h-5" />
          LIVE MONITORING
        </h3>

        <motion.div
          key={state}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}
        >
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-xs font-display font-semibold ${config.color}`}>
            {config.label}
          </span>
        </motion.div>
      </div>

      <div className="relative h-32 rounded-lg overflow-hidden bg-background/50">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>Real-time system activity</span>
        <span className="flex items-center gap-1">
          <span
            className={`w-2 h-2 rounded-full ${
              state === "attack"
                ? "bg-destructive animate-pulse"
                : state === "recovery"
                ? "bg-primary"
                : "bg-success"
            }`}
          />
          {state === "attack"
            ? "High Activity"
            : state === "recovery"
            ? "Stabilizing"
            : "Normal"}
        </span>
      </div>
    </motion.div>
  );
};

export default LiveMonitoring;
