# Event Handling & User Interaction

## 1. What is Event Handling in React?
Whenever a user interacts with a web page—like clicking a button, typing in a text box, or submitting a form—an "event" occurs. Event handling is how we tell React what code to run when these specific actions happen.

## 2. Common Events (`onClick`, `onChange`, `onSubmit`)
- **`onClick`**: Runs when an element (like a button) is clicked.
- **`onChange`**: Runs whenever the value of an input field changes (like when a user types a new letter).
- **`onSubmit`**: Runs when a form is submitted (like clicking a "Submit" button inside a `<form>`).

## 3. How User Input is Stored in State
When a user types into an input field, we need to remember what they typed. We use the `useState` hook to store this value. Every time the `onChange` event fires, we take the new text and update our state variable.

## 4. What is Two-Way Data Binding?
Two-way data binding means there is a synchronized connection between what is displayed on the screen and the state variable in the code.
1. The input field displays the value from the state.
2. When the user types, it updates the state, which immediately updates what is displayed.

## 5. A Small Example
Here is a simplified example based on our code:

```jsx
import { useState } from "react";

export default function SimpleExample() {
  // 1. Create a state variable to hold the text
  const [name, setName] = useState("");

  // 2. Event Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the page from refreshing!
    alert(`Form submitted with name: ${name}`);
  };

  return (
    // onSubmit runs when the button inside is clicked
    <form onSubmit={handleSubmit}>
      
      {/* onChange runs when the user types */}
      {/* value={name} connects the input to our state (Two-Way Data Binding) */}
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      
      {/* onClick can also be used directly on buttons */}
      <button type="submit">Submit</button>

    </form>
  );
}
```

### The Basic Flow
1. **User Action:** The user types "A".
2. **React Event:** The `onChange` event triggers.
3. **Event Handler:** `(e) => setName(e.target.value)` runs.
4. **Update State:** React updates the state variable `name` to "A".
5. **UI Updates:** React re-renders the input field to show "A".
