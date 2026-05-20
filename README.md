<p align="center">
  <img src="https://img.shields.io/badge/STATUS-OPERATIONAL-brightgreen?style=flat-square&labelColor=0d110d&color=4db84d" />
  <img src="https://img.shields.io/badge/REGION-MAHARASHTRA-blue?style=flat-square&labelColor=0d110d&color=1a6ef5" />
  <img src="https://img.shields.io/badge/NDRF-INTEGRATED-red?style=flat-square&labelColor=0d110d&color=cc3333" />
  <img src="https://img.shields.io/badge/BUILD-VITE + REACT-orange?style=flat-square&labelColor=0d110d&color=e89040" />
</p>

<h1 align="center">
  🔴 RESQ — Disaster Management System
</h1>

<p align="center">
  <strong>Hyperlocal disaster management for Maharashtra.</strong><br/>
  Live hazard mapping · AI-powered guidance · Community-driven safe zone tracking — all in real time.
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Landing Page](#1--landing-page---operational-command-center)
  - [Interactive Disaster Map](#2--interactive-disaster-map)
  - [Hazard Filter System](#3--hazard-filter-system)
  - [Real-Time Incident Feed](#4--real-time-incident-feed)
  - [Safe Zone & Capacity Tracking](#5--safe-zone--capacity-tracking)
  - [AI Assistant Drawer](#6--ai-assistant-drawer)
  - [Hazard Reporting](#7--community-hazard-reporting)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Data Coverage](#data-coverage)
- [Design Philosophy](#design-philosophy)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

## Overview

**ResQ** is a real-time disaster response dashboard designed specifically for **Maharashtra, India**. It provides emergency responders, NDRF teams, and citizens with a live operational view of hazards, evacuation zones, safe shelters, and infrastructure status across the state.

The system covers **6 major disaster categories**:
- 🌊 **Coastal hazards** — Cyclones, storm surges (Mumbai, Ratnagiri, Sindhudurg)
- 🏔️ **Landslides** — Western Ghats (Mahabaleshwar, Lonavala, Raigad)
- 🌊 **River basin floods** — Krishna, Mutha, Sangli basins
- 🔥 **Industrial fires** — MIDC plant zones (Pimpri-Chinchwad, Bhiwandi)
- 🌍 **Seismic activity** — Koyna Dam, Latur earthquake zones
- 🧬 **Biological hazards** — Water contamination alerts

---

## Key Features

### 1. 🖥️ Landing Page — Operational Command Center

The landing page serves as a **mission control interface** with a military-inspired brutalist aesthetic.

| Zone | Description |
|------|-------------|
| **Topbar** | ResQ logo with cross-hair icon, pulsing LIVE badge, version indicator |
| **Breaking Ticker** | Auto-scrolling alert feed with real-time critical incident headlines |
| **Hero Section** | Centred RESQ title with glitch animation (every 3s) and mission description |
| **Stats Bar** | 4-column grid: Active Users, Critical Alerts, Safe Zones, System Uptime — with animated count-up on load |
| **Three-Column Panel** | Live incidents list, radar scanner visualization, quick access controls |
| **Footer** | System status with blinking critical alerts indicator |

**Animations included:**
- ① **Glitch title** — `::before`/`::after` pseudo-element clip-path glitch every 3 seconds
- ② **Stat counter roll-up** — easeOutCubic count-up with staggered delays
- ③ **Radar sweep** — Canvas-rendered rotating sweep arm with blip detection
- ⑤ **Typewriter boot** — Character-by-character terminal boot sequence
- ⑨ **CTA shimmer** — Gradient sweep on the ENTER RESQ button

---

### 2. 🗺️ Interactive Disaster Map

The full-screen Leaflet map displays **Maharashtra state-level disaster data** with a custom military-green tile theme.

- **Base tiles:** CartoDB Dark Matter + CSS filter pipeline
  ```css
  filter: sepia(0.6) hue-rotate(90deg) saturate(0.35) brightness(0.45) contrast(1.1);
  ```
- **Overlay:** Green screen blend for cohesive military ops aesthetic
- **Default view:** State-level zoom (level 7) centred at `[18.5, 75.0]`
- **10 danger zones** with red pulsing circle overlays
- **6 safe zones** with green circles and capacity data
- **16 active hazard markers** with severity-coded colors
- **Grid overlay** with subtle green lines for tactical feel

---

### 3. 🎛️ Hazard Filter System

A semantically color-coded filter bar lets users focus on specific disaster types:

| Filter | Border Color | Text Color | Use Case |
|--------|-------------|------------|----------|
| ALL HAZARDS | Solid red `#e03e3e` | White | Default view — show everything |
| FLOOD | `#1a6ef5` | `#5a9fff` | River floods, coastal flooding |
| EARTHQUAKE | `#c07020` | `#e89040` | Seismic events, landslides |
| FIRE | `#cc3333` | `#f06060` | Industrial fires, wildfires |
| BIOLOGICAL | `#2a8a40` | `#50bb70` | Contamination alerts |
| TRANSPORT | `#5a7a8a` | `#88b0cc` | Road blockages |
| WEATHER | `#5a8a7a` | `#80ccb0` | Cyclones, storm warnings |

Filters are applied across both **map markers** and the **incident feed** simultaneously.

---

### 4. 📡 Real-Time Incident Feed

The right sidebar displays a scrollable incident feed with **12 tracked events**:

- **Severity badges:** CRITICAL (red), HIGH (amber), MEDIUM (yellow), SAFE (green)
- **Status indicators:** ACTIVE, OPEN, UNVERIFIED
- **Capacity bars** on safe zone entries (color-coded: green < 70%, amber 70–89%, red ≥ 90%)
- **Unverified reports** section with community-submitted alerts
- Each incident shows: type icon, title, distance, time ago, status

---

### 5. 🏥 Safe Zone & Capacity Tracking

Real-time monitoring of **6 relief shelters** across Maharashtra:

| Shelter | Location | Capacity |
|---------|----------|----------|
| Pune NDRF Base Camp | Pune | 42% 🟢 |
| Mumbai Relief Center | Worli | 78% 🟡 |
| Kolhapur Evacuation Camp | Kolhapur | 65% 🟢 |
| Nagpur Civil Hospital | Nagpur | 55% 🟢 |
| Aurangabad Relief Point | Aurangabad | 38% 🟢 |
| Ratnagiri SDRF Camp | Ratnagiri | 91% 🔴 |

Capacity bars use dynamic coloring:
- 🟢 **Green** (`#4db84d`) — Below 70%
- 🟡 **Amber** (`#e89040`) — 70% to 89%
- 🔴 **Red** (`#cc3333`) — 90% and above (near full)

---

### 6. 🤖 AI Assistant Drawer

A slide-out AI assistant panel for natural language disaster queries:

- Ask about specific zones, evacuation routes, or shelter availability
- Terminal-inspired interface with monospace typography
- Accessible from the quick-access pills on the landing page

---

### 7. 📝 Community Hazard Reporting

Citizens can submit hazard reports directly from the map:

- **Report button** with warning icon (`⚠ REPORT HAZARD`)
- Reports appear as **unverified** until confirmed by authorities
- Supports hazard type selection, severity rating, and description

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + Vite 6 |
| **Mapping** | Leaflet + React-Leaflet |
| **Tiles** | CartoDB Dark Matter (CSS-filtered) |
| **Styling** | Vanilla CSS with CSS custom properties |
| **Typography** | Share Tech Mono, Space Grotesk, Bebas Neue |
| **Animations** | CSS keyframes + Canvas API (radar) |
| **Deployment** | Vercel |
| **Mobile App** | React Native + Expo (in `resq/`) |

---

## Project Structure

```
RESQ-Disaster-management-system/
├── resq-web/                    # Web application (Vite + React)
│   ├── src/
│   │   ├── App.jsx              # Root — Landing ↔ Map routing
│   │   ├── main.jsx             # Entry point
│   │   ├── index.css            # Global styles & keyframes
│   │   └── screens/
│   │       ├── LandingPage.jsx  # 6-zone command center layout
│   │       ├── LandingPage.css  # Landing styles & animations
│   │       ├── MapApp.jsx       # Full disaster map + data
│   │       └── MapApp.css       # Map theme, overlays, sidebar
│   ├── package.json
│   └── vite.config.js
│
├── resq/                        # React Native mobile app
│   ├── App.tsx                  # Mobile app entry
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── navigation/          # Stack navigator
│   │   ├── screens/             # Mobile screens
│   │   └── theme.ts             # Design tokens
│   └── package.json
│
├── vercel.json                  # Deployment config
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/shravanipatangrao97-dotcom/RESQ-Disaster-management-system.git
cd RESQ-Disaster-management-system

# Install web app dependencies
cd resq-web
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production

```bash
cd resq-web
npm run build    # Output → resq-web/dist/
npm run preview  # Preview production build
```

---

## Deployment

The project is configured for **Vercel** deployment with automatic builds on push.

```json
// vercel.json
{
  "buildCommand": "cd resq-web && npm install && npm run build",
  "outputDirectory": "resq-web/dist",
  "framework": "vite"
}
```

**To deploy:**
1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Vercel auto-detects `vercel.json` and deploys from `resq-web/`
3. Every push to `main` triggers a new deployment

---

## Data Coverage

### Geographic Scope: Maharashtra, India

```
┌─────────────────────────────────────────────┐
│  MAHARASHTRA DISASTER MONITORING GRID       │
│                                             │
│  ● Nagpur (Biological)                      │
│                                             │
│  ● Aurangabad (Transport)                   │
│                                             │
│  ● Latur (Seismic Zone)                     │
│                                             │
│  ● Pune (NDRF Base)    ● Mumbai (Coastal)   │
│  ● Lonavala (Landslide)                     │
│  ● Mahabaleshwar (Landslide)                │
│                                             │
│  ● Kolhapur (Flood)    ● Sangli (Flood)     │
│  ● Koyna (Seismic)                          │
│  ● Ratnagiri (Cyclone)                      │
│  ● Sindhudurg (Storm Surge)                 │
└─────────────────────────────────────────────┘
```

---

## Design Philosophy

ResQ follows a **"Brutalist Ops"** design language:

- **Dark military-green theme** — Reduces eye strain in emergency operations
- **Monospace typography** — Evokes terminal/command-line authority
- **High-contrast severity coding** — Critical = Red, High = Amber, Safe = Green
- **Minimal decoration** — Every pixel serves a functional purpose
- **0.5px borders** — Ultra-thin lines for structured, grid-like layouts
- **Scanline overlays** — CRT-inspired texture for ops immersion
- **CSS-filtered map tiles** — Custom color pipeline for cohesive dark theme

---

## Future Roadmap

- [ ] **Real-time data** — WebSocket integration for live NDRF/IMD feeds
- [ ] **Push notifications** — Critical alert push via Firebase Cloud Messaging
- [ ] **Offline mode** — Service Worker + cached map tiles for no-connectivity areas
- [ ] **Multi-language** — Marathi, Hindi, English support
- [ ] **Evacuation routing** — AI-powered route planning avoiding hazard zones
- [ ] **Community verification** — Crowdsource hazard report validation
- [ ] **Mobile app** — Complete React Native app (foundation in `resq/`)
- [ ] **State persistence** — Zustand for cross-navigation state management

---

## License

This project is developed for the **Google Solution Hackathon**.

© 2025 ResQ — Maharashtra, India · NDRF Integrated

---

<p align="center">
  <strong>⚠ SYSTEM OPERATIONAL — 3 CRITICAL ALERTS ACTIVE</strong>
</p>
