import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {
  Search,
  Star,
  Shield,
  MapPin,
  Users,
  ArrowRight,
  CheckCircle,
  Waves,
  Sun,
  Compass,
  TrendingUp,
  BarChart3,
  Zap,
} from 'lucide-react';
import styles from '../styles/home.module.css';

const FEATURES = [
  {
    icon: Search,
    title: 'Compare Prices',
    desc: 'See real-time prices from every vendor side-by-side. Never overpay for a Maui adventure again.',
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    desc: 'Honest ratings and reviews from real travelers who have done the activities.',
  },
  {
    icon: Compass,
    title: 'Curated Selection',
    desc: 'Hand-picked activities across snorkeling, hiking, surfing, whale watching, and more.',
  },
  {
    icon: Shield,
    title: 'Book With Confidence',
    desc: 'We only list trusted, licensed operators with proven safety records.',
  },
];

const CATEGORIES = [
  { icon: Waves, name: 'Snorkeling', count: '40+ tours' },
  { icon: Sun, name: 'Sunset Cruises', count: '25+ tours' },
  { icon: Compass, name: 'Hiking', count: '30+ trails' },
  { icon: MapPin, name: 'Road to Hana', count: '15+ tours' },
  { icon: Users, name: 'Luaus', count: '12+ events' },
  { icon: Star, name: 'Whale Watching', count: '20+ tours' },
];

const STEPS = [
  {
    num: 1,
    title: 'Search Activities',
    desc: 'Browse hundreds of activities by category, location, price, or rating.',
  },
  {
    num: 2,
    title: 'Compare & Choose',
    desc: 'See prices from multiple vendors, read reviews, and find your perfect match.',
  },
  {
    num: 3,
    title: 'Book & Enjoy',
    desc: 'Book directly with vendors at the best price and create unforgettable memories.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    location: 'San Francisco, CA',
    text: 'Found a snorkeling tour at Molokini for $30 less than what I was about to book elsewhere. This site is a must before visiting Maui!',
    rating: 5,
  },
  {
    name: 'James L.',
    location: 'Denver, CO',
    text: 'The price comparison feature saved us over $100 on our family trip. We booked whale watching, a luau, and a sunset cruise all through here.',
    rating: 5,
  },
  {
    name: 'Mika T.',
    location: 'Seattle, WA',
    text: 'I loved being able to read real reviews and compare options. The Road to Hana tour we picked was absolutely incredible.',
    rating: 5,
  },
];

