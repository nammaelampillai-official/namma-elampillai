'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, TrendingUp, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalRevenue: number;
    activeOrdersCount: number;
    totalProducts: number;
    totalCustomers: number;
    recentOrders: any[];
    isOffline: boolean;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const manufacturerId = localStorage.getItem('manufacturer_id');
                const url = manufacturerId ? `/api/admin/stats?manufacturerId=${manufacturerId}` : '/api/admin/stats';

                const res = await fetch(url);
                const result = await res.json();
                if (result.success) {
                    setStats(result.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 italic">Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-500">Real-time performance metrics</p>
                </div>
                {stats?.isOffline && (
                    <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Running in Offline Mode (Local Storage)
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Total Revenue"
                    value={`₹${stats?.totalRevenue?.toLocaleString('en-IN') || 0}`}
                    trend="From completed orders"
                    icon={TrendingUp}
                    color="bg-emerald-100 text-emerald-700"
                />
                <DashboardCard
                    title="Active Orders"
                    value={stats?.activeOrdersCount || 0}
                    trend="Pending & Shipped"
                    icon={ShoppingCart}
                    color="bg-blue-100 text-blue-700"
                />
                <DashboardCard
                    title="Total Products"
                    value={stats?.totalProducts || 0}
                    trend="In your collection"
                    icon={Package}
                    color="bg-purple-100 text-purple-700"
                />
                <DashboardCard
                    title="Total Customers"
                    value={stats?.totalCustomers || 0}
                    trend="Unique purchasers"
                    icon={Users}
                    color="bg-orange-100 text-orange-700"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                    <div className="space-y-4">
                        {!stats?.recentOrders?.length ? (
                            <p className="text-gray-400 italic py-4 text-center">No recent orders found</p>
                        ) : (
                            stats.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{order.customer}</p>
                                        <p className="text-sm text-gray-500">₹{order.total?.toLocaleString('en-IN')} • {new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Products Stub - Keeping for layout balance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Top Selling Categories</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Kanchipuram Silk', sales: 12, rev: '₹42,000' },
                            { name: 'Soft Silk', sales: 8, rev: '₹24,000' },
                            { name: 'Art Silk', sales: 5, rev: '₹12,500' }
                        ].map((cat, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-12 h-12 bg-heritage-maroon/5 rounded-md flex items-center justify-center text-heritage-maroon font-bold">
                                    {cat.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium">{cat.name}</p>
                                    <p className="text-sm text-gray-500">{cat.sales} sales</p>
                                </div>
                                <div className="ml-auto font-bold">{cat.rev}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardCard({ title, value, trend, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
                <p className="text-xs text-gray-600">{trend}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}
