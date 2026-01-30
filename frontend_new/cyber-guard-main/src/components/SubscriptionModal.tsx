import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 40,
    period: "/month",
    features: [
      "Real-time ransomware detection",
      "Behavioral analysis engine",
      "24/7 monitoring",
      "Email alerts",
      "Basic support",
    ],
    popular: false,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 385,
    period: "/year",
    savings: "Save $95",
    features: [
      "All Monthly features",
      "Advanced threat intelligence",
      "Priority incident response",
      "Forensic analysis tools",
      "Priority support",
      "Custom security rules",
    ],
    popular: true,
  },
];

const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="cyber-card w-full max-w-3xl max-h-[90vh] overflow-auto p-6 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Title */}
              <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-primary text-glow-cyan mb-2">
                Choose Your Plan
              </h2>
              <p className="font-body text-center text-muted-foreground mb-8">
                Protect your systems with RANSENTRY's advanced detection
              </p>

              {/* Plans */}
              <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      relative p-6 rounded-lg border transition-all duration-300
                      ${plan.popular
                        ? "border-secondary bg-secondary/10 shadow-neon-purple"
                        : "border-primary/30 bg-card hover:border-primary/60"
                      }
                    `}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-display uppercase tracking-wide rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Best Value
                        </span>
                      </div>
                    )}

                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {plan.name}
                    </h3>

                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-display text-4xl font-bold text-primary text-glow-cyan">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground font-body">
                        {plan.period}
                      </span>
                    </div>

                    {plan.savings && (
                      <span className="inline-block px-2 py-0.5 bg-neon-green/20 text-neon-green text-xs font-body rounded mb-4">
                        {plan.savings}
                      </span>
                    )}

                    <ul className="space-y-3 my-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 font-body text-sm">
                          <Check className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={plan.popular ? "neonPurple" : "neon"}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;