import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold">Main Landing Page</h1>
      <p>This is the new home page for the base URL (/).</p>
      <Footer />
    </div>
  );
}
