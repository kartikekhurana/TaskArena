import { isLoggedIn } from "@/lib/middlewares/auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: NextRequest) {
  try {
    const { id: userId } = await isLoggedIn();
    const YOUR_DOMAIN = "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pro Access",
              description: "Unlock all the premuim features of TaskArena",
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
      metadata: {
        userId,
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
     if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "You must be logged in to purchase" },
        { status: 401 }
      );
    }
    console.error("Eror while creating stripe session", error.message);
    return NextResponse.json(
      {
        error:
          error.message || "something went wrong while creating stripe session",
      },
      {
        status: 500,
      }
    );
  }
}
