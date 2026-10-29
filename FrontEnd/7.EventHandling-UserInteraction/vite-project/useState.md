# React useState Hook

## 1. What is useState?
`useState` is a special function built into React that lets you add "state" to your components. State is just a way for a component to remember some information or data that might change over time.

## 2. Why we use it
Normally, variables in JavaScript are forgotten when a component re-renders (redraws itself). When we use `useState`, React safely remembers our variable's value across re-renders. More importantly, when we update a state variable, React automatically redraws the component to show the new data on the screen!

## 3. How to create a state variable
You call `useState` and give it an initial value. It gives you back an array with two things:
1. The current value (your state variable).
2. A function to change that value.

For example:
```jsx
// Creating a variable 'data' that starts as "Loading..."
const [data, setData] = useState("Loading...");
```

## 4. How to update state
You must NEVER change the state variable directly (like `data = "Done"`). Instead, you use the function that `useState` provided:
```jsx
// This tells React to change 'data' to "API Data Loaded!" and update the screen
setData("API Data Loaded!");
```

## 5. How the implemented example uses useState
In our `UseStateExample.jsx` component, we use `useState` twice:
- `const [data, setData] = useState("Loading...");` is used to remember the text that shows the simulated API status.
- `const [count, setCount] = useState(0);` is used to remember how many times a user clicked a button. When you click the button, `setCount(count + 1)` is called to increase the number.

## 6. How the simulated API/time delay changes the state
We simulated a delay (like waiting for data from an API over the internet) using JavaScript's `setTimeout`. 
1. **Initial State:** The component first renders, and `data` is set to `"Loading..."`. The screen shows "Loading...".
2. **Time Delay:** A 2-second timer starts immediately.
3. **State Update:** After 2 seconds, the timer finishes and runs `setData("API Data Loaded!")`.
4. **React Re-renders:** Because `setData` was called, React notices the state changed. It re-runs the component and updates the screen to show the new value: `"API Data Loaded!"`.
