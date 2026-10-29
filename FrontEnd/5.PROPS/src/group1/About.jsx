import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div>
      <Navbar name="xyz" />
      <h1 className="text-2xl font-bold">About Component</h1>
      <p>This is the about page in Group 1.</p>
      <Footer />
    </div>
  );
}
