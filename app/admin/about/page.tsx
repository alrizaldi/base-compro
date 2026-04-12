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

  // Upload states
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [storyPreview, setStoryPreview] = useState<string>("");
  const [uploadingTeamMember, setUploadingTeamMember] = useState<number | null>(
    null,
  );
  const [avatarPreviews, setAvatarPreviews] = useState<Record<number, string>>(
    {},
  );

  useEffect(() => {
    loadAbout();
  }, []);

  async function loadAbout() {
    try {
      setLoading(true);
      const data = await fetchAboutContent();
      if (data) {
        setAbout(data);
        setStoryPreview(data.storyImage || "");
        const previews: Record<number, string> = {};
        data.teamMembers.forEach((member, index) => {
          if (member.avatar) previews[index] = member.avatar;
        });
        setAvatarPreviews(previews);
      } else setError("Failed to load about content.");
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

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPG, SVG, and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    try {
      setUploadingLogo(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload logo");
      }

      if (data.url) updateField("logoUrl", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleStoryImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPG, SVG, and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setStoryPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUploadingStory(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      if (data.url) updateField("storyImage", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingStory(false);
    }
  }

  async function handleTeamAvatarUpload(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPG, SVG, and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreviews((prev) => ({
        ...prev,
        [index]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);

    try {
      setUploadingTeamMember(index);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload avatar");
      }

      if (data.url) updateTeamMember(index, "avatar", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar");
    } finally {
      setUploadingTeamMember(null);
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
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Story Image</h3>
            <div className="space-y-3">
              {storyPreview && (
                <div className="relative w-full max-w-md">
                  <img
                    src={storyPreview}
                    alt="Story preview"
                    className="w-full h-48 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setStoryPreview("");
                      updateField("storyImage", "");
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors text-center">
                    {uploadingStory ? "Uploading..." : "Upload Image"}
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                    onChange={handleStoryImageUpload}
                    disabled={uploadingStory}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-gray-500">or</span>
              </div>
              <input
                type="text"
                value={about.storyImage}
                onChange={(e) => {
                  updateField("storyImage", e.target.value);
                  if (e.target.value) {
                    setStoryPreview(e.target.value);
                  } else {
                    setStoryPreview("");
                  }
                }}
                className={inputClass}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500">
                Upload an image or paste a URL. Max size: 5MB (PNG, JPG, SVG,
                WebP)
              </p>
            </div>
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
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600">
                  Avatar
                </label>
                <div className="flex items-center gap-3">
                  {avatarPreviews[i] && (
                    <img
                      src={avatarPreviews[i]}
                      alt={`${member.name || "Member"} avatar`}
                      className="w-16 h-16 rounded-full object-cover border border-gray-300"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-block">
                      <div className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors text-center">
                        {uploadingTeamMember === i
                          ? "Uploading..."
                          : "Upload Avatar"}
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                        onChange={(e) => handleTeamAvatarUpload(i, e)}
                        disabled={uploadingTeamMember === i}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={member.avatar}
                      onChange={(e) => {
                        updateTeamMember(i, "avatar", e.target.value);
                        if (e.target.value) {
                          setAvatarPreviews((prev) => ({
                            ...prev,
                            [i]: e.target.value,
                          }));
                        } else {
                          setAvatarPreviews((prev) => {
                            const updated = { ...prev };
                            delete updated[i];
                            return updated;
                          });
                        }
                      }}
                      placeholder="https://example.com/avatar.jpg"
                      className={smallInputClass}
                    />
                  </div>
                </div>
              </div>
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
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Icon
                  </label>
                  <div className="relative">
                    <select
                      value={value.icon}
                      onChange={(e) => updateValue(i, "icon", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm appearance-none bg-white pr-10"
                    >
                      <option value="quality">Quality</option>
                      <option value="innovation">Innovation</option>
                      <option value="community">Community</option>
                      <option value="accessibility">Accessibility</option>
                      <option value="integrity">Integrity</option>
                      <option value="sustainability">Sustainability</option>
                      <option value="teamwork">Teamwork</option>
                      <option value="excellence">Excellence</option>
                      <option value="customer">Customer Focus</option>
                      <option value="growth">Growth</option>
                      <option value="trust">Trust</option>
                      <option value="transparency">Transparency</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Icon Preview */}
                  <div className="mt-2 flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <div className="w-8 h-8 rounded-md bg-gray-900 text-white flex items-center justify-center">
                      {value.icon === "quality" && (
                        <svg
                          className="w-5 h-5"
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
                      )}
                      {value.icon === "innovation" && (
                        <svg
                          className="w-5 h-5"
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
                      )}
                      {value.icon === "community" && (
                        <svg
                          className="w-5 h-5"
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
                      )}
                      {value.icon === "accessibility" && (
                        <svg
                          className="w-5 h-5"
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
                      )}
                      {value.icon === "integrity" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      )}
                      {value.icon === "sustainability" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      )}
                      {value.icon === "teamwork" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                          />
                        </svg>
                      )}
                      {value.icon === "excellence" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      )}
                      {value.icon === "customer" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                      {value.icon === "growth" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      )}
                      {value.icon === "trust" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      )}
                      {value.icon === "transparency" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 capitalize">
                      {value.icon || "No icon selected"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={value.title}
                    onChange={(e) => updateValue(i, "title", e.target.value)}
                    placeholder="Title"
                    className={smallInputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={value.description}
                  onChange={(e) =>
                    updateValue(i, "description", e.target.value)
                  }
                  placeholder="Description"
                  className={smallInputClass}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
