import React from "react";
import { RestaurantHero } from "@/components/RestaurantHero";
import { PopularDishesSection } from "@/components/PopularDishesSection";
import { AboutSection } from "@/components/AboutSection";
import { MenuSection } from "@/components/MenuSection";
import { DinnerPlanBanner } from "@/components/DinnerPlanBanner";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ChefsSection } from "@/components/ChefsSection";
import { AppDownloadBanner } from "@/components/AppDownloadBanner";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Hero Section: "We Serve The Taste You Love 😍" */}
      <RestaurantHero />

      {/* 2. Popular Dishes Carousel / Showcase */}
      <PopularDishesSection />

      {/* 3. Feature Section: "We Are More Than Multiple Service" */}
      <AboutSection />

      {/* 4. Main Menu Pack: "Our Regular Menu Pack" */}
      <MenuSection />

      {/* 5. Dinner Reservation Callout: "Do You Have Any Dinner Plan Today? Reserve Your Table" */}
      <DinnerPlanBanner />

      {/* 6. Customer Reviews: "What Our Customer Says?" */}
      <TestimonialsSection />

      {/* 7. Chefs Showcase: "Meet Our Chefs" */}
      <ChefsSection />

      {/* 8. Mobile App Promotional Banner */}
      <AppDownloadBanner />
    </div>
  );
}
