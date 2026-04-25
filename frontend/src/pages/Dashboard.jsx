import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Plus, LogOut } from "lucide-react";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground">Manage and view your planned adventures.</p>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/create-trip">
              <Plus className="mr-2 h-4 w-4" /> New Trip
            </Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <p>Loading your trips...</p>
        </div>
      ) : trips.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <CardHeader>
            <CardTitle>No trips yet</CardTitle>
            <CardDescription>
              You haven't planned any trips. Start your first journey today!
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/create-trip">Create Your First Trip</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Card key={trip._id} className="overflow-hidden flex flex-col">
              <CardHeader className="bg-muted/50 pb-4">
                <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {trip.destination}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{trip.days} Days</span>
                </div>
                <div className="mt-2 font-semibold">
                  Budget: ${trip.budget}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="ghost" className="w-full justify-start text-primary" asChild>
                  <Link to={`/trip/${trip._id}`}>View Full Itinerary</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
