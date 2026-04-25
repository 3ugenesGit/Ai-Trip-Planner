import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, DollarSign, Clock } from "lucide-react";

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
        console.error("Failed to fetch trip", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground animate-pulse">Loading itinerary...</p>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{trip.title}</h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {trip.destination}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Duration
            </CardDescription>
            <CardTitle className="text-xl">{trip.days} Days</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-green-700">
              <DollarSign className="h-4 w-4" /> Total Budget
            </CardDescription>
            <CardTitle className="text-xl text-green-700">${trip.budget}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-blue-700">
              <Clock className="h-4 w-4" /> Created
            </CardDescription>
            <CardTitle className="text-xl text-blue-700">
              {new Date(trip.createdAt).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Itinerary</h2>
        {trip.itinerary && trip.itinerary.length > 0 ? (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {trip.itinerary.map((item, index) => (
              <div key={index} className="relative pl-12">
                <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                  {item.day}
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Day {item.day}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.activities.map((activity, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <span className="text-slate-600">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50 py-12 text-center">
            <p className="text-muted-foreground italic">No itinerary details found.</p>
          </Card>
        )}
      </div>

      <div className="flex justify-center pt-8">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Trip;
