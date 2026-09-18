# MailSense — Email Validation & Intelligence Platform

> Built for Indian businesses, marketers, and developers who need professional-grade email validation at an accessible price.

## Problem Statement

Every business that does email marketing, runs sign-up forms, or manages customer data faces the same hidden problem — their email list is dirty, and they don't know it until it's too late.

### The Core Problems

**1. Typos and misspellings destroy deliverability**

A customer types `priya@gamil.com` instead of `priya@gmail.com`. The email looks valid. It passes basic checks. It sits in the database. The campaign goes out and that contact never receives anything. The business loses a real customer not because of bad marketing but because of one mistyped letter. Studies show 10–15% of manually entered emails contain domain typos.

**2. Invalid emails cause bounce rates to spike**

An email like `someone@notrealdomain.xyz` can have a perfectly correct format but still be completely undeliverable because the domain has no mail servers. Basic format checkers don't catch this. Only an MX record lookup can confirm a domain is real. When businesses send to these addresses they get hard bounces. Too many hard bounces and Gmail starts sending all their emails to spam — including the good ones.

**3. Disposable emails inflate numbers with zero value**

People signing up for free trials, contests, or gated content routinely use temporary email services like `mailinator.com` or `tempmail.com`. These addresses expire within hours. They make sign-up numbers look good while delivering zero real engagement, zero conversions, and zero long-term value.

**4. Duplicate entries waste money and damage relationships**

The same email appears multiple times under different names, different form submissions, or different campaign sources. The business pays to send to it multiple times. The customer receives the same email twice or three times and marks it as spam.

**5. Affordable India-first alternatives are limited**

Tools that solve these problems exist, but many are primarily priced for international markets. For Indian startups, small D2C brands, and freelance marketers, an India-focused pricing model with INR and UPI payments can provide a more accessible alternative.

**6. Existing tools validate but never correct**

Many validation tools identify invalid addresses but may not provide typo-correction suggestions. They reject `user@gamil.com` and move on. The business loses that contact permanently.

**7. No actionable reports after validation**

Validation results are often presented as raw tables, making it difficult to quickly understand overall list health, identify major issues, or share results with a team or client.

**8. No visibility during bulk processing**

When businesses upload thousands of emails for validation, they stare at a loading spinner with no idea how long it will take or what is happening.

---

## Solution

MailSense is an email validation and intelligence platform that validates, corrects, scores, cleans, and reports on email data — built specifically for Indian businesses.

### How It Solves Each Problem

**Typo correction** — detects common domain typos using the Levenshtein distance algorithm and suggests the likely correct version. Achieved 100% accuracy on a manually tested set of 10 predefined domain-typo cases, with an average response time of ~622ms.

**MX record check** — performs a live DNS lookup to verify whether the email domain has configured mail servers.

**Disposable detection** — maintains a blocklist of 31 known disposable and temporary email providers and flags them automatically.

**Duplicate removal** — scans uploaded CSV files and removes duplicate entries before download.

**India pricing** — plans starting at ₹499/month, payments via Razorpay supporting UPI, no USD card required.

**PDF validation report** — after bulk CSV processing, users can download a professional PDF report showing list health score out of 100, complete summary numbers, and top issues found.

**Real time progress bar** — instead of staring at a loading spinner, users see a live progress bar showing exactly how many emails have been processed using Server-Sent Events.

**Actionable insights** — after validation the dashboard shows plain language summaries of what was wrong with the list and why.

---

## What MailSense Is Not

- It is not an email sending platform
- It does not replace Mailchimp or SendGrid
- It is not an enterprise tool with complex setup
- It does not use any external AI API for core validation

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| DNS module | Live MX record lookups |
| Multer | CSV file uploads |
| csv-parser | Parse uploaded CSV files |
| PDFKit | Generate PDF validation reports |
| Razorpay | Payment integration |
| dotenv | Environment variable management |
| nodemon | Development auto-restart |

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js | UI framework |
| React Router | Page navigation |
| Axios | API calls to backend |
| React Toastify | Toast notifications |
| CSS | Component styling |
| Razorpay Checkout | Payment UI |

### Algorithms & Logic
| Feature | How it works |
|---------|-------------|
| Typo correction | Levenshtein distance algorithm with ≤2 threshold |
| MX record check | Live DNS lookup using Node.js dns module |
| Disposable detection | Blocklist of 31 known disposable providers |
| Scoring engine | Rule based scoring system out of 100 |
| Duplicate removal | Set based deduplication on CSV upload |
| Health score | Formula based on valid, invalid and disposable ratio |
| PDF generation | PDFKit server side report generation |
| Progress tracking | Server-Sent Events for real time updates |

---

## Features

- ✅ Single email validation with instant results
- ✅ Format check
- ✅ Live MX record verification via DNS lookup
- ✅ Typo detection and correction — 100% accuracy on 10 predefined test cases
- ✅ Disposable email detection across 31 providers
- ✅ Trust score out of 100 for every email
- ✅ Bulk CSV upload and validation
- ✅ Duplicate email removal
- ✅ Download cleaned email list as CSV
- ✅ Real time progress bar using Server-Sent Events
- ✅ Actionable insights dashboard
- ✅ PDF validation report with health score
- ✅ Razorpay payment integration with UPI support
- ✅ India first pricing in rupees
- ✅ REST API for developer integration

---

## Testing Results

| Test | Result |
|------|--------|
| Typo correction accuracy | 100% (10/10 test cases) |
| Average API response time | 622ms |
| Disposable detection | 31 providers blocked |
| MX record verification | Live DNS lookup |

---

## Pricing Plans

| Plan | Price | Validations |
|------|-------|-------------|
| Free | ₹0/forever | 50/month |
| Starter | ₹499/month | 5,000/month |
| Pro | ₹1,299/month | 25,000/month |

---

## Future Improvements

- MongoDB-based user accounts and validation history
- JWT authentication and API key management
- AI-assisted email risk analysis
- Queue-based processing for large datasets
- Expanded disposable-email provider database

---

## Live Demo

- Frontend: [https://mailsense-fawn.vercel.app/](https://mailsense-fawn.vercel.app/)
- Backend: [https://mailsense-backend.onrender.com](https://mailsense-backend.onrender.com)
- GitHub: [https://github.com/shrutibhardwaj22/mailsense](https://github.com/shrutibhardwaj22/mailsense)

---

## Developer

Built by **Shruti Bhardwaj**
- GitHub: [github.com/shrutibhardwaj22](https://github.com/shrutibhardwaj22)

---

*MailSense is not an email sending platform. It is the tool you use to clean your list before you send it anywhere.*