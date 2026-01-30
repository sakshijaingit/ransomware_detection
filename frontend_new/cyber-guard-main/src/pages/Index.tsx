import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AwarenessBlock from "@/components/AwarenessBlock";
import ForensicsLogReport from "@/components/ForensicsLogReport";
import LiveMonitoring from "@/components/LiveMonitoring";
import ParticlesBackground from "@/components/ParticlesBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticlesBackground />
      
      <div className="relative z-10">
        <Header />
        <Navigation />
        <HeroSection />
        
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <AwarenessBlock />
            </div>
            
            <div className="space-y-6">
              <ForensicsLogReport />
              <LiveMonitoring />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
