"use client";

import { ContactPageData } from "@/lib/graphql";
import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface ContactPageSectionProps {
  data: ContactPageData;
}

export default function ContactPageSection({ data }: ContactPageSectionProps) {
  return (
    <>
      <section className="relative w-full">
        {/* Hero Background */}
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: data.imageUrl ? `url(${data.imageUrl})` : 'none', backgroundColor: '#111' }}
        >
          {/* Dark Overlay - Explicitly dark to ensure white text is visible */}
          <div className="absolute inset-0" style={{ backgroundColor: '#0a0a0a', opacity: 0.65 }}></div>
        </div>

        {/* Content Container */}
        <div className="relative pt-[200px] md:pt-[250px] pb-[200px] md:pb-[220px] px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          
          {/* Intro text */}
          <div className="max-w-4xl animate-fade-slide-up">
            <div className="mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-none" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
              <span 
                className="font-normal text-[17px] leading-[30px] uppercase text-[#ffffff]"
                style={{ fontFamily: 'Barlow, sans-serif' }}
              >
                {data.subtitle || "Kontakt"}
              </span>
            </div>
            <h1 
              className="font-normal text-[40px] md:text-[76px] leading-[1.1] md:leading-[99px] text-[#ffffff] mb-4 uppercase"
              style={{ fontFamily: 'Federo, sans-serif' }}
            >
              {data.title}
            </h1>
            <p 
              className="font-medium text-[18px] md:text-[22px] leading-[1.5] md:leading-[31px] text-[#ffffff]"
              style={{ fontFamily: 'Federo, sans-serif' }}
            >
              {data.description}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Boxes overlapping the bottom */}
      <section className="relative z-10 w-full px-6 md:px-12 lg:px-24 -mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1 (Email) */}
            <ScrollReveal delay={100}>
              <a href={`mailto:${data.email || 'haas@2hws.at'}`} className="h-full bg-[#f4f4f5] hover:!bg-[var(--color-brand-primary,#b6ef00)] group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl p-8 md:p-10 rounded-2xl shadow-xl flex flex-col justify-start relative overflow-hidden min-h-[220px] cursor-pointer">
              {/* Huge faded icon */}
              <svg className="absolute -bottom-4 -right-4 w-40 h-40 text-zinc-200 opacity-50 group-hover:text-black/10 transition-colors z-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              
              <div className="relative z-10 h-full flex flex-col">
                <svg className="w-[45px] h-[45px] mb-6 text-[var(--color-brand-primary,#b6ef00)] group-hover:text-[#101010] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <div className="mt-auto">
                  <h5 
                    className="font-normal text-[20px] leading-[30px] text-[#101010] uppercase mb-2"
                    style={{ fontFamily: 'Federo, sans-serif' }}
                  >
                    {data.emailTitle || "e-Mail"}
                  </h5>
                  <p 
                    className="font-normal text-[17px] leading-[30px] text-[#101010]"
                    style={{ fontFamily: 'Barlow, sans-serif' }}
                  >
                    {data.email || 'haas@2hws.at'}
                  </p>
                </div>
              </div>
              </a>
            </ScrollReveal>
            
            {/* Box 2 (Location) */}
            <ScrollReveal delay={200}>
              <a href="https://www.google.com/maps/place/2H+Web+Solutions/@48.1983125,16.3532567,17z/data=!3m1!4b1!4m6!3m5!1s0x476d07225ede5f4f:0x4bb56cb9fa9ce05f!8m2!3d48.198309!4d16.3558316!16s%2Fg%2F11sbpv7wsk!5m1!1e1?entry=tts&g_ep=EgoyMDI2MDYwMS4wIPu8ASoASAFQAw%3D%3D&skid=46ede52b-ca65-4b81-95f6-dff2f76a9e30" target="_blank" rel="noopener noreferrer" className="h-full bg-[#f4f4f5] hover:!bg-[var(--color-brand-primary,#b6ef00)] group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl p-8 md:p-10 rounded-2xl shadow-xl flex flex-col justify-start relative overflow-hidden min-h-[220px] cursor-pointer">
              {/* Huge faded icon */}
              <svg className="absolute -bottom-4 -right-4 w-40 h-40 text-zinc-200 opacity-50 group-hover:text-black/10 transition-colors z-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
              
              <div className="relative z-10 h-full flex flex-col">
                <svg className="w-[45px] h-[45px] mb-6 text-[var(--color-brand-primary,#b6ef00)] group-hover:text-[#101010] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
                <div className="mt-auto">
                  <h5 
                    className="font-normal text-[20px] leading-[30px] text-[#101010] uppercase mb-2"
                    style={{ fontFamily: 'Federo, sans-serif' }}
                  >
                    {data.locationTitle || "Der Standort"}
                  </h5>
                  <p 
                    className="font-normal text-[17px] leading-[30px] text-[#101010]"
                    style={{ fontFamily: 'Barlow, sans-serif' }}
                  >
                    {data.location}
                  </p>
                </div>
              </div>
              </a>
            </ScrollReveal>

            {/* Box 3 (Phone - Green) */}
            <ScrollReveal delay={300}>
              <a href={`tel:${data.phone ? data.phone.replace(/\\s/g, '') : '+436764508579'}`} className="h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl p-8 md:p-10 rounded-2xl shadow-xl flex flex-col justify-start relative overflow-hidden min-h-[220px] cursor-pointer group" style={{ background: "var(--color-brand-primary, #b6ef00)" }}>
              {/* Huge faded icon */}
              <svg className="absolute -bottom-4 -right-4 w-40 h-40 text-text-primary/5 z-0" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              
              <div className="relative z-10 h-full flex flex-col">
                <svg className="w-[45px] h-[45px] mb-6 text-[#101010] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                <div className="mt-auto">
                  <h5 
                    className="font-normal text-[20px] leading-[30px] text-[#101010] uppercase mb-2"
                    style={{ fontFamily: 'Federo, sans-serif' }}
                  >
                    {data.phoneTitle || "Einfach anrufen"}
                  </h5>
                  <p 
                    className="font-normal text-[17px] leading-[30px] text-[#101010]"
                    style={{ fontFamily: 'Barlow, sans-serif' }}
                  >
                    {data.phone || '+43 676 4508579'}
                  </p>
                </div>
              </div>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Form & Map Section below */}
      <section className="px-6 md:px-12 lg:px-24 pt-[120px] md:pt-[200px] pb-32 bg-white relative z-0">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal delay={200} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Left: Form */}
            <div>
              <h2 
                className="font-medium text-[26px] leading-[26px] text-[#101010] uppercase mb-10 text-left"
                style={{ fontFamily: 'Federo, sans-serif' }}
              >
                {data.formTitle || "Jetzt eine Nachricht senden"}
              </h2>
              <ContactForm theme="light" fields={data.fields} submitLabel={data.submitLabel} />
            </div>

            {/* Right: Map */}
            <div>
              <h2 
                className="font-medium text-[26px] leading-[26px] text-[#101010] uppercase mb-10 text-left"
                style={{ fontFamily: 'Federo, sans-serif' }}
              >
                {data.mapTitle || "Da ist 2H Websolutions zu Hause"}
              </h2>
              <div className="w-full h-[400px] md:h-[450px] rounded-3xl overflow-hidden shadow-lg border border-brand-border bg-brand-card relative">
                <iframe
                  src={data.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.1303102142516!2d16.35246731566418!3d48.19830597922758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d07842c676231%3A0xcda99763bc5f891b!2sWindm%C3%BChlgasse%2025%2C%201060%20Wien%2C%20Austria!5e0!3m2!1sen!2sus!4v1689230123456!5m2!1sen!2sus"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </div>

          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
