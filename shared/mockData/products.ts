export interface EcommerceLink {
  platform: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  ecommerceLinks: EcommerceLink[];
  createdAt: string;
  updatedAt: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    price: 1299000,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    ],
    ecommerceLinks: [
      { platform: "Tokopedia", url: "https://tokopedia.com/product/1" },
      { platform: "Shopee", url: "https://shopee.co.id/product/1" },
    ],
    createdAt: "2025-01-15T08:00:00Z",
    updatedAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    description:
      "Feature-packed smartwatch with heart rate monitor and GPS tracking.",
    price: 3499000,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    ],
    ecommerceLinks: [
      { platform: "Tokopedia", url: "https://tokopedia.com/product/2" },
      { platform: "Lazada", url: "https://lazada.co.id/product/2" },
    ],
    createdAt: "2025-01-20T10:30:00Z",
    updatedAt: "2025-01-20T10:30:00Z",
  },
  {
    id: "3",
    name: "Mechanical Keyboard",
    description:
      "RGB mechanical keyboard with Cherry MX switches and aluminum frame.",
    price: 1899000,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    ],
    ecommerceLinks: [
      { platform: "Shopee", url: "https://shopee.co.id/product/3" },
    ],
    createdAt: "2025-02-01T14:00:00Z",
    updatedAt: "2025-02-01T14:00:00Z",
  },
  {
    id: "4",
    name: "USB-C Hub Adapter",
    description:
      "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.",
    price: 459000,
    images: [
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400",
    ],
    ecommerceLinks: [],
    createdAt: "2025-02-10T09:15:00Z",
    updatedAt: "2025-02-10T09:15:00Z",
  },
  {
    id: "5",
    name: "Portable SSD 1TB",
    description: "Ultra-fast portable SSD with read speeds up to 1050MB/s.",
    price: 1599000,
    images: [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400",
    ],
    ecommerceLinks: [
      { platform: "Tokopedia", url: "https://tokopedia.com/product/5" },
      { platform: "Shopee", url: "https://shopee.co.id/product/5" },
      { platform: "Lazada", url: "https://lazada.co.id/product/5" },
    ],
    createdAt: "2025-02-15T11:00:00Z",
    updatedAt: "2025-02-15T11:00:00Z",
  },
  {
    id: "6",
    name: "Webcam 4K Ultra HD",
    description:
      "Professional 4K webcam with auto-focus and built-in microphone.",
    price: 2199000,
    images: [
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400",
    ],
    ecommerceLinks: [],
    createdAt: "2025-03-01T16:45:00Z",
    updatedAt: "2025-03-01T16:45:00Z",
  },
  {
    id: "7",
    name: "Ergonomic Mouse",
    description: "Vertical ergonomic mouse designed to reduce wrist strain.",
    price: 699000,
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    ],
    ecommerceLinks: [
      { platform: "Tokopedia", url: "https://tokopedia.com/product/7" },
    ],
    createdAt: "2025-03-05T08:30:00Z",
    updatedAt: "2025-03-05T08:30:00Z",
  },
  {
    id: "8",
    name: "Monitor Light Bar",
    description:
      "Screen-mounted LED light bar with adjustable color temperature.",
    price: 899000,
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    ],
    ecommerceLinks: [],
    createdAt: "2025-03-10T13:00:00Z",
    updatedAt: "2025-03-10T13:00:00Z",
  },
  {
    id: "9",
    name: "Laptop Stand Aluminum",
    description:
      "Adjustable aluminum laptop stand for better ergonomics and airflow.",
    price: 549000,
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    ],
    ecommerceLinks: [
      { platform: "Shopee", url: "https://shopee.co.id/product/9" },
    ],
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2025-03-15T10:00:00Z",
  },
  {
    id: "10",
    name: "Wireless Charger Pad",
    description:
      "15W fast wireless charging pad compatible with all Qi devices.",
    price: 349000,
    images: [
      "https://images.unsplash.com/photo-1618438051762-1cf05e7e3205?w=400",
    ],
    ecommerceLinks: [],
    createdAt: "2025-03-20T15:30:00Z",
    updatedAt: "2025-03-20T15:30:00Z",
  },
  {
    id: "11",
    name: "Noise Machine",
    description:
      "White noise machine with 20 soothing sounds for better sleep.",
    price: 799000,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400"],
    ecommerceLinks: [],
    createdAt: "2025-03-25T09:00:00Z",
    updatedAt: "2025-03-25T09:00:00Z",
  },
  {
    id: "12",
    name: "Desk Organizer Set",
    description:
      "Minimalist desk organizer set with pen holder and cable management.",
    price: 299000,
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=400"],
    ecommerceLinks: [],
    createdAt: "2025-04-01T12:00:00Z",
    updatedAt: "2025-04-01T12:00:00Z",
  },
];
