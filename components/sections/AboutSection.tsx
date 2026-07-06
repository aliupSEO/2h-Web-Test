import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CheckSquare, Skull } from "lucide-react";
import SectionBadge from "@/components/ui/SectionBadge";
import SectionTitle from "@/components/ui/SectionTitle";
import { AboutSectionData } from "@/lib/graphql";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface AboutSectionProps {
  data: AboutSectionData | null;
  isHomePage?: boolean;
  mottoPosition?: 'before-list' | 'after-list';
}

export default function AboutSection({ data, isHomePage = false, mottoPosition = 'before-list' }: AboutSectionProps) {
  if (!data) return null;

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-[var(--color-bg-light,#ffffff)] overflow-hidden">
      <div className="max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-12 items-center">
        {/* Text Content */}
        <ScrollReveal className="flex flex-col items-start text-left">
          {data.subtitle && (
            <div 
              className={isHomePage ? "flex items-center gap-[10px] font-normal uppercase mb-4" : "font-sans font-normal uppercase tracking-[2px] mb-4"}
              style={isHomePage 
                ? { fontFamily: "var(--font-federo)", fontSize: "17px", lineHeight: "29.8px", letterSpacing: "2px", color: "#101010" }
                : { fontSize: "21px", lineHeight: "21px", color: "#101010" }
              }
            >
              {isHomePage && <div className="w-[8px] h-[8px] rounded-full bg-[var(--color-brand-primary,#b6ef00)]"></div>}
              {data.subtitle}
            </div>
          )}
          
          {isHomePage ? (
            <h2 
              className="font-[family-name:var(--font-federo)] font-normal mb-6 uppercase"
              style={{ fontSize: "45px", lineHeight: "54px", letterSpacing: "2px" }}
              suppressHydrationWarning
            >
              <span style={{ color: "var(--color-brand-primary, #b6ef00)" }} dangerouslySetInnerHTML={{ __html: data.titleLine1 }} />
              {data.titleLine2 && (
                <>
                  <br/>
                  <span style={{ color: "#101010" }} dangerouslySetInnerHTML={{ __html: data.titleLine2 }} />
                </>
              )}
            </h2>
          ) : (
            <h2 
              className="font-[family-name:var(--font-federo)] font-normal mb-6 uppercase"
              style={{ fontSize: "42px", lineHeight: "46.2px", color: "#101010" }}
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: data.titleLine2 ? `${data.titleLine1}<br/>${data.titleLine2}` : data.titleLine1 }}
            />
          )}

          <div 
            className="font-normal mb-6 max-w-full lg:max-w-lg"
            style={isHomePage 
              ? { fontFamily: "var(--font-barlow)", fontSize: "17px", lineHeight: "29.8px", letterSpacing: "0px", color: "#727272" }
              : { fontFamily: "var(--font-barlow)", fontSize: "18px", lineHeight: "28.8px", color: "#7A7A7A" }
            }
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: data.description || "Sie erreichen genau die Menschen, die aktiv nach Ihrer Leistung suchen – und können Ergebnisse jederzeit messen und steuern." }}
          />

          {mottoPosition === 'before-list' && data.motto && (
            <div 
              className={isHomePage ? "font-[family-name:var(--font-federo)] font-normal uppercase mb-8 max-w-full lg:max-w-lg" : "font-[family-name:var(--font-federo)] font-normal mb-8 max-w-full lg:max-w-lg"}
              style={isHomePage 
                ? { fontSize: "20px", lineHeight: "30px", letterSpacing: "2px", color: "#101010" }
                : { fontSize: "20px", lineHeight: "20px", color: "#101010" }
              }
              suppressHydrationWarning
            >
              {data.motto}
            </div>
          )}

          {/* Main List 1 */}
          {!isHomePage && data.list1 && data.list1.length > 0 && (
            <ul className="mb-8 space-y-4">
              {data.list1.map((item, idx) => {
                const titleFull = `${data.titleLine1 || ''} ${data.titleLine2 || ''}`.toUpperCase();
                const useSkull = titleFull.includes("SEHEN GUT AUS") || titleFull.includes("BRINGEN KEINE ANFRAGEN");
                
                return (
                  <ScrollReveal delay={((idx % 5) + 1) * 100 as any} key={idx}>
                    <li className="flex items-start gap-3">
                      {useSkull ? (
                        <div className="mt-[4px] flex-shrink-0 text-[var(--color-brand-primary,#b6ef00)]">
                          <Skull size={18} strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="mt-[4px] w-[24px] h-[24px] rounded-full bg-[var(--color-brand-primary,#b6ef00)] flex items-center justify-center flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      )}
                      <span 
                        className="font-[family-name:var(--font-barlow)] font-normal"
                        style={{ fontSize: "17px", lineHeight: "29.8px", color: "#101010" }}
                      >
                        {item}
                      </span>
                    </li>
                  </ScrollReveal>
                );
              })}
            </ul>
          )}

          {/* Fallback list if WP is empty */}
          {!isHomePage && (!data.list1 || data.list1.length === 0) && (
            <ul className="mb-8 space-y-4">
              <li className="flex items-start gap-2.5">
                <BadgeCheck className="mt-[4px] flex-shrink-0" size={28} fill="var(--color-brand-primary,#b6ef00)" stroke="white" strokeWidth={2} />
                <span className="font-sans font-normal" style={{ fontSize: "24px", lineHeight: "36px", color: "#101010" }}>
                  Sofort sichtbar bei Google
                </span>
              </li>
            </ul>
          )}


          {mottoPosition === 'after-list' && data.motto && (
            <div 
              className={isHomePage ? "font-[family-name:var(--font-federo)] font-normal uppercase mb-8 max-w-full lg:max-w-lg" : "font-[family-name:var(--font-federo)] font-normal mb-8 max-w-full lg:max-w-lg"}
              style={isHomePage 
                ? { fontSize: "20px", lineHeight: "30px", letterSpacing: "2px", color: "#101010" }
                : { fontSize: "20px", lineHeight: "20px", color: "#101010" }
              }
              suppressHydrationWarning
            >
              {data.motto}
            </div>
          )}

          {data.list2 && data.list2.length > 0 && (
            <ul className="mb-10 space-y-1.5">
              {data.list2.map((item, idx) => (
                <ScrollReveal delay={((idx % 5) + 1) * 100 as any} key={idx}>
                  <li className="flex items-start gap-2.5">
                    <div className="mt-[1px] w-[28px] h-[28px] rounded-[4px] bg-[var(--color-brand-primary,#b6ef00)] flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span 
                      className="text-[17px] leading-[29.8px] font-normal"
                      style={{ fontFamily: "var(--font-barlow)", color: "#101010" }}
                    >
                      {item}
                    </span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          )}
  
          <div className="flex flex-wrap items-center justify-start gap-6">
            {isHomePage && data.btnText && data.btnLink && (
              <Link 
                href={data.btnLink}
                className="btn-primary uppercase"
                style={{ 
                  fontFamily: "var(--font-federo)", 
                  fontSize: "15px", 
                  lineHeight: "29.8px", 
                  letterSpacing: "0px",
                  "--btn-primary-text": "#000000",
                  "--btn-primary-hover-bg": "#101010",
                  "--btn-primary-hover-text": "#ffffff",
                  "--btn-primary-border-radius": "50px",
                } as React.CSSProperties}
                suppressHydrationWarning
              >
                {data.btnText}
              </Link>
            )}
            
            {data.phoneText && (
              <a 
                href={data.phoneLink} 
                className="flex items-center gap-3 text-[rgb(16,16,16)] hover:opacity-80 transition-opacity font-sans font-normal text-[20px] leading-[30px] tracking-wide"
                suppressHydrationWarning
              >
                <span className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[var(--color-brand-secondary,#111111)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                {data.phoneText}
              </a>
            )}
          </div>
        </ScrollReveal>
  
        {/* Image */}
        <ScrollReveal delay={200} className="flex justify-center lg:justify-end mt-4 lg:mt-0 w-full">
          <div className="relative w-full aspect-[4/3] rounded-[1rem] overflow-hidden shadow-xl group cursor-pointer">
            {data.imageUrl && (
              <Image
                src={data.imageUrl}
                alt={data.motto || "About Image"}
                fill
                quality={95}
                className="object-cover grayscale transition-all duration-700 ease-in-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                suppressHydrationWarning
              />
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
