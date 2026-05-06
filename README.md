# 🍌 Cha-Ching

> **Personal finance that feels like a Sunday morning, not a spreadsheet.**

Cha-Ching is the antithesis of a traditional, sterile banking app. It's a warm, bouncy, and highly interactive web application designed to help you track your savings and expenses—while actually enjoying the process. 

Say goodbye to intimidating charts and grayscale data tables. Say hello to **Chico**.

## 🐒 Meet Chico (The Emotional Engine)

At the heart of Cha-Ching is Chico the monkey, your personal financial conscience. He doesn't just show you numbers; he *feels* them. As you adjust your budget and savings rate, Chico's expression updates in real-time.

He has five dynamic states:
- 👑 **Rich Mode**: You're saving like a banana baron.
- 🌴 **Thriving**: You're outsaving most of your peers. Keep climbing.
- 😐 **Okay-ish**: We're doing fine, but we could do better.
- 😰 **Stressed**: Cutting it pretty close. One emergency away from a bad time.
- 😱 **Shocked (Banana Red Alert)**: We need to have a serious chat about your spending.

## ✨ Features

- **Fluid & Responsive UI**: A beautiful, desktop-first (yet mobile-friendly) interface built with Tailwind CSS, featuring warm colors and gorgeous typography (`Instrument Serif`).
- **Interactive Drag-and-Drop Budgeting**: Allocate your expenses into visual "bubbles" and drag them around to see how they affect your bottom line.
- **Dream Tracker**: Visualize your long-term goals (Boracay trips, new phones, emergency funds) and see exactly how many months it will take to achieve them based on your current savings rate.
- **Dynamic Insights Dashboard**: Tweak your savings rate on the fly and watch your projections compound instantly.
- **Talk to Chico**: A conversational interface for getting quick advice and making adjustments to your budget.

## 🚀 Getting Started

Ready to get your finances in order? Let's go.

### Prerequisites

You'll need [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (if you haven't already).
2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the App Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 
*(If port 3000 is occupied, Next.js will automatically try 3001, 3002, etc. Just check your terminal output!)*

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org) (React)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (Semantic tokens & fluid responsive design)
- **Animations & Graphics**: SVG-based dynamic components (Chico is fully rendered and animated via React state)
- **Typography**: Google Fonts (`Instrument Serif` & `Inter` via `next/font`)

---
*Built with love (and a lot of bananas). 🍌*
