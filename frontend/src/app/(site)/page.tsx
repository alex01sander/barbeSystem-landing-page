"use client";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services as ServicesComponent } from "./components/Services";
import { Team } from "./components/Team";
import { Booking } from "./components/Booking";
import { MobileBooking } from "./components/MobileBooking";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background font-body text-foreground selection:bg-accent selection:text-black">
      <Navbar />
      <Hero />
      <About />
      <ServicesComponent />
      <Team />
      <Booking />
      <MobileBooking />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
