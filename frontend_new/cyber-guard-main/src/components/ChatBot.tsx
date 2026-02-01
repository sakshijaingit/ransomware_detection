


import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "bot";
  content: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "hi", name: "हिन्दी" },
  { code: "zh", name: "中文" },
];

const botResponses: Record<string, Record<string, string>> = {
  ransomware: {
    en: `Ransomware is a form of malicious software that encrypts files on a system and demands a ransom payment to restore access.
    
Modern ransomware attacks often use advanced techniques such as double extortion, where attackers steal sensitive data before encryption and threaten to leak it publicly.

RANSENTRY protects systems by using behavioral analysis instead of traditional signatures. It monitors abnormal file access patterns, rapid file modifications, and suspicious process behavior in real time, allowing early detection before large-scale damage occurs.`,

    hi: `रैंसमवेयर एक प्रकार का दुर्भावनापूर्ण सॉफ़्टवेयर होता है जो सिस्टम की फ़ाइलों को एन्क्रिप्ट कर देता है और उन्हें वापस खोलने के लिए फिरौती की मांग करता है।

आधुनिक रैंसमवेयर हमले अक्सर "डबल एक्सटॉर्शन" तकनीक का उपयोग करते हैं, जिसमें हमलावर पहले डेटा चुरा लेते हैं और फिर उसे सार्वजनिक करने की धमकी देते हैं।

RANSENTRY पारंपरिक सिग्नेचर आधारित सुरक्षा के बजाय व्यवहार आधारित पहचान का उपयोग करता है। यह असामान्य फ़ाइल गतिविधि, तेज़ फ़ाइल बदलाव और संदिग्ध प्रोसेस व्यवहार को रियल-टाइम में मॉनिटर करता है, जिससे बड़ा नुकसान होने से पहले ही हमला पकड़ा जा सके।`,
  },

  protection: {
    en: `Effective protection against ransomware requires a layered security approach.

Key preventive measures include:
1. Keeping operating systems and software up to date.
2. Using strong, unique passwords and multi-factor authentication.
3. Maintaining regular offline and cloud backups.
4. Training users to identify phishing emails and malicious attachments.
5. Deploying behavioral security solutions like RANSENTRY.

RANSENTRY continuously monitors system activity and immediately responds to ransomware-like behavior, minimizing operational downtime and data loss.`,

    hi: `रैंसमवेयर से प्रभावी सुरक्षा के लिए बहु-स्तरीय सुरक्षा रणनीति आवश्यक होती है।

मुख्य बचाव उपाय:
1. ऑपरेटिंग सिस्टम और सॉफ़्टवेयर को हमेशा अपडेट रखें।
2. मजबूत और यूनिक पासवर्ड तथा मल्टी-फैक्टर ऑथेंटिकेशन का उपयोग करें।
3. नियमित रूप से ऑफ़लाइन और क्लाउड बैकअप बनाए रखें।
4. उपयोगकर्ताओं को फ़िशिंग ईमेल और संदिग्ध अटैचमेंट पहचानने के लिए प्रशिक्षित करें।
5. RANSENTRY जैसे व्यवहार आधारित सुरक्षा सिस्टम का उपयोग करें।

RANSENTRY सिस्टम गतिविधि को लगातार मॉनिटर करता है और रैंसमवेयर जैसे व्यवहार पर तुरंत प्रतिक्रिया देता है, जिससे डेटा हानि और सिस्टम डाउनटाइम कम हो जाता है।`,
  },

  default: {
    en: `Hello, I’m SentryBot — your intelligent cybersecurity assistant.

I can help you understand ransomware threats, explain how behavioral detection works, and guide you on best security practices to protect your systems.

You can ask me questions like:
• What is ransomware?
• How does RANSENTRY detect attacks?
• How can I protect my data?

Feel free to ask anytime.`,

    hi: `नमस्ते, मैं SentryBot हूँ — आपका बुद्धिमान साइबर सुरक्षा सहायक।

मैं आपको रैंसमवेयर खतरों को समझाने, व्यवहार आधारित पहचान प्रणाली कैसे काम करती है यह बताने और सिस्टम सुरक्षा के सर्वोत्तम तरीकों के बारे में मार्गदर्शन देने में मदद कर सकता हूँ।

आप मुझसे ऐसे सवाल पूछ सकते हैं:
• रैंसमवेयर क्या है?
• RANSENTRY हमला कैसे पहचानता है?
• मैं अपने डेटा को सुरक्षित कैसे रखूँ?

जब चाहें मुझसे प्रश्न पूछें।`,
  },
};


const ChatBot = ({ isOpen, onClose, initialQuery }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ---------------- LOAD VOICES ---------------- */
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) setVoices(available);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- SPEAK FUNCTION ---------------- */
  const speak = (text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const voice =
      voices.find(v => v.lang.startsWith(language)) ||
      voices.find(v => v.lang.startsWith("en"));

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  /* ---------------- BOT RESPONSE ---------------- */
  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("ransomware") || q.includes("encrypt"))
      return botResponses.ransomware[language];
    if (q.includes("protect") || q.includes("safe"))
      return botResponses.protection[language];
    return botResponses.default[language];
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSendMessage = (query?: string) => {
    const text = query || input;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(text);
      setMessages(prev => [...prev, { role: "bot", content: response }]);
      setIsTyping(false);
      speak(response);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed right-4 bottom-4 top-4 w-96 z-50 cyber-card flex flex-col"
        >
          {/* HEADER */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-primary">SentryBot</h3>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-input text-xs px-2 py-1 rounded border"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded ${
                  voiceEnabled ? "bg-primary/20 text-primary" : "text-muted-foreground"
                }`}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" && "flex-row-reverse"}`}>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="bg-card p-3 rounded-lg max-w-[80%] text-sm">
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && <p className="text-xs text-muted-foreground">SentryBot is typing…</p>}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 border-t border-border"
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 cyber-search"
                placeholder="Ask about ransomware…"
              />
              <button className="neon-button-solid p-3">
                <Send size={16} />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBot;
