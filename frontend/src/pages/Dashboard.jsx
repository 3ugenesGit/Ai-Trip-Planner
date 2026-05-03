import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Calendar, Plus, Loader2, Compass, ArrowUpRight, Share2, Heart } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }
        const res = await axios.get("http://localhost:5000/api/trips", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(res.data);
      } catch (err) {
        if (err.response?.status === 401) navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-16"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">Your <br/> World.</h1>
          <p className="text-text-muted font-bold tracking-tight">Your collection of planned adventures and vibes.</p>
        </div>
        <button onClick={() => navigate("/create-trip")} className="btn-black">
          New Itinerary
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-black/10" />
          <p className="font-black uppercase tracking-widest text-[10px] text-text-muted">Loading...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="visual-card py-32 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-[2rem] bg-black flex items-center justify-center">
            <Compass className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Empty Canvas</h2>
            <p className="text-text-muted font-bold tracking-tight">You haven't planned any trips yet.</p>
          </div>
          <button onClick={() => navigate("/create-trip")} className="btn-magic">
            Create Your First
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, index) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/trip/${trip._id}`)}
              className="visual-card group cursor-pointer"
            >
              <div className="h-64 bg-surface relative overflow-hidden flex items-center justify-center group-hover:bg-black/5 transition-all duration-700">
                <MapPin className="h-16 w-16 text-black/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 right-6 flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white transition-all">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white transition-all">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-6 left-6 flex flex-col items-start gap-1">
                   <span className="bg-black text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                    {trip.days} Days
                  </span>
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight group-hover:text-accent transition-colors">
                    {trip.title || `Trip to ${trip.destination}`}
                  </h3>
                  <ArrowUpRight className="h-5 w-5 text-text-muted group-hover:text-accent transition-all" />
                </div>

                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted border-t border-border-main pt-6">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {trip.destination}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Upcoming
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <button 
            onClick={() => navigate("/create-trip")}
            className="visual-card border-dashed flex flex-col items-center justify-center py-20 px-6 group hover:bg-black hover:text-white"
          >
            <Plus className="h-10 w-10 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Start New Plan</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;