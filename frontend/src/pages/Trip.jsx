import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Share2, Download, Heart, Utensils, Landmark, TreePine, Home } from "lucide-react";

const Trip = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/trips/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrip(res.data);
      } catch (err) {
        console.error(err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id, navigate]);

  const getIcon = (activity) => {
    const act = activity.toLowerCase();
    if (act.includes("eat") || act.includes("food") || act.includes("dinner") || act.includes("lunch")) return <Utensils className="h-4 w-4" />;
    if (act.includes("visit") || act.includes("museum") || act.includes("temple") || act.includes("shrine")) return <Landmark className="h-4 w-4" />;
    if (act.includes("park") || act.includes("hike") || act.includes("nature") || act.includes("walk")) return <TreePine className="h-4 w-4" />;
    return <Home className="h-4 w-4" />;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border-main">
        <div className="space-y-6">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-black transition-all">
            <ArrowLeft className="h-3 w-3" /> Back to Journeys
          </button>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">{trip.title}</h1>
            <div className="flex flex-wrap gap-4 pt-4">
              <span className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <MapPin className="h-3 w-3" /> {trip.destination}
              </span>
              <span className="flex items-center gap-2 bg-magic-bg text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Calendar className="h-3 w-3" /> {trip.days} Days
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="w-12 h-12 rounded-full border border-border-main flex items-center justify-center hover:bg-black hover:text-white transition-all">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="btn-black flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-12">
        {/* Timeline */}
        <div className="lg:col-span-3 space-y-20">
          {trip.itinerary.map((day, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-6">
                <div className="text-5xl font-black tracking-tighter uppercase leading-none">Day {day.day}</div>
                <div className="h-px bg-border-main flex-grow"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {day.activities.map((activity, i) => (
                  <div 
                    key={i}
                    className="visual-card p-8 space-y-6 group cursor-pointer hover:bg-black hover:text-white transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-black group-hover:bg-white/20 group-hover:text-white transition-colors">
                        {getIcon(activity)}
                      </div>
                      <Heart className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Planned Activity</span>
                      <p className="text-xl font-bold leading-tight">{activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8 lg:sticky lg:top-32 h-fit">
          <div className="visual-card p-8 bg-surface space-y-6">
            <h4 className="text-xl font-black uppercase tracking-tighter">Trip Details</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                <span>Location</span>
                <span className="text-black">{trip.destination}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                <span>Total Days</span>
                <span className="text-black">{trip.days} Days</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                <span>Estimated Budget</span>
                <span className="text-black">${trip.budget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="visual-card p-8 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
             <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center">
              <MapPin className="h-5 w-5" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest">Map View Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trip;