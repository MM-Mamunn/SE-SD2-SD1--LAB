import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold">Home Component</h1>
      <p>This is the home page in Group 1.</p>
      <Footer />
    </div>
  );
}
