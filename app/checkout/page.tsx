
'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { sendOrderNotification } from '@/app/actions/email';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [paymentQR, setPaymentQR] = useState('/gpay-qr.png');
    const [settings, setSettings] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content');
                const result = await res.json();
                if (result.success && result.data) {
                    if (result.data.paymentQR) setPaymentQR(result.data.paymentQR);
                    // Merge database settings with defaults to ensure all fields exist
                    setSettings({
                        isCodEnabled: true,
                        freeShippingThreshold: 2000,
                        shippingCharge: 100,
                        estimatedDeliveryDays: '5-7 Days',
                        ...(result.data.checkoutSettings || {})
                    });
                } else {
                    // Fallback to defaults if no data at all
                    setSettings({
                        isCodEnabled: true,
                        freeShippingThreshold: 2000,
                        shippingCharge: 100,
                        estimatedDeliveryDays: '5-7 Days'
                    });
                }
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };
        fetchContent();
    }, []);

    const shippingCharge = settings?.freeShippingThreshold > 0 && total >= settings.freeShippingThreshold ? 0 : (settings?.shippingCharge || 0);
    const finalTotal = total + shippingCharge;

    const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPlacingOrder(true);

        const formData = new FormData(e.currentTarget);
        const address = `${formData.get('address')}, ${formData.get('city')}, ${formData.get('state')} - ${formData.get('pincode')}`;

        const orderDetails = {
            orderId: Date.now().toString().slice(-6),
            customerName: `${formData.get('firstName')} ${formData.get('lastName')}`,
            customerEmail: formData.get('email') as string,
            customerPhone: formData.get('phone') as string,
            items: items.map(item => ({
                id: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: finalTotal,
            paymentMethod: paymentMethod === 'online' ? 'Online Payment (GPay)' : 'Cash on Delivery',
            shippingAddress: address
        };

        // Send email notification (Wait for it to ensure delivery)
        await sendOrderNotification(orderDetails).catch(console.error);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderDetails)
            });

            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const result = await res.json();
                if (result.success) {
                    setIsOrderPlaced(true);
                    clearCart();
                } else {
                    throw new Error(result.error || 'Failed to place order');
                }
            } else {
                const text = await res.text();
                console.error('Server returned non-JSON response:', text);
                throw new Error(`Server Error: Received HTML instead of JSON. (Status: ${res.status})`);
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(error.message || 'Something went wrong while placing your order. Please try again.');
        } finally {
            setPlacingOrder(false);
        }
    };

    if (isOrderPlaced) {
        return (
            <div className="container mx-auto px-4 py-20 text-center max-w-lg">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for supporting the weavers of Elampillai. Your order has been received and will be processed shortly.
                </p>
                <div className="space-y-3">
                    <Link href="/">
                        <Button className="w-full">Return Home</Button>
                    </Link>
                    <Link href="/products">
                        <Button variant="outline" className="w-full">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Link href="/products">
                    <Button>Browse Collection</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-serif font-bold text-heritage-maroon mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Details */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-heritage-maroon text-white flex items-center justify-center text-sm">1</span>
                            Shipping Details
                        </h2>
                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" required placeholder="Ragavan" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" required placeholder="Ravi" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number (Required for Delivery)</Label>
                                <Input id="phone" name="phone" type="tel" required placeholder="9876543210" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" name="address" required placeholder="123 Weaver Street" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" name="city" required placeholder="Salem" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" name="state" required placeholder="Tamil Nadu" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input id="pincode" name="pincode" required placeholder="637502" />
                                </div>
                            </div>
                        </form>
                    </section>
                </div>

                {/* Payment Method */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-heritage-maroon text-white flex items-center justify-center text-sm">2</span>
                            Payment Method
                        </h2>

                        <div className="space-y-3">
                            <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-heritage-maroon bg-heritage-maroon/5' : 'border-gray-200 bg-gray-50/50'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="online"
                                    checked={paymentMethod === 'online'}
                                    onChange={() => setPaymentMethod('online')}
                                    className="w-5 h-5 text-heritage-maroon focus:ring-heritage-maroon"
                                />
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900">Online Payment</div>
                                    <div className="text-sm text-gray-500">UPI, Credit/Debit Card, Netbanking</div>
                                </div>
                            </label>

                            {settings?.isCodEnabled && (
                                <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-heritage-maroon bg-heritage-maroon/5' : 'border-gray-200 bg-gray-50/50'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="w-5 h-5 text-heritage-maroon focus:ring-heritage-maroon"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-900">Cash on Delivery</div>
                                        <div className="text-sm text-gray-500">Pay when you receive the order</div>
                                    </div>
                                </label>
                            )}
                        </div>

                        {/* GPay QR Code Section (Only shown if online payment selected) */}
                        {paymentMethod === 'online' && (
                            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">Pay with GPay</h3>
                                    <p className="text-sm text-gray-600 mb-2">Scan the QR code below to complete your payment</p>
                                    <p className="text-lg font-bold text-heritage-maroon mb-4 bg-white/50 py-1 rounded inline-block px-4">Total: ₹{finalTotal.toLocaleString('en-IN')}</p>
                                    <div className="bg-white p-4 rounded-lg inline-block shadow-md">
                                        <Image
                                            src={paymentQR}
                                            alt="GPay QR Code"
                                            width={200}
                                            height={200}
                                            className="mx-auto"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">After payment, click "Place Order" below</p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-4 max-h-80 overflow-y-auto mb-4 pr-2">
                            {items.map((item) => (
                                <div key={item._id} className="flex gap-3 text-sm">
                                    <div className="relative w-16 h-20 bg-gray-100 rounded">
                                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover rounded" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium line-clamp-2">{item.name}</p>
                                        <p className="text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{total.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                {shippingCharge === 0 ? (
                                    <span className="text-green-600 font-medium">Free</span>
                                ) : (
                                    <span>₹{shippingCharge}</span>
                                )}
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2 mt-2">
                                <span>Total</span>
                                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <Button type="submit" form="checkout-form" className="w-full mt-6 py-6 text-lg">
                            Place Order
                        </Button>
                        <p className="text-xs text-center text-gray-500 mt-4">
                            By placing this order, you agree to our Terms of Service.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
