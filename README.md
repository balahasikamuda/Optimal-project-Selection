# InvestOptima – Smart Investment Project Selection System

> **A modern, responsive Decision Support System for Corporate Capital Budgeting and Portfolio Optimization.**

![React](https://img.shields.io/badge/Frontend-React_18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/Language-TypeScript_5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Bundler-Vite-646cff?logo=vite)

---

## 🎯 Overview

In capital budgeting, organizations evaluate multiple capital investment projects under budget constraints and management limits. 

**InvestOptima** is a high-performance web application designed to help finance executives and project managers:
* Evaluate investment projects using standard financial metrics: **Net Present Value (NPV)**, **Internal Rate of Return (IRR)**, **Payback Period**, and **Profitability Index (PI)**.
* Optimize capital allocation subject to **Available Capital Budget** and **Maximum Number of Funded Projects**.
* Perform real-time **Discount Rate Sensitivity Stress-Testing** and inspect portfolio cash flow trajectories.

All calculations and optimizations run **100% in the browser** without requiring an external backend or database server.

---

## 🚀 Application Sections

### 1. Dashboard
* Executive overview of total evaluated capital proposals vs. funded allocation.
* Maximized expected portfolio return (NPV) and average portfolio IRR.
* Financial viability screening (Viable vs. Value-Destructive projects).
* Top project candidates ranked by Capital Efficiency (Profitability Index).

### 2. Investment Projects
* Interactive catalog of investment projects across diverse industry sectors (Renewable Energy, Healthcare, Technology, Manufacturing, Infrastructure, R&D).
* Search, filter by sector, and sort by financial metrics.
* Add and edit project proposals with a live financial estimate preview.
* Expandable row views showing year-by-year cash flows and discounted cash flow schedules.
* **Export to CSV** for reporting and presentation.

### 3. Optimizer
* Set capital constraints:
  * **Available Investment Budget** ($50,000 to $1,500,000 slider and manual input).
  * **Maximum Number of Projects** (cardinality limit slider and input).
* Click **"Optimize Portfolio"** or adjust sliders to dynamically calculate the optimal project combination.
* View **Selected Optimal Portfolio** with individual project outlays, NPV contribution, and payback periods.
* View **Unselected Proposals** with clear business explanations for exclusion (e.g., budget cap, project limit reached, negative NPV).

### 4. Analytics
* **Cumulative Cash Flow & Breakeven Curve**: Identifies the portfolio's payback year and tracks net cash flow recovery.
* **Budget Allocation Donut**: Visual breakdown of capital expenditure across funded projects.
* **Risk vs. Return Frontier**: Scatter chart of IRR (%) vs. Risk Level (1–5).
* **Discount Rate Sensitivity Simulator**: Interactive slider (5% to 22%) to test portfolio resilience against cost-of-capital shifts.

---

## 🛠️ How to Run Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* npm

### Running the Application

1. Open your terminal in the project directory:
   ```bash
   cd c:\Users\mrhar\OneDrive\Desktop\InvestOptima
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   **`http://localhost:3000/`**

---

## 📁 Project Architecture

```
InvestOptima/
├── src/
│   ├── components/
│   │   ├── analytics/
│   │   │   └── AnalyticsTab.tsx     # Cash flow curves, budget charts & sensitivity
│   │   ├── dashboard/
│   │   │   ├── DashboardTab.tsx     # Executive KPIs & viability summary
│   │   │   └── StatCard.tsx         # Reusable KPI card
│   │   ├── layout/
│   │   │   └── Navbar.tsx           # 4-tab navigation (Dashboard, Projects, Optimizer, Analytics)
│   │   ├── optimizer/
│   │   │   └── OptimizerTab.tsx     # Budget & project limit optimizer
│   │   └── projects/
│   │       ├── ProjectListTab.tsx   # Project table, CSV export, search & filters
│   │       └── ProjectModal.tsx     # Add/Edit modal with live preview
│   ├── data/
│   │   └── sampleProjects.ts        # Pre-loaded realistic sample projects
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── utils/
│   │   ├── financialEngine.ts       # NPV, IRR, Payback, PI formulas
│   │   ├── formatters.ts            # Currency, percentage & risk formatting
│   │   └── knapsackOptimizer.ts     # Dual-constrained 0/1 knapsack optimizer
│   ├── App.tsx                      # Root state management & tabs
│   ├── index.css                    # Tailwind CSS directives
│   └── main.tsx                     # Entry point
├── index.html                       # HTML template
├── package.json                     # Dependencies & scripts
├── tailwind.config.js               # Design tokens
├── tsconfig.json                    # TypeScript compiler config
└── vite.config.ts                   # Vite bundler config
```
