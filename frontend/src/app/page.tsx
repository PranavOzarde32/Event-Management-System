"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, ShoppingBag, Package, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { API_URLS } from "@/lib/config";
import { syncEntity } from "@/lib/storageSync";

// --- Types ---
type User = { id: number; name: string; email: string; role: string; };
type Event = { id: number; name: string; price: number; category: string; stock: number; };
type Booking = { id: number; user_id: number; product_id: number; status: string; total: number; };

export default function Dashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [eventsCount, setEventsCount] = useState(0); // Added for events count
  const [bookingsCount, setBookingsCount] = useState(0); // Added for total bookings count
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
      const [usersData, bookingsData, eventsData] = await Promise.all([
          syncEntity<User>('users_cache', API_URLS.USERS),
          syncEntity<Booking>('bookings_cache', API_URLS.BOOKINGS),
          syncEntity<Event>('events_cache', API_URLS.EVENTS)
        ]);
        
        setUsersCount(usersData.length);
        setEventsCount(eventsData.length);
        setBookingsCount(bookingsData.length);
        
        const totalRev = bookingsData.reduce((sum: number, booking: Booking) => sum + booking.total, 0);
        setTotalRevenue(totalRev);
        
        setRecentBookings(bookingsData.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const stats = [
    { name: 'Total Revenue', value: `Rs ${totalRevenue.toFixed(2)}`, icon: DollarSign, trend: '+12.5%', isUp: true },
    { name: 'Total Users', value: usersCount, icon: Users, trend: '+4.1%', isUp: true },
    { name: 'Total Events', value: eventsCount, icon: Package, trend: '-2.3%', isUp: false },
    { name: 'Total Bookings', value: bookingsCount, icon: ShoppingBag, trend: '+8.4%', isUp: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 font-bold tracking-tight text-slate-900">Welcome back. Here's what's happening with your microservices today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Soft gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.isUp ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
                {stat.trend}
              </span>
              <span className="ml-2 text-slate-400">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Overview */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-6 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-semibold text-slate-900">Recent Bookings</h3>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-white">
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">#{booking.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                      booking.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      booking.status === 'shipped' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 font-medium">${booking.total.toFixed(2)}</td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                    No orders found. Ensure Python microservices are running.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
