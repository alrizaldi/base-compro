export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    content:
      "Next.js 15 brings exciting features including partial prerendering, React 19 support, and improved caching. Learn how to leverage these features in your next project.\n\n## Partial Prerendering\n\nPartial prerendering (PPR) is a new rendering model that combines static and dynamic rendering in the same route. With PPR, you can instantly serve a static shell while dynamically streaming in personalized content.\n\n## React 19 Support\n\nReact 19 introduces new features like Server Components, Server Actions, and improved Suspense. Next.js 15 fully embraces these patterns.\n\n## Improved Caching\n\nThe new cache system gives you more granular control over data freshness while maintaining the performance benefits of static generation.",
    author: "John Doe",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
    published: true,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "2",
    title: "Understanding TypeScript Generics",
    content:
      "TypeScript generics allow you to write flexible, reusable functions and types. This guide covers everything from basic to advanced generic patterns.\n\n## What Are Generics?\n\nGenerics provide a way to create reusable code components that work with a variety of types rather than a single one.\n\n## Generic Functions\n\nA generic function is a function that can work with any type while still providing type safety.",
    author: "Jane Smith",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600",
    published: true,
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
  },
  {
    id: "3",
    title: "CSS Container Queries Are Here",
    content:
      "Container queries finally allow components to respond to their parent's size instead of the viewport. Here's how to use them effectively.\n\n## Why Container Queries?\n\nTraditional media queries respond to the viewport size. But components often need to adapt to their container's size, not the viewport.\n\n## How to Use Them\n\nUse `@container` to define conditions based on the container's dimensions.",
    author: "Alex Chen",
    published: false,
    createdAt: "2025-02-05T14:30:00Z",
    updatedAt: "2025-02-05T14:30:00Z",
  },
  {
    id: "4",
    title: "Building Accessible Web Applications",
    content:
      "Accessibility is not optional. Learn the essential ARIA attributes, semantic HTML patterns, and testing strategies for inclusive web apps.\n\n## Semantic HTML\n\nUsing the right HTML element for the job is the foundation of web accessibility.\n\n## ARIA Attributes\n\nWhen semantic HTML isn't enough, ARIA attributes provide additional context to assistive technologies.",
    author: "Sarah Lee",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600",
    published: true,
    createdAt: "2025-02-20T09:00:00Z",
    updatedAt: "2025-02-20T09:00:00Z",
  },
  {
    id: "5",
    title: "React Server Components Explained",
    content:
      "Server components let you render components on the server, reducing client-side JavaScript. Understand when and how to use them.\n\n## What Are Server Components?\n\nServer Components are components that run exclusively on the server. They have zero impact on client bundle size.\n\n## When to Use Them\n\nUse Server Components for data fetching, accessing backend resources, and rendering static content.",
    author: "John Doe",
    published: true,
    createdAt: "2025-03-01T11:00:00Z",
    updatedAt: "2025-03-01T11:00:00Z",
  },
  {
    id: "6",
    title: "Optimizing Web Vitals for Better SEO",
    content:
      "Core Web Vitals directly impact your search rankings. Learn practical techniques to improve LCP, INP, and CLS scores.\n\n## Largest Contentful Paint (LCP)\n\nLCP measures how long it takes for the largest content element to render.\n\n## Interaction to Next Paint (INP)\n\nINP measures the responsiveness of your page to user interactions.",
    author: "Mike Johnson",
    published: false,
    createdAt: "2025-03-15T16:00:00Z",
    updatedAt: "2025-03-15T16:00:00Z",
  },
  {
    id: "7",
    title: "Modern Form Handling in React",
    content:
      "From controlled inputs to server actions, explore the modern approaches to form handling in React applications.\n\n## Controlled Inputs\n\nThe traditional approach using state to manage form values.\n\n## Server Actions\n\nReact Server Actions allow form submissions to be handled directly on the server without API routes.",
    author: "Jane Smith",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600",
    published: true,
    createdAt: "2025-03-28T08:30:00Z",
    updatedAt: "2025-03-28T08:30:00Z",
  },
  {
    id: "8",
    title: "State Management in 2025",
    content:
      "Zustand, Jotai, Redux, Context — which state management solution should you choose? A comprehensive comparison.\n\n## Zustand\n\nA minimal, flexible state management library with a simple API.\n\n## Jotai\n\nAn atomic approach to state management that scales from simple to complex apps.",
    author: "Alex Chen",
    published: true,
    createdAt: "2025-04-05T13:00:00Z",
    updatedAt: "2025-04-05T13:00:00Z",
  },
  {
    id: "9",
    title: "Introduction to Edge Functions",
    content:
      "Edge functions run your code closer to users for faster responses. Learn how to deploy them with popular frameworks.\n\n## What Are Edge Functions?\n\nEdge functions are server-side functions that execute at the edge of the network, near the user.\n\n## Use Cases\n\nPerfect for A/B testing, personalization, authentication, and API proxying.",
    author: "Sarah Lee",
    published: false,
    createdAt: "2025-04-12T10:00:00Z",
    updatedAt: "2025-04-12T10:00:00Z",
  },
  {
    id: "10",
    title: "The Future of Web Authentication",
    content:
      "Passkeys are replacing passwords. Learn how WebAuthn works and how to implement passkey authentication in your app.\n\n## What Are Passkeys?\n\nPasskeys are a passwordless authentication method based on the WebAuthn standard.\n\n## Benefits\n\nBetter security, easier sign-in, and no more password resets.",
    author: "Mike Johnson",
    image: "https://images.unsplash.com/photo-1555992457-b8fefdd09069?w=600",
    published: true,
    createdAt: "2025-04-20T15:00:00Z",
    updatedAt: "2025-04-20T15:00:00Z",
  },
  {
    id: "11",
    title: "Tailwind CSS v4 What's New",
    content:
      "Tailwind CSS v4 introduces a new engine, improved performance, and exciting new utilities. Here's what changed.\n\n## New Engine\n\nBuilt on Oxide, the new Rust-powered engine is significantly faster.\n\n## Zero-Config Setup\n\nNo more tailwind.config.js — v4 auto-detects your content paths.",
    author: "John Doe",
    published: true,
    createdAt: "2025-05-01T09:00:00Z",
    updatedAt: "2025-05-01T09:00:00Z",
  },
  {
    id: "12",
    title: "Building a Design System from Scratch",
    content:
      "A step-by-step guide to creating a consistent, scalable design system for your organization.\n\n## Foundation\n\nStart with your color palette, typography, and spacing scale.\n\n## Components\n\nBuild a component library with consistent APIs and styles.",
    author: "Jane Smith",
    published: false,
    createdAt: "2025-05-10T14:00:00Z",
    updatedAt: "2025-05-10T14:00:00Z",
  },
  {
    id: "13",
    title: "Performance Budgets That Actually Work",
    content:
      "Setting and enforcing performance budgets keeps your site fast. Learn practical strategies your team can adopt today.\n\n## What Is a Performance Budget?\n\nA set of constraints you place on metrics that affect page performance.\n\n## Implementation\n\nUse Lighthouse CI, webpack bundles, and monitoring tools to enforce budgets.",
    author: "Alex Chen",
    published: true,
    createdAt: "2025-05-18T11:30:00Z",
    updatedAt: "2025-05-18T11:30:00Z",
  },
  {
    id: "14",
    title: "GraphQL vs REST in 2025",
    content:
      "The debate continues. We compare GraphQL and REST across performance, developer experience, and ecosystem maturity.\n\n## REST\n\nStill the most widely used API architecture. Simple, cacheable, and well understood.\n\n## GraphQL\n\nFlexible querying, fewer endpoints, but more complexity in caching and tooling.",
    author: "Sarah Lee",
    published: true,
    createdAt: "2025-06-01T08:00:00Z",
    updatedAt: "2025-06-01T08:00:00Z",
  },
  {
    id: "15",
    title: "Micro Frontends: A Practical Guide",
    content:
      "Break your monolith frontend into independently deployable modules. Lessons learned from real-world micro frontend implementations.\n\n## When to Consider Micro Frontends\n\nLarge teams, multiple products, and independent deployment needs.\n\n## Architecture Patterns\n\nModule Federation, iframes, and build-time composition.",
    author: "Mike Johnson",
    published: false,
    createdAt: "2025-06-15T16:30:00Z",
    updatedAt: "2025-06-15T16:30:00Z",
  },
];
