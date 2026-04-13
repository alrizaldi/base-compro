"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminComposePage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    sent: number;
    failed: number;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setError("Subject and body are required");
      return;
    }

    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/subscribers/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send email");
        setSending(false);
        return;
      }

      setSuccess({
        sent: data.results.sent,
        failed: data.results.failed,
      });
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (success) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Compose Newsletter
          </h1>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Email Sent!
            </h2>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-green-600">
                  {success.sent} succeeded
                </span>
                {success.failed > 0 && (
                  <>
                    ,{" "}
                    <span className="font-medium text-red-600">
                      {success.failed} failed
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/admin/subscribers"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back to Subscribers
              </Link>
              <button
                onClick={() => {
                  setSuccess(null);
                  setSubject("");
                  setBody("");
                }}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Compose Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/subscribers"
          className="text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Compose Newsletter
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Send an announcement email to all active subscribers.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-5">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Enter email subject..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none"
              placeholder="Write your email content here..."
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {showPreview ? "Hide Preview" : "Preview Email"}
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !body.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              {sending ? "Sending..." : "Send to All Subscribers"}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Email Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 mb-4">
              <p className="text-xs text-gray-500 mb-1">
                <span className="font-medium">From:</span>{" "}
                {process.env.NEXT_PUBLIC_APP_URL || "yourbrand.com"}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                <span className="font-medium">Subject:</span> {subject || "(no subject)"}
              </p>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700">Hi Subscriber,</p>
              <div className="text-gray-700 whitespace-pre-wrap">
                {body || "(no content)"}
              </div>
              <p className="text-gray-700 mt-4">Best regards,</p>
              <p className="text-gray-700">The Team</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                You received this email because you subscribed to our
                newsletter. |{" "}
                <span className="text-gray-500 underline">Unsubscribe</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
