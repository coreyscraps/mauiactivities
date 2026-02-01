import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/home.module.css';

const SOLUTION_CARDS = [
  {
    icon: '\u{1F4CA}',
    title: 'Unbiased Comparisons',
    desc: "We don\u2019t earn commissions, so we have zero incentive to push one activity over another. Compare based on actual quality and fit.",
  },
  {
    icon: '\u{1F4B0}',
    title: 'Real Vendor Prices',
    desc: 'Prices pulled directly from vendor websites. What you see is what you\u2019ll pay when you book direct\u2014no markup, no surprises.',
  },
  {
    icon: '\u{1F517}',
    title: 'Book Directly',
    desc: 'Click through to vendor websites and book straight with them. They save on commissions, and you get authentic service.',
  },
  {
    icon: '\u{1F334}',
    title: 'See Everything',
    desc: 'All activities in one place\u2014from major operators to hidden local gems. No more endless tab-hopping to compare options.',
  },
];

const FEATURES = [
  { icon: '\u{1F50D}', title: 'Price Comparison', desc: 'See prices from every vendor side-by-side. Find the best deal without the markup.' },
  { icon: '\u26A1', title: 'Real-Time Availability', desc: 'See which activities have openings today or tomorrow. \u201CBook Now\u201D badges for immediate plans.' },
  { icon: '\u2B50', title: 'Unbiased Reviews', desc: 'Honest ratings from real travelers. No commission means no bias in our recommendations.' },
  { icon: '\u{1F514}', title: 'Price Alerts', desc: 'Get notified when activities on your wishlist drop in price. Never miss a deal.' },
  { icon: '\u{1F48E}', title: 'Hidden Gems', desc: 'Discover amazing local spots that don\u2019t show up on commission sites. Support small businesses.' },
  { icon: '\u{1F324}\uFE0F', title: 'Weather-Based Tips', desc: 'Smart recommendations based on current forecasts. \u201CPerfect beach day\u201D or \u201Crainy day activities.\u201D' },
  { icon: '\u{1F916}', title: 'AI Itinerary Planner', desc: 'Personalized trip planning with insider tips and optimized schedules. Your perfect Maui day.' },
  { icon: '\u{1F4F1}', title: 'Mobile Friendly', desc: 'Access from anywhere on any device. Plan on the go while exploring the island.' },
  { icon: '\u{1F3AF}', title: 'Honest Info', desc: 'No hidden agendas. No upselling. Just straightforward information to help you decide.' },
  { icon: '\u{1F504}', title: 'Always Updated', desc: 'Prices and availability refreshed regularly. Current information when you need it.' },
];

const STEPS = [
  { num: 1, title: 'Subscribe', desc: 'Pay $10 once for 180 days of full access. No recurring charges, no surprises.' },
  { num: 2, title: 'Compare', desc: 'Browse all Maui activities with real prices, honest reviews, and AI-powered recommendations.' },
  { num: 3, title: 'Click Through', desc: "Found something perfect? Click the direct link to the vendor\u2019s website." },
  { num: 4, title: 'Book Direct', desc: "Complete your booking on the vendor\u2019s site at the real price\u2014no middleman, no markup." },
];

const PRICING_FEATURES = [
  'Compare all Maui activities',
  'Real-time availability updates',
  'Unbiased reviews and ratings',
  'Price alerts for wishlist items',
  'Hidden gems recommendations',
  'Weather-based suggestions',
  'AI itinerary planner',
  'Direct vendor booking links',
  'Mobile access anywhere',
  'No recurring charges',
];

