import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Heart, Users, Zap, Shield, Smartphone } from 'lucide-react';
import styles from '../styles/home.module.css';

interface Activity {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  rating: number;
  reviews_count: number;
}

export default function Home() {
  const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedActivities();
  }, []);

  const fetchFeaturedActivities = async () => {
    try {
      const response = await fetch('/api/activities?limit=6');
      const data = await response.json();
      setFeaturedActivities(data.activities || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover Amazing Activities in Maui
          </h1>
          <p className={styles.heroSubtitle}>
            Find, book, and share unforgettable experiences on the beautiful island of Maui
          </p>
          <div className={styles.heroCTA}>
            <Link href="/activities" className={styles.ctaButton}>
              Browse Activities <ArrowRight size={20} />
            </Link>
            <Link href="/auth/signup?type=vendor" className={styles.ctaButtonSecondary}>
              Become a Vendor
            </Link>
          </div>
          <p className={styles.heroSecondary}>
            ✨ 500+ activities • 🌟 Trusted by 5,000+ travelers • 💰 Best prices guaranteed
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statBox}>
          <div className={styles.statNumber}>500+</div>
          <div className={styles.statLabel}>Activities</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statNumber}>5K+</div>
          <div className={styles.statLabel}>Happy Travelers</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statNumber}>4.8★</div>
          <div className={styles.statLabel}>Average Rating</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statNumber}>24/7</div>
          <div className={styles.statLabel}>Support</div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2>How It Works</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Browse</h3>
            <p>Explore hundreds of activities across Maui</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Book</h3>
            <p>Secure your spot with instant confirmation</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Enjoy</h3>
            <p>Experience unforgettable moments in paradise</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>Review</h3>
            <p>Share your experience with the community</p>
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className={styles.featured}>
        <h2>Featured Activities</h2>
        {loading ? (
          <div className={styles.loadingSpinner}>Loading activities...</div>
        ) : featuredActivities.length > 0 ? (
          <div className={styles.activitiesGrid}>
            {featuredActivities.map((activity) => (
              <Link key={activity.id} href={`/activities/${activity.id}`}>
                <div className={styles.activityCard}>
                  <div className={styles.cardImage}>
                    <img 
                      src={activity.image_url || '/placeholder-activity.jpg'} 
                      alt={activity.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-activity.jpg';
                      }}
                    />
                    <div className={styles.cardBadge}>Featured</div>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardCategory}>{activity.category}</div>
                    <h3>{activity.title}</h3>
                    <p className={styles.cardDescription}>{activity.description?.substring(0, 80)}...</p>
                    <div className={styles.cardFooter}>
                      <div className={styles.cardRating}>
                        <span>⭐ {activity.rating?.toFixed(1) || 'N/A'}</span>
                        <span className={styles.reviews}>({activity.reviews_count || 0})</span>
                      </div>
                      <div className={styles.cardPrice}>${activity.price}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No activities available. Check back soon!</p>
          </div>
        )}
        <div className={styles.viewAll}>
          <Link href="/activities" className={styles.viewAllLink}>
            View All Activities <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2>Why Choose Maui Activities Hub?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <Shield size={32} />
            <h3>Safe & Secure</h3>
            <p>All transactions are secure and protected. We verify all vendors</p>
          </div>
          <div className={styles.featureCard}>
            <Zap size={32} />
            <h3>Instant Booking</h3>
            <p>Get instant confirmation. No waiting, no hassle</p>
          </div>
          <div className={styles.featureCard}>
            <Users size={32} />
            <h3>Community Driven</h3>
            <p>Read reviews and ratings from real travelers</p>
          </div>
          <div className={styles.featureCard}>
            <Heart size={32} />
            <h3>Save Favorites</h3>
            <p>Create your wishlist and share with friends</p>
          </div>
          <div className={styles.featureCard}>
            <MapPin size={32} />
            <h3>Explore Maui</h3>
            <p>Discover hidden gems and popular attractions</p>
          </div>
          <div className={styles.featureCard}>
            <Smartphone size={32} />
            <h3>Mobile Friendly</h3>
            <p>Book anytime, anywhere with our responsive app</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricing}>
        <h2>Simple Transparent Pricing</h2>
        <div className={styles.pricingContainer}>
          <div className={styles.pricingCard}>
            <h3>For Travelers</h3>
            <div className={styles.price}>
              <span className={styles.amount}>$10</span>
              <span className={styles.period}>one-time pass</span>
            </div>
            <ul className={styles.features}>
              <li>✓ Browse all activities</li>
              <li>✓ Book instantly</li>
              <li>✓ Save favorites</li>
              <li>✓ Leave reviews</li>
              <li>✓ Lifetime access</li>
            </ul>
            <Link href="/auth/signup" className={styles.pricingCTA}>
              Get Started
            </Link>
          </div>

          <div className={styles.pricingCard + ' ' + styles.pricingCardPopular}>
            <div className={styles.popularBadge}>Most Popular</div>
            <h3>For Vendors</h3>
            <div className={styles.price}>
              <span className={styles.amount}>$99</span>
              <span className={styles.period}>per month</span>
            </div>
            <ul className={styles.features}>
              <li>✓ Unlimited activity listings</li>
              <li>✓ Booking management</li>
              <li>✓ Analytics dashboard</li>
              <li>✓ Customer support</li>
              <li>✓ Marketing tools</li>
            </ul>
            <Link href="/auth/signup?type=vendor" className={styles.pricingCTAPrimary}>
              Become a Vendor
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <h2>What Our Users Say</h2>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialRating}>★★★★★</div>
            <p>"Amazing platform! Found the perfect snorkeling tour within minutes. Highly recommended!"</p>
            <div className={styles.testimonialAuthor}>- Sarah M., Travel Blogger</div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialRating}>★★★★★</div>
            <p>"As a vendor, this platform has transformed my business. Great support team!"</p>
            <div className={styles.testimonialAuthor}>- Mike K., Activity Owner</div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialRating}>★★★★★</div>
            <p>"Best booking experience ever. Easy to use, great prices, and excellent customer service."</p>
            <div className={styles.testimonialAuthor}>- Jennifer L., Family Traveler</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2>Ready to Explore Maui?</h2>
        <p>Join thousands of travelers discovering amazing activities on the island</p>
        <div className={styles.ctaButtons}>
          <Link href="/activities" className={styles.ctaButtonLarge}>
            Browse Activities Now
          </Link>
          <Link href="/auth/signup?type=vendor" className={styles.ctaButtonLargeSecondary}>
            Start Earning as a Vendor
          </Link>
        </div>
      </section>
    </div>
  );
}
