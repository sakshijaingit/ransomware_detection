import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ChatBot from "./ChatBot";

const Navigation = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Damage vs Time", path: "/damage-time" },
    { name: "Damage Risk %", path: "/damage-risk" },
    { name: "Support", path: "/support" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsChatOpen(true);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full px-6 py-3 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between neon-border rounded-lg px-4 py-2 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ransomware topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cyber-search w-64"
              />
            </form>
          </div>
        </div>
      </motion.nav>

      <ChatBot 
        isOpen={isChatOpen} 
        onClose={() => {
          setIsChatOpen(false);
          setSearchQuery("");
        }}
        initialQuery={searchQuery}
      />
    </>
  );
};

export default Navigation;
