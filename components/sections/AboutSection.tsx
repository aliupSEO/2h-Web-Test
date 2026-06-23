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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="flex flex-col items-start animate-fade-slide-up">
          <SectionBadge label={data.subtitle} variant="light" />
          
          <h2 className="text-3xl sm:text-[48px] lg:text-[60px] leading-[1.1] font-serif mb-8 tracking-normal text-zinc-900 uppercase">
            <span style={{ color: "var(--color-brand-primary, #b6ef00)" }}>{data.titleLine1}</span>
            <br />
            {data.titleLine2}
          </h2>

          <p className="text-base sm:text-lg leading-relaxed mb-8 text-zinc-600 max-w-lg font-sans">
            {data.description}
          </p>

          <h5 className="text-[17px] font-sans mb-10 text-zinc-900 leading-[1.6] uppercase tracking-[1.5px] max-w-xl">
            {data.motto}
          </h5>

          <div className="flex flex-wrap items-center gap-6">
            <Link 
              href={data.btnLink} 
              className="btn-primary font-sans font-medium uppercase tracking-[1px]"
            >
              {data.btnText}
            </Link>
            
            <a 
              href={data.phoneLink} 
              className="flex items-center gap-4 text-zinc-900 hover:opacity-80 transition-opacity font-sans font-medium text-[17px] tracking-wide"
            >
              <span className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#111111]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              {data.phoneText}
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl animate-fade-slide-up animation-delay-200">
          {data.imageUrl && (
            <Image
              src={data.imageUrl}
              alt={data.motto || "About Image"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          )}
        </div>
      </div>
    </section>
  );
}
