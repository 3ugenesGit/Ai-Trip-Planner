import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Sparkles, ArrowLeft, Send, MapPin, Calendar, Heart, Share2, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    destination: "",
    days: 3,
    interests: "",
  });
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateAIItinerary = async () => {
    if (!formData.destination || !formData.interests) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/trips/generate", {
        destination: formData.destination,
        duration: formData.days,
        interests: formData.interests.split(",").map(i => i.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const generatedItinerary = res.data.itinerary || res.data;
      setItinerary(Array.isArray(generatedItinerary) ? generatedItinerary : []);
    } catch (err) {
      if (err.response?.status === 401) navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-12"
      >
        {/* Magic Input Bar */}
        <div className="magic-box p-8 max-w-4xl mx-auto w-full flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-black rounded-[1.5rem] flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="flex-grow space-y-4">
              <input 
                name="destination"
                placeholder="Where to? (e.g. Paris, France)" 
                className="input-ghost text-4xl font-black uppercase tracking-tighter"
                onChange={handleChange}
              />
              <input 
                name="interests"
                placeholder="What's the vibe? (e.g. Art, Coffee, Nightlife)" 
                className="input-ghost text-xl text-text-muted"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-border-main">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted">
                <Calendar className="h-3 w-3" />
                <input name="days" type="number" value={formData.days} onChange={handleChange} className="w-8 bg-transparent border-none focus:ring-0 outline-none p-0 text-black" /> Days
              </div>
            </div>
            <button 
              onClick={generateAIItinerary}
              disabled={loading}
              className="btn-black flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Plan Magic"}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <AnimatePresence>
          {itinerary.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              {/* Vertical Timeline */}
              <div className="lg:col-span-3 space-y-12">
                {itinerary.map((day, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-black tracking-tighter uppercase">Day {day.day}</span>
                      <div className="h-px bg-border-main flex-grow"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {day.activities.map((act, i) => (
                        <div key={i} className="visual-card p-6 flex flex-col justify-between min-h-[160px] group cursor-pointer hover:bg-black hover:text-white">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100">09:00 AM</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Heart className="h-4 w-4" />
                              <Plus className="h-4 w-4" />
                            </div>
                          </div>
                          <p className="text-lg font-bold leading-tight">{act}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Sidebar Summary */}
              <div className="space-y-6 lg:sticky lg:top-32 h-fit">
                <div className="visual-card p-8 bg-black text-white space-y-6">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Your Vibe</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/40">
                      <span>Destination</span>
                      <span className="text-white">{formData.destination}</span>
                    </div>
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/40">
                      <span>Style</span>
                      <span className="text-white">Custom</span>
                    </div>
                  </div>
                  <button className="w-full btn-magic mt-4">Save Trip</button>
                  <button className="w-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white flex items-center justify-center gap-2">
                    <Share2 className="h-3 w-3" /> Share Plan
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CreateTrip;