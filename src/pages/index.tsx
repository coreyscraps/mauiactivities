import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', overflow: 'hidden' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Discover Activities in Maui</h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '40px' }}>Compare prices across vendors • Find the best deals • Book instantly</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/activities" style={{
            padding: '14px 32px',
            background: 'white',
            color: '#0077b6',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none'
          }}>
            Browse Activities
          </Link>
          <Link href="/auth/signup" style={{
            padding: '14px 32px',
            background: 'transparent',
            color: 'white',
            textDecoration: 'none',
            border: '2px solid white',
            borderRadius: '8px',
            fontWeight: 600
          }}>
            Become a Vendor
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px 60px' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '50px' }}>Why Maui Activities Hub?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {[
            { icon: '🔍', title: 'Best Price Guarantee', desc: 'Compare prices across all vendors in real-time' },
            { icon: '⭐', title: 'Verified Reviews', desc: 'Read honest reviews from real travelers' },
            { icon: '🎯', title: 'Curated Selection', desc: 'Hand-picked activities for unforgettable experiences' },
            { icon: '💰', title: '10-Day Pass', desc: 'Unlimited access for just $10' },
          ].map((f, i) => (
            <div key={i} style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.2rem', color: '#0077b6', marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '50px' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          {[
            { num: 1, title: 'Browse', desc: 'Search thousands of activities' },
            { num: 2, title: 'Compare', desc: 'See prices from all vendors' },
            { num: 3, title: 'Book', desc: 'Book directly with vendors' },
            { num: 4, title: 'Enjoy', desc: 'Create unforgettable memories' },
          ].map((s) => (
            <div key={s.num} style={{paddingLeft: '60px', position: 'relative'}}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.5rem'
              }}>
                {s.num}
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#1a1a1a', marginBottom: '12px' }}>{s.title}</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{
        background: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)',
        color: 'white',
        padding: '80px 20px'
      }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '50px', color: 'white' }}>Simple Pricing</h2>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '40px 30px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Traveler Pass</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, margin: '20px 0' }}>$10</div>
            <p>180 days of unlimited access</p>
            <ul style={{ listStyle: 'none', padding: '20px 0', margin: 0 }}>
              <li style={{ paddingBottom: '12px' }}>✓ Browse all activities</li>
              <li style={{ paddingBottom: '12px' }}>✓ Compare prices</li>
              <li>✓ Save favorites</li>
            </ul>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '40px 30px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Vendor Subscription</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, margin: '20px 0' }}>$99<span style={{ fontSize: '1.2rem' }}>/mo</span></div>
            <p>List your activities</p>
            <ul style={{ listStyle: 'none', padding: '20px 0', margin: 0 }}>
              <li style={{ paddingBottom: '12px' }}>✓ List activities</li>
              <li style={{ paddingBottom: '12px' }}>✓ Real-time bookings</li>
              <li>✓ Analytics dashboard</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Ready to Explore Maui?</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '40px', color: '#666' }}>Join thousands of travelers discovering amazing experiences</p>
        <Link href="/activities" style={{
          display: 'inline-block',
          padding: '16px 40px',
          background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '1rem',
          border: 'none'
        }}>
          Browse Activities
        </Link>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#1a1a1a',
        color: '#ccc',
        padding: '40px 20px',
        textAlign: 'center',
        fontSize: '0.9rem'
      }}>
        <p>© 2024 Maui Activities Hub. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
          <Link href="/about" style={{ color: '#0077b6', textDecoration: 'none' }}>About</Link>
          <Link href="/terms" style={{ color: '#0077b6', textDecoration: 'none' }}>Terms</Link>
          <Link href="/privacy" style={{ color: '#0077b6', textDecoration: 'none' }}>Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
