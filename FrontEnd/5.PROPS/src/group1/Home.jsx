import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UserProfile from "../components/UserProfile";

export default function Home() {
  return (
    <div>
      <Navbar name="xyz" age={24}/>
    
      <h1 className="text-2xl font-bold">Home Component</h1>
      <p>This is the home page in Group 1.</p>
      {/* <UserProfile name = "Alice" age = {25} id= "C234567" /> */}
      <Footer />
    </div>
  );
}
