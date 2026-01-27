import React from 'react';
import styles from '../styles/legal.module.css';

export default function Privacy() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.legalHeader}>
        <h1>Privacy Policy</h1>
        <p>Last updated: January 2024</p>
      </div>

      <div className={styles.legalContent}>
        <section>
          <h2>1. Introduction</h2>
          <p>
            Maui Activities Hub ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and mobile application.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We collect information you provide directly, including:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email, phone number, password</li>
            <li><strong>Profile Information:</strong> Location, preferences, profile picture</li>
            <li><strong>Booking Information:</strong> Activity selections, dates, guest count</li>
            <li><strong>Payment Information:</strong> Processed securely through third-party providers</li>
            <li><strong>Communication:</strong> Messages, reviews, and feedback</li>
          </ul>
        </section>

        <section>
          <h2>3. Automatic Data Collection</h2>
          <p>
            When you visit our platform, we automatically collect certain information, including:
          </p>
          <ul>
            <li>IP address and device information</li>
            <li>Browser type and operating system</li>
            <li>Pages visited and time spent on each page</li>
            <li>Referring URL and search queries</li>
          </ul>
        </section>

        <section>
          <h2>4. Use of Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Respond to your inquiries and requests</li>
            <li>Monitor and analyze platform usage</li>
            <li>Detect and prevent fraudulent activity</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information with:
          </p>
          <ul>
            <li><strong>Activity Vendors:</strong> To fulfill your bookings</li>
            <li><strong>Payment Processors:</strong> To process transactions</li>
            <li><strong>Service Providers:</strong> For hosting, analytics, and customer support</li>
            <li><strong>Legal Authorities:</strong> When required by law</li>
          </ul>
        </section>

        <section>
          <h2>6. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section>
          <h2>8. Cookies</h2>
          <p>
            We use cookies to enhance your experience. You can control cookie preferences through your browser settings. Some features may not function properly if you disable cookies.
          </p>
        </section>

        <section>
          <h2>9. Children's Privacy</h2>
          <p>
            Our platform is not intended for children under 13. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information immediately.
          </p>
        </section>

        <section>
          <h2>10. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites. We are not responsible for their privacy practices. Please review their policies before providing personal information.
          </p>
        </section>

        <section>
          <h2>11. Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide our services and fulfill legal obligations. You can request deletion at any time.
          </p>
        </section>

        <section>
          <h2>12. Changes to Privacy Policy</h2>
          <p>
            We may update this policy periodically. We will notify you of significant changes via email or on our website.
          </p>
        </section>

        <section>
          <h2>13. Contact Us</h2>
          <p>
            For privacy concerns or data requests, contact us at privacy@mauiactivities.com
          </p>
        </section>
      </div>
    </div>
  );
}
