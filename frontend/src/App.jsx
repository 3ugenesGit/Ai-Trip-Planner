import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Trip from "./pages/Trip";
import CreateTrip from "./pages/CreateTrip";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trip/:id" element={<Trip />} />
            <Route path="/create-trip" element={<CreateTrip />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
