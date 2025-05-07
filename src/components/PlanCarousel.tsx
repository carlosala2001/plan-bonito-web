
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import PlanCard, { Plan } from "./PlanCard";
import { plansData } from "@/data/plans";
import { cn } from "@/lib/utils"; 

const PlanCarousel: React.FC = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [visiblePlans, setVisiblePlans] = useState<Plan[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if screen size is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!api) return;
    
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", handleSelect);
    
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Select the appropriate number of visible plans based on screen size
  useEffect(() => {
    // On mobile, show one plan at a time
    if (isMobile) {
      setVisiblePlans(plansData);
    } else {
      // On desktop, show three plans at a time
      setVisiblePlans(plansData);
    }
  }, [isMobile]);

  return (
    <div className="w-full py-6">
      <Carousel 
        setApi={setApi} 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {visiblePlans.map((plan, index) => (
            <CarouselItem 
              key={index} 
              className={cn(
                "pl-4",
                isMobile ? "basis-full" : "basis-1/3"
              )}
            >
              <div className="p-1">
                <PlanCard plan={plan} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-6 flex items-center justify-center gap-2">
          <CarouselPrevious className="static translate-y-0 border-0" />
          <div className="flex gap-1.5">
            {visiblePlans.map((_, index) => (
              <Button
                key={index}
                className={cn(
                  "h-2.5 w-2.5 rounded-full p-0",
                  index === current % visiblePlans.length
                    ? "bg-gradient-zenoscale"
                    : "bg-muted"
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
          <CarouselNext className="static translate-y-0 border-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default PlanCarousel;
