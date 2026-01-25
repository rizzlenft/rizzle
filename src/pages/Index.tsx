import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Projects />
      <Socials />
      <Footer />
    </div>
  );
};

export default Index;
