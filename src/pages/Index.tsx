import Hero from "@/components/Hero";
import ContentTabs from "@/components/ContentTabs";
import ActivityFeed from "@/components/ActivityFeed";
import Socials from "@/components/Socials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Top left glow */}
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px]" />
        {/* Top right glow */}
        <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[140px]" />
        {/* Center left glow */}
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] rounded-full bg-[hsl(200,100%,55%,0.05)] blur-[150px]" />
        {/* Center right glow */}
        <div className="absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full bg-accent/7 blur-[130px]" />
        {/* Bottom left glow */}
        <div className="absolute -left-20 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[hsl(200,100%,55%,0.06)] blur-[120px]" />
        {/* Bottom center glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-primary/5 blur-[160px]" />
        {/* Bottom right glow */}
        <div className="absolute -bottom-32 -right-32 h-[550px] w-[550px] rounded-full bg-accent/5 blur-[150px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <ContentTabs />
        <ActivityFeed />
        <Socials />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
