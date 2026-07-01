import Link from "next/link";
import SectionBadge from "@/components/ui/SectionBadge";
import SectionTitle from "@/components/ui/SectionTitle";
import { ServicesSectionData } from "@/lib/graphql";

interface ServicesSectionProps {
  data: ServicesSectionData | null;
  variant?: "light" | "dark";
}

export default function ServicesSection({ data, variant = "light" }: ServicesSectionProps) {
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
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    );
  };

  const getDarkIcon = (index: number) => {
    if (index === 0) {
      // Monitor with paintbrush (Webdesign & Ecommerce)
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
          <rect x="2" y="4" width="20" height="12" rx="2" ry="2"></rect>
          <line x1="8" y1="20" x2="16" y2="20"></line>
          <line x1="12" y1="16" x2="12" y2="20"></line>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      );
    }
    if (index === 1) {
      // Magnifying glass with chart (SEO, GEO & AEO)
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <polyline points="7 13 10 10 13 13 16 9"></polyline>
        </svg>
      );
    }
    // Megaphone (SEA)
    return (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    );
  };

  if (variant === "dark") {
    return (
      <section 
        className="relative py-24 px-6 md:px-12 lg:px-24 flex items-center min-h-[600px]"
        id="services-dark"
      >
        {/* Background Image with Dark Overlay */}
        {data.imageUrl && (
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${data.imageUrl})` }}
            ></div>
            {/* Dark overlay: solid dark color with 85% opacity */}
            <div className="absolute inset-0 bg-black opacity-85"></div>
          </div>
        )}

        <div className="relative z-10 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col items-center text-center mb-16 animate-fade-slide-up">
            <h2 className="text-3xl md:text-5xl font-sans font-normal text-white uppercase tracking-wider mb-4 leading-tight whitespace-pre-line">
              {data.title}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl font-serif">
              {data.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.services.map((service, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center animate-fade-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {getDarkIcon(index)}
                <h3 className="text-xl font-sans font-normal text-white mb-4 uppercase tracking-wider">
                  {service.title}
                </h3>
                <p className="text-gray-400 font-serif leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
              className="group relative p-8 pb-[140px] min-h-[320px] md:min-h-[460px] flex flex-col justify-start items-start rounded-[20px] bg-[#f4f5f5] animate-fade-slide-up overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <h3 
                className="text-[20px] leading-[30px] font-normal text-[rgb(16,16,16)] group-hover:text-[rgb(137,180,3)] transition-colors duration-300 mb-6 uppercase tracking-wider relative z-10"
              >
                {service.title}
              </h3>
              <p 
                className="text-[17px] leading-[30px] text-[#727272] font-serif font-normal relative z-10 whitespace-pre-line"
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
