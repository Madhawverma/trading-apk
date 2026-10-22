# ProTrade Mobile — Professional Trading Terminal

[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo%20SDK-57-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platforms-Android%20%7C%20iOS-brightgreen?style=for-the-badge)](https://expo.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An institutional-grade, cross-platform mobile trading terminal built with **React Native**, **TypeScript**, and **Expo**. Designed for lightning-fast execution, low-latency market data visualization, and an authentic multi-asset mobile trading experience.

---

## 📸 Key Terminal Modules

| **Trading Terminal & Charts** | **Real-Time Accounts & Funds** | **Global Economic Calendar** |
|:---:|:---:|:---:|
| Interactive SVG Candlestick & Area charts with M1–D1 timeframes and live tick execution. | Multi-tier Real & Demo accounts, equity calculation, floating P&L, and quick funding. | Macroeconomic release calendar with 16+ high-impact events, vector flags, and forecast analysis. |

---

## ⚡ Core Features

### 1. Multi-Asset Real-Time Market Feed
- **Sub-Second Tick Updates**: Live bid/ask quote engine simulating institutional order book spreads.
- **Comprehensive Asset Coverage**:
  - **Forex**: EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, EUR/GBP
  - **Precious Metals**: XAU/USD (Gold), XAG/USD (Silver) with authentic dual-overlapping asset insignias
  - **Global Indices**: USTEC (Nasdaq 100), US30 (Dow Jones), DE30 (DAX 40), JP225 (Nikkei), HK50
  - **Energies & Commodities**: USOIL (WTI Crude), UKOIL (Brent)
  - **Cryptocurrencies**: BTC/USD, ETH/USD with 24h market volume tracking
- **Dynamic Category Filtering**: Favorites, Most Traded, Top Movers, Majors, Metals, Crypto, Indices, Stocks, and Energies.

### 2. High-Performance Financial Charting
- **Dual Visual Modes**: Seamless toggle between Japanese Candlestick charts and smoothed Area Line charts.
- **Multi-Timeframe Controls**: M1, M5, M15, H1, H4, and D1 bar resolutions.
- **Interactive Price Tracking**: Real-time crosshair cursor, high/low horizontal reference bounds, and live spread indicators.

### 3. One-Tap Order Execution Engine
- **Market & Limit Execution**: Instant Buy and Sell drawers with micro-lot precision (from 0.01 lots).
- **Risk Management**: Configurable Stop Loss (SL) and Take Profit (TP) with projected monetary gain/loss calculators.
- **Margin Validation**: Real-time required margin and leverage verification before dispatching orders.
- **Active Positions Monitor**: Real-time floating P&L calculation in USD with one-tap instant position liquidation.

### 4. Comprehensive Account & Portfolio Center
- **Account Details & Metrics**:
  - Live Balance, Equity, Margin, Free Margin, and Margin Level metrics.
  - One-tap quick actions: **Deposit**, **Withdraw**, **History**, and **Transfer**.
- **Trading Platform Connectivity**:
  - MetaTrader 5 server configurations (`Server: MT5Real11`, Login ID `#478501477`).
  - Max leverage up to `1:200` / `1:2000 Unlimited`.
  - Commission transparency (`0.00 USD` on Standard accounts) and minimum spread tracking.
- **Demo & Real Switching**: Seamless toggle between Demo MT5 ($10,000 capital) and Real trading profiles.

### 5. Macroeconomic Insights & Economic Calendar
- **Live Economic Calendar**: Filter global events by **High Impact 🔥**, **Today**, **Tomorrow**, and **This Week**.
- **Vector Country Flags**: Crisp SVG national roundels for USA, Eurozone, UK, Japan, Canada, Australia, Germany, Switzerland, and Turkey.
- **Detailed Impact Metrics**: Forecast vs. Previous consensus, actual release figures, and direct links to affected trading instruments.
- **Market Movers & Technical Signals**: Curated intraday bullish/bearish technical analysis with pivot, target, and stop levels.

### 6. Regulatory & Legal Transparency
- Integrated **Legal Documents Center** featuring:
  - Client Agreement
  - General Business Terms
  - Partnership Agreement
  - Complaints Procedure
  - Risk Disclosure
  - Anti-Money Laundering (AML/CFT) Policy
  - Key Facts Statement

---

## 🏗 Architecture & Project Structure

```
├── assets/                          # App icons, adaptive launcher graphics & splash assets
│   ├── icon.png                     # High-res 1024x1024 application icon
│   ├── android-icon-foreground.png  # Adaptive icon safe-zone foreground
│   └── splash-icon.png              # Splash emblem
├── src/
│   ├── components/                  # UI screens & interactive components
│   │   ├── AccountsScreen.tsx       # Portfolio overview, carousel & open positions
│   │   ├── AccountDetailsModal.tsx  # 1:1 Funds & Settings breakdown screen
│   │   ├── TradeScreen.tsx          # Watchlist, category tabs & search engine
│   │   ├── TradingChart.tsx         # SVG Candlestick & Area charting canvas
│   │   ├── OrderModal.tsx           # Order execution drawer with SL/TP calculation
│   │   ├── InsightsScreen.tsx       # Economic calendar, signals & market movers
│   │   ├── ProfileScreen.tsx        # Profile settings, support hub & legal center
│   │   ├── LegalDocumentsModal.tsx  # Full legal document reading suite
│   │   ├── PerformanceScreen.tsx    # Trading analytics & historical metrics
│   │   ├── CurrencyIcon.tsx         # Universal vector pair & flag badges
│   │   ├── SplashScreen.tsx         # Zero-latency splash animation with native lock
│   │   └── Header.tsx               # Top navigation & balance badge
│   ├── context/
│   │   └── TradingContext.tsx       # Global state: quotes, accounts, orders & P&L
│   ├── constants/
│   │   └── theme.ts                 # Modern color tokens & typography scale
│   └── types/
│       └── trading.ts               # Core TypeScript models & order interfaces
├── App.tsx                          # Root container with safe-area & status bar management
├── app.json                         # Expo configuration
├── eas.json                         # Cloud build profiles for Android & iOS
└── package.json                     # Project dependencies & runtime scripts
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- [Expo Go](https://expo.dev/go) on your mobile device (iOS or Android)

### Installation
Clone the repository and install project dependencies:

```bash
git clone https://github.com/Madhawverma/trading-apk.git
cd trading-apk
npm install
```

### Running Locally

Launch the Expo development server:

```bash
npm start
# or
npx expo start
```

- **Physical Android / iOS device**: Open the **Expo Go** app and scan the QR code printed in the terminal.
- **Android Emulator**: Press `a` in the terminal.
- **iOS Simulator**: Press `i` in the terminal.
- **Web Preview**: Press `w` in the terminal.

### Verification & Health Check

```bash
# Typecheck TypeScript files
npx tsc --noEmit

# Diagnose Expo configuration & dependencies
npx expo-doctor
```

---

## 📦 Building Standalone APK & iOS Binaries

This project is configured with [Expo Application Services (EAS)](https://expo.dev/eas) for automated cloud compilation. Local Android Studio or Xcode installations are **not required**.

### 1. Direct Installable Android APK
Run the following command to generate an installable `.apk` file:

```bash
npx eas-cli build -p android --profile preview
```

### 2. Standalone iOS Ad-Hoc Build
```bash
npx eas-cli build -p ios --profile preview
```

---

## 🎨 Design System & UI Philosophy

- **High-Contrast Dark & Light Harmonies**: Deep black canvas with vibrant accents (`#FFDE00`, `#00A868`, `#D9383A`) tailored for clarity under varying ambient conditions.
- **Native-Speed Visualizations**: Pure SVG path rendering for charts and sparklines ensuring smooth 60fps interaction on mobile hardware.
- **Zero-Glitch Launch Cycle**: Dual-tier splash handling via `expo-splash-screen` ensuring zero white flashes during initialization.

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).
