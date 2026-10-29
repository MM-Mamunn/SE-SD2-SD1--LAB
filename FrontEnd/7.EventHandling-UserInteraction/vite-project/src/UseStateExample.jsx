import { useState, useEffect } from "react";

export default function UseStateExample() {
  // 1. Creating a state variable for simulated API data
  const [data, setData] = useState("Loading...");

  // 2. Creating a state variable for a simple counter
  const [count, setCount] = useState(0);

  // Using a simple effect to simulate a 2-second API delay
  useEffect(() => {
    const timer = setTimeout(() => {
      // Updating the state after 2 seconds
      setData("API Data Loaded!");
    }, 2000);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
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
