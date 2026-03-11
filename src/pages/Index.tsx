import { useState } from "react";
import Hero from "@/components/Hero";
import ContentTabs from "@/components/ContentTabs";
import Socials from "@/components/Socials";
import Footer from "@/components/Footer";
import TopNav from "@/components/TopNav";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "art">("projects");

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px]" />
        <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[140px]" />
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] rounded-full bg-[hsl(200,100%,55%,0.05)] blur-[150px]" />
        <div className="absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full bg-accent/7 blur-[130px]" />
        <div className="absolute -left-20 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[hsl(200,100%,55%,0.06)] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-primary/5 blur-[160px]" />
        <div className="absolute -bottom-32 -right-32 h-[550px] w-[550px] rounded-full bg-accent/5 blur-[150px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
        <main>
          <Hero />
          <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <Socials />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
