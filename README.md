# CrewDesk

> **Professional Crew Management for Film, TV and Events Production**

[![Expo Snack](https://img.shields.io/badge/Live%20Demo-Expo%20Snack-blue)](https://snack.expo.dev/@crewdesk/crewdesk-app)
[![Version](https://img.shields.io/badge/version-10.0-gold)](https://github.com/Ashtyn519/crewdesk-app)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey)](https://snack.expo.dev/@crewdesk/crewdesk-app)

---

## Overview

CrewDesk is a premium production management app built for film, TV and events professionals. Manage your entire production workflow from a single, beautifully designed interface — from pre-production through post.

**Live Demo:** [https://snack.expo.dev/@crewdesk/crewdesk-app](https://snack.expo.dev/@crewdesk/crewdesk-app)

---

## Features

### Business Dashboard
Real-time financial overview with revenue, pipeline, budget health scores, crew utilisation, and overdue invoice alerts.

### Freelancer Portal
Personal profile with skill tags, day rate, availability toggle, monthly earnings breakdown, upcoming shifts, and editable rate cards.

### Projects
Full CRUD project management with budget/spend tracking, animated progress bars, crew assignment, status filtering, and swipe-to-delete.

### Crew
Crew directory with availability toggle, role filtering, contract/rate card history, tags, and quick-action buttons.

### Schedule
Date-grouped shift calendar with type colour-coding, crew assignment, swipe gestures, and detailed shift sheets.

### Messages
Full thread-based messaging with real-time chat UI, gold/dark message bubbles, reply input bar, unread badges, and compose new conversations.

### Invoices
Invoice lifecycle management with bulk selection, file attachment simulation, due-date countdown alerts, status workflow buttons, and search/filter.

### Reports
Four-tab analytics: Financial summary, project budget bars, crew rate comparison, and shift activity breakdown — all with animated bars.

### More / Settings
App settings, data export hooks, integrations panel, feedback, and about screen.

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#050911` |
| Surface | `#0C1320` |
| Card | `#101828` |
| Gold (primary) | `#F59E0B` |
| Teal (secondary) | `#06B6D4` |
| Purple | `#8B5CF6` |
| Green | `#10B981` |
| Red | `#EF4444` |

---

## Tech Stack

- **React Native** (Expo SDK 54)
- **Expo Snack** (live web preview)
- **React Hooks** — useState, useRef, useEffect, useMemo
- **Animated API** — spring physics, PressCard scale, AnimBar width
- **PanResponder** — swipe-to-reveal gestures
- **KeyboardAvoidingView** — chat reply bar

---

## Screens

| # | Screen | Description |
|---|--------|-------------|
| 1 | Home | KPI dashboard, needs attention, activity feed |
| 2 | Business | Revenue analytics, overdue alerts, crew utilisation |
| 3 | Projects | CRUD projects, budget tracking, crew assignment |
| 4 | Crew | Directory, availability, rate cards, contracts |
| 5 | Schedule | Date-grouped shifts, type colour coding |
| 6 | Messages | Thread chat, reply, compose, unread badges |
| 7 | Invoices | Lifecycle workflow, bulk actions, file attachments |
| 8 | Reports | Animated financial and operational analytics |
| 9 | Portal | Freelancer profile, earnings, upcoming work |
| 10 | More | Settings, integrations, about |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Ashtyn519/crewdesk-app.git
cd crewdesk-app

# Install dependencies
npm install

# Start with Expo
npx expo start
```

Or open directly in [Expo Snack](https://snack.expo.dev/@crewdesk/crewdesk-app).

---

## Version History

| Version | Highlights |
|---------|-----------|
| v10.0 | Thread-based messaging, Business Dashboard, Freelancer Portal |
| v9.0 | Swipe gestures, bulk invoice, rate card history, activity feed |
| v8.0 | Invoice file attachments, due-date alerts, availability toggle |
| v7.0 | Search/filter, crew-project assignment, animated reports |
| v6.0 | Animated PressCards, avatar stacks, pull-to-refresh |
| v5.0 | Midnight navy palette, amber/teal design system |
| v4.0 | DEPT-inspired redesign, time tracking removed |

---

## Roadmap

- Push notifications for overdue invoices
- PDF invoice export
- iCloud / Google Drive file sync
- Zapier and Slack integrations
- Crew availability calendar view
- Multi-user / team accounts
- App Store submission (iOS + Android)

---

*Built with React Native and Expo. Designed for the modern production industry.*
