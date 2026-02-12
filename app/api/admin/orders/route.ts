import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Mock Data for Admin Orders - simpler for now as we don't have an order mocking function yet,
    // but let's return an empty list or a static list to avoid errors.

    const mockOrders = [
        {
            _id: "order1",
            customerName: "Jane Doe",
            totalAmount: 2499,
            status: "pending",
            items: [
                {
                    product: {
                        name: "Classic Maroon Kanjivaram Style",
                        manufacturerId: {
                            name: "Sri Lakshmi Silks", // Admin sees this!
                            contact: "+91 98765 43210"
                        }
                    },
                    quantity: 1,
                    priceAtPurchase: 2499
                }
            ]
        }
    ];

    return NextResponse.json({ success: true, data: mockOrders });
}
