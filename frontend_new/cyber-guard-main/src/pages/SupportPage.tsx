import { motion } from "framer-motion";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Phone, Mail, MessageCircle, Clock } from "lucide-react";

const supportCards = [
  {
    icon: Phone,
    title: "Emergency Hotline",
    subtitle: "24/7 Incident Response",
    value: "+1-800-REN-SENTRY",
    color: "text-primary",
    borderColor: "neon-border",
  },
  {
    icon: Mail,
    title: "Email Support",
    subtitle: "Technical Assistance",
    value: "support@ransentry.io",
    color: "text-primary",
    borderColor: "neon-border",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    subtitle: "Real-time Assistance",
    value: "Available on Dashboard",
    color: "text-accent",
    borderColor: "neon-border-magenta",
  },
  {
    icon: Clock,
    title: "Response Time",
    subtitle: "For Critical Incidents",
    value: "< 15 minutes",
    color: "text-success",
    borderColor: "neon-border",
  },
];

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-card p-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-12"
          >
            Support Center
          </motion.h1>

          <div className="grid md:grid-cols-2 gap-6">
            {supportCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-lg bg-card/50 ${card.borderColor}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full bg-card flex items-center justify-center ${card.borderColor}`}>
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  
                  <div>
                    <h3 className="font-display font-bold text-foreground">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {card.subtitle}
                    </p>
                    <p className={`font-display font-bold ${card.color}`}>
                      {card.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-card/30 rounded-lg text-center"
          >
            <p className="text-muted-foreground">
              For immediate assistance during a ransomware incident, call our emergency hotline. 
              Our security experts are available around the clock.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage;
