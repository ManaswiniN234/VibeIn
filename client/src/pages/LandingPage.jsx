import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Communities from '../components/Communities';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Communities />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default LandingPage;