const FAQ_ITEMS = [
  {
    q: 'Why only $10 for 6 months?',
    a: "We don\u2019t take commissions on bookings like other sites (which can be 10-40% per transaction). Our revenue comes from vendors paying a flat $99/month subscription to be listed\u2014way cheaper than commission fees. This lets us charge you almost nothing while giving vendors a better deal too.",
  },
  {
    q: 'How is this different from other activity sites?',
    a: 'Traditional booking sites earn 10-40% commission per booking, so they\u2019re incentivized to push expensive activities and hide cheaper alternatives. We show you everything with real prices pulled from vendor sites, with zero bias because we don\u2019t earn more when you spend more.',
  },
  {
    q: 'Do you actually book the activities for me?',
    a: "No\u2014we\u2019re an information directory, not a booking platform. We show you all your options with real prices and direct links to vendor websites. You click through and book directly with them. This saves them commission fees and ensures you get authentic service.",
  },
  {
    q: 'Are the prices really the same as booking direct?',
    a: "Yes! We pull prices directly from vendor websites in real-time. You\u2019ll pay the exact same price when you book through their site. No markup, no hidden fees.",
  },
  {
    q: "What\u2019s included in the AI itinerary planner?",
    a: 'Our AI analyzes your interests, travel dates, weather forecasts, and activity availability to create personalized day-by-day plans. You get insider tips, optimized schedules, and recommendations tailored to your preferences\u2014not our commissions.',
  },
  {
    q: 'Do you cover all Maui activities?',
    a: "We\u2019re continuously adding vendors who subscribe to our platform. Unlike commission sites that only show partners paying 10-40% fees, we include anyone paying our flat $99/month, which means better coverage of local and independent operators.",
  },
  {
    q: 'Is this a recurring subscription?',
    a: 'Nope! Pay $10 once and get 180 days of access. No auto-renewal, no recurring charges. If you want to continue after 6 months, you can resubscribe.',
  },
  {
    q: 'What if I\u2019m not satisfied?',
    a: "We offer a 30-day money-back guarantee. If Maui Activity Hub isn\u2019t helping you plan better, just let us know and we\u2019ll refund you\u2014no questions asked.",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Maui Activity Hub - Honest Activity Comparisons, Zero Commissions</title>
        <meta
          name="description"
          content="Compare every Maui activity in one place with real prices pulled directly from vendor websites. Book direct and skip the commission markup. $10 for 180 days."
        />
      </Head>

      <div className={styles.page}>
        {/* ===== HERO ===== */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1>
              No Commissions. No Agenda.<br />
              <span className={styles.highlight}>Just Honest Activity Comparisons.</span>
            </h1>
            <p>
              Compare every Maui activity in one place with real prices pulled
              directly from vendor websites. Book direct and skip the commission
              markup.
            </p>
            <div className={styles.price}>
              <span>$10</span> for 180 days of access
            </div>
            <Link href="/auth/signup" className={styles.ctaButton}>
              Start Exploring
            </Link>
          </div>
        </section>

        {/* ===== SOLUTION ===== */}
        <section className={styles.solution}>
          <div className={styles.container}>
            <h2>The Maui Activity Hub Difference</h2>
            <p className={styles.subtitle}>
              Honest comparisons. Real prices. Direct booking.
            </p>
            <div className={styles.solutionGrid}>
              {SOLUTION_CARDS.map((card) => (
                <div key={card.title} className={styles.solutionCard}>
                  <h3>
                    {card.icon} {card.title}
                  </h3>
                  <p>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className={styles.features}>
          <div className={styles.container}>
            <h2>Everything You Need to Plan Your Maui Adventure</h2>
            <div className={styles.featuresGrid}>
              {FEATURES.map((f) => (
                <div key={f.title} className={styles.featureCard}>
                  <div className={styles.featureIcon}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className={styles.howItWorks}>
          <div className={styles.container}>
            <h2>How It Works</h2>
            <div className={styles.steps}>
              {STEPS.map((step) => (
                <div key={step.num} className={styles.step}>
                  <div className={styles.stepNumber}>{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section className={styles.pricing} id="pricing">
          <div className={styles.container}>
            <h2>Simple, Honest Pricing</h2>
            <div className={styles.pricingCard}>
              <h3>Full Access</h3>
              <div className={styles.priceAmount}>$10</div>
              <div className={styles.pricePeriod}>for 180 days</div>
              <ul className={styles.pricingFeatures}>
                {PRICING_FEATURES.map((feat) => (
                  <li key={feat}>{feat}</li>
                ))}
              </ul>
              <Link href="/auth/signup" className={styles.ctaButton}>
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className={styles.faq}>
          <div className={styles.container}>
            <h2>Frequently Asked Questions</h2>
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className={styles.finalCta}>
          <div className={styles.container}>
            <h2>Ready to Plan Your Perfect Maui Trip?</h2>
            <p>
              Join travelers who are done overpaying and ready for honest
              recommendations.
            </p>
            <Link href="/auth/signup" className={styles.ctaButtonLarge}>
              Get 180 Days for $10
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
