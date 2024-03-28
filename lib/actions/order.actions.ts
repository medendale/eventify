"use server"
import Stripe from 'stripe';
import { CheckoutOrderParams, CreateOrderParams } from "@/types"
import { redirect } from 'next/navigation';
import { connectToDatabase } from '../database';

export const checkoutOrder = async (order: CheckoutOrderParams) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const price = order.isFree ? 0 : Number(order.price) * 100;
    try{
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
                currency: 'usd',
                unit_amount: price,
                product_data: {
                  name: order.eventTitle,
                },
            },
            quantity: 1,
            
          },
        ],
        metadata: {
            eventId: order.eventId,
            buyerId: order.buyerId
            },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
      });
      redirect(session.url!);

    }catch(error){
        throw error;
    }
}

export const createorder = async (order: CreateOrderParams) => {
    // create order
    try{
        await connectToDatabase();

        const newOrder = new Order.creatte({
            ...order,
            event: order.eventId,
            buyer: order.buyerId
        });

        return JSON.parse(JSON.stringify(newOrder));

    }catch(error){
        throw error;
    }
}
