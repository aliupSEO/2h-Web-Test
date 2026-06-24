import Image from "next/image";
import { TeamSectionData } from "@/lib/graphql";
import SectionTitle from "@/components/ui/SectionTitle";

interface TeamSectionProps {
  data: TeamSectionData | null;
}

export default function TeamSection({ data }: TeamSectionProps) {
  if (!data || !data.members || data.members.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-950 text-white relative">
      <div className="max-w-[1150px] mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16 animate-fade-slide-up">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
            <span className="text-[11px] md:text-[13px] uppercase tracking-[3px] font-medium text-zinc-400">
              Partner Netzwerk
            </span>
          </div>
          <h2 className="text-3xl sm:text-[40px] lg:text-[48px] font-sans text-white uppercase tracking-[1px] md:tracking-[2px] leading-tight max-w-2xl">
            {data.title}
          </h2>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {data.members.map((member, index) => (
            <div 
              key={index}
              className="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-300 backdrop-blur-sm group animate-fade-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Member Image */}
              {member.imageUrl && (
                <div className="relative w-full sm:w-[150px] h-[200px] sm:h-auto aspect-[3/4] sm:aspect-square rounded-2xl overflow-hidden flex-shrink-0">
                  <Image 
                    src={member.imageUrl} 
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                    sizes="(max-width: 640px) 100vw, 150px"
                  />
                </div>
              )}

              {/* Member Details */}
              <div className="flex flex-col justify-start">
                <h3 className="text-xl sm:text-2xl font-sans text-white mb-1">
                  {member.name}
                </h3>
                <p 
                  className="text-xs sm:text-sm font-medium tracking-[1.5px] uppercase mb-4"
                  style={{ color: "var(--color-brand-primary, #b6ef00)" }}
                >
                  {member.role}
                </p>
                <p className="text-[13px] leading-relaxed text-zinc-400 font-sans">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
