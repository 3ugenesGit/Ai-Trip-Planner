import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { LogOut, User, Compass, LayoutGrid, Sparkles } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          console.error("Failed to fetch user", err);
        }
      }
    };
    fetchUser();
  }, [token, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between pointer-events-auto glass-effect rounded-full px-8 shadow-magic">
        <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="bg-black p-1.5 rounded-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">MINDTRIP</span>
        </Link>

        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-2">
            <Link to="/dashboard" className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${location.pathname === '/dashboard' ? 'bg-black text-white' : 'text-text-muted hover:text-black'}`}>
              My Trips
            </Link>
            <Link to="/explore" className="px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-text-muted hover:text-black transition-all">
              Explore
            </Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isAuthPage ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">Traveler</span>
                <span className="text-sm font-bold text-text-main">{user?.email?.split('@')[0]}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/" className="text-xs font-bold uppercase tracking-widest hover:text-accent">Login</Link>
              <Link to="/register" className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">Join Free</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;