const STATS = [
  { value: '500+', label: 'Activities' },
  { value: '50+', label: 'Vendors' },
  { value: '10K+', label: 'Happy Travelers' },
  { value: '4.8', label: 'Avg Rating' },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Maui Activities Hub - Compare Prices & Book the Best Tours in Maui</title>
        <meta
          name="description"
          content="Find and compare the best activities in Maui. Browse snorkeling, surfing, whale watching, luaus, and more from 50+ trusted vendors. Save money with real-time price comparison."
        />
      </Head>

      <div className={styles.page}>
        {/* ===== HERO ===== */}
        <section className={styles.hero}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              <Sun size={14} /> The #1 Maui Activity Marketplace
            </span>
            <h1>
              Find the Best Deals on<br />
              <span className={styles.heroHighlight}>Maui Adventures</span>
            </h1>
            <p>
              Compare prices across 50+ trusted vendors. Snorkeling, surfing,
              whale watching, luaus, and hundreds more — all in one place.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/activities" className={styles.ctaPrimary}>
                Explore Activities <ArrowRight size={18} />
              </Link>
              <Link href="/auth/signup" className={styles.ctaSecondary}>
                Get Your Pass — $10
              </Link>
            </div>
            <div className={styles.heroTrust}>
              <CheckCircle size={16} />
              <span>No hidden fees</span>
              <span className={styles.dot} />
              <CheckCircle size={16} />
              <span>Verified vendors only</span>
              <span className={styles.dot} />
              <CheckCircle size={16} />
              <span>Best price guarantee</span>
            </div>
          </div>
        </section>

        {/* ===== STATS BAR ===== */}
        <section className={styles.statsBar}>
          <div className={styles.statsInner}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Why Travelers Choose Us</h2>
              <p>Everything you need to plan the perfect Maui vacation</p>
            </div>
            <div className={styles.featuresGrid}>
              {FEATURES.map((f) => (
                <div key={f.title} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <f.icon size={24} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CATEGORIES ===== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Popular Categories</h2>
              <p>Explore Maui&apos;s most loved experiences</p>
            </div>
            <div className={styles.categoriesGrid}>
              {CATEGORIES.map((c) => (
                <Link
                  href="/activities"
                  key={c.name}
                  className={styles.categoryCard}
                >
                  <div className={styles.categoryIcon}>
                    <c.icon size={28} />
                  </div>
                  <h3>{c.name}</h3>
                  <span className={styles.categoryCount}>{c.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>How It Works</h2>
              <p>Three simple steps to your next adventure</p>
            </div>
            <div className={styles.stepsGrid}>
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

        {/* ===== TESTIMONIALS ===== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>What Travelers Say</h2>
              <p>Real experiences from real visitors</p>
            </div>
            <div className={styles.testimonialsGrid}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className={styles.testimonialCard}>
                  <div className={styles.testimonialStars}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="#fbbf24" stroke="#fbbf24" />
                    ))}
                  </div>
                  <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.testimonialAvatar}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <span className={styles.testimonialName}>{t.name}</span>
                      <span className={styles.testimonialLocation}>
                        {t.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section className={styles.pricing}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Simple, Transparent Pricing</h2>
              <p>Choose the plan that fits you</p>
            </div>
            <div className={styles.pricingGrid}>
              {/* Traveler */}
              <div className={styles.priceCard}>
                <h3>Traveler Pass</h3>
                <div className={styles.priceAmount}>
                  <span className={styles.priceCurrency}>$</span>
                  <span className={styles.priceValue}>10</span>
                </div>
                <p className={styles.pricePeriod}>180 days of unlimited access</p>
                <ul className={styles.priceFeatures}>
                  <li><CheckCircle size={16} /> Browse all activities</li>
                  <li><CheckCircle size={16} /> Real-time price comparison</li>
                  <li><CheckCircle size={16} /> Save favorites</li>
                  <li><CheckCircle size={16} /> Verified reviews</li>
                  <li><CheckCircle size={16} /> Best price guarantee</li>
                </ul>
                <Link href="/auth/signup" className={styles.priceButton}>
                  Get Your Pass
                </Link>
              </div>

              {/* Vendor */}
              <div className={`${styles.priceCard} ${styles.priceCardFeatured}`}>
                <div className={styles.priceBadge}>For Businesses</div>
                <h3>Vendor Plan</h3>
                <div className={styles.priceAmount}>
                  <span className={styles.priceCurrency}>$</span>
                  <span className={styles.priceValue}>99</span>
                  <span className={styles.priceInterval}>/mo</span>
                </div>
                <p className={styles.pricePeriod}>List your activities &amp; grow bookings</p>
                <ul className={styles.priceFeatures}>
                  <li><CheckCircle size={16} /> Unlimited activity listings</li>
                  <li><CheckCircle size={16} /> Analytics dashboard</li>
                  <li><CheckCircle size={16} /> Commission tracking</li>
                  <li><CheckCircle size={16} /> Real-time booking alerts</li>
                  <li><CheckCircle size={16} /> Priority support</li>
                </ul>
                <Link
                  href="/auth/signup?type=vendor"
                  className={`${styles.priceButton} ${styles.priceButtonFeatured}`}
                >
                  Start Listing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== VENDOR CTA ===== */}
        <section className={styles.vendorCta}>
          <div className={styles.container}>
            <div className={styles.vendorCtaInner}>
              <div className={styles.vendorCtaText}>
                <h2>Are You a Tour Operator?</h2>
                <p>
                  Reach thousands of travelers actively looking for Maui activities.
                  List your tours, track performance, and grow your business.
                </p>
                <div className={styles.vendorPerks}>
                  <div className={styles.vendorPerk}>
                    <TrendingUp size={20} />
                    <span>Increase bookings</span>
                  </div>
                  <div className={styles.vendorPerk}>
                    <BarChart3 size={20} />
                    <span>Real-time analytics</span>
                  </div>
                  <div className={styles.vendorPerk}>
                    <Zap size={20} />
                    <span>Easy setup</span>
                  </div>
                </div>
              </div>
              <Link href="/auth/signup?type=vendor" className={styles.vendorCtaButton}>
                Become a Vendor <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className={styles.finalCta}>
          <div className={styles.finalCtaContent}>
            <h2>Ready to Explore Maui?</h2>
            <p>
              Join thousands of travelers who found their perfect Maui adventure
              — and saved money doing it.
            </p>
            <Link href="/activities" className={styles.finalCtaButton}>
              Browse Activities <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
