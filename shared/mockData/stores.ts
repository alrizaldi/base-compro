export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockStores: Store[] = [
  {
    id: "1",
    name: "Flagship Store Jakarta",
    address: "Jl. Sudirman No. 123, Senayan",
    city: "Jakarta",
    phone: "+62 21 555 0101",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    createdAt: "2024-06-01T08:00:00Z",
    updatedAt: "2024-06-01T08:00:00Z",
  },
  {
    id: "2",
    name: "Bandung Outlet",
    address: "Jl. Braga No. 45, Braga",
    city: "Bandung",
    phone: "+62 22 555 0202",
    image: "https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=400",
    createdAt: "2024-08-15T10:00:00Z",
    updatedAt: "2024-08-15T10:00:00Z",
  },
  {
    id: "3",
    name: "Surabaya Hub",
    address: "Jl. Pemuda No. 78, Genteng",
    city: "Surabaya",
    phone: "+62 31 555 0303",
    image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=400",
    createdAt: "2024-10-20T14:00:00Z",
    updatedAt: "2024-10-20T14:00:00Z",
  },
  {
    id: "4",
    name: "Bali Store",
    address: "Jl. Sunset Road No. 88, Kuta",
    city: "Bali",
    phone: "+62 361 555 0404",
    image: "https://images.unsplash.com/photo-1556740758-90de374c4665?w=400",
    createdAt: "2025-01-05T09:00:00Z",
    updatedAt: "2025-01-05T09:00:00Z",
  },
  {
    id: "5",
    name: "Yogyakarta Branch",
    address: "Jl. Malioboro No. 56, Gedongtengen",
    city: "Yogyakarta",
    phone: "+62 274 555 0505",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    createdAt: "2025-02-10T11:00:00Z",
    updatedAt: "2025-02-10T11:00:00Z",
  },
  {
    id: "6",
    name: "Medan Store",
    address: "Jl. Gatot Subroto No. 34, Medan Kota",
    city: "Medan",
    phone: "+62 61 555 0606",
    image: "https://images.unsplash.com/photo-1528698827591-e19cef3a72bf?w=400",
    createdAt: "2025-03-01T08:00:00Z",
    updatedAt: "2025-03-01T08:00:00Z",
  },
  {
    id: "7",
    name: "Semarang Pop-Up",
    address: "Jl. Pandanaran No. 22, Semarang Tengah",
    city: "Semarang",
    phone: "+62 24 555 0707",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400",
    createdAt: "2025-03-20T15:00:00Z",
    updatedAt: "2025-03-20T15:00:00Z",
  },
  {
    id: "8",
    name: "Makassar Store",
    address: "Jl. Pettarani No. 90, Panakkukang",
    city: "Makassar",
    phone: "+62 411 555 0808",
    createdAt: "2025-04-05T10:00:00Z",
    updatedAt: "2025-04-05T10:00:00Z",
  },
  {
    id: "9",
    name: "Denpasar Store",
    address: "Jl. Teuku Umar No. 15, Denpasar Barat",
    city: "Denpasar",
    phone: "+62 361 555 0909",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    createdAt: "2025-04-25T13:00:00Z",
    updatedAt: "2025-04-25T13:00:00Z",
  },
  {
    id: "10",
    name: "Malang Outlet",
    address: "Jl. Ijen No. 67, Klojen",
    city: "Malang",
    phone: "+62 341 555 1010",
    image: "https://images.unsplash.com/photo-1554199356-695380986996?w=400",
    createdAt: "2025-05-10T09:00:00Z",
    updatedAt: "2025-05-10T09:00:00Z",
  },
];
