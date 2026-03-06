import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import emailjs from '@emailjs/browser'
import './BookingPage.css'

// ── EmailJS config ─────────────────────────────────────────────
// 1. Sign up at https://www.emailjs.com (free – 200 emails/month)
// 2. Add a Gmail service  → copy the Service ID
// 3. Create an email template → copy the Template ID
// 4. Go to Account > API Keys → copy the Public Key
const EMAILJS_SERVICE_ID  = 'service_s2my4s3'
const EMAILJS_TEMPLATE_ID = 'template_cvrc63e'
const EMAILJS_PUBLIC_KEY  = 'kF-16Rc84gZ7ec0z1'

const COUNTRIES = [
  { name: 'Afghanistan', code: 'AF', dial: '+93' },
  { name: 'Albania', code: 'AL', dial: '+355' },
  { name: 'Algeria', code: 'DZ', dial: '+213' },
  { name: 'Argentina', code: 'AR', dial: '+54' },
  { name: 'Australia', code: 'AU', dial: '+61' },
  { name: 'Austria', code: 'AT', dial: '+43' },
  { name: 'Bahrain', code: 'BH', dial: '+973' },
  { name: 'Bangladesh', code: 'BD', dial: '+880' },
  { name: 'Belgium', code: 'BE', dial: '+32' },
  { name: 'Brazil', code: 'BR', dial: '+55' },
  { name: 'Cambodia', code: 'KH', dial: '+855' },
  { name: 'Canada', code: 'CA', dial: '+1' },
  { name: 'Chile', code: 'CL', dial: '+56' },
  { name: 'China', code: 'CN', dial: '+86' },
  { name: 'Colombia', code: 'CO', dial: '+57' },
  { name: 'Czech Republic', code: 'CZ', dial: '+420' },
  { name: 'Denmark', code: 'DK', dial: '+45' },
  { name: 'Egypt', code: 'EG', dial: '+20' },
  { name: 'Finland', code: 'FI', dial: '+358' },
  { name: 'France', code: 'FR', dial: '+33' },
  { name: 'Germany', code: 'DE', dial: '+49' },
  { name: 'Ghana', code: 'GH', dial: '+233' },
  { name: 'Greece', code: 'GR', dial: '+30' },
  { name: 'Hong Kong', code: 'HK', dial: '+852' },
  { name: 'Hungary', code: 'HU', dial: '+36' },
  { name: 'India', code: 'IN', dial: '+91' },
  { name: 'Indonesia', code: 'ID', dial: '+62' },
  { name: 'Iran', code: 'IR', dial: '+98' },
  { name: 'Iraq', code: 'IQ', dial: '+964' },
  { name: 'Ireland', code: 'IE', dial: '+353' },
  { name: 'Israel', code: 'IL', dial: '+972' },
  { name: 'Italy', code: 'IT', dial: '+39' },
  { name: 'Japan', code: 'JP', dial: '+81' },
  { name: 'Jordan', code: 'JO', dial: '+962' },
  { name: 'Kenya', code: 'KE', dial: '+254' },
  { name: 'Kuwait', code: 'KW', dial: '+965' },
  { name: 'Malaysia', code: 'MY', dial: '+60' },
  { name: 'Mexico', code: 'MX', dial: '+52' },
  { name: 'Morocco', code: 'MA', dial: '+212' },
  { name: 'Myanmar', code: 'MM', dial: '+95' },
  { name: 'Netherlands', code: 'NL', dial: '+31' },
  { name: 'New Zealand', code: 'NZ', dial: '+64' },
  { name: 'Nigeria', code: 'NG', dial: '+234' },
  { name: 'Norway', code: 'NO', dial: '+47' },
  { name: 'Oman', code: 'OM', dial: '+968' },
  { name: 'Pakistan', code: 'PK', dial: '+92' },
  { name: 'Philippines', code: 'PH', dial: '+63' },
  { name: 'Poland', code: 'PL', dial: '+48' },
  { name: 'Portugal', code: 'PT', dial: '+351' },
  { name: 'Qatar', code: 'QA', dial: '+974' },
  { name: 'Romania', code: 'RO', dial: '+40' },
  { name: 'Russia', code: 'RU', dial: '+7' },
  { name: 'Saudi Arabia', code: 'SA', dial: '+966' },
  { name: 'Singapore', code: 'SG', dial: '+65' },
  { name: 'South Africa', code: 'ZA', dial: '+27' },
  { name: 'South Korea', code: 'KR', dial: '+82' },
  { name: 'Spain', code: 'ES', dial: '+34' },
  { name: 'Sri Lanka', code: 'LK', dial: '+94' },
  { name: 'Sweden', code: 'SE', dial: '+46' },
  { name: 'Switzerland', code: 'CH', dial: '+41' },
  { name: 'Taiwan', code: 'TW', dial: '+886' },
  { name: 'Thailand', code: 'TH', dial: '+66' },
  { name: 'Turkey', code: 'TR', dial: '+90' },
  { name: 'Ukraine', code: 'UA', dial: '+380' },
  { name: 'United Arab Emirates', code: 'AE', dial: '+971' },
  { name: 'United Kingdom', code: 'GB', dial: '+44' },
  { name: 'United States', code: 'US', dial: '+1' },
  { name: 'Vietnam', code: 'VN', dial: '+84' },
]

