'use client'

import { useState } from 'react'
import ImageFallback from './ImageFallback'

interface Testimonial {
  quote: string;
  author: string;
  position: string;
  company: string;
  imageSrc: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "After 15 years in federal contracting, I've never seen a tool this effective. GovCon Agent identified a Sources Sought notice that led to a $5.2M contract with a new agency we weren't previously tracking.",
    author: "Michael Rodriguez",
    position: "President",
    company: "Secure Networks, Inc.",
    imageSrc: "/images/michael-rodriguez.jpg"
  },
  {
    quote: "Our BD team spent hours daily searching SAM.gov and drafting responses. GovCon Agent cut that time by 78% and improved our response quality. We've won two contracts directly traced to Sources Sought notices we'd have missed otherwise.",
    author: "Jennifer Wilson",
    position: "Director of BD",
    company: "FedTech Systems",
    imageSrc: "/images/jennifer-wilson.jpg"
  },
  {
    quote: "As a small business, we couldn't afford dedicated BD staff. GovCon Agent levels the playing field, giving us the capabilities of a large prime's BD department at a fraction of the cost.",
    author: "David Chen",
    position: "Owner",
    company: "Chen Engineering Services (SDVOSB)",
    imageSrc: "/images/david-chen.jpg"
  }
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Success Stories from the Federal Contracting Trenches
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-10">
            <div className="flex items-center justify-center mb-6">
              <svg className="h-16 w-16 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            <blockquote className="text-xl text-center text-gray-800 leading-relaxed mb-8">
              {testimonials[activeIndex].quote}
            </blockquote>
            
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 relative rounded-full overflow-hidden mb-4">
                <ImageFallback 
                  src={testimonials[activeIndex].imageSrc} 
                  alt={testimonials[activeIndex].author} 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{testimonials[activeIndex].author}</p>
                <p className="text-gray-600">{testimonials[activeIndex].position}, {testimonials[activeIndex].company}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 w-3 rounded-full transition ${
                  activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 