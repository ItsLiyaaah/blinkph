import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

type BookingForm = {
  fullName: string
  companyName: string
  email: string
  phone: string
  deliveryAddress: string
  pineappleType: string
  quantity: string
  deliveryDate: string
  notes: string
}

function App() {
  const [form, setForm] = useState<BookingForm>({
    fullName: '', companyName: '', email: '', phone: '',
    deliveryAddress: '', pineappleType: '', quantity: '',
    deliveryDate: '', notes: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Booking Request from ${form.fullName}`)
    const body = encodeURIComponent(
      `Full Name: ${form.fullName}\n` +
      `Company Name: ${form.companyName || 'N/A'}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n` +
      `Delivery Address: ${form.deliveryAddress}\n` +
      `Type of Pineapple: ${form.pineappleType}\n` +
      `Quantity Needed: ${form.quantity}\n` +
      `Preferred Delivery Date: ${form.deliveryDate}\n` +
      `Additional Notes: ${form.notes || 'None'}`
    )
    window.location.href = `mailto:info@blinkphilippines.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }
  return (
    <div className="app">
      {/* Navigation Header */}
      <header className="header">
        <div className="logo">
          <img
            src="/logo.ico.png"
            alt="Blink Logo"
            className="logo-img"
          />
        </div>
        
        <nav className="nav">
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact Us</a>
          <a href="#services" className="nav-link">Services</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero">
        <div className="hero-image">
          <div className="pineapple-container">
            <img 
              src="/10b7454b67e1b8bdf9f1b740996e3cc8-removebg-preview.png" 
              alt="Fresh Pineapple" 
              className="pineapple-img"
            />
          </div>

        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            Blink Philippines<br />
            International<br />
            OPC
          </h1>
          <p className="hero-tagline">"Taste the Fresh Tropics, Delivered"</p>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="section">
        <div className="section-content">
          <h2 className="section-title">About Us</h2>
          <p className="section-text">
            Blink Philippines International OPC is a one-person corporation situated in the Philippines. The company aims to be a global importer of high-quality pineapples, supplying markets across various countries. It sources its products from trusted tropical farms and ensures that only the freshest, ripest pineapples reach its customers.
          </p>
          <p className="section-text">
            Built on the values of sustainability, integrity, and excellence, we work directly with local farmers to ensure every product meets international quality standards while supporting the communities that grow them.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section section-alt">
        <div className="section-content">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Fresh Fruit Export</h3>
              <p>We export fresh, farm-to-ship tropical fruits including pineapples, mangoes, and bananas to international markets.</p>
            </div>
            <div className="service-card">
              <h3>Quality Assurance</h3>
              <p>Every batch is inspected and certified to meet global food safety and export quality standards.</p>
            </div>
            <div className="service-card">
              <h3>Logistics & Delivery</h3>
              <p>End-to-end cold chain logistics to ensure freshness from farm to your destination port.</p>
            </div>
            <div className="service-card">
              <h3>Custom Packaging</h3>
              <p>Flexible packaging solutions tailored to your brand and market requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Booking Section */}
      <section id="contact" className="section">
        <div className="section-content">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-text">Reach out through any channel below — we're ready to assist with your pineapple supply needs.</p>

          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-icon-wrap location">
                <span className="contact-icon">&#9679;</span>
              </div>
              <div className="contact-card-body">
                <div className="contact-card-label">Office Location</div>
                <h3>Davao City, Philippines</h3>
                <p>Oroderm City Strip Mall, Unit-205 Second Floor CM Recto Street, Davao City, Philippines, 8000</p>
                <a href="https://maps.google.com/?q=CM+Recto+Street+Davao+City+Philippines" target="_blank" rel="noopener noreferrer" className="contact-link">View on Map &rarr;</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon-wrap email">
                <span className="contact-icon">@</span>
              </div>
              <div className="contact-card-body">
                <div className="contact-card-label">Email Address</div>
                <h3>Send Us a Message</h3>
                <p><a href="mailto:blinkphilippines17@gmail.com">blinkphilippines17@gmail.com</a></p>
                <p><a href="mailto:director@blinkinternational.com.ph">director@blinkinternational.com.ph</a></p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon-wrap phone">
                <span className="contact-icon">&#9990;</span>
              </div>
              <div className="contact-card-body">
                <div className="contact-card-label">Phone & WhatsApp</div>
                <h3>Call or Message Us</h3>
                <p><a href="tel:09260439122">0926 043 9122</a></p>
                <p><a href="tel:+639178035323">+63 917 803 5323 (PH)</a></p>
                <a href="https://wa.me/639178035323" target="_blank" rel="noopener noreferrer" className="contact-link whatsapp-link">Chat on WhatsApp &rarr;</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon-wrap social">
                <span className="contact-icon">&#9670;</span>
              </div>
              <div className="contact-card-body">
                <div className="contact-card-label">Social Media</div>
                <h3>Follow Our Updates</h3>
                <a href="https://www.facebook.com/profile.php?id=61574300693480" target="_blank" rel="noopener noreferrer" className="contact-social-link"><span className="social-badge facebook">f</span> blinkphilippinesinternational</a>
                <a href="https://instagram.com/blinkphilippinesinternational" target="_blank" rel="noopener noreferrer" className="contact-social-link"><span className="social-badge instagram">◉</span> blinkphilippinesinternational</a>
              </div>
            </div>
          </div>

          <div className="booking-cta">
            <div className="booking-cta-text">
              <h3>Ready to place an order?</h3>
              <p>Fill out our booking form and we'll get back to you with confirmation and final pricing.</p>
            </div>
            <Link to="/booking" className="submit-btn booking-cta-btn">Start a Transaction →</Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="section section-alt">
        <div className="section-content">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"The pineapples we received were incredibly fresh and of exceptional quality. Blink Philippines has become our go-to supplier for tropical produce."</p>
              <div className="review-author">
                <span className="review-name">James Whitfield</span>
                <span className="review-role">Procurement Manager, FreshMart UK</span>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"Outstanding service from start to finish. The logistics were seamless and every pineapple arrived in perfect condition. Highly recommended."</p>
              <div className="review-author">
                <span className="review-name">Yuki Tanaka</span>
                <span className="review-role">Import Director, TropicaFoods Japan</span>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"We've partnered with many suppliers but none match the consistency and freshness that Blink Philippines delivers every single time."</p>
              <div className="review-author">
                <span className="review-name">Sofia Reyes</span>
                <span className="review-role">CEO, Tropic Select Canada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Blink Philippines International OPC. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
