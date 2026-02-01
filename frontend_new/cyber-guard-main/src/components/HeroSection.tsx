import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative z-10 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl md:text-8xl font-display font-bold neon-text-cyan mb-6"
        >
          RANSOMWARE
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-2xl md:text-3xl font-display font-semibold neon-text-purple">
            detect. disrupt. defend.
          </h3>
          
          <p className="text-lg text-foreground/70 font-body italic max-w-2xl">
            detecting ransomware by behavior, not by signatures
          </p>
          
          <p className="text-lg text-foreground/70 font-body italic max-w-2xl">
            so the real challenge is not just detection, but detection at the right time
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
