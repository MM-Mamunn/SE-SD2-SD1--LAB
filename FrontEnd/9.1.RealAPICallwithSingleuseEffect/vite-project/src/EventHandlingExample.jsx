import { useState } from "react";

export default function EventHandlingExample() {

  const [name, setName] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");

  const handleClick = () => {
    alert("Button was clicked!");
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    setSubmittedMessage(`Form submitted with name: ${name}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Event Handling & User Interaction</h1>

      {/* 1. onClick Example */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">1. onClick Example</h2>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleClick}
        >
          Click Me
        </button>
      </div>

      {/* 2. onChange and Two-Way Data Binding Example */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">2. onChange & Two-Way Data Binding</h2>
        <p className="mb-2">Type your name below:</p>
        <input 
          type="text"
          className="border p-2 rounded mb-2 w-full"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter your name"
        />
        <p>Current Value: <strong>{name}</strong></p>
      </div>
{/* <p className="text-green-700 font-semibold mt-2">Here is the message:{submittedMessage}</p> */}
      {/* 3. onSubmit Example */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">3. Form Submission (onSubmit)</h2>
        <form onSubmit={handleSubmit}>
          <p className="mb-2">Submit the form to see the result.</p>
          <button 
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-2"
          >
            Submit Form
          </button>
        </form>
       
    
          
        {submittedMessage && (
          <p className="text-blue-700 font-semibold mt-2">message: {submittedMessage}</p>
        )}
      </div>
    </div>
  );
}
