import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DigitalAtrium from "@/components/DigitalAtrium";
import ProactiveOpportunities from "@/components/ProactiveOpportunities";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <DigitalAtrium />
        <ProactiveOpportunities />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
