import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signatures");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }
  const rawbody = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawbody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("webhook signature verification failed", error.message);
    return NextResponse.json(
      {
        error: error.message || "something went wrong while verifying",
      },
      { status: 400 }
    );
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      try {
        await connectToDB();
        await User.findByIdAndUpdate(userId, { isPro: true });
        console.log(`User ${userId} upgraded to Pro`);
      } catch (error: any) {
        console.error("Error updating user:", error.message);
      }
    }
  }
  return NextResponse.json(
    {
      recieved: true,
    },
    {
      status: 200,
    }
  );
}
