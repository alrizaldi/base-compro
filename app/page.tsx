import PageLayout from "@/app/PageLayout";
import Link from "next/link";
import type { Metadata } from "next";
import { fetchAboutContent } from "@/app/about/actions";

// Fetch data for previews
import { fetchProducts, FetchProductsParams } from "@/app/product/actions";
import { fetchArticles, FetchArticlesParams } from "@/app/article/actions";
import {
  fetchTestimonials,
  FetchTestimonialsParams,
} from "@/app/testimonial/actions";
import { fetchStores, FetchStoresParams } from "@/app/store/actions";

export async function generateMetadata(): Promise<Metadata> {
  const about = await fetchAboutContent();
  const siteName = about?.logoText || "YourBrand";

  return {
    title: `Home | ${siteName}`,
  };
}

export default async function HomePage() {
  const productsRes = await fetchProducts({
    page: 1,
    limit: 4,
  } as FetchProductsParams);
  const articlesRes = await fetchArticles({
    page: 1,
    limit: 3,
  } as FetchArticlesParams);
  const testimonialsRes = await fetchTestimonials({
    page: 1,
    limit: 3,
  } as FetchTestimonialsParams);
  const storesRes = await fetchStores({
    page: 1,
    limit: 3,
  } as FetchStoresParams);
  const aboutData = await fetchAboutContent();

  const products = productsRes.data;
  const articles = articlesRes.data;
  const testimonials = testimonialsRes.data;
  const stores = storesRes.data;
  const stats = aboutData?.stats || [
    { value: "5+", label: "Years in Business" },
    { value: "10K+", label: "Happy Customers" },
    { value: "50K+", label: "Products Sold" },
    { value: "10", label: "Store Locations" },
  ];

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  }

  function truncate(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trimEnd() + "...";
  }

  function StarRating({ rating }: { rating: number }) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#8AAAE5] to-[#6a8fcf] text-white py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Premium Tech Essentials
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Curated collection of high-quality accessories designed to elevate
              your workspace and daily life.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/product"
                className="px-8 py-4 bg-white text-[#8AAAE5] rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Browse Products
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#8AAAE5] transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-blue-100">
              {stats.map((stat, i) => (
                <div key={i} className="py-10 px-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-[#8AAAE5]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#8AAAE5]">
                Featured Products
              </h2>
              <p className="mt-2 text-gray-600">Our most popular picks.</p>
            </div>
            <Link
              href="/product"
              className="text-sm font-medium text-[#8AAAE5] hover:text-[#6a8fcf] hidden sm:block"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white rounded-xl border border-blue-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-blue-50 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#8AAAE5] line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                  <span className="mt-2 block text-lg font-bold text-[#8AAAE5]">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/product"
              className="text-sm font-medium text-[#8AAAE5] hover:text-[#6a8fcf]"
            >
              View All Products &rarr;
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-blue-50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#8AAAE5]">
                  What Our Customers Say
                </h2>
                <p className="mt-2 text-gray-600">
                  Real reviews from real people.
                </p>
              </div>
              <Link
                href="/testimonial"
                className="text-sm font-medium text-[#8AAAE5] hover:text-[#6a8fcf] hidden sm:block"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl border border-blue-100 p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#8AAAE5] text-white flex items-center justify-center text-sm font-medium">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-[#8AAAE5] text-sm">
                        {t.name}
                      </h3>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                  <StarRating rating={t.rating} />
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {truncate(t.content, 120)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/testimonial"
                className="text-sm font-medium text-[#8AAAE5] hover:text-[#6a8fcf]"
              >
                View All Testimonials &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Latest Articles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#8AAAE5]">
                Latest Articles
              </h2>
              <p className="mt-2 text-gray-600">
                Insights, tutorials, and industry news.
              </p>
            </div>
            <Link
              href="/article"
              className="text-sm font-medium text-[#8AAAE5] hover:text-[#6a8fcf] hidden sm:block"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group flex flex-col bg-white rounded-xl border border-blue-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-blue-50 overflow-hidden">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>&middot;</span>
                    <span>{article.author}</span>
                  </div>
                  <h3 className="font-semibold text-[#8AAAE5] group-hover:text-[#6a8fcf] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {truncate(article.content, 100)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/article"
              className="text-sm font-medium text-[#8AAAE5] hover:text-[#6a8fcf]"
            >
              View All Articles &rarr;
            </Link>
          </div>
        </section>

        {/* Store Locations */}
        <section className="bg-blue-50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#8AAAE5]">
                  Visit Our Stores
                </h2>
                <p className="mt-2 text-gray-600">
                  Find a store near you across Indonesia.
                </p>
              </div>
              <Link
                href="/store"
                className="text-sm font-medium text-[#8AAAE5] hover:text-[#6a8fcf] hidden sm:block"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-xl border border-blue-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] bg-blue-50 overflow-hidden">
                    {store.image ? (
                      <img
                        src={store.image}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-[#8AAAE5]">
                      {store.name}
                    </h3>
                    <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{store.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        <span className="font-medium text-[#8AAAE5]">
                          {store.city}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-blue-100">
                    <iframe
                      src={
                        store.latitude && store.longitude
                          ? `https://maps.google.com/maps?q=${store.latitude},${store.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                          : `https://maps.google.com/maps?q=${encodeURIComponent(store.address + ", " + store.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                      }
                      width="100%"
                      height="150"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${store.name} location`}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/store"
                className="text-sm font-medium text-[#8AAAE5] hover:text-[#6a8fcf]"
              >
                View All Stores &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* CTA / Contact */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="bg-gradient-to-br from-[#8AAAE5] to-[#6a8fcf] rounded-2xl px-6 py-12 sm:px-12 sm:py-16 text-center">
            <h2 className="text-3xl font-bold text-white">Have a Question?</h2>
            <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
              We&apos;re here to help. Reach out to us and our team will get
              back to you within 24 hours.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block px-8 py-4 bg-white text-[#8AAAE5] rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
