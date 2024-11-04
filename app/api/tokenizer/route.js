const midtransClient = require('midtrans-client');
import { NextResponse } from "next/server";


let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.NEXT_PUBLIC_SECRET,
    clientKey: process.env.NEXT_PUBLIC_CLIENT,
});

export async function POST(request) {
    try {
        const { id, name, price, quantity } = await request.json();

        const params = {
            item_details: [
                {
                    id: id,
                    name: name,
                    price: price,
                    quantity: quantity,
                },
            ],
            transaction_details: {
                order_id: id,
                gross_amount: price * quantity,
            },
        };

        // Generate the transaction token
        const token = await snap.createTransactionToken(params);
        console.log("Transaction Token:", token);

        return NextResponse.json({ token });
    } catch (error) {
        console.error("Error generating transaction token:", error);
        return NextResponse.json({ error: "Failed to generate transaction token" }, { status: 500 });
    }
}
