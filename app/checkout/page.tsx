'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

interface CartData {
  items: CartItem[];
  total: number;
  count: number;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartData>({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/checkout');
      return;
    }

    fetchCart();
  }, [session, status, router]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
        
        // Redirect if cart is empty
        if (data.items.length === 0) {
          router.push('/cart');
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (orderData: any) => {
    setProcessing(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          ...orderData,
        }),
      });

      if (response.ok) {
        const order = await response.json();
        router.push(`/order-confirmation/${order.id}`);
      } else {
        const errorData = await response.json();
        console.error('Order creation failed:', errorData);
        alert(errorData.error || 'Failed to process order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded" />
              </div>
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to proceed with checkout!</p>
            <Link href="/products">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm 
              cart={cart}
              onSubmit={handleOrderSubmit}
              processing={processing}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary cart={cart} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}