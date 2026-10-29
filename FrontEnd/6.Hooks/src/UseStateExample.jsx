import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
export default function UseStateExample() {

  const [data, setData] = useState("Loading...");

  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Updating the state after 2 seconds
      setData("API Data Loaded!");
    }, 5000);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">useState Hook Demonstration</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Simulated API Update</h2>
        <p>Status: <strong>{data}</strong></p>
      </div>

      <div className="p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Simple Counter</h2>
        <p>Current Count: <strong>{count}</strong></p>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
          onClick={() => setCount(count + 1)}
        >
          Increase Count
        </button>
      </div>
    </div>
  );
}
