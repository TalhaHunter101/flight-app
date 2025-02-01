import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/utils/Navbar";
import Home from "./pages/Home";
import Flights from "./pages/Flights";
import Hotels from "./pages/Hotels";
import ErrorBoundary from "./components/utils/ErrorBoundary";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/hotels" element={<Hotels />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
