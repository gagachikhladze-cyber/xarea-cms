'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useClasses, useSettings } from '@/hooks'

export default function ClassesPage() {
  const { classes } = useClasses()
  const { settings } = useSettings()
  const [navScrolled, setNavScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const activeClasses = classes.filter(c => c.is_active)

  return (
    <div>
      {/* Nav */}
      <nav className="nav" style={{ background: navScrolled ? 'rgba(10,10,10,0.95)' : undefined }}>
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <svg viewBox="0 0 32 32" fill="none"><path d="M4 4L16 16L4 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M28 4L16 16L28 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="nav-logo-text">X <span>AREA FITNESS</span></span>
          </Link>
          <ul className="nav-links">
            <li><Link href="/#about">შესახებ</Link></li>
            <li><Link href="/#classes">ვარჯიშები</Link></li>
            <li><Link href="/#schedule">განრიგი</Link></li>
            <li><Link href="/#trainers">მწვრთნელები</Link></li>
            <li><Link href="/#pricing">ფასები</Link></li>
            <li><Link href="/#contact">კონტაქტი</Link></li>
          </ul>
          <Link href="/#pricing" className="nav-cta">შემოგვიერთდი</Link>
        </div>
      </nav>

      {/* Header */}
      <section className="section classes-page-header">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">ვარჯიშები</span>
            <h1 className="heading-xl section-title">აირჩიე შენი<br />ვარჯიში</h1>
            <p className="body-md section-subtitle">ჯგუფური და ინდივიდუალური ვარჯიშები ყველა დონისთვის</p>
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="section classes-page">
        <div className="section-container">
          <div className="classes-grid">
            {activeClasses.map(c => (
              <div key={c.id} className="class-card fade-in visible">
                <div className="class-card-image">
                  {c.image_url && <img src={c.image_url} alt={c.name} loading="lazy" />}
                  {c.badge && <span className="class-card-badge" style={c.badge_color ? { background: c.badge_color } : undefined}>{c.badge}</span>}
                </div>
                <div className="class-card-body">
                  <h3 className="class-card-title">{c.name}</h3>
                  <p className="class-card-subtitle">{c.subtitle}</p>
                  <div className="class-card-meta">
                    {c.schedule_text && (
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        {c.schedule_text}
                      </span>
                    )}
                    {c.level && (
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        {c.level}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section" style={{ background: 'var(--bg)' }}>
        <div className="section-container">
          <div className="cta-content" style={{ textAlign: 'center' }}>
            <h2 className="heading-xl">მზად ხარ ვარჯიშისთვის?</h2>
            <p className="cta-text" style={{ margin: 'var(--spacing-sm) auto 0' }}>ჩაეწერე ვარჯიშზე და დაიწყე შენი ტრანსფორმაცია</p>
            <div className="hero-buttons" style={{ justifyContent: 'center', marginTop: 'var(--spacing-md)' }}>
              <Link href={`tel:${settings.phone}`} className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                დაგვიკავშირდი
              </Link>
              <Link href="/#pricing" className="btn-secondary">ფასების ნახვა</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-bottom">
            <p className="footer-copyright">© 2026 X AREA FITNESS. ყველა უფლება დაცულია.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
