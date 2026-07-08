"use client";

import { useState } from "react";
import { faqs } from "@/content/faq";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div
            key={faq.question}
            className={`overflow-hidden rounded-xl border bg-card ${open ? "border-primary" : "border-line"}`}
          >
            <button
              onClick={() => setOpenIndex(open ? -1 : i)}
              aria-expanded={open}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left text-base font-bold text-foreground sm:px-[26px] sm:text-lg"
            >
              <span>{faq.question}</span>
              <span className="shrink-0 text-[22px] text-primary">{open ? "−" : "+"}</span>
            </button>
            {open && (
              <p className="m-0 px-5 pb-5 text-[15px] leading-[1.65] text-soft sm:px-[26px] sm:pb-6 sm:text-base">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
