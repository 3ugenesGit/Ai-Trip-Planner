import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Plus, LogOut, Loader2 } from "lucide-react";
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
        console.error("Failed to fetch trips", err);
        if (err.response?.status === 401) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header className="flex items-center justify-between pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground">Manage and view your planned adventures.</p>
        </div>
        <div className="flex gap-4">
          <Button asChild className="shadow-lg hover:shadow-xl transition-shadow">
            <Link to="/create-trip">
              <Plus className="mr-2 h-4 w-4" /> New Trip
            </Link>
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading your adventures...</p>
        </div>
      ) : trips.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed border-2">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">No trips yet</CardTitle>
              <CardDescription className="max-w-xs mx-auto">
                You haven't planned any trips. Start your first journey today with our AI assistant!
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild size="lg">
                <Link to="/create-trip">Create Your First Trip</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, index) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all border-l-4 border-l-primary">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-primary" /> {trip.destination}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex-grow">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{trip.days} Days</span>
                  </div>
                  <div className="mt-2 text-lg font-bold text-primary">
                    ${trip.budget.toLocaleString()}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/10 p-4">
                  <Button variant="outline" className="w-full group" asChild>
                    <Link to={`/trip/${trip._id}`}>
                      View Full Itinerary
                      <Plus className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
