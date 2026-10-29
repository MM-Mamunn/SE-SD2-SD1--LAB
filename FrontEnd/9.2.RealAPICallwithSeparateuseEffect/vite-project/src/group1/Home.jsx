import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar name="Alice" age={25}/>
      <h1 className="text-2xl font-bold">Home Component</h1>
      <p>This is the home page in Group 1.</p>
      <Footer />
    </div>
  );
}
