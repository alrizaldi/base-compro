export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Williams",
    role: "CEO, TechStart",
    content: "This product transformed the way we work. Highly recommended for any growing business.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    rating: 5,
    createdAt: "2025-01-12T08:00:00Z",
    updatedAt: "2025-01-12T08:00:00Z",
  },
  {
    id: "2",
    name: "Michael Brown",
    role: "Developer",
    content: "The developer experience is top-notch. Clean API and great documentation.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    rating: 5,
    createdAt: "2025-01-28T10:00:00Z",
    updatedAt: "2025-01-28T10:00:00Z",
  },
  {
    id: "3",
    name: "Emily Davis",
    role: "Designer, CreativeHub",
    content: "Beautiful design and intuitive interface. Our team adapted it quickly.",
    rating: 4,
    createdAt: "2025-02-14T14:00:00Z",
    updatedAt: "2025-02-14T14:00:00Z",
  },
  {
    id: "4",
    name: "James Wilson",
    role: "CTO, DataFlow",
    content: "Performance improvements were noticeable immediately after switching. Excellent support team too.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    rating: 5,
    createdAt: "2025-03-02T09:00:00Z",
    updatedAt: "2025-03-02T09:00:00Z",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    role: "Product Manager",
    content: "Our productivity increased by 40% after adopting this solution.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    rating: 4,
    createdAt: "2025-03-18T11:00:00Z",
    updatedAt: "2025-03-18T11:00:00Z",
  },
  {
    id: "6",
    name: "David Martinez",
    role: "Freelancer",
    content: "Affordable and reliable. Exactly what I needed for my freelance projects.",
    rating: 5,
    createdAt: "2025-04-01T15:00:00Z",
    updatedAt: "2025-04-01T15:00:00Z",
  },
  {
    id: "7",
    name: "Rachel Thompson",
    role: "Marketing Lead, GrowthCo",
    content: "The analytics dashboard alone is worth the price. We can now track everything in real-time.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    rating: 4,
    createdAt: "2025-04-15T08:30:00Z",
    updatedAt: "2025-04-15T08:30:00Z",
  },
  {
    id: "8",
    name: "Chris Lee",
    role: "Engineering Manager",
    content: "Seamless integration with our existing tools. Setup took less than an hour.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    rating: 5,
    createdAt: "2025-04-28T13:00:00Z",
    updatedAt: "2025-04-28T13:00:00Z",
  },
  {
    id: "9",
    name: "Amanda Clark",
    role: "Small Business Owner",
    content: "As a small business owner, this was the perfect solution. Easy to use and great value.",
    rating: 4,
    createdAt: "2025-05-10T10:00:00Z",
    updatedAt: "2025-05-10T10:00:00Z",
  },
  {
    id: "10",
    name: "Daniel Kim",
    role: "Data Scientist",
    content: "The data export features are fantastic. Clean CSV and JSON outputs every time.",
    rating: 5,
    createdAt: "2025-05-22T16:00:00Z",
    updatedAt: "2025-05-22T16:00:00Z",
  },
  {
    id: "11",
    name: "Olivia White",
    role: "Content Creator",
    content: "I use this daily for managing my content pipeline. Can't imagine working without it now.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    rating: 5,
    createdAt: "2025-06-05T09:00:00Z",
    updatedAt: "2025-06-05T09:00:00Z",
  },
  {
    id: "12",
    name: "Robert Garcia",
    role: "Startup Founder",
    content: "Scaled with us from 10 users to 10,000 without any issues. Rock-solid reliability.",
    rating: 4,
    createdAt: "2025-06-18T14:00:00Z",
    updatedAt: "2025-06-18T14:00:00Z",
  },
];
