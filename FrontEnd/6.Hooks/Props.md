# React Props

## 1. What are Props?
"Props" is short for properties. In React, props are like arguments you pass to a function. They allow you to send data from one component to another.

## 2. Why we use props
We use props to make components reusable and dynamic. Instead of hardcoding data inside a component, you can pass different data to it each time you use it. This way, one component can display many different things based on the props it receives.

## 3. How a parent sends props
A parent component passes props to a child component by adding custom attributes to the child component's tag.
For example:
`<UserProfile name="Alice" age={25} />`

## 4. How a child receives props
A child component receives props as a single object parameter (usually called `props`) in its function definition. You can then use `props.name` or `props.age` to display the data.

## 5. A simple example from the code
In our project, we created a `UserProfile` component.

**Parent Component (Home.jsx):**
```jsx
import UserProfile from "./components/UserProfile";

export default function Home() {
  return (
    <div>
      {/* Passing props to the child component */}
      <UserProfile name="Alice" age={25} />
      <UserProfile name="Bob" age={30} />
    </div>
  );
}
```

**Child Component (UserProfile.jsx):**
```jsx
export default function UserProfile(props) {
  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
      {/* Using the props received from the parent */}
      <h3>Name: {props.name}</h3>
      <p>Age: {props.age}</p>
    </div>
  );
}
```

## 6. Important Rule
**Props are read-only in the child component.** A child component cannot change the props it receives from its parent. If the data needs to change, the parent must manage it.
