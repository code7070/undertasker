# Schedule PWA - Product Requirements Document

## 1. Overview

A Progressive Web App for daily schedule management that can be installed to homescreen, with focus on ease of access and offline-first approach.

---

## 2. Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Storage**: localStorage (with sync-able structure for future online sync)
- **PWA**: Service Worker + Web Manifest

---

## 3. Core Features

### 3.1 Schedule Management

#### Create Schedule

- Input: Title, Date, Time, Recurrence type
- Recurrence options:
  - None (one-time)
  - Daily
  - Weekly (same day every week)
  - Monthly (same date every month)
- Auto-generate unique ID (UUID format for sync compatibility)
- Timestamps: createdAt, updatedAt

#### Edit Schedule

- Modify any field
- Update `updatedAt` timestamp
- Handle recurrence:
  - "Edit this only" - create exception
  - "Edit all future" - update recurring rule

#### Delete Schedule

- Soft delete with `deletedAt` timestamp (sync-friendly)
- Options: "Delete this only" or "Delete all recurring"

#### Complete Schedule

- Toggle completed status
- Show visual indicator (checkmark)
- Completed items remain visible with different styling

---

### 3.2 Daily View

**Primary Interface**

- Show schedules for selected date
- Sort by time (ascending)
- Visual separator for past/current/future items
- Current time indicator

**Display Elements**

- Time (24h format)
- Title
- Recurrence indicator icon (if applicable)
- Completion checkbox
- Quick actions: Edit, Delete

---

### 3.3 Calendar Navigation

- Date picker to jump to specific date
- Quick nav: Today, Tomorrow, +1 week
- Show indicator on dates with schedules

---

### 3.4 UI/UX Requirements

**Design Principles**

- Minimalist & clean
- Dark mode default
- Fast & responsive interactions
- Touch-friendly (min 44px touch targets)

**Color System**

- Implement CSS variables for theming
- Palette structure:
  ```css
  --bg-primary
  --bg-secondary
  --surface
  --surface-hover
  --text-primary
  --text-secondary
  --accent
  --accent-hover
  --success
  --warning
  --danger
  --border
  ```

**shadcn Components to Use**

- Button
- Input
- Select
- Dialog
- Calendar
- Checkbox
- Card
- Dropdown Menu

---

## 4. Data Structure

### 4.1 Schedule Object

```typescript
interface Schedule {
  id: string; // UUID v4
  userId: string | null; // null for local, populated on sync
  title: string;
  date: string; // ISO date: "2024-01-15"
  time: string; // 24h format: "14:30"
  recurrence: {
    type: "none" | "daily" | "weekly" | "monthly";
    interval: number; // default 1, for future: every 2 days, etc
    endDate: string | null; // optional end date
  };
  completed: boolean;
  completedAt: string | null; // ISO timestamp
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  deletedAt: string | null; // soft delete timestamp
  syncStatus: "synced" | "pending" | "conflict"; // for future sync
  version: number; // conflict resolution
}
```

### 4.2 Storage Strategy

**localStorage Keys**

- `schedules`: Array of all schedule objects
- `app_settings`: User preferences (theme, notifications, etc)
- `sync_metadata`: Last sync timestamp, user ID, etc (future use)

**Indexing Strategy**

- In-memory index by date for fast filtering
- Recalculate on app load and every mutation

---

## 5. PWA Requirements

### 5.1 Web Manifest

```json
{
  "name": "Daily Schedule",
  "short_name": "Schedule",
  "description": "Your daily schedule manager",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 5.2 Service Worker

- Cache-first strategy for app shell
- Network-first for data (future API calls)
- Offline fallback page

### 5.3 Install Prompt

- Detect if app can be installed
- Show custom install prompt (dismissable)
- Track install status

---

## 6. Development Phases

### Phase 1: MVP ✅

- Basic CRUD schedules (one-time only)
- Daily view with date picker
- Complete/uncomplete toggle
- Dark mode with CSS variables
- localStorage persistence

### Phase 2: Recurrence 🎯

- Daily recurrence
- Weekly recurrence
- Monthly recurrence
- Recurrence editing logic

### Phase 3: PWA 📱

- Service worker setup
- Web manifest
- Install prompt
- Offline support
- App icon & splash screen

### Phase 4: Polish ✨

- Notifications/reminders (future)
- Search/filter schedules
- Categories/tags (future)
- Export/import data

### Phase 5: Sync (Future) 🌐

- Backend API integration
- Real-time sync
- Conflict resolution
- Multi-device support

---

## 7. Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn components
│   ├── ScheduleList.jsx       # List of schedules
│   ├── ScheduleItem.jsx       # Individual schedule item
│   ├── AddScheduleDialog.jsx  # Create new schedule
│   ├── EditScheduleDialog.jsx # Edit existing schedule
│   ├── DatePicker.jsx         # Date navigation
│   └── InstallPrompt.jsx      # PWA install prompt
├── hooks/
│   ├── useSchedules.js        # Schedule CRUD operations
│   ├── useLocalStorage.js     # localStorage abstraction
│   └── usePWA.js              # PWA install detection
├── lib/
│   ├── storage.js             # localStorage wrapper
│   ├── schedule.js            # schedule logic (recurrence, etc)
│   └── utils.js               # utility functions
├── styles/
│   └── globals.css            # Tailwind + CSS variables
├── App.jsx
└── main.jsx

public/
├── manifest.json
├── sw.js                      # Service worker
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## 8. Key Considerations

### Performance

- Lazy load components
- Virtualize list if schedules > 100 items
- Debounce search/filter inputs

### Accessibility

- Keyboard navigation support
- ARIA labels
- Focus management in modals
- Screen reader friendly

### Data Integrity

- Validate input (date, time format)
- Handle timezone (store UTC, display local)
- Backup before mutations
- Error boundaries

### Future Sync Compatibility

- Never mutate IDs
- Always use timestamps
- Soft delete only
- Version tracking for conflict resolution

---

## 9. Success Metrics

- **Performance**: First load < 1s
- **Install rate**: Target 30% of repeat users
- **Retention**: 60% weekly active users
- **Data integrity**: Zero data loss incidents
- **Offline capability**: 100% feature availability offline

---

## 10. Open Questions / Future Considerations

1. Multi-language support?
2. Sync backend: Firebase, Supabase, or custom?
3. Export format: JSON, iCal, CSV?
4. Widget API support (Android 12+)?
5. Native notifications vs Push notifications?
6. Time format preference (12h/24h toggle)?
7. Timezone handling for travelers?

---

## 11. Implementation Notes

### Recurrence Logic

- Generate instances on-the-fly (don't store individual occurrences)
- Cache generated instances for current week/month
- Handle exceptions (edited/deleted single occurrences)

### Sync Strategy (Future)

- Optimistic UI updates
- Queue mutations when offline
- Last-write-wins with version numbers
- Manual conflict resolution UI for critical conflicts

### Performance Optimizations

- Use React.memo for ScheduleItem
- Implement virtual scrolling for large lists
- Index schedules by date in memory
- Batch localStorage writes

---

## Next Steps

1. **Setup**: Initialize Vite + React + Tailwind project
2. **shadcn**: Install and configure shadcn/ui components
3. **Data Layer**: Implement storage utilities and data models
4. **MVP**: Build Phase 1 features (basic CRUD + UI)
5. **PWA**: Add manifest, service worker, and install prompt
6. **Test**: Ensure offline functionality and data persistence
7. **Deploy**: Host on Vercel/Netlify with HTTPS (required for PWA)
