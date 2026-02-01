

// import React, { useEffect, useState } from "react";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
// } from "recharts";
// import "./App.css";

// function App() {
//   const [status, setStatus] = useState(null);
//   const [logs, setLogs] = useState([]);
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetch("http://localhost:5000/status")
//         .then(res => res.json())
//         .then(setStatus);

//       fetch("http://localhost:5000/logs")
//         .then(res => res.json())
//         .then(setLogs);

//       fetch("http://localhost:5000/history")
//         .then(res => res.json())
//         .then(setHistory);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   if (!status) return <h2>⏳ Connecting to agent...</h2>;

//   return (
//     <div className="container">
//       <h1>🛡️ Ransomware Detection Dashboard</h1>

//       <div className={`card ${status.system === "SAFE" ? "safe" : "attack"}`}>
//         <h3>System Status</h3>
//         {status.system === "SAFE" ? "✅ SYSTEM SAFE" : "🚨 RANSOMWARE DETECTED"}
//       </div>

//       <div className="card">
//         <h3>📊 Threat Metrics</h3>
//         <p>Honeypot Damage: {status.metrics.honeypot_damage}%</p>
//         <p>Real File Damage: {status.metrics.real_file_damage}%</p>
//         <p>CPU Stress: {status.metrics.cpu_stress}%</p>
//         <p>System Lockdown: {status.metrics.lockdown}%</p>
//       </div>

//       <div className="card">
//         <h3>📈 Damage vs Time</h3>
//         <LineChart width={800} height={300} data={history}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="time" label={{ value: "Time (s)", position: "insideBottomRight" }} />
//           <YAxis domain={[0, 100]} />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="honeypot" stroke="#ff0000" name="Honeypot Damage %" />
//           <Line type="monotone" dataKey="real" stroke="#007bff" name="Real File Damage %" />
//         </LineChart>
//       </div>

//       <div className="card logs">
//         <h3>📜 Security Logs</h3>
//         {logs.map((l, i) => (
//           <div key={i}>
//             <b>{l.event}</b> — {l.file} — {l.time}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;


// //npm install recharts







import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [alertShown, setAlertShown] = useState(false); // track if alert shown

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5000/status")
        .then(res => res.json())
        .then(data => {
          setStatus(data);

          // 🔹 Show toast notification when ransomware detected
          if (data.ransom_alert && !alertShown) {
            toast.error("🚨 RANSOMWARE DETECTED in system!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setAlertShown(true);
          }

          if (!data.ransom_alert && alertShown) {
            setAlertShown(false); // reset for next attack
          }
        })
        .catch(err => console.error("Status fetch error:", err));

      fetch("http://localhost:5000/logs")
        .then(res => res.json())
        .then(setLogs)
        .catch(err => console.error("Logs fetch error:", err));

      fetch("http://localhost:5000/history")
        .then(res => res.json())
        .then(setHistory)
        .catch(err => console.error("History fetch error:", err));
    }, 1000);

    return () => clearInterval(interval);
  }, [alertShown]);

  if (!status) return <h2>⏳ Connecting to agent...</h2>;

  return (
    <div className="container">
      <h1>🛡️ Ransomware Detection Dashboard</h1>

      {/* SYSTEM STATUS */}
      <div className={`card ${status.system === "SAFE" ? "safe" : "attack"}`}>
        <h3>System Status</h3>
        {status.system === "SAFE" ? "✅ SYSTEM SAFE" : "🚨 RANSOMWARE DETECTED"}
      </div>

      {/* METRICS */}
      <div className="card">
        <h3>📊 Threat Metrics</h3>
        <p>Honeypot Damage: {status.metrics.honeypot_damage}%</p>
        <p>Real File Damage: {status.metrics.real_file_damage}%</p>
        <p>CPU Stress: {status.metrics.cpu_stress}%</p>
        <p>System Lockdown: {status.metrics.lockdown}%</p>
      </div>

      {/* DAMAGE vs TIME GRAPH */}
      <div className="card">
        <h3>📈 Damage vs Time</h3>
        <LineChart width={800} height={300} data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" label={{ value: "Time (s)", position: "insideBottomRight" }} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="honeypot" stroke="#ff0000" name="Honeypot Damage %" />
          <Line type="monotone" dataKey="real" stroke="#007bff" name="Real File Damage %" />
        </LineChart>
      </div>

      {/* SECURITY LOGS */}
      <div className="card logs">
        <h3>📜 Security Logs</h3>
        {logs.length === 0 ? (
          <p>No suspicious activity</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="log">
              <strong>{log.event}</strong>
              <div>📄 {log.file}</div>
              <div>⏰ {log.time}</div>
            </div>
          ))
        )}
      </div>

      {/* 🔹 Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default App;
