"use client";

export default function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="w-10 h-10 rounded-full border border-zinc-600 hover:border-[var(--color-brand-primary,#b6ef00)] flex items-center justify-center transition-colors group"
    >
      <svg
        className="w-4 h-4 text-zinc-400 group-hover:text-[var(--color-brand-primary,#b6ef00)] transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
