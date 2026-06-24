"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import SectionBadge from "@/components/ui/SectionBadge";
import SectionTitle from "@/components/ui/SectionTitle";
import { TestimonialsSectionData } from "@/lib/graphql";

interface TestimonialsSectionProps {
  data: TestimonialsSectionData | null;
}

export default function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!data || !data.testimonials || data.testimonials.length === 0) return null;

  const totalPages = Math.ceil(data.testimonials.length / itemsPerPage);

  // Group testimonials into pages
  const pages = [];
  for (let i = 0; i < data.testimonials.length; i += itemsPerPage) {
    pages.push(data.testimonials.slice(i, i + itemsPerPage));
  }

  // Ensure current page is valid when resizing changes total pages
  if (currentPage >= totalPages && totalPages > 0) {
    setCurrentPage(totalPages - 1);
  }

  return (
    <section className="py-24 bg-white overflow-hidden" id="testimonials">
      <div className="flex flex-col items-center text-center mb-8 animate-fade-slide-up px-6 md:px-12 lg:px-24">
        <SectionBadge label={data.subtitle} variant="light" />
        <SectionTitle text={data.title} variant="light" as="h2" />
      </div>

      {/* Carousel Wrapper */}
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-in-out w-full"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((page, pageIndex) => (
            <div key={pageIndex} className="w-full shrink-0 px-6 md:px-12 lg:px-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-4">
                {page.map((testimonial, index) => (
                  <div 
                    key={index}
                    className="group relative bg-[#f4f5f5] rounded-[24px] p-8 md:p-10 pb-[140px] h-full min-h-[500px] flex flex-col justify-start animate-fade-slide-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Green Quotes */}
                    <div className="mb-6">
                      <svg className="w-10 h-10" style={{ color: "var(--color-brand-primary, #b6ef00)" }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    
                    {/* Testimonial Text */}
                    <p 
                      className="text-[17px] leading-[30px] text-[#727272] font-serif font-normal relative z-10 flex-grow"
                    >
                      {testimonial.text}
                    </p>

                    {/* Author Text (Positioned to the right of the cutout) */}
                    <div className="absolute bottom-6 left-[96px] right-6 z-10 flex flex-col justify-center">
                      <h6 className="font-sans font-normal text-[17px] leading-[26px] text-[rgb(16,16,16)]">
                        {testimonial.author}
                      </h6>
                      <p 
                        className="font-serif font-normal text-[15px] leading-[23px] text-[#727272] mt-1"
                        suppressHydrationWarning
                      >
                        {testimonial.role}
                      </p>
                    </div>

                    {/* Bottom Left White Cutout (Smaller proportions to match design) */}
                    <div className="absolute bottom-0 left-0 w-[80px] h-[80px] bg-white rounded-tr-[24px] z-0">
                      
                      {/* Inverse Corner - Top */}
                      <div className="absolute top-[-16px] left-0 w-[16px] h-[16px]">
                        <div className="absolute inset-0 bg-white"></div>
                        <div className="absolute inset-0 bg-[#f4f5f5] rounded-bl-[16px]"></div>
                      </div>
                      
                      {/* Inverse Corner - Right */}
                      <div className="absolute bottom-0 right-[-16px] w-[16px] h-[16px]">
                        <div className="absolute inset-0 bg-white"></div>
                        <div className="absolute inset-0 bg-[#f4f5f5] rounded-bl-[16px]"></div>
                      </div>

                      {/* Avatar */}
                      <div className="absolute bottom-4 left-4 w-[48px] h-[48px] rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <Image
                          src={testimonial.imageUrl}
                          alt={testimonial.author}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Functional Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                currentPage === index 
                  ? "bg-zinc-800" 
                  : "bg-transparent border border-zinc-400 hover:border-zinc-800"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
