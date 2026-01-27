import React from 'react';
import Link from 'next/link';
import { Heart, Target, Users, Zap } from 'lucide-react';
import styles from '../styles/about.module.css';

export default function About() {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.aboutHero}>
        <div className={styles.heroContent}>
          <h1>About Maui Activities Hub</h1>
          <p>Connecting travelers with unforgettable Maui experiences</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionContent}>
            <div className={styles.missionText}>
              <h2>Our Mission</h2>
              <p>
                To make discovering and booking amazing activities in Maui simple, affordable, and accessible to travelers worldwide while empowering local vendors to grow their businesses.
              </p>
            </div>
            <div className={styles.missionText}>
              <h2>Our Vision</h2>
              <p>
                To become the trusted marketplace where every visitor to Maui finds their perfect activity and creates unforgettable memories on the island.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <h2>Our Core Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <Heart size={40} />
              <h3>Passion</h3>
              <p>We're passionate about helping people create amazing memories in Maui</p>
            </div>
            <div className={styles.valueCard}>
              <Target size={40} />
              <h3>Quality</h3>
              <p>We maintain high standards for every activity and vendor on our platform</p>
            </div>
            <div className={styles.valueCard}>
              <Users size={40} />
              <h3>Community</h3>
              <p>We support and celebrate the Maui community and local vendors</p>
            </div>
            <div className={styles.valueCard}>
              <Zap size={40} />
              <h3>Innovation</h3>
              <p>We continuously improve to make booking activities easier and better</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <h2>Our Story</h2>
          <div className={styles.storyContent}>
            <p>
              Maui Activities Hub was founded with a simple idea: make it easy for travelers to discover and book amazing activities on Maui, while giving local vendors a platform to reach customers.
            </p>
            <p>
              We started by talking to hundreds of travelers and vendors. Travelers told us they struggled to find activities beyond the usual tourist traps. Vendors told us they wanted a better way to reach customers without expensive marketing.
            </p>
            <p>
              So we built Maui Activities Hub. A platform that brings together the best activities on the island with the travelers who are looking for authentic, unforgettable experiences.
            </p>
            <p>
              Today, we're proud to have helped thousands of travelers discover amazing experiences and hundreds of vendors grow their businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <h2>By The Numbers</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Activities Available</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>200+</div>
              <div className={styles.statLabel}>Local Vendors</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>5,000+</div>
              <div className={styles.statLabel}>Happy Travelers</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>4.8★</div>
              <div className={styles.statLabel}>Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <h2>Our Team</h2>
          <p className={styles.teamIntro}>
            We're a diverse team of travelers, entrepreneurs, and engineers passionate about Maui and connecting people with amazing experiences.
          </p>
          <div className={styles.teamGrid}>
            <div className={styles.teamCard}>
              <div className={styles.teamImage}>👤</div>
              <h3>Corbett Spence</h3>
              <p>Founder & CEO</p>
              <p className={styles.teamBio}>Passionate about travel and technology, with 10+ years of experience building marketplaces.</p>
            </div>
            <div className={styles.teamCard}>
              <div className={styles.teamImage}>👤</div>
              <h3>Your Name Here</h3>
              <p>Chief Technology Officer</p>
              <p className={styles.teamBio}>Expert in building scalable platforms that connect buyers and sellers.</p>
            </div>
            <div className={styles.teamCard}>
              <div className={styles.teamImage}>👤</div>
              <h3>Your Name Here</h3>
              <p>Head of Customer Success</p>
              <p className={styles.teamBio}>Dedicated to ensuring every traveler and vendor has an amazing experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2>Ready to Explore Maui?</h2>
        <p>Join thousands of travelers discovering amazing activities on the island</p>
        <Link href="/activities" className={styles.ctaButton}>
          Browse Activities
        </Link>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <h2>Get In Touch</h2>
          <div className={styles.contactContent}>
            <div className={styles.contactBox}>
              <h3>Email</h3>
              <p><a href="mailto:support@mauiactivities.com">support@mauiactivities.com</a></p>
            </div>
            <div className={styles.contactBox}>
              <h3>Phone</h3>
              <p><a href="tel:+18085550100">+1 (808) 555-0100</a></p>
            </div>
            <div className={styles.contactBox}>
              <h3>Location</h3>
              <p>Maui, Hawaii</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
