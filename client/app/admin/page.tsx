"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  ShieldAlert,
  UserRound,
  DollarSign,
  Package,
  Users,
  FileDown,
  CheckCircle2,
  XCircle,
  Activity,
  MessageSquare,
  Bell,
  BarChart3,
} from "lucide-react";

const stats = [
  {
    label: "Total Listings",
    value: "2,450",
    change: "+20.1% from last month",
    icon: Package,
    accent: "text-green-600",
  },
  {
    label: "Active Orders",
    value: "876",
    change: "+18.5% from last month",
    icon: Activity,
    accent: "text-emerald-600",
  },
  {
    label: "Escrowed Funds",
    value: "ETB 1.2M",
    change: "+4.3% from last month",
    icon: DollarSign,
    accent: "text-emerald-600",
  },
  {
    label: "Registered Users",
    value: "15.3K",
    change: "+5.1% from last month",
    icon: Users,
    accent: "text-green-600",
  },
];

const activityItems = [
  {
    title: "New listing 'Teff Grains' by Farmer Abebe",
    time: "2 hours ago",
  },
  {
    title: "Order #AGR-2023-0056 placed for Coffee Beans",
    time: "4 hours ago",
  },
  {
    title: "New user registered: Kebede Traders",
    time: "6 hours ago",
  },
  {
    title: "Listing 'Potatoes' updated by Farmer Almaz",
    time: "1 day ago",
  },
  {
    title: "Escrow funds released for order #AGR-2023-0050",
    time: "1 day ago",
  },
];

const moderationQueue = [
  {
    id: "MOD-001",
    type: "Listing",
    subject: "New: 'Avocado'",
    reporter: "System",
    date: "2023-11-20",
  },
  {
    id: "MOD-002",
    type: "User Report",
    subject: "User: 'Buyer_23'",
    reporter: "Farmer Sara",
    date: "2023-11-19",
  },
  {
    id: "MOD-003",
    type: "Listing",
    subject: "Update: 'Wheat'",
    reporter: "System",
    date: "2023-11-18",
  },
  {
    id: "MOD-004",
    type: "Comment",
    subject: "Listing: 'Tomatoes'",
    reporter: "User Admin",
    date: "2023-11-17",
  },
  {
    id: "MOD-005",
    type: "Listing",
    subject: "New: 'Onions'",
    reporter: "System",
    date: "2023-11-16",
  },
];

const users = [
  {
    id: "USR-001",
    name: "Abebe Kebede",
    email: "abebe@example.com",
    status: "Active",
    lastLogin: "2023-11-20 14:30",
  },
  {
    id: "USR-002",
    name: "Sara Alem",
    email: "sara@example.com",
    status: "Active",
    lastLogin: "2023-11-19 09:15",
  },
  {
    id: "USR-003",
    name: "John Doe Traders",
    email: "john@traders.com",
    status: "Suspended",
    lastLogin: "2023-11-18 11:00",
  },
  {
    id: "USR-004",
    name: "Almaz Tech",
    email: "almaz@tech.net",
    status: "Active",
    lastLogin: "2023-11-20 10:00",
  },
  {
    id: "USR-005",
    name: "Tilahun Farm",
    email: "tilahun@farm.org",
    status: "Pending",
    lastLogin: "2023-11-15 16:45",
  },
];

export default function AdminDashboardPage() {
  const [moderationSearch, setModerationSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const filteredModeration = useMemo(() => {
    if (!moderationSearch) return moderationQueue;
    const query = moderationSearch.toLowerCase();
    return moderationQueue.filter((item) =>
      [item.id, item.type, item.subject, item.reporter].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [moderationSearch]);

  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const query = userSearch.toLowerCase();
    return users.filter((user) =>
      [user.id, user.name, user.email, user.status].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [userSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard Overview
            </h1>
            <p className="text-sm text-gray-500">
              Monitor listings, users, and platform activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700">
              <FileDown className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <stat.icon className={`h-4 w-4 ${stat.accent}`} />
              </div>
              <div className="mt-3 text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="mt-2 text-xs text-gray-500">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Platform Activity
                </h2>
                <button className="text-xs font-medium text-green-600 hover:underline">
                  View All
                </button>
              </div>
              <ul className="space-y-4">
                {activityItems.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-50 p-2 text-green-600">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400">{item.time}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-300" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                System Health
              </h2>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Sync Backlog</span>
                    <span className="text-red-500">75 items</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 w-3/4 rounded-full bg-green-500" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Offline Queue</span>
                    <span className="text-gray-700">12 pending</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 w-1/3 rounded-full bg-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Moderation Queue
              </h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600">
                  <FileDown className="h-3 w-3" />
                  Export
                </button>
              </div>
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={moderationSearch}
                  onChange={(event) => setModerationSearch(event.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 focus:border-green-500 focus:outline-none"
                />
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600">
                <SlidersHorizontal className="h-3 w-3" />
                Filter Type
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600">
                <ShieldAlert className="h-3 w-3" />
                Filter Status
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Reporter</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredModeration.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-gray-600">{item.id}</td>
                      <td className="px-4 py-3 text-gray-600">{item.type}</td>
                      <td className="px-4 py-3 text-gray-800">
                        {item.subject}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.reporter}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-gray-300">
                            Review
                          </button>
                          <button className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600">
                <FileDown className="h-3 w-3" />
                Export
              </button>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search users..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 focus:border-green-500 focus:outline-none"
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600">
              <UserRound className="h-3 w-3" />
              Filter Role
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600">
              <ShieldAlert className="h-3 w-3" />
              Filter Status
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Login</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 text-gray-600">{user.id}</td>
                    <td className="px-4 py-3 text-gray-800">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : user.status === "Suspended"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {user.lastLogin}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-gray-300">
                          View Profile
                        </button>
                        <button className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600">
                          Ban
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Telebirr Webhooks
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage real-time notifications for Telebirr payments and
                  transaction statuses.
                </p>
              </div>
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Status: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <span>Last Event: 2023-11-20 15:00 (Payment received)</span>
              </div>
            </div>
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
              <ArrowUpRight className="h-4 w-4" />
              View Logs
            </button>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">SMS Provider</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure and monitor the SMS gateway for OTPs and
                  transaction alerts.
                </p>
              </div>
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Status: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <span>Last Event: 2023-11-20 14:55 (OTP sent)</span>
              </div>
            </div>
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
              <ArrowUpRight className="h-4 w-4" />
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
