import Hero from "@/components/Hero";
import ContentTabs from "@/components/ContentTabs";
import Socials from "@/components/Socials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Top left glow */}
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]" />
        {/* Center right glow */}
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
        {/* Bottom left glow */}
        <div className="absolute -left-20 bottom-1/4 h-[350px] w-[350px] rounded-full bg-[hsl(var(--electric-blue)/0.04)] blur-[100px]" />
        {/* Bottom right subtle glow */}
        <div className="absolute -bottom-20 -right-20 h-[450px] w-[450px] rounded-full bg-primary/3 blur-[130px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <ContentTabs />
        <Socials />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
