
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import PlanCard from "./PlanCard";
import { plansData } from "@/data/plans";
import { cn } from "@/lib/utils"; 
import { useIsMobile } from "@/hooks/use-mobile";

const PlanCarousel: React.FC = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const isMobile = useIsMobile();

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

  return (
    <div className="w-full py-4 sm:py-6">
      <Carousel 
        setApi={setApi} 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 sm:-ml-4">
          {plansData.map((plan, index) => (
            <CarouselItem 
              key={index} 
              className={cn(
                "pl-2 sm:pl-4",
                isMobile ? "basis-full" : "basis-1/3"
              )}
            >
              <div className="p-1">
                <PlanCard plan={plan} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2">
          <CarouselPrevious className="static translate-y-0 border-0" />
          <div className="flex gap-1.5">
            {plansData.map((_, index) => (
              <Button
                key={index}
                className={cn(
                  "h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full p-0",
                  index === current % plansData.length
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
