import Hero from "@/components/Hero";
import ContentTabs from "@/components/ContentTabs";
import Socials from "@/components/Socials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ContentTabs />
      <Socials />
      <Footer />
    </div>
  );
};

export default Index;
