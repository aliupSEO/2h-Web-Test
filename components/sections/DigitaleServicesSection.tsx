import Link from "next/link";
import Image from "next/image";
import { MonitorSmartphone, FileSearch, TrendingUp, Presentation, ArrowUpRight } from "lucide-react";
import { DigitaleServiceData } from "@/lib/graphql";

interface DigitaleServicesSectionProps {
  services: DigitaleServiceData[];
}

export default function DigitaleServicesSection({ services }: DigitaleServicesSectionProps) {
  if (!services || services.length === 0) return null;

  // A helper function to assign a specific Lucide icon based on the service title
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("webdesign") || t.includes("webshop")) return <MonitorSmartphone size={20} color="white" />;
    if (t.includes("seo")) return <FileSearch size={20} color="white" />;
    if (t.includes("sea")) return <TrendingUp size={20} color="white" />;
    return <Presentation size={20} color="white" />;
  };

  return (
    <section className="bg-white py-12 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {services.map((service, index) => (
            <Link 
              key={index} 
              href={service.link || "#"}
              className="block relative group overflow-hidden rounded-[24px] aspect-[16/10] shadow-sm hover:shadow-xl transition-all duration-300 bg-[#111]"
            >
              {/* Background Image */}
              {service.imageUrl && (
                <Image 
                  src={service.imageUrl} 
                  alt={service.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              )}

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-100 opacity-90" />
              
              {/* Service Title */}
              <h3 
                className="absolute bottom-7 left-7 md:bottom-8 md:left-8 text-[22px] md:text-[26px] lg:text-[30px] font-sans uppercase tracking-[1.5px] transition-transform duration-300 group-hover:-translate-y-1 max-w-[80%] leading-[1.3]" 
                style={{ color: "var(--color-brand-primary, #b6ef00)" }}
                dangerouslySetInnerHTML={{ __html: service.title.replace('& ', '&<br>') }}
              />

              {/* Bottom Right Notch and Icon */}
              <div className="absolute bottom-0 right-0 bg-white p-3 md:p-4 rounded-tl-[32px] z-20">
                {/* Top inverse curve */}
                <svg className="absolute bottom-full right-0 w-6 h-6 md:w-8 md:h-8 text-white pointer-events-none" viewBox="0 0 100 100" fill="currentColor" preserveAspectRatio="none">
                  <path d="M100 100 V0 C100 55.23 55.23 100 0 100 H100 Z" />
                </svg>
                {/* Left inverse curve */}
                <svg className="absolute bottom-0 right-full w-6 h-6 md:w-8 md:h-8 text-white pointer-events-none" viewBox="0 0 100 100" fill="currentColor" preserveAspectRatio="none">
                  <path d="M100 100 V0 C100 55.23 55.23 100 0 100 H100 Z" />
                </svg>

                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#0a0a0a] flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--color-brand-primary,#b6ef00)] relative">
                  <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-50">
                    {getIcon(service.title)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100">
                    <ArrowUpRight size={24} color="black" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
