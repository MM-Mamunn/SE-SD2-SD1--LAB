export default function UserProfile(props) {
  return (
    <div className="border p-4 rounded mt-4">
      <h3 className="text-xl font-semibold">Name: {props.name}</h3>
      <p>Age: {props.age}</p>
    </div>
  );
}
