
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import { Eye, Package, X, CheckCircle, Truck, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [updating, setUpdating] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const result = await res.json();
            if (result.success) {
                setOrders(result.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            });
            const result = await res.json();
            if (result.success) {
                // Update local state
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 italic">Preparing your order list...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold text-heritage-maroon">Orders</h1>
                <p className="text-gray-500 italic">Track and manage customer orders globally</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-bold">Order ID</TableHead>
                            <TableHead className="font-bold">Customer</TableHead>
                            <TableHead className="font-bold">Date</TableHead>
                            <TableHead className="font-bold">Items</TableHead>
                            <TableHead className="font-bold">Total</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="text-right font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-gray-500 italic">
                                    No orders yet. They will appear here once placed!
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="font-mono text-xs text-gray-400">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-gray-900">{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">{order.items?.length || 0}</TableCell>
                                    <TableCell className="font-bold text-heritage-maroon">
                                        ₹{order.totalAmount?.toLocaleString('en-IN') || 0}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            order.status === 'delivered' ? 'verified' :
                                                order.status === 'shipped' ? 'secondary' :
                                                    order.status === 'confirmed' ? 'outline' :
                                                        order.status === 'pending' ? 'outline' : 'destructive'
                                        }>
                                            <span className="capitalize">{order.status}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedOrder(order)}
                                                className="gap-2 text-heritage-gold hover:text-heritage-gold hover:bg-heritage-gold/5"
                                            >
                                                <Eye className="w-4 h-4" /> View
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-heritage-maroon text-white">
                            <div>
                                <h1 className="text-xl font-bold font-serif">Order Details</h1>
                                <p className="text-xs opacity-80 uppercase tracking-widest mt-1">Order #{selectedOrder._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Status Section */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Current Status: <span className="text-heritage-maroon">{selectedOrder.status}</span>
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                        <Button
                                            key={status}
                                            variant={selectedOrder.status === status ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={updating}
                                            onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                                            className={`capitalize ${selectedOrder.status === status ? 'bg-heritage-maroon' : ''}`}
                                        >
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Customer Info */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <Package className="w-5 h-5 text-heritage-maroon" /> Customer Information
                                    </h2>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500">Name:</span> <strong>{selectedOrder.customerName}</strong></p>
                                        <p><span className="text-gray-500">Email:</span> <strong>{selectedOrder.customerEmail}</strong></p>
                                        <p><span className="text-gray-500">Phone:</span> <strong>{selectedOrder.customerPhone}</strong></p>
                                        <p><span className="text-gray-500">Method:</span> <strong>{selectedOrder.paymentMethod}</strong></p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-heritage-maroon" /> Shipping Address
                                    </h2>
                                    <div className="p-4 bg-gray-50 rounded-lg text-sm italic border border-gray-100">
                                        {selectedOrder.address}
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold">Items Ordered</h2>
                                <div className="border border-gray-100 rounded-xl overflow-hidden text-sm">
                                    <div className="grid grid-cols-4 bg-gray-50 p-3 font-bold text-gray-600">
                                        <div className="col-span-2">Item</div>
                                        <div className="text-center">Qty</div>
                                        <div className="text-right">Price</div>
                                    </div>
                                    {selectedOrder.items.map((item: any, i: number) => (
                                        <div key={i} className="grid grid-cols-4 p-3 border-t border-gray-100 items-center">
                                            <div className="col-span-2">
                                                <div className="font-medium text-gray-900 line-clamp-1">{item.name || 'Saree'}</div>
                                                <div className="text-xs text-gray-400">ID: {item.product}</div>
                                            </div>
                                            <div className="text-center">{item.quantity}</div>
                                            <div className="text-right font-medium">₹{item.priceAtPurchase?.toLocaleString('en-IN') || 0}</div>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-4 p-4 bg-gray-50 border-t border-gray-200">
                                        <div className="col-span-3 text-right font-bold text-gray-600">Total Amount:</div>
                                        <div className="text-right font-bold text-heritage-maroon text-lg">₹{selectedOrder.totalAmount?.toLocaleString('en-IN') || 0}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end">
                            <Button onClick={() => setSelectedOrder(null)} variant="outline" className="px-8">Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
