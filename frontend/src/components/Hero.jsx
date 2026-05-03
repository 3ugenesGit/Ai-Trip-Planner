import { Sparkles, Camera, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-40 pb-20 min-h-screen bg-background flex flex-col items-center">
      <div className="max-w-4xl w-full px-6 space-y-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Travel <br/> Better.
          </h1>
          <p className="text-xl text-text-muted font-bold tracking-tight max-w-xl mx-auto">
            Build your dream itinerary from a photo, a screenshot, or just a vibe.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="magic-box w-full max-w-3xl mx-auto flex flex-col p-6 gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <textarea 
              placeholder="Ask anything... 'Plan a 5-day foodie trip to Seoul' or 'Show me the best beaches in Bali'" 
              className="input-ghost min-h-[100px] py-2 resize-none"
              onFocus={() => navigate("/create-trip")}
            />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border-main">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-black transition-all">
                <Camera className="h-3 w-3" /> Photo
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-black transition-all">
                <MapPin className="h-3 w-3" /> Pin
              </button>
            </div>
            <button 
              onClick={() => navigate("/create-trip")}
              className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
            >
              Start Plan <Search className="h-3 w-3" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[
            { label: "TRENDING", title: "Amalfi Coast Vibe", color: "bg-blue-100" },
            { label: "CREATOR", title: "Tokyo Food Hunt", color: "bg-orange-100" },
            { label: "LATEST", title: "Swiss Alps Trek", color: "bg-emerald-100" }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="visual-card h-64 relative group cursor-pointer"
            >
              <div className={`absolute inset-0 ${item.color} opacity-50`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-left">
                <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">{item.label}</span>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;