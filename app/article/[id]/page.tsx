"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/app/PageLayout";
import { fetchArticleById, Article } from "../actions";
import { usePageTitle } from "@/lib/usePageTitle";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  usePageTitle(article?.title || "Article");

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  async function loadArticle() {
    try {
      setLoading(true);
      const data = await fetchArticleById(articleId);
      if (data) {
        setArticle(data);
      } else {
        setError("Article not found.");
      }
    } catch (err) {
      setError("Failed to load article.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="aspect-video bg-gray-200 rounded-xl mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !article) {
    return (
      <PageLayout>
        <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Article Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The article you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/article")}
            className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
          >
            Back to Articles
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-500">
            <button
              onClick={() => router.push("/")}
              className="hover:text-gray-900 transition-colors"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <button
              onClick={() => router.push("/article")}
              className="hover:text-gray-900 transition-colors"
            >
              Articles
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate">
              {article.title}
            </span>
          </nav>
        </div>

        {/* Article */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <time dateTime={article.createdAt}>
                {formatDate(article.createdAt)}
              </time>
              <span>&middot;</span>
              <span>{article.author}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {article.title}
            </h1>
          </header>

          {/* Featured Image */}
          {article.image && (
            <div className="mb-10 rounded-2xl overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg prose-gray max-w-none
              [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4
              [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4
              [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3
              [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-4
              [&>a]:text-blue-600 [&>a]:underline
              [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4
              [&>li]:mb-2
              [&>pre]:bg-gray-900 [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-4
              [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>code]:text-sm
              [&>pre_code]:bg-transparent [&>pre_code]:p-0 [&>pre_code]:text-inherit
              [&>hr]:border-gray-300 [&>hr]:my-8
              [&>img]:rounded-lg [&>img]:my-6 [&>img]:max-w-full [&>img]:h-auto"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Divider */}
          <div className="mt-12 pt-8 border-t border-gray-200" />

          {/* Author Bio */}
          <div className="mt-8 flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{article.author}</p>
              <p className="text-sm text-gray-500">Author</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => router.push("/article")}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Articles
            </button>
          </div>
        </article>
      </div>
    </PageLayout>
  );
}
