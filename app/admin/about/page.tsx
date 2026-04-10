"use client";

import { useState, useEffect } from "react";
import {
  fetchAboutContent,
  updateAboutContent,
  AboutContent,
} from "@/app/about/actions";

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "general" | "story" | "team" | "values"
  >("general");

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

  async function handleSave() {
    if (!about) return;
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      await updateAboutContent(about);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: string, value: string) {
    if (!about) return;
    setAbout({ ...about, [field]: value });
  }
  function updateStat(index: number, field: "label" | "value", value: string) {
    if (!about) return;
    const s = [...about.stats];
    s[index] = { ...s[index], [field]: value };
    setAbout({ ...about, stats: s });
  }
  function updateTeamMember(index: number, field: string, value: string) {
    if (!about) return;
    const t = [...about.teamMembers];
    t[index] = { ...t[index], [field]: value };
    setAbout({ ...about, teamMembers: t });
  }
  function addTeamMember() {
    if (!about) return;
    setAbout({
      ...about,
      teamMembers: [
        ...about.teamMembers,
        {
          id: String(Date.now()),
          name: "",
          role: "",
          bio: "",
          avatar: "",
          order: about.teamMembers.length + 1,
        },
      ],
    });
  }
  function removeTeamMember(index: number) {
    if (!about) return;
    setAbout({
      ...about,
      teamMembers: about.teamMembers.filter((_, i) => i !== index),
    });
  }
  function updateValue(index: number, field: string, value: string) {
    if (!about) return;
    const v = [...about.companyValues];
    v[index] = { ...v[index], [field]: value };
    setAbout({ ...about, companyValues: v });
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) updateField("logoUrl", data.url);
    } catch (err) {
      setError("Failed to upload logo.");
    }
  }

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading about content...
      </div>
    );
  if (!about)
    return (
      <div className="p-8 text-center text-gray-500">
        {error || "No about content found."}
      </div>
    );

  const tabs = [
    { id: "general" as const, label: "General" },
    { id: "story" as const, label: "Our Story" },
    { id: "team" as const, label: "Team" },
    { id: "values" as const, label: "Values" },
  ];

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const smallInputClass =
    "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage About</h1>
          <p className="mt-1 text-sm text-gray-600">
            Edit the content displayed on the About page.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium text-sm disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">Changes saved successfully!</p>
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          {/* Logo */}
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Brand Logo</h3>
            <div>
              <label className={labelClass}>Upload Logo</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800 file:cursor-pointer`}
              />
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, SVG, or WebP. Max 5MB.
              </p>
              {about.logoUrl && (
                <button
                  type="button"
                  onClick={() => updateField("logoUrl", "")}
                  className="mt-2 text-xs text-red-600 hover:text-red-900"
                >
                  Remove uploaded logo
                </button>
              )}
            </div>
            <div>
              <label className={labelClass}>Logo Text (Fallback)</label>
              <input
                type="text"
                value={about.logoText}
                onChange={(e) => updateField("logoText", e.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-500">
                Displayed when no logo image is set.
              </p>
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {about.logoUrl ? (
                  <img
                    src={about.logoUrl}
                    alt={about.logoText}
                    className="h-8 w-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    {about.logoText}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Hero Title</label>
            <input
              type="text"
              value={about.heroTitle}
              onChange={(e) => updateField("heroTitle", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Hero Subtitle</label>
            <input
              type="text"
              value={about.heroSubtitle}
              onChange={(e) => updateField("heroSubtitle", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {about.stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder="Value"
                    className={smallInputClass}
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder="Label"
                    className={smallInputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Story Tab */}
      {activeTab === "story" && (
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Story Title</label>
            <input
              type="text"
              value={about.storyTitle}
              onChange={(e) => updateField("storyTitle", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Story Content</label>
            <textarea
              value={about.storyContent}
              onChange={(e) => updateField("storyContent", e.target.value)}
              rows={10}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Story Image URL</label>
            <input
              type="text"
              value={about.storyImage}
              onChange={(e) => updateField("storyImage", e.target.value)}
              className={inputClass}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div className="space-y-6">
          {about.teamMembers.map((member, i) => (
            <div
              key={member.id}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  Team Member {i + 1}
                </h3>
                <button
                  onClick={() => removeTeamMember(i)}
                  className="text-sm text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateTeamMember(i, "name", e.target.value)}
                  placeholder="Name"
                  className={smallInputClass}
                />
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) => updateTeamMember(i, "role", e.target.value)}
                  placeholder="Role"
                  className={smallInputClass}
                />
              </div>
              <input
                type="text"
                value={member.bio}
                onChange={(e) => updateTeamMember(i, "bio", e.target.value)}
                placeholder="Bio"
                className={smallInputClass}
              />
              <input
                type="text"
                value={member.avatar}
                onChange={(e) => updateTeamMember(i, "avatar", e.target.value)}
                placeholder="Avatar URL"
                className={smallInputClass}
              />
            </div>
          ))}
          <button
            onClick={addTeamMember}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            + Add Team Member
          </button>
        </div>
      )}

      {/* Values Tab */}
      {activeTab === "values" && (
        <div className="space-y-6">
          {about.companyValues.map((value, i) => (
            <div
              key={value.id}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <h3 className="text-sm font-medium text-gray-900">
                Value {i + 1}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={value.icon}
                  onChange={(e) => updateValue(i, "icon", e.target.value)}
                  placeholder="Icon key"
                  className={smallInputClass}
                />
                <input
                  type="text"
                  value={value.title}
                  onChange={(e) => updateValue(i, "title", e.target.value)}
                  placeholder="Title"
                  className={smallInputClass}
                />
              </div>
              <input
                type="text"
                value={value.description}
                onChange={(e) => updateValue(i, "description", e.target.value)}
                placeholder="Description"
                className={smallInputClass}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