const TRUCK_RATES: Record<string, { capacityTons: number; logisticsUSD: number }> = {
  '6-Wheeler (~3–5 tons)':              { capacityTons: 4,    logisticsUSD: 400  },
  '10-Wheeler (~8–10 tons)':            { capacityTons: 9,    logisticsUSD: 800  },
  '18-Wheeler / Trailer (~15–20 tons)': { capacityTons: 17.5, logisticsUSD: 1400 },
  'Refrigerated Truck':                 { capacityTons: 8,    logisticsUSD: 1100 },
}

// Product price per ton (USD) by delivery country — $400 (nearest) to $800 (farthest)
const COUNTRY_RATE_PER_TON: Record<string, number> = {
  // Zone A – Southeast Asia
  'Cambodia': 400, 'Indonesia': 400, 'Malaysia': 400, 'Myanmar': 400,
  'Singapore': 400, 'Thailand': 400, 'Vietnam': 400,
  // Zone B – East Asia
  'China': 500, 'Hong Kong': 500, 'Japan': 500, 'South Korea': 500, 'Taiwan': 500,
  // Zone C – South Asia
  'Bangladesh': 550, 'India': 550, 'Pakistan': 550, 'Sri Lanka': 550,
  // Zone D – Oceania & Middle East
  'Australia': 600, 'Bahrain': 600, 'Iraq': 600, 'Iran': 600, 'Israel': 600,
  'Jordan': 600, 'Kuwait': 600, 'New Zealand': 600, 'Oman': 600, 'Qatar': 600,
  'Saudi Arabia': 600, 'United Arab Emirates': 600,
  // Zone E – Eastern Europe
  'Czech Republic': 680, 'Greece': 680, 'Hungary': 680, 'Poland': 680,
  'Romania': 680, 'Russia': 680, 'Ukraine': 680,
  // Zone F – Western Europe
  'Austria': 720, 'Belgium': 720, 'Denmark': 720, 'Finland': 720, 'France': 720,
  'Germany': 720, 'Ireland': 720, 'Italy': 720, 'Netherlands': 720, 'Norway': 720,
  'Portugal': 720, 'Spain': 720, 'Sweden': 720, 'Switzerland': 720, 'United Kingdom': 720,
  // Zone G – Africa
  'Algeria': 760, 'Egypt': 760, 'Ghana': 760, 'Kenya': 760, 'Morocco': 760,
  'Nigeria': 760, 'South Africa': 760,
  // Zone H – Americas
  'Argentina': 800, 'Brazil': 800, 'Canada': 800, 'Chile': 800, 'Colombia': 800,
  'Mexico': 800, 'United States': 800,
}
const DEFAULT_RATE_PER_TON = 600 // USD fallback for unlisted countries

function calcCost(truckType: string, truckCount: string, deliveryCountry: string) {
  const rate = TRUCK_RATES[truckType]
  const count = parseInt(truckCount) || 0
  if (!rate || count === 0) return null
  const totalTons = rate.capacityTons * count
  const totalKg = totalTons * 1000
  const ratePerTon = COUNTRY_RATE_PER_TON[deliveryCountry] ?? DEFAULT_RATE_PER_TON
  const productCost = totalTons * ratePerTon
  const logisticsCost = rate.logisticsUSD * count
  return {
    totalKg,
    productCost,
    logisticsCost,
    total: productCost + logisticsCost,
    capacityTons: totalTons,
    ratePerTon,
  }
}

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

type BookingForm = {
  fullName: string
  companyName: string
  email: string
  phoneCode: string
  phoneNumber: string
  deliveryCountry: string
  deliveryAddress: string
  pineappleType: string
  truckType: string
  truckCount: string
  deliveryDate: Date | null
  notes: string
}

function BookingPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<BookingForm>({
    fullName: '', companyName: '', email: '',
    phoneCode: '+63', phoneNumber: '',
    deliveryCountry: '', deliveryAddress: '',
    pineappleType: '', truckType: '', truckCount: '', deliveryDate: null, notes: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [step, setStep] = useState<1 | 2>(1)
  const cost = calcCost(form.truckType, form.truckCount, form.deliveryCountry)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = COUNTRIES.find(c => c.name === e.target.value)
    setForm({ ...form, deliveryCountry: e.target.value, phoneCode: selected ? selected.dial : form.phoneCode })
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSending(true)
    setSendError('')
    const fullPhone = `${form.phoneCode} ${form.phoneNumber}`
    const costInfo = cost
      ? `Product: ${fmt(cost.productCost)} ($${cost.ratePerTon}/ton) | Logistics: ${fmt(cost.logisticsCost)} | Total: ${fmt(cost.total)}`
      : 'N/A'
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          full_name:      form.fullName,
          company_name:   form.companyName || 'N/A',
          email:          form.email,
          phone:          fullPhone,
          country:        form.deliveryCountry,
          address:        form.deliveryAddress,
          pineapple_type: form.pineappleType,
          truck_type:     form.truckType,
          truck_count:    form.truckCount,
          delivery_date:  form.deliveryDate ? form.deliveryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified',
          cost_estimate:  costInfo,
          notes:          form.notes || 'None',
        },
        EMAILJS_PUBLIC_KEY
      )
      setSubmitted(true)
    } catch (err) {
      console.error('EmailJS error:', err)
      setSendError('Failed to send. Please try again or email us directly.')
    } finally {
      setSending(false)
    }
  }

  const resetForm = () => {
    setForm({ fullName: '', companyName: '', email: '', phoneCode: '+63', phoneNumber: '', deliveryCountry: '', deliveryAddress: '', pineappleType: '', truckType: '', truckCount: '', deliveryDate: null, notes: '' })
    setSubmitted(false)
    setStep(1)
  }

  return (
    <div className="booking-page">
      <header className="booking-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
        <img src="/logo.ico.png" alt="Blink Logo" className="booking-logo" />
      </header>

      <div className="booking-container">
        <div className="booking-intro">
          <h1>Start a Transaction</h1>
          <p>Fill out the form below to request a pineapple supply booking. We'll review your request and respond via email with confirmation and pricing details.</p>
        </div>

        <div className="booking-steps">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-line" />
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        {submitted ? (
          <div className="booking-success">
            <div className="success-icon">✓</div>
            <h3>Request Sent!</h3>
            <p>Your booking request has been submitted. We'll be in touch shortly at <strong>{form.email}</strong>.</p>
            <div className="success-actions">
              <button className="submit-btn" onClick={resetForm}>Submit Another Request</button>
              <button className="back-home-btn" onClick={() => navigate('/')}>Back to Home</button>
            </div>
          </div>
        ) : step === 1 ? (
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-section-label">Personal Information</div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                <input type="text" id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label htmlFor="companyName">Company Name <span className="optional">(optional)</span></label>
                <input type="text" id="companyName" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Your company or business" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number <span className="required">*</span></label>
                <div className="phone-input-row">
                  <select name="phoneCode" value={form.phoneCode} onChange={handleChange} className="phone-code-select" aria-label="Phone country code">
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.dial}>{c.dial} ({c.name})</option>
                    ))}
                  </select>
                  <input type="tel" id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Local number" required className="phone-number-input" />
                </div>
              </div>
            </div>

            <div className="form-section-label">Delivery Details</div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deliveryCountry">Delivery Country <span className="required">*</span></label>
                <select id="deliveryCountry" name="deliveryCountry" value={form.deliveryCountry} onChange={handleCountryChange} required>
                  <option value="">Select a country</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="deliveryAddress">Delivery Address <span className="required">*</span></label>
                <input type="text" id="deliveryAddress" name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} placeholder="City, province, or full address" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pineappleType">Type of Pineapple <span className="required">*</span></label>
                <select id="pineappleType" name="pineappleType" value={form.pineappleType} onChange={handleChange} required>
                  <option value="">Select a variety</option>
                  <option value="MD2/MG3 Pineapple">MD2/MG3 Pineapple</option>
                  <option value="Queen Pineapple">Queen Pineapple</option>
                  <option value="Smooth Cayenne">Smooth Cayenne</option>
                  <option value="Formosa Pineapple">Formosa Pineapple</option>
                  <option value="Other / Not Sure">Other / Not Sure</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="truckType">Truck Type <span className="required">*</span></label>
                <select id="truckType" name="truckType" value={form.truckType} onChange={handleChange} required>
                  <option value="">Select truck type</option>
                  <option value="6-Wheeler (~3–5 tons)">6-Wheeler (~3–5 tons)</option>
                  <option value="10-Wheeler (~8–10 tons)">10-Wheeler (~8–10 tons)</option>
                  <option value="18-Wheeler / Trailer (~15–20 tons)">18-Wheeler / Trailer (~15–20 tons)</option>
                  <option value="Refrigerated Truck">Refrigerated Truck</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="truckCount">Number of Trucks <span className="required">*</span></label>
                <input type="number" id="truckCount" name="truckCount" value={form.truckCount} onChange={handleChange} placeholder="e.g. 2" min="1" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
              <label htmlFor="deliveryDate">Preferred Delivery Date <span className="required">*</span></label>
              <DatePicker
                id="deliveryDate"
                selected={form.deliveryDate}
                onChange={(date: Date | null) => setForm({ ...form, deliveryDate: date })}
                minDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
                placeholderText="Select a date"
                dateFormat="MMMM d, yyyy"
                className="datepicker-input"
                calendarClassName="custom-calendar"
                popperPlacement="right-start"
                required
                autoComplete="off"
              />
              <p className="field-hint">Earliest available date is 1 month from today. This allows sufficient time for order processing, quality checks, and logistics coordination.</p>
              </div>
              <div className="form-group" />
            </div>

            <div className="form-section-label">Additional Information</div>
            <div className="form-group">
              <label htmlFor="notes">Additional Notes <span className="optional">(optional)</span></label>
              <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={4} placeholder="Special requests, packaging preferences, or any other instructions..." />
            </div>

            <div className="form-actions">
              <button type="button" className="submit-btn" onClick={() => setStep(2)}>Next: Review Estimate →</button>
              <p className="form-notice">Review your order summary and estimated cost before submitting.</p>
            </div>
          </form>
        ) : (
            <div className="cost-summary">
              <h2 className="cost-title">Order Summary & Estimate</h2>
              <p className="cost-disclaimer">This is a <strong>sample estimate only</strong>. Final pricing will be confirmed by our team after reviewing your request.</p>

              <div className="summary-grid">
                <div className="summary-section">
                  <h3>Contact Details</h3>
                  <div className="summary-row"><span>Name</span><span>{form.fullName}</span></div>
                  {form.companyName && <div className="summary-row"><span>Company</span><span>{form.companyName}</span></div>}
                  <div className="summary-row"><span>Email</span><span>{form.email}</span></div>
                  <div className="summary-row"><span>Phone</span><span>{form.phoneCode} {form.phoneNumber}</span></div>
                </div>
                <div className="summary-section">
                  <h3>Delivery Details</h3>
                  <div className="summary-row"><span>Country</span><span>{form.deliveryCountry}</span></div>
                  <div className="summary-row"><span>Address</span><span>{form.deliveryAddress}</span></div>
                  <div className="summary-row"><span>Delivery Date</span><span>{form.deliveryDate ? form.deliveryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span></div>
                </div>
                <div className="summary-section">
                  <h3>Order Details</h3>
                  <div className="summary-row"><span>Pineapple Type</span><span>{form.pineappleType}</span></div>
                  <div className="summary-row"><span>Truck Type</span><span>{form.truckType}</span></div>
                  <div className="summary-row"><span>No. of Trucks</span><span>{form.truckCount}</span></div>
                  {cost && <div className="summary-row"><span>Est. Capacity</span><span>~{cost.capacityTons.toLocaleString()} tons ({cost.totalKg.toLocaleString()} kg)</span></div>}
                </div>
              </div>

              {cost && (
                <div className="cost-breakdown">
                  <h3>Estimated Cost Breakdown</h3>
                  <div className="cost-row"><span>Product Cost <em>(${cost.ratePerTon}/ton)</em></span><span>{fmt(cost.productCost)}</span></div>
                  <div className="cost-row"><span>Logistics & Trucking</span><span>{fmt(cost.logisticsCost)}</span></div>
                  <div className="cost-row cost-total"><span>Estimated Total</span><span>{fmt(cost.total)}</span></div>
                  <p className="cost-note">* Rates are indicative. Actual pricing may vary based on market conditions, distance, and volume discounts.</p>
                </div>
              )}

              {sendError && <p className="send-error">{sendError}</p>}
              <div className="cost-actions">
                <button type="button" className="back-home-btn" onClick={() => setStep(1)} disabled={sending}>← Back to Edit</button>
                <button type="button" className="submit-btn" onClick={handleSubmit} disabled={sending}>
                  {sending ? 'Sending…' : 'Confirm & Submit Request'}
                </button>
              </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default BookingPage

