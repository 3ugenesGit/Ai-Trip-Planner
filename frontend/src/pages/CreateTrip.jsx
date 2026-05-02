import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowLeft, Save } from "lucide-react";

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    days: 3,
    budget: 1000,
    interests: "",
  });
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === "days" || name === "budget" ? parseInt(value) || 0 : value 
    });
  };

  const generateAIItinerary = async () => {
    if (!formData.destination || !formData.interests) {
      alert("Please enter destination and interests first");
      return;
    }
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
      console.error("Failed to generate itinerary", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }
      const errorMessage = err.response?.data?.message || "Failed to generate itinerary. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (itinerary.length === 0) {
      alert("Please generate an itinerary first!");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/trips", {
        ...formData,
        itinerary
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create trip", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Plan Your New Adventure</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
            <CardDescription>Tell us where and when you're going.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trip Title</label>
              <Input name="title" placeholder="e.g., Summer in Japan" onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Input name="destination" placeholder="e.g., Tokyo, Japan" onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Days</label>
                <Input name="days" type="number" value={formData.days} onChange={handleChange} required min="1" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget ($)</label>
                <Input name="budget" type="number" value={formData.budget} onChange={handleChange} required min="0" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Interests</label>
              <Input name="interests" placeholder="e.g., Food, Culture, Anime" onChange={handleChange} required />
              <p className="text-xs text-muted-foreground">Comma-separated list of things you love.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="button" 
              onClick={generateAIItinerary} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={loading}
            >
              {loading ? (
                "Generating Magic..."
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Itinerary with AI
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Itinerary Preview</CardTitle>
            <CardDescription>Your AI-generated plan will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto max-h-[400px]">
            {itinerary.length > 0 ? (
              <div className="space-y-6">
                {itinerary.map((day, idx) => (
                  <div key={idx} className="border-l-2 border-primary pl-4 py-1">
                    <h4 className="font-bold text-lg mb-2 text-primary">Day {day.day}</h4>
                    <ul className="space-y-1">
                      {day.activities.map((act, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {act}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-muted/30 rounded-lg border-2 border-dashed">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground italic">
                  Fill in your details and click generate to see the magic happen!
                </p>
              </div>
            )}
          </CardContent>
          {itinerary.length > 0 && (
            <CardFooter className="border-t pt-4">
              <Button onClick={handleSubmit} className="w-full" disabled={saving}>
                {saving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Trip to Dashboard</>}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CreateTrip;
