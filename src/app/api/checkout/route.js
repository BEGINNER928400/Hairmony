import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1R812yC5BtERDQMm1T7PGMzA',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/login?canceled=true`,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error(err)
    return new Response('Erreur de paiement', { status: 500 })
  }
}
