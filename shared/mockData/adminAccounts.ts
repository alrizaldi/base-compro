export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "editor";
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export const mockAdminAccounts: AdminAccount[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@yourbrand.com",
    role: "super_admin",
    status: "active",
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z",
  },
  {
    id: "2",
    name: "John Manager",
    email: "john@yourbrand.com",
    role: "admin",
    status: "active",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "3",
    name: "Sarah Editor",
    email: "sarah@yourbrand.com",
    role: "editor",
    status: "active",
    createdAt: "2024-06-20T14:00:00Z",
    updatedAt: "2024-06-20T14:00:00Z",
  },
  {
    id: "4",
    name: "Mike Content",
    email: "mike@yourbrand.com",
    role: "editor",
    status: "suspended",
    createdAt: "2024-09-10T09:00:00Z",
    updatedAt: "2025-01-05T11:00:00Z",
  },
  {
    id: "5",
    name: "Lisa Admin",
    email: "lisa@yourbrand.com",
    role: "admin",
    status: "active",
    createdAt: "2025-01-15T08:30:00Z",
    updatedAt: "2025-01-15T08:30:00Z",
  },
];
