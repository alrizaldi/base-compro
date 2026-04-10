"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/app/PageLayout";
import { fetchAboutContent, AboutContent } from "./actions";

const iconMap: Record<string, React.ReactNode> = {
  quality: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
  ),
  innovation: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  community: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  accessibility: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
      />
    </svg>
  ),
};

export default function AboutPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAbout();
  }, []);

  async function loadAbout() {
    try {
      setLoading(true);
      const data = await fetchAboutContent();
      if (data) setAbout(data);
      else setError("Failed to load about content.");
    } catch (err) {
      setError("Failed to load about content.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 animate-pulse">
          <div className="bg-gray-200 py-24 sm:py-32" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
              <div className="bg-gray-200 rounded-2xl aspect-[4/3]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !about) {
    return (
      <PageLayout>
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Failed to Load</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {about.heroTitle}
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              {about.heroSubtitle}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
              {about.stats.map((stat, i) => (
                <div key={i} className="py-10 px-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {about.storyTitle}
              </h2>
              {about.storyContent.split("\n").map((paragraph, i) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                return (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4">
                    {trimmed}
                  </p>
                );
              })}
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
              <img
                src={about.storyImage}
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="bg-gray-50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
              <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {about.companyValues.map((value) => (
                <div
                  key={value.id}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 rounded-lg bg-gray-900 text-white flex items-center justify-center mb-4">
                    {iconMap[value.icon] || iconMap.quality}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              The people behind {about.logoText} who make it all possible.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {about.teamMembers.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-gray-100 group-hover:border-gray-900 transition-colors">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{member.role}</p>
                <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
