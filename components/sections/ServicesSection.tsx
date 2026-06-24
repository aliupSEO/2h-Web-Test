import Link from "next/link";
import SectionBadge from "@/components/ui/SectionBadge";
import SectionTitle from "@/components/ui/SectionTitle";
import { ServicesSectionData } from "@/lib/graphql";

interface ServicesSectionProps {
  data: ServicesSectionData | null;
}

export default function ServicesSection({ data }: ServicesSectionProps) {
  if (!data || !data.services || data.services.length === 0) return null;

  const getIcon = (index: number) => {
    if (index === 0) {
      // Globe icon for Webdesign
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      );
    }
    if (index === 1) {
      // Search Document for SEO
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <circle cx="11.5" cy="14.5" r="2.5"></circle>
          <line x1="13.5" y1="16.5" x2="15.5" y2="18.5"></line>
        </svg>
      );
    }
    // Line Chart for SEA
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 17 9 11 13 15 21 7"></polyline>
        <circle cx="3" cy="17" r="1.5" fill="white"></circle>
        <circle cx="9" cy="11" r="1.5" fill="white"></circle>
        <circle cx="13" cy="15" r="1.5" fill="white"></circle>
        <circle cx="21" cy="7" r="1.5" fill="white"></circle>
      </svg>
    );
  };

  return (
    <section className="py-16 px-6 md:px-12 lg:px-24 bg-white" id="services">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col items-center text-center mb-6 animate-fade-slide-up">
          <SectionBadge label={data.subtitle} variant="light" />
          <SectionTitle text={data.title} variant="light" as="h2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.services.map((service, index) => (
            <div 
              key={index}
              className="group relative p-8 pb-[90px] min-h-[320px] md:min-h-[460px] flex flex-col justify-start items-start rounded-[20px] bg-[#f4f5f5] animate-fade-slide-up overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <h3 
                className="text-[20px] leading-[30px] font-normal text-[rgb(16,16,16)] group-hover:text-[rgb(137,180,3)] transition-colors duration-300 mb-6 uppercase tracking-wider relative z-10"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                {service.title}
              </h3>
              <p 
                className="text-[17px] leading-[30px] text-[#727272] font-normal relative z-10 whitespace-pre-line"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                {service.description}
              </p>
              
              {/* White Cutout at bottom right */}
              <div className="absolute bottom-0 right-0 w-[96px] h-[96px] bg-white rounded-tl-[32px] z-0 flex items-end justify-end p-2">
                
                {/* Smooth curve corner - TOP */}
                <div className="absolute top-[-24px] right-0 w-[24px] h-[24px]">
                  <div className="absolute inset-0 bg-white"></div>
                  <div className="absolute inset-0 bg-[#f4f5f5] rounded-br-[24px]"></div>
                </div>
                
                {/* Smooth curve corner - LEFT */}
                <div className="absolute bottom-0 left-[-24px] w-[24px] h-[24px]">
                  <div className="absolute inset-0 bg-white"></div>
                  <div className="absolute inset-0 bg-[#f4f5f5] rounded-br-[24px]"></div>
                </div>

                {/* The Button */}
                <Link 
                  href={service.link}
                  className="relative z-10 w-[64px] h-[64px] rounded-full flex items-center justify-center overflow-hidden"
                  aria-label={`Mehr erfahren über ${service.title}`}
                >
                  {/* Default Background (Black on desktop, hidden on mobile/hover) */}
                  <div 
                    className="absolute inset-0 transition-opacity duration-300 hidden md:block opacity-100 group-hover:opacity-0 bg-[#111111]"
                  ></div>
                  
                  {/* Hover/Mobile Background (Green on mobile and desktop hover) */}
                  <div 
                    className="absolute inset-0 transition-opacity duration-300 opacity-100 md:opacity-0 group-hover:opacity-100"
                    style={{ background: "var(--color-brand-primary, #b6ef00)" }}
                  ></div>

                  {/* Default Icon (hidden on mobile and desktop hover) */}
                  <div className="relative z-10 hidden md:block group-hover:hidden">
                    {getIcon(index)}
                  </div>
                  
                  {/* Hover/Mobile Arrow Icon */}
                  <div className="relative z-10 block md:hidden group-hover:block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
