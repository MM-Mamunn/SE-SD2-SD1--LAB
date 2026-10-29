export default function UserProfile(props) {
  return (
    <div className="border p-4 rounded mt-4 flex flex-col gap-2">
      <h3 className="bg-green-100 p-2 text-xl font-semibold ">Name: {props.name}</h3>
      <p className=" bg-green-100 p-2 font-bold ">Age: {props.age}</p>
      <p className=" bg-green-100 p-2 font-bold ">ID: {props.id}</p>
    </div>
  );
}
