import Image from "next/image";
import { TeamSectionData } from "@/lib/graphql";

interface TeamSectionProps {
  data: TeamSectionData | null;
}

export default function TeamSection({ data }: TeamSectionProps) {
  if (!data || !data.members || data.members.length === 0) return null;

  return (
    <section 
      className="pt-24 lg:pt-32 pb-12 lg:pb-16 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--color-bg-primary, #ffffff)" }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16 lg:gap-24">
        {data.members.map((member, index) => {
          const isImageRight = index % 2 === 0;

          return (
            <div key={index} className="flex flex-col w-full gap-16 lg:gap-24">
              {index > 0 && (
                <div className="w-full flex justify-center animate-fade-slide-up">
                  <div className="h-10 md:h-[60px] w-[1px]" style={{ backgroundColor: "var(--color-brand-primary, #b6ef00)" }}></div>
                </div>
              )}
              <div 
                className={`flex flex-col ${isImageRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} justify-center gap-10 lg:gap-12 items-center`}
              >
              {/* Text Content */}
              <div className="w-full flex flex-col justify-center max-w-[720px] animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
                <h2 className="font-sans font-medium text-[28px] md:text-[40px] leading-[1.2] md:leading-[52px] text-[rgb(16,16,16)] uppercase tracking-wide mb-6 md:mb-8 whitespace-pre-line">
                  {member.title}
                </h2>
                <div className="flex flex-col gap-4 md:gap-6">
                  {member.paragraphs.map((p, i) => (
                    <p key={i} className="font-serif font-normal text-[15px] md:text-[17px] leading-[1.6] md:leading-[30px] text-[rgb(114,114,114)]">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* Image Content */}
              <div className="w-full max-w-[420px] mx-auto lg:mx-0 animate-fade-slide-up" style={{ animationDelay: '250ms' }}>
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-[420px] mx-auto aspect-[4/5] overflow-hidden rounded-2xl mb-4">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.bio || member.title}
                        fill
                        className="object-cover grayscale"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-200"></div>
                    )}
                  </div>
                  {member.bio && (
                    <p className="font-serif font-semibold text-[15px] leading-[30px] text-[rgb(122,122,122)] text-center md:whitespace-nowrap">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
