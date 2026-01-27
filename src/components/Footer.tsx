import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';
import styles from '../styles/footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <h3>Maui Activities Hub</h3>
            <p>Discover amazing experiences on the beautiful island of Maui. Connect travelers with local vendors.</p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>Maui, Hawaii</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>support@mauiactivities.com</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>+1 (808) 555-0100</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/activities">Browse Activities</Link></li>
              <li><Link href="/auth/signup?type=vendor">Become a Vendor</Link></li>
              <li><Link href="/favorites">My Favorites</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.footerSection}>
            <h4>Resources</h4>
            <ul>
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className={styles.footerSection}>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/refund">Refund Policy</Link></li>
              <li><Link href="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} Maui Activities Hub. All rights reserved.</p>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
