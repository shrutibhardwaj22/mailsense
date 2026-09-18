import React from 'react';
import './Pricing.css';

function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      color: 'plan-free',
      features: [
        '50 email validations/month',
        'Single email validation',
        'Format & MX check',
        'Typo correction',
        'No CSV upload',
        'No API access',
      ],
      buttonText: 'Get Started Free',
      buttonClass: 'btn-free',
      popular: false,
    },
    {
      name: 'Starter',
      price: '₹499',
      period: 'per month',
      color: 'plan-starter',
      features: [
        '5,000 email validations/month',
        'Single & bulk CSV validation',
        'Format, MX & disposable check',
        'Typo correction',
        'Download cleaned CSV',
        'No API access',
      ],
      buttonText: 'Subscribe — ₹499/mo',
      buttonClass: 'btn-starter',
      popular: true,
    },
    {
      name: 'Pro',
      price: '₹1,299',
      period: 'per month',
      color: 'plan-pro',
      features: [
        '25,000 email validations/month',
        'Everything in Starter',
        'REST API access',
        'Real-time form integration',
        'Priority support',
        'Usage analytics',
      ],
      buttonText: 'Subscribe — ₹1,299/mo',
      buttonClass: 'btn-pro',
      popular: false,
    },
  ];

  const handlePayment = (plan) => {
    if (plan.name === 'Free') {
      alert('Free plan activated!');
      return;
    }

    // Razorpay test mode
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: plan.name === 'Starter' ? 49900 : 129900,
      currency: 'INR',
      name: 'MailSense',
      description: `${plan.name} Plan - Monthly`,
      image: '',
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#4f46e5',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="pricing-container">

      {/* Header */}
      <div className="pricing-header">
        <h1 className="pricing-heading">Simple, Honest Pricing</h1>
        <p className="pricing-subheading">
          No USD pricing. No foreign card needed. Pay via UPI in seconds.
        </p>
      </div>

      {/* Plans */}
      <div className="plans-grid">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`plan-card ${plan.color} ${plan.popular ? 'plan-popular' : ''}`}
          >
            {plan.popular && (
              <div className="popular-badge">Most Popular</div>
            )}
            <h2 className="plan-name">{plan.name}</h2>
            <div className="plan-price">
              {plan.price}
              <span className="plan-period"> / {plan.period}</span>
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, j) => (
                <li key={j} className="plan-feature-item">
                  <span className="feature-check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`plan-btn ${plan.buttonClass}`}
              onClick={() => handlePayment(plan)}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Razorpay Script */}
      {!document.getElementById('razorpay-script') && (() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.id = 'razorpay-script';
        document.body.appendChild(script);
        return null;
      })()}

      {/* FAQ */}
      <div className="faq-section">
        <h2 className="faq-heading">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {[
            {
              q: 'How do I pay?',
              a: 'Via Razorpay — supports UPI, credit/debit cards, and net banking. No foreign card needed.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. Cancel from your account settings anytime. No questions asked.',
            },
            {
              q: 'What counts as one validation?',
              a: 'Each email address checked counts as one validation, whether single or bulk.',
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes — the Free plan gives you 50 validations every month at no cost forever.',
            },
          ].map((item, i) => (
            <div key={i} className="faq-card">
              <h3 className="faq-question">{item.q}</h3>
              <p className="faq-answer">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Note */}
      <div className="test-mode-note">
        💳 Payments currently in <strong>test mode</strong> — no real charges will be made
      </div>

    </div>
  );
}

export default Pricing;