"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Heart, Sparkles, Coffee, Gift, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const OPEN_POSITIONS: JobPosition[] = [
  {
    id: "pastry-artisan",
    title: "Master Pastry Chef & Cake Artisan",
    department: "Bakery Operations",
    location: "Colombo Kitchen Studio",
    type: "Full-Time",
    description: "Lead daily production of handcrafted cake bites, signature frostings, and limited-edition dessert flavors with meticulous attention to detail."
  },
  {
    id: "unboxing-engineer",
    title: "Surprise Box Assembly & Experience Specialist",
    department: "Packaging & Design",
    location: "Fulfillment Center",
    type: "Full-Time",
    description: "Craft our iconic explosion boxes, butterfly releases, and personalized photo cubes, ensuring every recipient experiences unboxing magic."
  },
  {
    id: "customer-delight",
    title: "Customer Delight & Support Coordinator",
    department: "Customer Care",
    location: "Hybrid / Colombo",
    type: "Full-Time",
    description: "Help customers customize surprise orders, solve delivery questions, and ensure every sweet milestone is celebrated seamlessly."
  },
  {
    id: "dispatch-courier",
    title: "Temperature-Controlled Delivery Courier",
    department: "Logistics",
    location: "Greater Colombo",
    type: "Part-Time / Full-Time",
    description: "Execute white-glove, surprise doorstep deliveries keeping treats fresh and celebratory surprises completely intact."
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [resumeNote, setResumeNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 font-sans text-[#050505]">
      <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white border border-zinc-200 p-8 sm:p-14 mb-10 shadow-xs">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E91E63] mb-3 bg-[#FFF5F8] px-3 py-1 border border-[#F8DCE3]">
            <Briefcase size={14} /> Join Our Team
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#050505] mb-4">
            Careers at Halo Bites
          </h1>
          <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-3xl">
            We are culinary dreamers, packaging engineers, and celebration enthusiasts on a mission to turn everyday moments into unforgettable memories. Come build the sweetest experiences with us.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white border border-zinc-200 p-6">
            <Coffee size={24} className="text-[#E91E63] mb-3" />
            <h3 className="font-bold text-sm uppercase mb-1">Daily Treats</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Unlimited sampling of fresh bakery creations and test kitchen recipes.</p>
          </div>
          <div className="bg-white border border-zinc-200 p-6">
            <Heart size={24} className="text-[#E91E63] mb-3" />
            <h3 className="font-bold text-sm uppercase mb-1">Health & Wellness</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Comprehensive medical, dental, and paid wellness recovery days.</p>
          </div>
          <div className="bg-white border border-zinc-200 p-6">
            <Sparkles size={24} className="text-[#E91E63] mb-3" />
            <h3 className="font-bold text-sm uppercase mb-1">Creative Freedom</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Pitch, design, and experiment with new flavors and unboxing mechanics.</p>
          </div>
          <div className="bg-white border border-zinc-200 p-6">
            <Gift size={24} className="text-[#E91E63] mb-3" />
            <h3 className="font-bold text-sm uppercase mb-1">Celebration Credits</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Free monthly Halo Bites gift boxes to send to friends and family.</p>
          </div>
        </div>

        {/* Positions Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tight">Open Opportunities</h2>
            <span className="text-xs font-bold bg-[#FFF5F8] text-[#E91E63] px-3 py-1 border border-[#F8DCE3]">
              {OPEN_POSITIONS.length} Active Openings
            </span>
          </div>

          <div className="space-y-4">
            {OPEN_POSITIONS.map((job) => (
              <div 
                key={job.id}
                className="bg-white border border-zinc-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-black transition-colors shadow-xs"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2.5 py-0.5">
                      {job.department}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2.5 py-0.5">
                      {job.type}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      • {job.location}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{job.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{job.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedJob(job);
                    setSubmitted(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-[#E91E63] hover:bg-[#d81b5c] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap self-start md:self-center"
                >
                  <span>Apply Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Modal / Form */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button 
                type="button" 
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-black font-bold text-sm"
              >
                ✕ Close
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E91E63]">Applying For</span>
                <h3 className="text-xl font-black uppercase text-zinc-900">{selectedJob.title}</h3>
                <p className="text-xs text-zinc-500">{selectedJob.location} • {selectedJob.type}</p>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle size={40} className="text-emerald-500 mx-auto mb-4" />
                  <h4 className="text-lg font-bold mb-2">Application Received!</h4>
                  <p className="text-xs text-zinc-600 mb-6">
                    Thank you {applicantName}! Our talent team will review your details and reach out within 48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-[#FAFAFA] border border-zinc-200 py-2.5 px-3.5 text-sm focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#FAFAFA] border border-zinc-200 py-2.5 px-3.5 text-sm focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full bg-[#FAFAFA] border border-zinc-200 py-2.5 px-3.5 text-sm focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Tell us about your experience</label>
                    <textarea
                      rows={3}
                      value={resumeNote}
                      onChange={(e) => setResumeNote(e.target.value)}
                      placeholder="Link to your portfolio/LinkedIn, or briefly describe your culinary or packaging background..."
                      className="w-full bg-[#FAFAFA] border border-zinc-200 py-2.5 px-3.5 text-sm focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#E91E63] hover:bg-[#d81b5c] text-white py-3.5 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
