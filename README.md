# CrewDesk

> **Professional Crew Management for Film, TV and Events Production**

![Live Demo](https://img.shields.io/badge/Live%20Demo-Expo%20Snack-000000?style=flat-square&logo=expo)
![Version](https://img.shields.io/badge/version-11.0-F59E0B?style=flat-square)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-06B6D4?style=flat-square)

---

## Overview

CrewDesk is a premium production management app built for film, TV and events professionals. Manage your entire production workflow from a single, beautifully designed interface - from pre-production through post.

**Live Demo:** https://snack.expo.dev/@crewdesk/crewdesk-app

---

## Features

### Business Dashboard
Real-time financial overview with revenue, pipeline, budget health scores, crew utilisation, and overdue invoice alerts.

### Projects
Full project lifecycle management. Create, edit and track productions with budget tracking, progress bars, priority flags, and crew assignment.

### Crew
Complete crew roster management. Profiles with ratings, skills, bio, day rates, and availability status. Full CRUD with search and department filtering.

### Schedule
Interactive week calendar view. Add, edit and remove shifts with crew picker, project assignment, time, location and status fields.

### Messages
Thread-based chat system. Real chat bubbles, reply bar, unread badges, compose new conversations, delete threads.

### Invoices
Professional invoice management with VAT calculation, file attachment simulation, status tracking (draft/sent/paid/overdue) and mark-as-paid functionality.

### Reports
Three-tab analytics dashboard covering Finance (monthly revenue/cost charts, top clients), Projects (budget breakdown, progress tracking), and Crew (utilisation by department, top rated crew).

### Freelancer Portal
Personal profile card with availability toggle, earnings charts, rate cards (half-day/full-day/weekly), upcoming shifts, and recent invoices.

### More / Settings
Account management, preferences (notifications, dark mode, currency), integrations list, support links, and app stats.

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#04080F` |
| Surface | `#0A1020` |
| Card | `#0F1A2E` |
| Gold | `#F59E0B` |
| Teal | `#06B6D4` |
| Purple | `#A78BFA` |
| Green | `#10B981` |
| Red | `#EF4444` |

Design inspired by DEPT Agency, Newsprint editorial layouts, and TurboTax notification patterns.

---

## Tech Stack

- **React Native** with Expo SDK 54
- **State management:** React hooks (useState, useRef)
- **Animations:** Animated API with spring physics
- **Navigation:** Custom scrollable tab bar (10 tabs)
- **Modals:** KeyboardAvoidingView bottom sheets
- **No external dependencies**

---

## Screens

| Screen | Description |
|--------|-------------|
| Home / Dashboard | KPI overview, today's shifts, active projects, activity feed |
| Business | Financial overview, revenue charts, crew utilisation |
| Projects | Full CRUD project management with search and filters |
| Crew | Roster management with expandable profiles |
| Schedule | Week calendar with shift management |
| Messages | Thread-based chat with real-time bubbles |
| Invoices | Invoice lifecycle with VAT, file attachments |
| Reports | Finance, projects and crew analytics |
| Freelancer Portal | Personal earnings, rate cards, availability |
| More | Settings, preferences, integrations |

---

## Getting Started

```bash
# View live demo
open https://snack.expo.dev/@crewdesk/crewdesk-app

# Run locally
npx expo start
```

---

## Version History

| Version | Key Changes |
|---------|-------------|
| v11.0 | Full rebuild: clean architecture, all 10 screens, zero errors, polished CRUD |
| v10.0 | Fixed Messages (thread chat), Business Dashboard, Freelancer Portal |
| v9.0 | SwipeRow gestures, bulk invoice selection, crew rate cards |
| v8.0 | Invoice file upload, improved animations, full CRUD audit |
| v7.0 | Reports screen, revenue charts, top clients |
| v6.0 | Schedule calendar view, shift management |
| v5.0 | Improved colour system, production-ready polish |
| v4.0 | Removed Time Tracking, DEPT-inspired design overhaul |

---

## Roadmap

- Push notifications for shift reminders and invoice due dates
- Real file upload with document picker
- Xero and QuickBooks integration
- Calendar sync (Google Calendar, iCal)
- Multi-user roles and permissions
- Dark/light theme toggle
- Offline support with AsyncStorage
- Native iOS and Android app store builds

---

*Built with Expo SDK 54. No external UI libraries. Pure React Native.*
