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
    <section className="pb-24 pt-8 lg:pt-12 px-6 md:px-12 lg:px-24 bg-[#F8FAFC] text-zinc-900 relative">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        {/* Green Line Separator */}
        <div className="h-10 md:h-[60px] w-[1px] mb-12 lg:mb-16" style={{ backgroundColor: "var(--color-brand-primary, #b6ef00)" }}></div>

        {/* Title */}
        <h2 className="font-sans font-medium text-[28px] md:text-[40px] leading-[1.2] md:leading-[52px] text-[rgb(16,16,16)] mb-8 md:mb-10 text-center animate-fade-slide-up">
          {data.title}
        </h2>

        {/* Paragraphs */}
        <div className="w-full flex flex-col gap-4 md:gap-6 text-left animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
          {data.paragraphs.map((p, i) => (
            <p key={i} className="font-serif font-normal text-[15px] md:text-[17px] leading-[1.6] md:leading-[30px] text-[rgb(114,114,114)]">
              {p}
            </p>
          ))}
        </div>

        {/* Image Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 animate-fade-slide-up" style={{ animationDelay: '250ms' }}>
          {/* Map */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
            <iframe
              src={mapIframeUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            />
          </div>

          {/* Office Photo */}
          {data.imageUrl && (
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={data.imageUrl}
                alt="Office Location"
                fill
                className="object-cover grayscale"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
