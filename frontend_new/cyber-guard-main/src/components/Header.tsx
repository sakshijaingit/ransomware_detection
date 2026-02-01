import { motion } from "framer-motion";
import { useState } from "react";
import SubscriptionModal from "./SubscriptionModal";

const Header = () => {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  return (
    <>
      <header className="w-full py-4 px-6 bg-background-dark relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1" />
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-display font-bold tracking-wider neon-text-cyan text-center"
          >
            RANSENTRY
          </motion.h1>
          
          <div className="flex-1 flex justify-end items-center gap-4">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() => setIsSubscribeOpen(true)}
              className="neon-button"
            >
              Subscribe
            </motion.button>
          </div>
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xs text-muted-foreground text-right max-w-7xl mx-auto mt-1"
        >
          Create an account and install RANSENTRY for enhanced system protection
        </motion.p>
      </header>

      <SubscriptionModal 
        isOpen={isSubscribeOpen} 
        onClose={() => setIsSubscribeOpen(false)} 
      />
    </>
  );
};

export default Header;
