import Image from "next/image";
import Link from "next/link";
import SectionBadge from "@/components/ui/SectionBadge";
import SectionTitle from "@/components/ui/SectionTitle";
import { AboutSectionData } from "@/lib/graphql";

interface AboutSectionProps {
  data: AboutSectionData | null;
}

export default function AboutSection({ data }: AboutSectionProps) {
  if (!data) return null;

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-[1150px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left animate-fade-slide-up">
          <SectionBadge label={data.subtitle} variant="light" />
          
          <h2 className="text-4xl sm:text-[45px] lg:text-[50px] leading-[1.15] font-sans font-normal mb-6 tracking-wide text-zinc-900 uppercase">
            <span style={{ color: "var(--color-brand-primary, #b6ef00)" }}>{data.titleLine1}</span>
            <br />
            {data.titleLine2}
          </h2>

          <p className="text-[14px] leading-[1.8] mb-6 text-zinc-600 max-w-lg font-sans">
            {data.description}
          </p>

          <h5 className="text-[14px] font-sans mb-8 text-zinc-900 leading-[1.6] uppercase tracking-[1px] max-w-lg mx-auto lg:mx-0">
            {data.motto}
          </h5>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
            <Link 
              href={data.btnLink} 
              className="btn-primary font-sans font-medium uppercase tracking-[1px] text-[13px] px-8 py-3 hover:!bg-[#111111] hover:!text-white transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {data.btnText}
            </Link>
            
            <a 
              href={data.phoneLink} 
              className="flex items-center gap-3 text-zinc-900 hover:opacity-80 transition-opacity font-sans font-medium text-[14px] tracking-wide"
            >
              <span className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#111111]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              {data.phoneText}
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center lg:justify-end animate-fade-slide-up animation-delay-200">
          <div className="relative w-full max-w-[480px] aspect-[16/10] rounded-[1rem] overflow-hidden shadow-xl group cursor-pointer">
            {data.imageUrl && (
              <Image
                src={data.imageUrl}
                alt={data.motto || "About Image"}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
