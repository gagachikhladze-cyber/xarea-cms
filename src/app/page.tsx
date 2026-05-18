'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSettings, useTrainers, useClasses, useSchedule, usePricing, useTestimonials, useGallery } from '@/hooks'
import { supabase } from '@/lib/supabase'
import { Trainer } from '@/types'

const iconPaths: Record<string, string> = {
  dumbbell: '<path d="M6.5 6.5L17.5 17.5M6.5 17.5L17.5 6.5M12 2v20M2 12h20"/>',
  clock: '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
}

export default function LandingPage() {
  const { settings } = useSettings()
  const { trainers } = useTrainers()
  const { classes } = useClasses()
  const { days } = useSchedule()
  const { plans } = usePricing()
  const { items: testimonials } = useTestimonials()
  const { items: gallery } = useGallery()
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [activeDay, setActiveDay] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [bmiHeight, setBmiHeight] = useState('')
  const [bmiWeight, setBmiWeight] = useState('')
  const [bmiVal, setBmiVal] = useState<number | null>(null)
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formInterest, setFormInterest] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible') })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    document.querySelectorAll('.fade-in').forEach(el => observerRef.current?.observe(el))
    return () => { window.removeEventListener('scroll', onScroll); observerRef.current?.disconnect() }
  }, [])

  useEffect(() => {
    observerRef.current?.disconnect()
    document.querySelectorAll('.fade-in').forEach(el => observerRef.current?.observe(el))
  }, [trainers, classes, days, plans, testimonials, gallery])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const calcBmi = () => {
    const h = parseFloat(bmiHeight) / 100
    const w = parseFloat(bmiWeight)
    if (h > 0 && w > 0) setBmiVal(parseFloat((w / (h * h)).toFixed(1)))
  }

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('contact_messages').insert({ name: formName, phone: formPhone, interest: formInterest, message: formMessage })
    setFormSubmitted(true)
    setFormName(''); setFormPhone(''); setFormInterest(''); setFormMessage('')
    setTimeout(() => setFormSubmitted(false), 5000)
  }

  const todayIdx = new Date().getDay()
  const dayMap = [6, 0, 1, 2, 3, 4, 5]

  return (
    <div>
      {/* Nav */}
      <nav className="nav" style={{ background: navScrolled ? 'rgba(10,10,10,0.95)' : undefined }}>
        <div className="nav-container">
          <a href="#" className="nav-logo">
            <svg viewBox="0 0 32 32" fill="none"><path d="M4 4L16 16L4 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M28 4L16 16L28 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="nav-logo-text">X <span>AREA FITNESS</span></span>
          </a>
          <ul className="nav-links">
            <li><a href="#about" onClick={e => { e.preventDefault(); scrollTo('about') }}>შესახებ</a></li>
            <li><Link href="/classes">ვარჯიშები</Link></li>
            <li><a href="#schedule" onClick={e => { e.preventDefault(); scrollTo('schedule') }}>განრიგი</a></li>
            <li><a href="#trainers" onClick={e => { e.preventDefault(); scrollTo('trainers') }}>მწვრთნელები</a></li>
            <li><a href="#pricing" onClick={e => { e.preventDefault(); scrollTo('pricing') }}>ფასები</a></li>
            <li><a href="#bmi" onClick={e => { e.preventDefault(); scrollTo('bmi') }}>BMI</a></li>
            <li><a href="#contact" onClick={e => { e.preventDefault(); scrollTo('contact') }}>კონტაქტი</a></li>
          </ul>
          <a href="#pricing" className="nav-cta" onClick={e => { e.preventDefault(); scrollTo('pricing') }}>შემოგვიერთდი</a>
          <button className="nav-mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="მენიუ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="mobile-menu" style={{ display: mobileOpen ? 'flex' : 'none' }}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="დახურვა">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        {['about|შესახებ', 'classes|ვარჯიშები', 'schedule|განრიგი', 'trainers|მწვრთნელები', 'pricing|ფასები', 'bmi|BMI', 'contact|კონტაქტი'].map(([id, label]) => (
          id === 'classes' ? (
            <Link key={id} href="/classes">{label}</Link>
          ) : (
            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a>
          )
        ))}
      </div>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-bg" style={{ backgroundImage: `url('${settings.heroBgImage}')` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">{settings.heroBadge}</div>
          <h1 className="display-campaign hero-title">
            {settings.heroTitle1}<br /><span className="accent">{settings.heroTitle2}</span>
          </h1>
          <p className="hero-subtitle">{settings.heroSubtitle}</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollTo('contact')}>
              {settings.heroCta1}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="btn-secondary" onClick={() => scrollTo('classes')}>{settings.heroCta2}</button>
          </div>
        </div>
        <div className="hero-scroll">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </section>

      {/* About */}
      <section className="section about" id="about">
        <div className="section-container">
          <div className="about-grid">
            <div className="about-image fade-in">
              <img src={settings.aboutImage} alt="X AREA FITNESS დარბაზი" loading="lazy" />
            </div>
            <div className="about-content fade-in">
              <div className="section-header">
                <span className="section-label">{settings.aboutLabel}</span>
                <h2 className="heading-xl section-title" dangerouslySetInnerHTML={{ __html: settings.aboutTitle }} />
              </div>
              <p className="body-md" style={{ color: 'var(--mute)' }}>{settings.aboutDescription}</p>
              <div className="about-features">
                {[
                  { icon: 'dumbbell', title: 'თანამედროვე აღჭურვილობა', desc: 'პრემიუმ ხარისხის ტრენაჟორები და თავისუფალი წონები' },
                  { icon: 'clock', title: 'ყოველდღე 9:00-23:59', desc: 'კვირაში 7 დღე, შენს მოხერხებულ დროს' },
                  { icon: 'users', title: 'ჯგუფური ვარჯიშები', desc: 'აერობიკა, ფუნქციური ვარჯიში და სხვა' },
                  { icon: 'shield', title: 'საუნა', desc: 'დასვენება და აღდგენა ვარჯიშის შემდეგ' },
                ].map((f, i) => (
                  <div key={i} className="about-feature">
                    <div className="about-feature-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: iconPaths[f.icon] || '' }} />
                    </div>
                    <div><h4>{f.title}</h4><p>{f.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section stats" id="stats">
        <div className="section-container">
          <div className="stats-grid">
            {[
              { value: '9.65', label: 'საშუალო შეფასება' },
              { value: '263+', label: 'კმაყოფილი წევრი' },
              { value: '15', label: 'საათი ყოველდღე' },
              { value: '7/7', label: 'კვირაში დღე' },
            ].map((s, i) => (
              <div key={i} className="stat-card fade-in">
                <div className="stat-number">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes */}
      <section className="section classes" id="classes">
        <div className="section-container">
          <div className="section-header fade-in">
            <span className="section-label">ვარჯიშები</span>
            <h2 className="heading-xl section-title">აირჩიე შენი<br />ვარჯიში</h2>
            <p className="body-md section-subtitle">ჯგუფური და ინდივიდუალური ვარჯიშები ყველა დონისთვის</p>
          </div>
          <div className="classes-grid">
            {classes.filter(c => c.is_active).map(c => (
              <div key={c.id} className="class-card fade-in">
                <div className="class-card-image">
                  {c.image_url && <img src={c.image_url} alt={c.name} loading="lazy" />}
                  {c.badge && <span className="class-card-badge" style={c.badge_color ? { background: c.badge_color } : undefined}>{c.badge}</span>}
                </div>
                <div className="class-card-body">
                  <h3 className="class-card-title">{c.name}</h3>
                  <p className="class-card-subtitle">{c.subtitle}</p>
                  <div className="class-card-meta">
                    {c.schedule_text && <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>{c.schedule_text}</span>}
                    {c.level && <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>{c.level}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
            <Link href="/classes" className="btn-secondary">ყველა ვარჯიშის ნახვა →</Link>
          </div>
        </div>
      </section>

      {/* Schedule */}
      {settings.scheduleEnabled && days.length > 0 && (
        <section className="section schedule" id="schedule">
          <div className="section-container">
            <div className="section-header fade-in">
              <span className="section-label">განრიგი</span>
              <h2 className="heading-xl section-title">კვირეული<br />განრიგი</h2>
              <p className="body-md section-subtitle">აირჩიე დრო და ვარჯიში</p>
            </div>
            <div className="schedule-tabs">
              {days.filter(d => d.is_active).map((day, i) => (
                <button key={day.id} className={`schedule-tab ${activeDay === i ? 'active' : ''}`} onClick={() => setActiveDay(i)}>{day.day_name}</button>
              ))}
            </div>
            {days.filter(d => d.is_active)[activeDay] && (
              <div className="schedule-list">
                {days.filter(d => d.is_active)[activeDay].classes.map(sc => (
                  <div key={sc.id} className="schedule-item">
                    <div className="schedule-time">{sc.time}</div>
                    <div><div className="schedule-class-name">{sc.name}</div><div className="schedule-class-trainer">{sc.trainer}</div></div>
                    {sc.level && <span className="schedule-level">{sc.level}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trainers */}
      <section className="section trainers" id="trainers">
        <div className="section-container">
          <div className="section-header fade-in">
            <span className="section-label">გუნდი</span>
            <h2 className="heading-xl section-title">პროფესიონალი<br />მწვრთნელები</h2>
            <p className="body-md section-subtitle">ჩვენი გუნდი დაგეხმარება მიზნების მიღწევაში</p>
          </div>
          <div className="trainers-grid">
            {trainers.filter(t => t.is_active).map(t => (
              <div key={t.id} className="trainer-card fade-in" onClick={() => setSelectedTrainer(t)}>
                <div className="trainer-card-image">
                  {t.image_url && <img src={t.image_url} alt={t.name} loading="lazy" />}
                </div>
                <div className="trainer-card-body">
                  <h3 className="trainer-card-name">{t.name}</h3>
                  <p className="trainer-card-role">{t.role}</p>
                  {t.price && <p className="trainer-card-price">{t.price} <span>/ {t.price_label}</span></p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainer Modal */}
      {selectedTrainer && (
        <div className="modal-overlay active" onClick={() => setSelectedTrainer(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTrainer(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="modal-hero">{selectedTrainer.image_url && <img src={selectedTrainer.image_url} alt="" />}</div>
            <div className="modal-body">
              <h3 className="modal-name">{selectedTrainer.name}</h3>
              <p className="modal-role">{selectedTrainer.role}</p>
              {selectedTrainer.specialization && (
                <div className="modal-section">
                  <h4>სპეციალიზაცია</h4>
                  <div className="modal-tags">
                    {selectedTrainer.specialization.split(', ').map((s, i) => <span key={i} className="modal-tag">{s}</span>)}
                  </div>
                </div>
              )}
              {selectedTrainer.experience && <div className="modal-section"><h4>გამოცდილება</h4><p>{selectedTrainer.experience}</p></div>}
              {selectedTrainer.bio && <div className="modal-section"><h4>შესახებ</h4><p>{selectedTrainer.bio}</p></div>}
              {selectedTrainer.price && (
                <div className="modal-section">
                  <h4>ფასი</h4>
                  <div className="modal-price-box">
                    <div><div className="modal-price">{selectedTrainer.price}</div><div className="modal-price-label">{selectedTrainer.price_label}</div></div>
                    <a href={`tel:${settings.phone}`} className="btn-primary" style={{ minWidth: 'auto' }}>ჩაწერა</a>
                  </div>
                </div>
              )}
              {selectedTrainer.schedule && (
                <div className="modal-section">
                  <h4>განრიგი</h4>
                  <div className="modal-schedule">
                    <div className="modal-schedule-item"><span className="day">{selectedTrainer.schedule}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BMI */}
      <section className="section bmi" id="bmi">
        <div className="section-container">
          <div className="section-header fade-in" style={{ textAlign: 'center' }}>
            <span className="section-label">BMI კალკულატორი</span>
            <h2 className="heading-xl section-title">გაიგე შენი<br />სხეულის მასის ინდექსი</h2>
            <p className="body-md section-subtitle" style={{ margin: 'var(--spacing-sm) auto 0' }}>შეიყვანე სიმაღლე და წონა — მიიღებ რეკომენდაციას</p>
          </div>
          <div className="bmi-grid">
            <div className="bmi-form fade-in">
              <div className="bmi-input-group">
                <label>სიმაღლე (სმ)</label>
                <input type="number" value={bmiHeight} onChange={e => setBmiHeight(e.target.value)} placeholder="მაგ: 175" min={100} max={250} />
              </div>
              <div className="bmi-input-group">
                <label>წონა (კგ)</label>
                <input type="number" value={bmiWeight} onChange={e => setBmiWeight(e.target.value)} placeholder="მაგ: 75" min={30} max={300} />
              </div>
              <button className="btn-primary" onClick={calcBmi} style={{ width: '100%', justifyContent: 'center' }}>გამოთვლა</button>
            </div>
            <div className="bmi-result fade-in" style={{ display: bmiVal !== null ? 'block' : 'none' }}>
              <div className="bmi-value">{bmiVal}</div>
              <div className="bmi-category">
                {bmiVal !== null ? (bmiVal < 18.5 ? 'წონის ნაკლებობა' : bmiVal < 25 ? 'ნორმალური წონა' : bmiVal < 30 ? 'ჭარბი წონა' : 'ობესობა') : ''}
              </div>
              <div className="bmi-bar">
                <div className="bmi-bar-fill" style={{
                  width: bmiVal !== null ? (bmiVal < 18.5 ? '15%' : bmiVal < 25 ? '40%' : bmiVal < 30 ? '65%' : '90%') : '0%',
                  background: bmiVal !== null ? (bmiVal < 18.5 ? 'var(--accent-cool)' : bmiVal < 25 ? 'var(--energy)' : bmiVal < 30 ? 'var(--accent-warm)' : 'var(--danger)') : 'transparent',
                }} />
              </div>
              <div className="bmi-ranges">
                {[
                  { id: 'bmiUnder', label: 'ნაკლები', range: '<18.5', active: bmiVal !== null && bmiVal < 18.5 },
                  { id: 'bmiNormal', label: 'ნორმა', range: '18.5-24.9', active: bmiVal !== null && bmiVal >= 18.5 && bmiVal < 25 },
                  { id: 'bmiOver', label: 'ჭარბი', range: '25-29.9', active: bmiVal !== null && bmiVal >= 25 && bmiVal < 30 },
                  { id: 'bmiObese', label: 'ობესობა', range: '30+', active: bmiVal !== null && bmiVal >= 30 },
                ].map(r => (
                  <div key={r.id} className={`bmi-range ${r.active ? 'active' : ''}`}>
                    <div className="label">{r.label}</div><div className="range">{r.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {settings.galleryEnabled && gallery.filter(g => g.is_active).length > 0 && (
        <section className="section gallery" id="gallery">
          <div className="section-container">
            <div className="section-header fade-in" style={{ textAlign: 'center' }}>
              <span className="section-label">გალერეა</span>
              <h2 className="heading-xl section-title">ტრანსფორმაციები</h2>
              <p className="body-md section-subtitle" style={{ margin: 'var(--spacing-sm) auto 0' }}>რეალური შედეგები ჩვენი წევრებისგან</p>
            </div>
            <div className="gallery-grid">
              {gallery.filter(g => g.is_active).map(g => (
                <div key={g.id} className="gallery-item fade-in">
                  <div className="gallery-comparison">
                    {g.before_url && <img src={g.before_url} alt="წინ" />}
                    {g.after_url && <img src={g.after_url} alt="შემდეგ" />}
                    <span className="gallery-label before">წინ</span>
                    <span className="gallery-label after">შემდეგ</span>
                  </div>
                  <div className="gallery-info">
                    <div className="gallery-name">{g.name}</div>
                    {g.result && <div className="gallery-result">{g.result}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="section pricing" id="pricing">
        <div className="section-container">
          <div className="section-header fade-in" style={{ textAlign: 'center' }}>
            <span className="section-label">ფასები</span>
            <h2 className="heading-xl section-title">აირჩიე შენი<br />გეგმა</h2>
            <p className="body-md section-subtitle" style={{ margin: 'var(--spacing-sm) auto 0' }}>მოქნილი წევრობის გეგმები შენი საჭიროებების მიხედვით</p>
          </div>
          <div className="pricing-grid">
            {plans.filter(p => p.is_active).map(p => (
              <div key={p.id} className={`pricing-card fade-in ${p.is_featured ? 'featured' : ''}`}>
                {p.badge && <div className="pricing-badge">{p.badge}</div>}
                <div className="pricing-name">{p.name}</div>
                <div className="pricing-price">{p.price}</div>
                <div className="pricing-period">{p.period}</div>
                <ul className="pricing-features">
                  {p.features.map((f, i) => (
                    <li key={i} className="pricing-feature">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={`tel:${settings.phone}`} className={p.is_featured ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', justifyContent: 'center' }}>{p.cta_text || 'დაგვიკავშირდი'}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.filter(t => t.is_active).length > 0 && (
        <section className="section testimonials" id="testimonials">
          <div className="section-container">
            <div className="section-header fade-in">
              <span className="section-label">შეფასებები</span>
              <h2 className="heading-xl section-title">რას ამბობენ<br />ჩვენი წევრები</h2>
            </div>
            <div className="testimonials-grid">
              {testimonials.filter(t => t.is_active).map(t => (
                <div key={t.id} className="testimonial-card fade-in">
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ))}
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.initials}</div>
                    <div><div className="testimonial-name">{t.client_name}</div>{t.date && <div className="testimonial-date">{t.date}</div>}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg" style={{ backgroundImage: `url('${settings.ctaBgImage}')` }} />
        <div className="cta-overlay" />
        <div className="section-container">
          <div className="cta-content fade-in">
            <h2 className="heading-xl cta-title" dangerouslySetInnerHTML={{ __html: settings.ctaTitle }} />
            <p className="cta-text">{settings.ctaText}</p>
            <div className="hero-buttons" style={{ justifyContent: 'flex-start' }}>
              <a href={`tel:${settings.phone}`} className="btn-primary">
                {settings.ctaCta1}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
              <button className="btn-secondary" onClick={() => scrollTo('pricing')}>{settings.ctaCta2}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section contact" id="contact">
        <div className="section-container">
          <div className="section-header fade-in" style={{ textAlign: 'center' }}>
            <span className="section-label">კონტაქტი</span>
            <h2 className="heading-xl section-title">დაგვიკავშირდი</h2>
            <p className="body-md section-subtitle" style={{ margin: 'var(--spacing-sm) auto 0' }}>დაგვისვი კითხვა ან ჩაეწერე ვარჯიშზე</p>
          </div>
          <div className="contact-grid">
            <form className="contact-form fade-in" onSubmit={submitForm}>
              <div className="form-group">
                <label>სახელი</label>
                <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} placeholder="შენი სახელი" />
              </div>
              <div className="form-group">
                <label>ტელეფონი</label>
                <input type="tel" required value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+995 5XX XXX XXX" />
              </div>
              <div className="form-group">
                <label>ინტერესი</label>
                <select value={formInterest} onChange={e => setFormInterest(e.target.value)}>
                  <option value="">აირჩიე...</option>
                  <option value="membership">წევრობა</option>
                  <option value="personal">პერსონალური ვარჯიში</option>
                  <option value="group">ჯგუფური ვარჯიში</option>
                  <option value="other">სხვა</option>
                </select>
              </div>
              <div className="form-group">
                <label>შეტყობინება</label>
                <textarea rows={4} value={formMessage} onChange={e => setFormMessage(e.target.value)} placeholder="რისი კითხვა გინდა?" />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>გაგზავნა</button>
              <div className={`form-success ${formSubmitted ? 'show' : ''}`}>✓ შეტყობინება გაგზავნილია! მალე დაგიკავშირდებით.</div>
            </form>
            <div className="contact-info fade-in">
              <div className="contact-info-card"><h4>მისამართი</h4><p>{settings.address}, {settings.city}</p></div>
              <div className="contact-info-card"><h4>ტელეფონი</h4><p><a href={`tel:${settings.phone}`}>{settings.phoneDisplay}</a></p></div>
              <div className="contact-info-card"><h4>სამუშაო საათები</h4><p>{settings.hours}</p></div>
              <div className="contact-info-card">
                <h4>სოციალური ქსელები</h4>
                <div className="footer-social" style={{ marginTop: 'var(--spacing-sm)' }}>
                  <a href={settings.facebook} target="_blank" rel="noopener" aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href={settings.instagram} target="_blank" rel="noopener" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                  <a href={`tel:${settings.phone}`} aria-label="ტელეფონი">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="map-container fade-in">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2998.5!2d42.6946!3d42.2679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s42%C2%B016'04.4%22N+42%C2%B041'40.6%22E!5e0!3m2!1sen!2sge!4v1" width="100%" height="300" style={{ border: 0, filter: 'grayscale(1) invert(1) contrast(1.1) brightness(0.6)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="X AREA FITNESS მდებარეობა" />
          </div>
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <svg viewBox="0 0 32 32" fill="none"><path d="M4 4L16 16L4 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M28 4L16 16L28 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="footer-logo-text">X <span>AREA FITNESS</span></span>
              </div>
              <p className="footer-description">ქუთაისის პრემიუმ ფიტნეს დარბაზი. ფიტნესი, საუნა და ჯგუფური ვარჯიშები — ყოველდღე 9:00-დან 23:59-მდე.</p>
              <div className="footer-social">
                <a href={settings.facebook} target="_blank" rel="noopener" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href={`tel:${settings.phone}`} aria-label="ტელეფონი">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-column">
              <h4>ვარჯიშები</h4>
              <ul className="footer-links">
                <li><a href="#classes" onClick={e => { e.preventDefault(); scrollTo('classes') }}>ფიტნეს დარბაზი</a></li>
                <li><a href="#classes" onClick={e => { e.preventDefault(); scrollTo('classes') }}>აერობიკა</a></li>
                <li><a href="#classes" onClick={e => { e.preventDefault(); scrollTo('classes') }}>ჯგუფური ვარჯიშები</a></li>
                <li><a href="#classes" onClick={e => { e.preventDefault(); scrollTo('classes') }}>საუნა</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>კონტაქტი</h4>
              <ul className="footer-links">
                <li><a href={`tel:${settings.phone}`}>{settings.phoneDisplay}</a></li>
                <li><a href="#">{settings.address}</a></li>
                <li><a href="#">{settings.city}</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>საათები</h4>
              <ul className="footer-links">
                <li><a href="#">{settings.hours}</a></li>
                <li><a href="#">ყოველდღე ღია</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright">© 2026 X AREA FITNESS. ყველა უფლება დაცულია.</p>
            <div className="footer-hours">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              {settings.hours}
            </div>
          </div>
        </div>
      </footer>

      {/* Admin link */}
      <Link href="/login" className="admin-link" title="ადმინ პანელი">⚙ Admin</Link>
    </div>
  )
}
