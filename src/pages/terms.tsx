import React from 'react';
import styles from '../styles/legal.module.css';

export default function Terms() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.legalHeader}>
        <h1>Terms of Service</h1>
        <p>Last updated: January 2024</p>
      </div>

      <div className={styles.legalContent}>
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Maui Activities Hub ("we," "our," or "us"). These Terms of Service govern your use of our website, mobile application, and services. By accessing or using our platform, you agree to be bound by these terms.
          </p>
        </section>

        <section>
          <h2>2. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2>3. User Content</h2>
          <p>
            You retain ownership of any content you submit, post, or display on the Maui Activities Hub. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such content.
          </p>
        </section>

        <section>
          <h2>4. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on any intellectual property rights</li>
            <li>Engage in harassment or abusive conduct</li>
            <li>Post or transmit malware or harmful code</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Engage in any form of fraud or deception</li>
            <li>Spam or send unsolicited messages</li>
          </ul>
        </section>

        <section>
          <h2>5. Activity Bookings</h2>
          <p>
            Bookings made through Maui Activities Hub are contracts between you and the activity vendor. We facilitate the booking but are not responsible for the quality, safety, or delivery of activities. Each vendor is responsible for their own activities and customer safety.
          </p>
        </section>

        <section>
          <h2>6. Payment Terms</h2>
          <p>
            All prices are displayed in USD. Payment processing is handled by secure payment providers. You agree to pay all fees associated with your account and bookings. Your $10 pass grant lifetime access to our platform.
          </p>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <p>
            All content on Maui Activities Hub, including text, graphics, logos, images, and software, is the property of Maui Activities Hub or its content suppliers and is protected by international copyright laws.
          </p>
        </section>

        <section>
          <h2>8. Disclaimers</h2>
          <p>
            Our platform is provided on an "as-is" basis. We make no warranties regarding the availability, accuracy, or suitability of the information on our site. We are not responsible for third-party activities or content.
          </p>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Maui Activities Hub shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform or inability to use our services.
          </p>
        </section>

        <section>
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Maui Activities Hub from any claims, damages, or costs arising from your violation of these terms or your use of the platform.
          </p>
        </section>

        <section>
          <h2>11. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account at any time, with or without cause, if we believe you have violated these terms.
          </p>
        </section>

        <section>
          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the platform constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2>13. Contact Information</h2>
          <p>
            For questions about these terms, please contact us at support@mauiactivities.com
          </p>
        </section>
      </div>
    </div>
  );
}
