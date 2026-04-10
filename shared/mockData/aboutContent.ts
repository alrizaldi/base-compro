export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  order: number;
}

export interface CompanyValue {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface AboutContent {
  id: string;
  logoUrl: string;
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyContent: string;
  storyImage: string;
  stats: { label: string; value: string }[];
  teamMembers: TeamMember[];
  companyValues: CompanyValue[];
}

export const mockAboutContent: AboutContent = {
  id: "1",
  logoUrl: "",
  logoText: "YourBrand",
  heroTitle: "About YourBrand",
  heroSubtitle:
    "We build premium tech essentials that empower people to do their best work.",
  storyTitle: "Our Story",
  storyContent:
    "Founded in 2020, YourBrand started with a simple mission: create high-quality tech accessories that don't compromise on design or functionality.\n\nWhat began as a small workshop in Jakarta has grown into a trusted brand serving thousands of customers across Indonesia. We believe that the tools you use every day should inspire you — whether you're working from home, at the office, or on the go.\n\nOur team of designers, engineers, and product enthusiasts carefully curate every item in our collection. We test, iterate, and refine until each product meets our exacting standards.\n\nToday, we continue to expand our reach, opening new stores and partnering with local communities to make great tech accessible to everyone.",
  storyImage:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
  stats: [
    { label: "Years in Business", value: "5+" },
    { label: "Happy Customers", value: "10K+" },
    { label: "Products Sold", value: "50K+" },
    { label: "Store Locations", value: "10" },
  ],
  teamMembers: [
    {
      id: "1",
      name: "Andi Pratama",
      role: "Founder & CEO",
      bio: "Visionary leader with 15+ years in tech retail.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200",
      order: 1,
    },
    {
      id: "2",
      name: "Siti Rahayu",
      role: "Head of Design",
      bio: "Award-winning designer passionate about user experience.",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
      order: 2,
    },
    {
      id: "3",
      name: "Budi Santoso",
      role: "Head of Engineering",
      bio: "Tech enthusiast who ensures our platform runs flawlessly.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      order: 3,
    },
    {
      id: "4",
      name: "Dewi Lestari",
      role: "Marketing Director",
      bio: "Creative strategist driving our brand growth.",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200",
      order: 4,
    },
  ],
  companyValues: [
    {
      id: "1",
      icon: "quality",
      title: "Quality First",
      description:
        "Every product goes through rigorous testing before reaching our shelves.",
      order: 1,
    },
    {
      id: "2",
      icon: "innovation",
      title: "Innovation",
      description:
        "We continuously evolve our offerings based on customer feedback and emerging technology.",
      order: 2,
    },
    {
      id: "3",
      icon: "community",
      title: "Community",
      description:
        "We believe in giving back and supporting the communities we serve.",
      order: 3,
    },
    {
      id: "4",
      icon: "accessibility",
      title: "Accessibility",
      description:
        "Great tech should be accessible to everyone, regardless of budget.",
      order: 4,
    },
  ],
};
