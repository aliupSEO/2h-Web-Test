import Image from "next/image";
import { OfficeSectionData } from "@/lib/graphql";

interface OfficeSectionProps {
  data: OfficeSectionData | null;
}

export default function OfficeSection({ data }: OfficeSectionProps) {
  if (!data) return null;

  // Google Maps URL encoded for Windmühlgasse 26, 1060 Wien, Austria
  const mapIframeUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.39572621183!2d16.3558299!3d48.1983137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d0785f80459a1%3A0xe447395d223d4e9e!2sWindm%C3%BChlgasse%2026%2C%201060%20Wien%2C%20Austria!5e0!3m2!1sen!2sat!4v1782222400000!5m2!1sen!2sat";

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white text-zinc-900 relative">
      <div className="max-w-[1150px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Text Details */}
        <div className="flex flex-col items-start animate-fade-slide-up">
          <div className="mb-4 flex items-center justify-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
            <span className="text-[11px] md:text-[13px] uppercase tracking-[3px] font-medium text-zinc-500">
              Unser Standort
            </span>
          </div>

          <h2 className="text-3xl sm:text-[40px] lg:text-[45px] font-sans font-normal uppercase tracking-wide leading-tight mb-6 text-zinc-900">
            {data.title}
          </h2>

          <p className="text-[14px] leading-[1.8] text-zinc-600 font-sans mb-8">
            {data.description}
          </p>

          <a 
            href="https://maps.app.goo.gl/uR6Vx5Wz2b979a159" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary font-sans font-medium uppercase tracking-[1px] text-[13px] px-8 py-3 hover:!bg-[#111111] hover:!text-white transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Route planen →
          </a>
        </div>

        {/* Right: Map & Image */}
        <div className="flex flex-col gap-6 w-full animate-fade-slide-up animation-delay-200">
          {/* Interactive Google Map iframe */}
          <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-md border border-zinc-200">
            <iframe
              src={mapIframeUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
              className="grayscale contrast-[1.1]"
            />
          </div>

          {/* Optional Office/Team Photo below Map */}
          {data.imageUrl && (
            <div className="relative w-full h-[220px] rounded-3xl overflow-hidden shadow-md">
              <Image
                src={data.imageUrl}
                alt="Office Location"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
