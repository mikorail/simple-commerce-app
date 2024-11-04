// components/ProductPage.tsx
"use client"; // This allows the use of hooks and state management

import { useEffect, useState } from "react";
import { fetchProduct } from "@/app/services/ProductServices"; // Adjust the import based on your structure
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid function at the top of your file

export default function ProductPage({ params }: { params: { id: string } }) {
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_CLIENT;
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const productId = params.id; // Now we can safely access params.id
  const [product, setProduct] = useState<any>(null); // State for product data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for errors
  const [paymentUrl,setPaymentUrl] = useState("");
  const [quantity, setQuantity] = useState(1); // State for quantity

  // Effect to fetch product data
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const response = await fetchProduct(productId); // Fetch product by ID
        if (response.status === "success" || response.status === "error") {
          setProduct(response); // Set the product data from the response
        } else {
          setProduct(response);
        }
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false);
      }
    };

    loadProduct(); // Call the function to load product data
  }, [productId]); // Dependency on productId

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  // Buy button handler
  const handleBuy = async () => {
    const token = localStorage.getItem('authToken');

    const purchaseResponse = await fetch("http://localhost:4000/api/purchase/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json', // Set the content type for JSON
        'Authorization': `Bearer ${token}`, // Include the auth token if needed
      },
      body: JSON.stringify({
        id: product.id,
        quantity: quantity,
      }),
    });

    const purchaseData = await purchaseResponse.json();

    // Check if the purchase record was created successfully
    if (!purchaseResponse.ok) {
      alert(`Purchase failed: ${purchaseData.error}`);
      return; // Exit if the purchase record creation failed
    }

    // Use the purchase ID from the purchase record response
    const purchaseId = purchaseData.purchaseRecord.id
    console.log("purchaseId", purchaseData.purchaseRecord.id);

    const data = {
      id: purchaseId,
      name: product.name,
      price: product.price,
      quantity: quantity,
    };
    if (quantity > (product?.stock || 0)) {
      alert("Insufficient stock available.");
      return;
    }

    // Logic to handle the purchase
    // alert(`You bought ${quantity} of ${product.name}!`);
    const response = await fetch("/api/tokenizer", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const requestData = await response.json();
    console.log(requestData);
    window.snap.pay(requestData.token);
  };

  const generatePaymentLink = async () => {
    const secret = process.env.NEXT_PUBLIC_SECRET;
    const encodedSecret = Buffer.from(secret).toString("base64");
    let data = {
      item_details: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
        },
      ],
      transaction_details: {
        order_id: product.id,
        gross_amount: product.price * quantity,
      },
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_MIDTRANS_URL}/v1/payment-links`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedSecret}`,
        },
        body: JSON.stringify(data),
      }
    );
    const paymentLink = await response.json();
    // console.log("paymentLink", paymentLink);
    console.log(paymentUrl)
    setPaymentUrl(paymentLink.payment_url);
  };
  // Loading and error handling
  if (loading) return <div className="text-center">Loading...</div>; // Show loading indicator
  if (error) return <div className="text-red-500 text-center">{error}</div>; // Show error message

  // If product is not found
  if (!product) {
    return <div className="text-center">Product not found</div>; // Handle product not found case
  }

  return (
    <div className="container mx-auto p-4 text-white">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={product.image} // Ensure this key exists in your response
            alt={product.name}
            className="w-full h-[300px] rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-200 mt-2">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-4 text-gray-300 leading-relaxed">
            {product.description}
          </p>
          <div className="mt-6 space-y-3">
            <div className="flex items-center">
              <span className="text-gray-700 font-medium">Category:</span>
              <span className="ml-2 px-3 py-1 bg-slate-600 rounded-full text-sm text-white">
                {product.category}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 font-medium">Contact:</span>
              <a
                href={`mailto:${product.shopEmail}`}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                {product.shopEmail}
              </a>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 font-medium">Stock:</span>
              <span className="ml-2 text-gray-700">{product.stock}</span>
            </div>
          </div>

          {/* Quantity Input and Buy Button */}
          <div className="mt-4">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
              className="mt-1 block w-20 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
            <div className="flex flex-col items-center space-y-4 mt-6">
              <button
                onClick={generatePaymentLink}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 ease-in-out"
              >
                Generate Payment Link
              </button>

              <button
                onClick={handleBuy}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
              >
                Buy Now
              </button>

              <Link href={`${paymentUrl}`}>
                <p className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out">
                  Payment Link
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
