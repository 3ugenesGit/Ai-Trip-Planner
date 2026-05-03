import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Trip from "./pages/Trip";
import CreateTrip from "./pages/CreateTrip";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;
  return children;
};

const Home = () => {
  const token = localStorage.getItem("token");
  return token ? <Dashboard /> : <Hero />;
};

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/trip/:id" element={
              <ProtectedRoute>
                <Trip />
              </ProtectedRoute>
            } />
            <Route path="/create-trip" element={
              <ProtectedRoute>
                <CreateTrip />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
