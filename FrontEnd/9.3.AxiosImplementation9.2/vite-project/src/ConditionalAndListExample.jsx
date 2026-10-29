import { useState } from "react";

export default function ConditionalAndListExample() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const students = ["Alice", "Bob", "Charlie", "David", "Eve"];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Conditional Rendering & Lists</h1>

      {/* 1. Conditional Rendering Example */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">1. Conditional Rendering</h2>
        
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          onClick={() => setIsLoggedIn(!isLoggedIn)}
        >
          Toggle Login Status
        </button>

        {/* Logical && Example */}
        <div className="mb-2 p-2 bg-gray-100 rounded">
          <p className="font-semibold text-gray-700">Logical &amp;&amp; Operator:</p>
          {isLoggedIn && <p className="text-green-600">Welcome back, User!</p>}
          {!isLoggedIn && <p className="text-red-600">You are currently logged out.</p>}
        </div>

        {/* Ternary Operator Example */}
        <div className="p-2 bg-gray-100 rounded">
          <p className="font-semibold text-gray-700">Ternary ? : Operator:</p>
          {isLoggedIn ? (
            <p className="text-green-600">Logged In</p>
          ) : (
            <p className="text-red-600">Please Log In</p>
          )}
        </div>
      </div>

      {/* 2. List Rendering Example */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">2. Rendering Lists</h2>
        <p className="mb-2">List of Students:</p>
        
        <ul className="list-disc ml-5">
          {students.map((student, index) => (
            // We use 'index' here as the key only because the items are unique simple strings.
            // In a real app, you should use unique IDs like user.id as the key.
            <li key={index} className="mb-1">{student}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}
