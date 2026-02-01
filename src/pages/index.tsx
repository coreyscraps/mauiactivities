import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Maui Activity Hub - Honest Activity Comparisons, Zero Commissions</title>
      </Head>

      <style jsx global>{`
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .cta-button {
            background: #e76f51;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: inline-block;
        }

        .cta-button:hover {
            background: #d1593f;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(231, 111, 81, 0.4);
        }

        .hero {
            background: linear-gradient(135deg, #01befe 0%, #0b4f6c 100%);
            color: white;
            padding: 6rem 0;
            text-align: center;
        }

        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }

        .hero .highlight {
            color: #ffd166;
        }

        .hero p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        .hero .price {
            font-size: 1.5rem;
            margin: 2rem 0;
            font-weight: 600;
        }

        .hero .price span {
            font-size: 2.5rem;
            color: #ffd166;
        }

        .solution {
            padding: 5rem 0;
            background: white;
        }

        .solution h2 {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 1rem;
            color: #0b4f6c;
        }

        .solution .subtitle {
            text-align: center;
            font-size: 1.2rem;
            color: #4a5568;
            margin-bottom: 3rem;
        }

        .solution-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
        }

        .solution-card {
            background: #f7fafc;
            padding: 2rem;
            border-radius: 10px;
            border: 2px solid #e2e8f0;
            transition: all 0.3s ease;
        }

        .solution-card:hover {
            border-color: #5fb3b3;
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .solution-card h3 {
            color: #2d3748;
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }

        .solution-card p {
            color: #4a5568;
        }

        .features {
            background: #f7fafc;
            padding: 5rem 0;
        }

        .features h2 {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
            color: #0b4f6c;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }

        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .feature-card h3 {
            color: #2d3748;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }

        .feature-card p {
            color: #718096;
            font-size: 0.95rem;
        }

        .how-it-works {
            padding: 5rem 0;
            background: white;
        }

        .how-it-works h2 {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
            color: #0b4f6c;
        }

        .steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }

        .step {
            text-align: center;
            padding: 2rem;
        }

        .step-number {
            background: #5fb3b3;
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 auto 1.5rem;
        }

        .step h3 {
            color: #2d3748;
            margin-bottom: 1rem;
        }

        .step p {
            color: #4a5568;
        }

        .pricing {
            background: linear-gradient(135deg, #01befe 0%, #0b4f6c 100%);
            color: white;
            padding: 5rem 0;
            text-align: center;
        }

        .pricing h2 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
        }

        .pricing-card {
            background: white;
            color: #2d3748;
            max-width: 500px;
            margin: 0 auto;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .price-amount {
            font-size: 4rem;
            font-weight: 700;
            color: #e76f51;
            margin: 1rem 0;
        }

        .price-period {
            font-size: 1.2rem;
            color: #718096;
            margin-bottom: 2rem;
        }

        .pricing-features {
            text-align: left;
            margin: 2rem 0;
        }

        .pricing-features li {
            padding: 0.75rem 0;
            border-bottom: 1px solid #e2e8f0;
            list-style: none;
        }

        .pricing-features li:before {
            content: "✓ ";
            color: #5fb3b3;
            font-weight: bold;
            margin-right: 0.5rem;
        }

        .faq {
            padding: 5rem 0;
            background: #f7fafc;
        }

        .faq h2 {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
            color: #0b4f6c;
        }

        .faq-item {
            background: white;
            padding: 2rem;
            margin-bottom: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }

        .faq-item h3 {
            color: #2d3748;
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }

        .faq-item p {
            color: #4a5568;
            line-height: 1.8;
        }

        .final-cta {
            background: linear-gradient(135deg, #e76f51 0%, #d1593f 100%);
            color: white;
            padding: 5rem 0;
            text-align: center;
        }

        .final-cta h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .final-cta p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
        }

        .cta-button-large {
            background: white;
            color: #e76f51;
            padding: 1rem 3rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            display: inline-block;
            border: none;
            cursor: pointer;
        }

        .cta-button-large:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }

            .hero p {
                font-size: 1.1rem;
            }

            .solution h2, .features h2, .how-it-works h2, .pricing h2, .faq h2 {
                font-size: 2rem;
            }
        }
      `}</style>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>No Commissions. No Agenda.<br /><span className="highlight">Just Honest Activity Comparisons.</span></h1>
          <p>Compare every Maui activity in one place with real prices pulled directly from vendor websites. Book direct and skip the commission markup.</p>
          <div className="price">
            <span>$10</span> for 180 days of access
          </div>
          <a href="#pricing" className="cta-button">Start Exploring</a>
        </div>
      </section>

      {/* The Solution */}
      <section className="solution">
        <div className="container">
          <h2>The Maui Activity Hub Difference</h2>
          <p className="subtitle">Honest comparisons. Real prices. Direct booking.</p>
          <div className="solution-grid">
            <div className="solution-card">
              <h3>📊 Unbiased Comparisons</h3>
              <p>We don&apos;t earn commissions, so we have zero incentive to push one activity over another. Compare based on actual quality and fit.</p>
            </div>
            <div className="solution-card">
              <h3>💰 Real Vendor Prices</h3>
              <p>Prices pulled directly from vendor websites. What you see is what you&apos;ll pay when you book direct—no markup, no surprises.</p>
            </div>
            <div className="solution-card">
              <h3>🔗 Book Directly</h3>
              <p>Click through to vendor websites and book straight with them. They save on commissions, and you get authentic service.</p>
            </div>
            <div className="solution-card">
              <h3>🌴 See Everything</h3>
              <p>All activities in one place—from major operators to hidden local gems. No more endless tab-hopping to compare options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2>Everything You Need to Plan Your Maui Adventure</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Price Comparison</h3>
              <p>See prices from every vendor side-by-side. Find the best deal without the markup.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-Time Availability</h3>
              <p>See which activities have openings today or tomorrow. &ldquo;Book Now&rdquo; badges for immediate plans.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Unbiased Reviews</h3>
              <p>Honest ratings from real travelers. No commission means no bias in our recommendations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Price Alerts</h3>
              <p>Get notified when activities on your wishlist drop in price. Never miss a deal.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Hidden Gems</h3>
              <p>Discover amazing local spots that don&apos;t show up on commission sites. Support small businesses.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌤️</div>
              <h3>Weather-Based Tips</h3>
              <p>Smart recommendations based on current forecasts. &ldquo;Perfect beach day&rdquo; or &ldquo;rainy day activities.&rdquo;</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Itinerary Planner</h3>
              <p>Personalized trip planning with insider tips and optimized schedules. Your perfect Maui day.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access from anywhere on any device. Plan on the go while exploring the island.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Honest Info</h3>
              <p>No hidden agendas. No upselling. Just straightforward information to help you decide.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Always Updated</h3>
              <p>Prices and availability refreshed regularly. Current information when you need it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Subscribe</h3>
              <p>Pay $10 once for 180 days of full access. No recurring charges, no surprises.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Compare</h3>
              <p>Browse all Maui activities with real prices, honest reviews, and AI-powered recommendations.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Click Through</h3>
              <p>Found something perfect? Click the direct link to the vendor&apos;s website.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Book Direct</h3>
              <p>Complete your booking on the vendor&apos;s site at the real price—no middleman, no markup.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="container">
          <h2>Simple, Honest Pricing</h2>
          <div className="pricing-card">
            <h3>Full Access</h3>
            <div className="price-amount">$10</div>
            <div className="price-period">for 180 days</div>
            <ul className="pricing-features">
              <li>Compare all Maui activities</li>
              <li>Real-time availability updates</li>
              <li>Unbiased reviews and ratings</li>
              <li>Price alerts for wishlist items</li>
              <li>Hidden gems recommendations</li>
              <li>Weather-based suggestions</li>
              <li>AI itinerary planner</li>
              <li>Direct vendor booking links</li>
              <li>Mobile access anywhere</li>
              <li>No recurring charges</li>
            </ul>
            <a href="#" className="cta-button" style={{ display: 'block', textAlign: 'center', marginTop: '2rem' }}>Get Started Now</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3>Why only $10 for 6 months?</h3>
            <p>We don&apos;t take commissions on bookings like other sites (which can be 10-40% per transaction). Our revenue comes from vendors paying a flat $99/month subscription to be listed—way cheaper than commission fees. This lets us charge you almost nothing while giving vendors a better deal too.</p>
          </div>

          <div className="faq-item">
            <h3>How is this different from other activity sites?</h3>
            <p>Traditional booking sites earn 10-40% commission per booking, so they&apos;re incentivized to push expensive activities and hide cheaper alternatives. We show you everything with real prices pulled from vendor sites, with zero bias because we don&apos;t earn more when you spend more.</p>
          </div>

          <div className="faq-item">
            <h3>Do you actually book the activities for me?</h3>
            <p>No—we&apos;re an information directory, not a booking platform. We show you all your options with real prices and direct links to vendor websites. You click through and book directly with them. This saves them commission fees and ensures you get authentic service.</p>
          </div>

          <div className="faq-item">
            <h3>Are the prices really the same as booking direct?</h3>
            <p>Yes! We pull prices directly from vendor websites in real-time. You&apos;ll pay the exact same price when you book through their site. No markup, no hidden fees.</p>
          </div>

          <div className="faq-item">
            <h3>What&apos;s included in the AI itinerary planner?</h3>
            <p>Our AI analyzes your interests, travel dates, weather forecasts, and activity availability to create personalized day-by-day plans. You get insider tips, optimized schedules, and recommendations tailored to your preferences—not our commissions.</p>
          </div>

          <div className="faq-item">
            <h3>Do you cover all Maui activities?</h3>
            <p>We&apos;re continuously adding vendors who subscribe to our platform. Unlike commission sites that only show partners paying 10-40% fees, we include anyone paying our flat $99/month, which means better coverage of local and independent operators.</p>
          </div>

          <div className="faq-item">
            <h3>Is this a recurring subscription?</h3>
            <p>Nope! Pay $10 once and get 180 days of access. No auto-renewal, no recurring charges. If you want to continue after 6 months, you can resubscribe.</p>
          </div>

          <div className="faq-item">
            <h3>What if I&apos;m not satisfied?</h3>
            <p>We offer a 30-day money-back guarantee. If Maui Activity Hub isn&apos;t helping you plan better, just let us know and we&apos;ll refund you—no questions asked.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <h2>Ready to Plan Your Perfect Maui Trip?</h2>
          <p>Join travelers who are done overpaying and ready for honest recommendations.</p>
          <a href="#pricing" className="cta-button-large">Get 180 Days for $10</a>
        </div>
      </section>
    </>
  );
}
