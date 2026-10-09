# Weekly Mini Project 02 — Tasks & Team Workflow

## 1. Team

| Member | Main Task | Area |
| --- | --- | --- |
| Mohammad Kashmar (Team Lead) | Foundation + Pitch Details + Pitches Context + Review & Integration | Frontend |
| Hassan Alloush | Availability + Availability Context + Home + Not Found + Shared UI | Frontend |
| Ali Al Hamwi | Booking Form + My Booking + Confirmation + Booking Context + Status Badge | Frontend |
| Nawar Hasan | Pitches Module + Validators + Validation Pipe + Exception Filter + Endpoint Testing | Backend |
| Maya Al Hamwi | Time Utilities + Pricing + Availability + Quote (with their DTOs) | Backend |
| Iyad Ibrahim | Bookings Store + DTOs + Create / Find / Cancel + Statuses | Backend |

### Working pairs

Each frontend member works with one backend member. The endpoints are already fixed in `docs/API.md`, so you only agree on small details.

| Feature | Backend | Frontend |
| --- | --- | --- |
| Pitches | Nawar | Mohammad (details), Hassan (home) |
| Availability + Quote | Maya | Hassan (availability), Ali (quote) |
| Bookings | Iyad | Ali |

### Reviews

- Mohammad approves the Pull Requests of everyone else.
- Hassan approves Mohammad's Pull Requests (GitHub does not let you approve your own).

---

# 2. Team Rules

### Everyone must understand the whole project

Each member builds one area, but everyone must be able to explain:

* the user flow: browse → availability → book → confirm → find → cancel
* the frontend routes and the three contexts
* the backend modules and DTOs
* every API endpoint
* how prices work (normal and peak)
* how a slot becomes available, booked, or past
* how overlaps are rejected
* how cancellation works (the 2-hour rule)
* the three statuses: Confirmed, Cancelled, Completed
* what DTOs check and what services check
* what happens when the server is not reachable

Every member speaks in the final English presentation.

### Work alone, join through the contract

- Your work depends on `docs/API.md` and `docs/PROJECT-STRUCTURE.md`, not on someone's unfinished code.
- In Phase 0, the team lead adds **stubs**: every endpoint already answers with example data.
- Replace stubs only inside your own module.

### Stay in your lane

- Edit only the files you own (section 4).
- Never push to `main`.
- Check your branch before every commit.
- Never change a fixed name, field, endpoint, or message without the team lead.

---

# 3. Technology

## Frontend

* React, TypeScript, Vite, React Router
* **React Context** for state (one context per feature)
* Hooks: `useState`, `useEffect`, `useCallback`, `useMemo`, `useContext`
* Plain CSS, one file per page or component
* API service layer in `client/src/services/`
* `sessionStorage` only for the last booking

## Backend

* Node.js, NestJS, TypeScript
* In-memory data
* Controllers, services, modules
* **DTO classes** with `class-validator` and `class-transformer`
* One global `ValidationPipe`

## Not allowed

* database, login, user accounts, JWT, sessions, cookies
* external AI services, cloud services, paid APIs
* Redux, React Query, Zustand, or any state library
* Tailwind or any CSS framework
* payments, maps, SMS, email, notifications, an admin area
* GraphQL, WebSockets, Docker
* new npm packages (ask the team lead first)

---

# 4. File Ownership

Every file has exactly one owner.

## Frontend

### Mohammad

```text
client/src/
├── App.tsx
├── main.tsx
├── routes/AppRouter.tsx
├── styles/theme.css
├── styles/global.css
├── components/layout/
├── components/common/PageContainer*
├── context/PitchesContext.tsx
├── services/http.ts
├── services/pitches.api.ts
├── types/pitch.types.ts
└── pages/PitchDetails/
```

### Hassan

```text
client/src/
├── pages/Home/
├── pages/NotFound/
├── pages/Availability/
├── context/AvailabilityContext.tsx
├── services/availability.api.ts
├── types/availability.types.ts
├── components/common/Loading*
├── components/common/ErrorMessage*
├── components/common/EmptyState*
├── components/common/Button*
├── utils/format.ts
├── utils/date.ts
└── constants.ts
```

### Ali

```text
client/src/
├── pages/BookingForm/
├── pages/MyBooking/
├── pages/BookingConfirmation/
├── context/BookingContext.tsx
├── services/bookings.api.ts
├── types/booking.types.ts
├── components/common/StatusBadge*
└── utils/lastBooking.ts
```

## Backend

### Mohammad

```text
api/src/
├── main.ts
├── app.module.ts
├── common/constants.ts
├── common/clock.service.ts
├── common/common.module.ts
└── data/seed.data.ts
```

### Nawar

```text
api/src/
├── pitches/                  (with dto/pitch-id-param.dto.ts)
├── common/validators.ts
├── common/normalize.util.ts
├── common/validation.pipe.ts
└── common/all-exceptions.filter.ts

api/requests/api.http
```

### Maya

```text
api/src/
├── availability/             (with dto/availability-query.dto.ts)
├── pricing/                  (with dto/quote-query.dto.ts)
└── common/time.util.ts
```

### Iyad

```text
api/src/
└── bookings/                 (with dto/)
```

## Repository and docs

### Mohammad

```text
docs/   README.md   .github/   .editorconfig   .prettierrc   .gitignore   package.json files
```

### Important

Do not edit another member's files. Need a change? Message the owner or open a GitHub issue. The owner makes the change in their own branch.

---

# 5. Phase 0 — Foundation (Mohammad)

Mohammad does this **before** the others start coding. Target: about 2 hours. The others read the specification and the docs, clone the repo, and wait.

The goal: everyone can branch from `main` and work in their own folder without touching shared files.

## 5.1 Repository

1. Create the GitHub repository and add everyone.
2. Create the folders from `PROJECT-STRUCTURE.md`.
3. Add `.gitignore`, `.editorconfig`, `.prettierrc`, and a README stub.
4. Add the three docs.
5. Add `.github/CODEOWNERS` and `.github/pull_request_template.md` (section 15).
6. Make the **first commit directly on `main`** (one-time exception), push it, then **turn on branch protection right away** (section 15).

## 5.2 Backend (`api/`)

1. Create a NestJS project in `api/` and install `class-validator` and `class-transformer`.
2. `main.ts`: prefix `api`, CORS for `http://localhost:5173`, `createValidationPipe()`, `AllExceptionsFilter`, port `3000`.
3. `common/constants.ts`, `common/clock.service.ts`, and the global `CommonModule`.
4. Module skeletons with the **fixed method names**: `PitchesModule`, `PricingModule`, `AvailabilityModule`, `BookingsModule`, and the four controllers.
5. **Stubs:** every stubbed method returns the example JSON from `docs/API.md`. Mark each one with `// STUB: replace with real implementation`. Controllers use `@Body() body: unknown` until their owner adds the DTO.
6. Placeholder files that compile with the fixed names: `time.util.ts`, `normalize.util.ts`, `validators.ts`, `validation.pipe.ts`, `all-exceptions.filter.ts`.
7. Connect all modules in `app.module.ts`.
8. Check: `npm run start:dev` starts and `GET /api/pitches` answers.

## 5.3 Frontend (`client/`)

1. Create a Vite + React + TypeScript project in `client/` and install `react-router-dom`.
2. `styles/theme.css` and `styles/global.css` (imported in `main.tsx`, in that order).
3. `services/http.ts` (`request<T>()`, `ApiError`) and the three `*.api.ts` files with all functions from `API.md`, section 17.
4. `types/*.types.ts` exactly as in `PROJECT-STRUCTURE.md`, section 12.
5. **`PitchesContext.tsx` fully written.** The other two contexts copy its pattern.
6. `AvailabilityContext.tsx` and `BookingContext.tsx` as **skeletons**: Provider, hook, the fixed value shape, and empty default actions.
7. `App.tsx` wraps the router with the three providers.
8. `components/layout/`: `Layout` and `Navbar` (Pitches, My Booking).
9. Placeholder components in `components/common/` with the exact props.
10. `routes/AppRouter.tsx` with **all routes** pointing to placeholder pages (each shows only its name).
11. `.env.example` with `VITE_API_URL=http://localhost:3000/api`.
12. Check: `npm run dev` starts and every route shows its placeholder.

## 5.4 Hand-off

Phase 0 is done when:

* `main` has the full skeleton
* `api` and `client` both start from a clean checkout
* every endpoint answers with stub data
* every route shows a placeholder
* branch protection is on
* the team is told: "branch from `main` now"

---

# 6. Task 1 — Mohammad Kashmar

## Team Lead: Pitch Details + Pitches Context + Review & Integration

### Main responsibility

After Phase 0: build the Pitch Details screen and its context, review every Pull Request, and own integration, the README, and the presentation plan.

## Files

```text
client/src/pages/PitchDetails/
├── PitchDetailsPage.tsx
└── PitchDetailsPage.css

client/src/context/PitchesContext.tsx
```

Plus the shared files listed under Mohammad in section 4.

---

## Part A — Pitches Context

You wrote the base in Phase 0. After that:

1. Add `currentPitch`, `isPitchLoading`, `pitchError`, and `loadPitch(pitchId)` (shape in `PROJECT-STRUCTURE.md`, section 4.2).
2. Every error is saved as a readable message. Never throw it to the page.
3. Wrap the value with `useMemo` and actions with `useCallback`.
4. Help Hassan and Ali copy the pattern into their contexts.

---

## Part B — Pitch Details (`/pitches/:pitchId`)

1. Read `pitchId` from the URL. Call `loadPitch(pitchId)` from `usePitches()` when the page opens.
2. Show all pitch information: name, type, description, surface, normal price, peak price, opening hours (use `formatPrice` and `formatTime`).
3. Show this explanation:

```text
Peak hours are 18:00–22:00, every day.
Any hour that starts inside this period is charged at the peak price.
```

4. Show a small price example (one normal hour + one peak hour) using the pitch's real prices. It is display only.
5. **Check availability** button → `/pitches/:pitchId/availability`.
6. Unknown pitch: show the API message (`Pitch not found.`) and a link to Home.
7. Loading and error states, with a retry button.

---

## Part C — Team Lead Work

**Review**

- Review every PR, normally within **2 hours**.
- Check: only owned files changed, names and CSS prefixes follow the docs, the PR template is filled, the build works.
- Ask for a split when a PR is too big.

**Integration**

- Merge in dependency order (section 17).
- After every merge, `main` must still start and build.
- Run the full test (section 12) at the end of Phase 2 and again before the demo.

**Team**

- 15-minute daily sync: done, next, blockers.
- One GitHub issue for each Definition-of-Done item.
- Decide contract changes and update `docs/` in the same PR.

**Final**

- README (section 13).
- Presentation plan and rehearsal (section 14).
- Freeze `main` two hours before the demo.

## Mohammad must NOT

- build the Availability, Booking, or Home screens
- write backend business logic
- skip branch protection
- merge a PR that nobody reviewed
- change a fixed name silently

## Definition of Done

* Phase 0 is complete and `main` is protected.
* `PitchesContext` works with the fixed shape.
* Pitch Details shows all information and the peak explanation.
* An unknown pitch shows the backend message.
* Loading, error, and retry states exist.
* The page works on desktop and mobile.
* CSS uses the `pitch-details-` prefix and `theme.css` colors only.
* No `fetch` or service call inside the page.
* All PRs are reviewed.
* README is complete.
* Code is committed and pushed on Mohammad's branches.
* Mohammad can explain the whole project.

---

# 7. Task 2 — Hassan Alloush

## Availability + Availability Context + Home + Not Found + Shared UI

### Main responsibility

Build the screen where the customer picks a date and selects one or two consecutive free hours. Also build the Home page, the 404 page, and the shared UI pieces every page uses.

Availability is the **most interactive** screen. It must always show what the API returns.

## Files

```text
client/src/pages/Availability/
├── AvailabilityPage.tsx
├── AvailabilityPage.css
├── SlotGrid.tsx
└── SelectionSummary.tsx

client/src/pages/Home/
├── HomePage.tsx
├── HomePage.css
└── PitchCard.tsx

client/src/pages/NotFound/
├── NotFoundPage.tsx
└── NotFoundPage.css

client/src/context/AvailabilityContext.tsx
client/src/services/availability.api.ts
client/src/types/availability.types.ts

client/src/components/common/   (Loading, ErrorMessage, EmptyState, Button + their CSS)
client/src/utils/format.ts
client/src/utils/date.ts
client/src/constants.ts
```

---

## Part A — Shared UI and utilities (first small PR)

Everyone imports these, so deliver them first (target: the first 1 to 2 hours of Phase 1).

| Item | What it does |
| --- | --- |
| `Loading` | Spinner and an optional message |
| `ErrorMessage` | Error box with the message and an optional **Try again** button (`onRetry`) |
| `EmptyState` | Title and optional description |
| `Button` | Variants `primary`, `secondary`, `danger`, `accent`. `isLoading` shows a loading state and disables the button |
| `formatDate(date)` | `'2026-10-16'` → `Fri, 16 Oct 2026` |
| `formatTime(time)` | `'20:00'` → `20:00` |
| `formatPrice(amount)` | `30` → `$30` |
| `formatDuration(hours)` | `1` → `1 hour`, `2` → `2 hours` |
| `toDateString(date)` | local `Date` → `YYYY-MM-DD` (do not use `toISOString()`) |
| `getTodayString()` | today as `YYYY-MM-DD` |
| `addDaysToToday(days)` | today plus N days as `YYYY-MM-DD` |
| `constants.ts` | `MAX_ADVANCE_DAYS = 14` (only for the date input) |

Props are fixed in `PROJECT-STRUCTURE.md`, section 6. Colors come only from `theme.css`.

---

## Part B — Availability Context

Copy the pattern from `PitchesContext`. The fixed shape (`PROJECT-STRUCTURE.md`, section 4.2):

```ts
availability, isAvailabilityLoading, availabilityError, loadAvailability(pitchId, date)
selectedIndexes, selectedSlots, selectionMessage, toggleSlot(index), clearSelection()
```

### `loadAvailability`

- Calls `getDayAvailability(pitchId, date)`.
- Clears the selection when it starts loading.
- Saves errors as readable messages.

### `toggleSlot(index)`

The selection is a list of slot **positions** (indexes).

| User action | Result |
| --- | --- |
| Click an available slot, nothing selected | Select it |
| Click an available slot **next to** the selected one (index ± 1) | Select both (2 hours) |
| Click an available slot that is **not next to** it | Do nothing. Set `selectionMessage` to `Please choose one or two consecutive hours.` |
| Click a third slot while two are selected | Do nothing. Same message |
| Click a selected slot | Remove it |
| Click a booked or past slot | Ignore |

Keep `selectedIndexes` sorted. `selectedSlots` comes from it. A good click clears `selectionMessage`. "Next to" means the neighbor index. Do not parse times.

---

## Part C — Availability page (`/pitches/:pitchId/availability`)

### Flow

```text
URL (/pitches/:pitchId/availability?date=...)
 ↓
loadPitch + loadAvailability
 ↓
Slots (available / booked / past)
 ↓
User selects 1 or 2 consecutive slots
 ↓
Continue to booking
 ↓
/pitches/:pitchId/book?date=...&start=...&duration=...
```

### Date

1. The date lives in the URL: `?date=YYYY-MM-DD`. If it is missing, use today.
2. Show one **date input** (`<input type="date">`) with `min` = today and `max` = `addDaysToToday(MAX_ADVANCE_DAYS)`.
3. When the date changes, update the URL and load the new availability.

### Slot grid

1. Show every slot from the API, in order.
2. Each slot shows the time range (`20:00 – 21:00`), the price, a **Peak** tag when `isPeak` is `true`, and a text label: `Available`, `Booked`, `Past`, or `Selected`.
3. Colors (`PROJECT-STRUCTURE.md`, section 13): available is light green with a green border, selected is solid green, booked is red, past is gray. Color is never the only signal.
4. Booked and past slots are disabled.
5. Add a legend for the four states.
6. Slots are real `<button>` elements.

### Selection summary

A bar under the grid with the selected time range, the duration, `selectionMessage` when there is one, and a **Continue to booking** button. The button works only when at least one slot is selected and opens:

```text
/pitches/:pitchId/book?date=YYYY-MM-DD&start=HH:mm&duration=1|2
```

This page does **not** show a total price. The Booking Form does.

### Loading and errors

1. Loading view while the availability loads.
2. Error view with **Try again**.
3. If the API says the date is bad (`400`), show the message and a button to go back to today.
4. If the pitch does not exist, show `Pitch not found.` and a link to Home.
5. The page loads its data every time it opens, so slots are correct after a booking or a cancellation.

---

## Part D — Home (`/`)

1. Call `loadPitches()` from `usePitches()` when the page opens.
2. Hero section on the dark color: app name, one sentence about the app, and a button that scrolls to the pitch list.
3. A responsive grid of `PitchCard`: 1 column on phones, 2 on tablets, 3–4 on desktop.
4. Each card shows: name, type, normal price, peak price (highlighted with `--color-peak`), opening hours, and a **View pitch** link to `/pitches/:pitchId`.
5. Loading view, error view with **Try again**, and an empty view.

## Part E — Not Found (`*`)

A friendly 404 page with a short message and a link to Home.

## Hassan must NOT

* calculate prices
* decide if a slot is available, booked, or past
* create bookings or send any POST request
* build the Booking Form
* write backend code
* change routes (ask Mohammad)
* use hardcoded colors
* call `fetch` or services inside pages or components

## Definition of Done

* Shared UI and utilities are merged and used by the team.
* `AvailabilityContext` matches the fixed shape.
* The date input works from today to today + 14 and updates the URL.
* Every slot shows time, price, peak tag, and a status label.
* Available, booked, past, and selected look different.
* Booked and past slots cannot be selected.
* One slot, or two slots next to each other, can be selected.
* A slot that is not next to it, or a third slot, shows the message.
* Changing the date or pitch clears the selection.
* Continue opens the Booking Form with correct `date`, `start`, and `duration`.
* Loading, error, retry, and unknown-pitch views exist.
* After a booking or cancellation, the slots are correct when the page opens again.
* Home shows all pitches with every required field, plus loading, error, and empty views.
* Not Found works.
* All pages work on desktop and mobile.
* CSS uses the `availability-`, `home-`, `not-found-`, and `ui-` prefixes and `theme.css` colors only.
* Code is committed and pushed on Hassan's branches.
* Hassan can explain the whole project.

---

# 8. Task 3 — Ali Al Hamwi

## Booking Form + My Booking + Confirmation + Booking Context + Status Badge

### Main responsibility

Build the three screens where the customer **creates** a booking, **sees** the confirmation, and later **finds and cancels** it. Also build the context that manages the booking state.

Every rejection from the backend must be shown clearly on these screens.

## Files

```text
client/src/pages/BookingForm/
├── BookingFormPage.tsx
├── BookingFormPage.css
├── PriceSummary.tsx
└── CustomerFields.tsx

client/src/pages/MyBooking/
├── MyBookingPage.tsx
├── MyBookingPage.css
├── FindBookingForm.tsx
└── BookingDetails.tsx

client/src/pages/BookingConfirmation/
├── BookingConfirmationPage.tsx
└── BookingConfirmationPage.css

client/src/context/BookingContext.tsx
client/src/services/bookings.api.ts
client/src/types/booking.types.ts
client/src/components/common/StatusBadge.tsx (+ css)
client/src/utils/lastBooking.ts
```

## Endpoints (used through the context)

```text
GET   /api/pitches/:pitchId/quote?date=&startTime=&durationHours=
POST  /api/bookings
POST  /api/bookings/find
PATCH /api/bookings/:code/cancel
```

---

## Part A — Small shared pieces (first small PR)

* `StatusBadge({ status })`: `Confirmed` uses `--color-success`, `Cancelled` uses `--color-error`, `Completed` uses `--color-info`. It shows the status as text.
* `lastBooking.ts`: `saveLastBooking(code, customerPhone)` and `getLastBooking()` with `sessionStorage` and the key `pb.lastBooking`. Wrap reads and writes in `try/catch`.

---

## Part B — Booking Context

Copy the pattern from `PitchesContext`. The fixed shape (`PROJECT-STRUCTURE.md`, section 4.2):

```ts
quote, isQuoteLoading, quoteError, loadQuote(pitchId, date, startTime, durationHours)
booking, isBookingLoading, bookingError
submitBooking(payload)        → Booking | null
lookupBooking(payload)        → boolean
cancelCurrentBooking()        → boolean
clearBooking()
```

| Action | What it does |
| --- | --- |
| `loadQuote` | Calls `getQuote`. Saves `quoteError` if it fails. |
| `submitBooking` | Sets `isBookingLoading`, calls `createBooking`. Success: saves `booking` and returns it. Failure: saves `bookingError` and returns `null`. |
| `lookupBooking` | Calls `findBooking`. Success: saves `booking`, returns `true`. Failure: sets `booking` to `null`, saves `bookingError`, returns `false`. |
| `cancelCurrentBooking` | Calls `cancelBooking(booking.code, { customerPhone: booking.customerPhone })`. Success: saves the updated booking. Failure: saves `bookingError`, then **reloads the booking with `findBooking`**, and returns `false`. |
| `clearBooking` | Clears `booking` and `bookingError`. |

Rules: a new action clears the old `bookingError`. `isBookingLoading` goes back to `false` after every result. Wrap the value with `useMemo` and actions with `useCallback`.

---

## Part C — Booking Form (`/pitches/:pitchId/book`)

### Flow

```text
URL (date, start, duration)
 ↓
Check the URL values
 ↓
loadPitch + loadQuote
 ↓
Summary + form
 ↓
submitBooking
 ↓
Accepted → save last booking → /confirmation/:code
Rejected → show bookingError
```

### Requirements

1. Read `pitchId` from the route and `date`, `start`, `duration` from the URL.
2. If a value is missing, show `Please choose a time first.` and a link to `/pitches/:pitchId/availability`.
3. Load the pitch (`usePitches`) and the quote (`useBooking`).
4. Show the summary (`PriceSummary`): pitch name, date, start and end time, duration, the price of **each hour** with a **Peak** tag when `isPeak`, and the **total price** (large and clear). Every value comes from the quote.
5. Show the fields (`CustomerFields`): customer name and customer phone (`type="tel"`).
6. Check only that both fields are not empty (`Please enter your name.`, `Please enter your phone number.`). Do **not** copy the phone rules. The backend decides, and its message is shown.
7. **Confirm booking** button: calls `submitBooking(payload)`. It is disabled and shows loading while `isBookingLoading` is `true` (no double submit).
8. On success: `saveLastBooking(booking.code, booking.customerPhone)`, then open `/confirmation/:code`.
9. On failure show `bookingError` **inside the form** (not an alert):
   * overlap message → also show **Choose another time**, linking to `/pitches/:pitchId/availability?date=...`
   * other `400` messages → keep what the user typed
   * network error → show the connection message and keep what the user typed
10. If the quote fails (`400` or `404`), show the message and a link back to Availability.
11. Call `clearBooking()` when the page opens, so an old error never shows.

### Test these by hand

| Situation | Expected |
| --- | --- |
| Slot booked by someone else a moment earlier | Overlap message and a link to choose another time |
| Time that already started | Past-time message |
| Empty name | Name message |
| Empty or wrong phone | Phone message |
| Backend stopped, then submit | Connection message, typed values kept |
| Refresh the page | Same selection and price |
| Double-click Confirm | Only one booking |

---

## Part D — Booking Confirmation (`/confirmation/:code`)

1. Read `code` from the URL and the saved phone from `getLastBooking()`.
2. Call `lookupBooking({ customerPhone, code })` when the page opens, so the **current** status is shown (also after a refresh).
3. Show: booking code (large), pitch, date, start and end time, duration, total price, name, phone, and `StatusBadge`.
4. Show this reminder:

```text
You can cancel this booking until 2 hours before the match starts.
```

5. Buttons: **View / cancel my booking** (→ `/my-booking`) and **Book another pitch** (→ `/`).
6. No saved last booking, or it does not match the code? Show a friendly message and a link to My Booking.
7. Loading and error views with retry.

---

## Part E — My Booking (`/my-booking`)

### Flow

```text
Form (phone + code)
 ↓
lookupBooking
 ↓
Found → details + status + cancel area
Not found → clear message
```

### Requirements

1. `FindBookingForm`: phone and code fields and a **Find booking** button (disabled while loading). Optional: fill both fields from `getLastBooking()`.
2. On success, `BookingDetails` shows: code, pitch, date, start and end time, duration, total price, name, phone, `StatusBadge`.
3. On failure, show `bookingError` (for example `Booking not found. Check your phone number and booking code.`). Never show another booking.
4. Cancel area:
   * `canCancel` is `true`: show a **Cancel booking** button (danger variant) that asks to confirm first
   * `canCancel` is `false`: show an explanation instead:

| Status | Explanation |
| --- | --- |
| `Cancelled` | `This booking has been cancelled.` |
| `Completed` | `This match has already been played.` |
| `Confirmed` | `The cancellation deadline has passed. Matches can only be cancelled more than 2 hours before they start.` |

5. When cancelling: the button is disabled and loading. Success shows the updated booking (`Cancelled`) and `Your booking has been cancelled. The time slot is available again.` Failure shows `bookingError` (the context already reloaded the booking).
6. Loading and network-error views with retry.

## Layout

- Booking Form: two columns on desktop (summary and form), one column on mobile.
- My Booking: a centered card, with the booking details below the form.
- Inputs are big enough for phones. Labels are visible. Errors show near the form.

## Ali must NOT

* calculate prices (use the quote)
* decide if cancelling is allowed (use `canCancel`)
* write status logic
* build the Availability screen
* write backend code
* change routes (ask Mohammad)
* use hardcoded colors
* call `fetch` or services inside pages or components

## Definition of Done

* `BookingContext` matches the fixed shape. After every action, `isBookingLoading` is `false` again.
* The Booking Form reads its selection from the URL and survives a refresh.
* The summary shows each hour's price, peak tags, and the total from the quote.
* Submit cannot run twice.
* Success saves the last booking and opens the Confirmation page.
* Every backend rejection is shown clearly, with a way to recover.
* Confirmation shows every required field and the current status after a refresh.
* My Booking finds by phone + code and shows full details and status.
* "Not found" works and shows nothing else.
* The cancel button shows only when `canCancel` is `true`. Otherwise the right explanation shows.
* Cancel asks to confirm and updates the page. A failed cancel reloads the booking.
* `StatusBadge` shows the three statuses.
* Loading, error, and retry views exist.
* Pages work on desktop and mobile.
* CSS uses the `booking-form-`, `booking-confirmation-`, `my-booking-`, and `ui-` prefixes and `theme.css` colors only.
* Code is committed and pushed on Ali's branches.
* Ali can explain the whole project.

---

# 9. Task 4 — Nawar Hasan

## Pitches Module + Validators + Validation Pipe + Exception Filter + Endpoint Testing

### Main responsibility

Provide the pitch data, the shared validation tools (validators, cleaning functions, validation pipe), one error format for the whole API, and independent testing of every endpoint.

Everyone on the backend uses your validation tools, so your first PRs must be merged fast (target: the first 2 to 3 hours of Phase 1).

## Files

```text
api/src/pitches/
├── dto/pitch-id-param.dto.ts
├── pitches.module.ts
├── pitches.controller.ts
├── pitches.service.ts
└── pitch.types.ts

api/src/common/
├── validators.ts
├── normalize.util.ts
├── validation.pipe.ts
└── all-exceptions.filter.ts

api/requests/api.http
```

---

## Part A — Validators and cleaning functions (first PR)

`validators.ts` has three custom `class-validator` decorators. Each accepts the usual `ValidationOptions`, so callers can set a `message`. They only return `true` or `false`. They never throw.

| Decorator | Passes when | Examples |
| --- | --- | --- |
| `@IsCalendarDate()` | string `YYYY-MM-DD` and a real date | `'2026-10-16'` ✔, `'2026-02-31'` ✘, `'16-10-2026'` ✘, `20261016` ✘ |
| `@IsOnTheHour()` | string `HH:00`, hour 00–23 | `'20:00'` ✔, `'18:30'` ✘, `'8:00'` ✘, `'24:00'` ✘ |
| `@IsValidPhone()` | optional `+`, then 8–15 digits | `'0912345678'` ✔, `'+963912345678'` ✔, `'12345'` ✘, `'09123abc78'` ✘ |

`normalize.util.ts`:

| Function | What it does | Example |
| --- | --- | --- |
| `normalizePhone(value)` | removes spaces and dashes | `'+963 912-345-678'` → `'+963912345678'` |
| `normalizeCode(value)` | trim + uppercase | `' pb-4821 '` → `'PB-4821'` |

Test every row with a quick script or unit tests.

---

## Part B — Validation pipe and exception filter

### `validation.pipe.ts`

`createValidationPipe()` returns a Nest `ValidationPipe` with:

```text
transform: true
whitelist: true
stopAtFirstError: true
exceptionFactory → BadRequestException with ONE string message
```

The factory returns the message of the first failing property. DTO properties are written in the checking order, so the message follows the order in `API.md`.

### `all-exceptions.filter.ts`

Every error must leave the API in this shape:

```json
{ "message": "Human-readable reason." }
```

| Situation | Status | Message |
| --- | --- | --- |
| `HttpException` from our code or the pipe | its status | its message |
| Unknown route (Nest's `Cannot GET /x`) | 404 | `Endpoint not found.` |
| Broken JSON body | 400 | `Invalid request body.` |
| Any other error | 500 | `Something went wrong. Please try again.` |

Rules:

- Always send one string `message`. Never an array, never the default Nest shape.
- Unexpected (500) errors are logged to the console with the stack trace. They are **never** sent to the client.

---

## Part C — Pitches module

### DTO

`PitchIdParamDto` has one property, `pitchId`: `@IsString()` and `@IsNotEmpty()`, both with the message `Pitch ID is required.`

### Service

```text
findAll()        → Pitch[]
findById(id)     → Pitch      (throws NotFoundException('Pitch not found.'))
```

Data comes from `SEED_PITCHES` in `api/src/data/seed.data.ts`. Return copies, so callers cannot change the seed data.

### Controller

```text
GET /api/pitches            → getPitches()
GET /api/pitches/:pitchId   → getPitchById(@Param() params: PitchIdParamDto)
```

The controller has no business logic. It calls the service.

### Types and module

`pitch.types.ts` has the backend `Pitch` interface (same as `docs/API.md`, section 4.1). `PitchesModule` exports `PitchesService`.

---

## Part D — Endpoint testing (`api/requests/api.http`)

Write a request file (VS Code REST Client format) with **one request for each item** in `docs/API.md`, section 18.

- Run the whole file after every merge to `main` and tell the owner about failures.
- At the end of Phase 2, run it against the full backend and post a pass/fail list in the team chat.
- Check that every error body is `{ "message": "..." }` and the text matches `API.md`.

---

## Nawar must NOT

* write pricing, availability, or booking logic
* write time utilities (Maya owns them)
* write the DTOs of other modules (their owners do)
* write frontend code
* add a database or any storage

## Definition of Done

* The three validators work as in the table.
* `normalizePhone` and `normalizeCode` work as in the table.
* The pipe returns one readable message per error, in the documented order.
* The filter returns `{ "message": "..." }` for every case, including unknown routes and broken JSON.
* 500 errors are logged, not sent to the client.
* `GET /api/pitches` returns all pitches.
* `GET /api/pitches/:pitchId` returns one pitch or `404` with `Pitch not found.`
* `PitchIdParamDto` exists and is used.
* `PitchesService` is exported and used by other modules.
* `api.http` covers the checklist in `API.md`, section 18.
* All endpoints were tested after integration.
* Code is committed and pushed.
* Nawar can explain the whole API flow.

---

# 10. Task 5 — Maya Al Hamwi

## Time Utilities + Pricing + Availability + Quote

### Main responsibility

Own all **time and price logic**: how an hour becomes a slot, what it costs, and the status of each slot. Also write the DTOs for the availability and quote requests.

This part decides what the user sees on the Availability and Booking Form screens.

## Files

```text
api/src/common/time.util.ts

api/src/pricing/
├── dto/quote-query.dto.ts
├── pricing.module.ts
├── pricing.controller.ts
├── pricing.service.ts
└── pricing.types.ts

api/src/availability/
├── dto/availability-query.dto.ts
├── availability.module.ts
├── availability.controller.ts
├── availability.service.ts
└── availability.types.ts
```

---

## Part A — Time utilities (first PR)

Iyad and Maya both need these, so deliver them first.

| Function | What it does | Example |
| --- | --- | --- |
| `parseHour(time)` | hour number from `HH:mm` | `'08:00'` → `8` |
| `formatHour(hour)` | `HH:00` text | `8` → `'08:00'`, `22` → `'22:00'` |
| `toDateString(date)` | local date as `YYYY-MM-DD` | `Date` → `'2026-10-16'` |
| `toDateTime(date, hour)` | local `Date` at that hour | `('2026-10-16', 20)` → 16 Oct 2026 20:00 |
| `isPastSlot(date, hour, now)` | `true` when the slot has started: `toDateTime(date, hour) <= now` | slot 20:00, now 20:00 → `true` |
| `isWithinBookingWindow(date, now)` | `true` when the date is at most `MAX_ADVANCE_DAYS` after today | today + 14 → `true`, today + 15 → `false` |

Use the local time zone, never UTC. Do not use `toISOString()` for dates: it converts to UTC and can change the day.

---

## Part B — DTOs

Write properties in the order below. Every decorator has a `message` from `docs/API.md`.

### `AvailabilityQueryDto`

| Property | Decorators | Message |
| --- | --- | --- |
| `date` | `@IsCalendarDate()` | `Invalid date. Use the format YYYY-MM-DD.` |

### `QuoteQueryDto`

| Property | Decorators | Message |
| --- | --- | --- |
| `date` | `@IsCalendarDate()` | `Invalid date. Use the format YYYY-MM-DD.` |
| `startTime` | `@IsOnTheHour()` | `Start time must be on the hour, for example 18:00.` |
| `durationHours` | `@Type(() => Number)`, `@IsIn([1, 2])` | `A booking can be one or two hours only.` |

Query values arrive as text, so `durationHours` is turned into a number first. A missing value fails. Use the decorators from Nawar (`common/validators.ts`). Until his PR is merged, code against the fixed names.

---

## Part C — PricingService

```text
isPeakHour(hour)                                     → boolean
getHourPrice(pitch, hour)                            → number
calculateTotalPrice(pitch, startHour, durationHours) → number
getQuote(pitch, date, startTime, durationHours)      → Quote
```

### Rules

- Peak is `hour >= PEAK_START_HOUR && hour < PEAK_END_HOUR` (18, 19, 20, 21). Hour 22 is **normal**.
- Each hour is priced alone.
- Use the constants from `common/constants.ts`. No `18` or `22` anywhere else.

### Examples (normal 20, peak 30)

| Booking | Hours | Total |
| --- | --- | --- |
| 10:00–11:00 | normal | 20 |
| 19:00–20:00 | peak | 30 |
| 17:00–19:00 | normal + peak | 50 |
| 21:00–23:00 | peak + normal | 50 |
| 20:00–22:00 | peak + peak | 60 |
| 08:00–10:00 | normal + normal | 40 |

### `getQuote`

The DTO already checked the format. `getQuote` checks the **rules** and returns a `Quote` (API.md, section 4.4):

1. the date is inside the 14-day window (`400 Bookings can only be made up to 14 days in advance.`)
2. the booking is inside the pitch's opening hours (`400 The booking must be within the pitch's opening hours.`)

It does **not** check past times or conflicts. The booking creation does.

### Controller

```text
GET /api/pitches/:pitchId/quote?date=&startTime=&durationHours=
→ getQuote(@Param() params: PitchIdParamDto, @Query() query: QuoteQueryDto)
```

The controller loads the pitch with `PitchesService.findById` and calls `PricingService.getQuote`.

---

## Part D — AvailabilityService

```text
getDayAvailability(pitchId, date) → DayAvailability
```

### Steps

1. Load the pitch (`PitchesService.findById`, `404` if missing).
2. If the date is **after** the 14-day window → `400 Bookings can only be made up to 14 days in advance.` A past date is allowed. (The date format was already checked by `AvailabilityQueryDto`.)
3. Make one slot for each hour from `parseHour(openingTime)` up to, but not including, `parseHour(closingTime)`.
4. Get active bookings with `BookingsStore.findActiveByPitchAndDate(pitchId, date)`. Collect their hours (from the start hour up to, not including, the end hour).
5. Give each slot a status, in this order:
   1. `past` if `isPastSlot(date, hour, now)`
   2. `booked` if the hour is in the booked hours
   3. `available` otherwise
6. Set `price` with `getHourPrice` and `isPeak` with `isPeakHour`.
7. Return `{ pitchId, date, slots }`.

`now` always comes from `ClockService.now()`.

### Controller

```text
GET /api/pitches/:pitchId/availability?date=
→ getDayAvailability(@Param() params: PitchIdParamDto, @Query() query: AvailabilityQueryDto)
```

### Test table

| Case | Expected |
| --- | --- |
| Pitch 08:00–23:00 | 15 slots, the last is 22:00–23:00 |
| Pitch 09:00–23:00 | 14 slots, the first is 09:00–10:00 |
| Past date | every slot is `past` |
| Today | hours that started are `past`, later hours are not |
| Hour 22:00 | `isPeak: false`, normal price |
| Hours 18:00–21:00 | `isPeak: true`, peak price |
| Active booking 19:00–21:00 on a future date | 19:00 and 20:00 are `booked`, 21:00 is `available` |
| Cancelled booking | its slots are `available` |
| Booking on another pitch, same time | not `booked` here |
| Today + 14 | `200` |
| Today + 15 | `400` |
| `date=2026-02-31` | `400` with the invalid-date message (from the DTO) |

---

## Dependencies

- `PitchesService.findById`, the validators, and `PitchIdParamDto` — Nawar (stub from Phase 0).
- `BookingsStore.findActiveByPitchAndDate` — Iyad (stub returns `[]` until his PR is merged).

If a dependency is not merged yet, code against the fixed name and test with the stub.

## Maya must NOT

* create, find, or cancel bookings
* write the booking store or booking codes
* write custom validators (use Nawar's)
* write frontend code
* put price logic in controllers
* use `18`, `22`, `14`, or `2` outside `constants.ts`
* use `new Date()` for "now" (use `ClockService`)

## Definition of Done

* All six time functions work in the local time zone.
* Both DTOs use the exact messages and property order.
* `PricingService` gives the right price for every example.
* The quote endpoint returns the breakdown and total, and rejects every bad case with the exact `API.md` message.
* Availability returns the right number of slots for each pitch.
* Slot status follows `past` > `booked` > `available`.
* Cancelled bookings never block slots.
* Past dates, today, +14, and +15 work as described.
* Constants are used, not repeated.
* Every case in the test table was checked.
* Code is committed and pushed.
* Maya can explain the pricing and availability flow.

---

# 11. Task 6 — Iyad Ibrahim

## Bookings Store + DTOs + Create / Find / Cancel + Statuses

### Main responsibility

Own the bookings: check the requests, store the bookings, accept or reject new ones, find them, cancel them, and calculate their current status.

This is the **heaviest backend task**. It holds most of the business rules the project is graded on.

## Files

```text
api/src/bookings/
├── dto/
│   ├── create-booking.dto.ts
│   ├── find-booking.dto.ts
│   ├── cancel-booking.dto.ts
│   └── booking-code-param.dto.ts
├── bookings.module.ts
├── bookings.controller.ts
├── bookings.service.ts
├── bookings.store.ts
├── booking-code.util.ts
└── booking.types.ts
```

---

## Part A — Types and store (first PR)

### `booking.types.ts`

The stored booking:

```text
code, pitchId, date, startTime, endTime, durationHours,
customerName, customerPhone, totalPrice,
status ('Confirmed' | 'Cancelled'),
createdAt, cancelledAt?
```

and `BookingResponse` (API.md, section 4.5), which adds `pitchName`, the calculated `status`, and `canCancel`.

### `bookings.store.ts`

```text
findAll()                                → StoredBooking[]
findByCode(code)                         → StoredBooking | undefined
findActiveByPitchAndDate(pitchId, date)  → StoredBooking[]   (never Cancelled ones)
save(booking)                            → StoredBooking     (insert or update)
generateUniqueCode()                     → string
```

- The store keeps an in-memory array, loaded from `createSeedBookings()` when the server starts.
- `findByCode` uses `normalizeCode`.
- `generateUniqueCode` returns `PB-` and four random digits. It tries again until the code is unused (`booking-code.util.ts`).
- `BookingsModule` exports the store so `AvailabilityService` can use it.

Merge this PR first. Maya's availability needs `findActiveByPitchAndDate`.

---

## Part B — DTOs

Write properties in the order below. Every decorator has a `message` from `docs/API.md`. Use the validators and cleaning functions from Nawar. Until his PR is merged, code against the fixed names.

### `CreateBookingDto`

| Property | Transform | Decorators | Message |
| --- | --- | --- | --- |
| `pitchId` | — | `@IsString()`, `@IsNotEmpty()` | `Pitch ID is required.` |
| `date` | — | `@IsCalendarDate()` | `Invalid date. Use the format YYYY-MM-DD.` |
| `startTime` | — | `@IsOnTheHour()` | `Start time must be on the hour, for example 18:00.` |
| `durationHours` | — | `@IsIn([1, 2])` | `A booking can be one or two hours only.` |
| `customerName` | trim | `@IsString()`, `@IsNotEmpty()` | `Customer name is required.` |
| `customerPhone` | `normalizePhone` | `@IsValidPhone()` | `A valid phone number is required.` |

`durationHours` comes from a JSON body, so it must be the **number** `1` or `2`. The text `"2"` is rejected.

### `FindBookingDto`

| Property | Transform | Decorators | Message |
| --- | --- | --- | --- |
| `customerPhone` | `normalizePhone` | `@IsValidPhone()` | `A valid phone number is required.` |
| `code` | `normalizeCode` | `@IsString()`, `@IsNotEmpty()` | `Booking code is required.` |

### `CancelBookingDto`

| Property | Transform | Decorators | Message |
| --- | --- | --- | --- |
| `customerPhone` | `normalizePhone` | `@IsValidPhone()` | `A valid phone number is required.` |

### `BookingCodeParamDto`

| Property | Transform | Decorators | Message |
| --- | --- | --- | --- |
| `code` | `normalizeCode` | `@IsString()`, `@IsNotEmpty()` | `Booking code is required.` |

---

## Part C — Create booking

`BookingsService.createBooking(dto: CreateBookingDto)` → `201` with `BookingResponse`.

The DTO already made sure every field has the right format. The service checks only the **rules**, in this order (stop at the first problem):

1. The pitch exists (`PitchesService.findById`, `404 Pitch not found.`).
2. `isWithinBookingWindow(date, now)` → `400 Bookings can only be made up to 14 days in advance.`
3. Opening hours: `startHour >= opening` and `endHour <= closing` → `400 The booking must be within the pitch's opening hours.`
4. `isPastSlot(date, startHour, now)` → `400 This time has already started or passed. Please choose a future time.`
5. Overlap with an active booking on the same pitch and date → `409 This time is already booked on this pitch. Please choose another time.`
6. Price: `PricingService.calculateTotalPrice(pitch, startHour, durationHours)`.
7. Make the booking: `code = generateUniqueCode()`, `endTime = formatHour(startHour + durationHours)`, `status = 'Confirmed'`, `createdAt = now`.
8. Save it and return `toBookingResponse(booking)`.

### Overlap check

Two bookings overlap when they are on the same pitch and the same date and:

```text
newStart < existingEnd  AND  newEnd > existingStart
```

(use hour numbers). Only **active** (not cancelled) bookings count.

| Existing | New | Result |
| --- | --- | --- |
| 19:00–21:00 | 19:00–20:00 | overlap |
| 19:00–21:00 | 20:00–22:00 | overlap (partial) |
| 19:00–21:00 | 18:00–20:00 | overlap (partial) |
| 19:00–21:00 | 21:00–22:00 | **no overlap** (back to back) |
| 19:00–21:00 | 17:00–19:00 | **no overlap** |
| 19:00–21:00 on pitch A | 19:00–21:00 on pitch B | **no overlap** |
| cancelled 19:00–21:00 | 19:00–21:00 | **no overlap** |

### Double requests

Steps 5 to 8 run in **one block** with no `await` between the overlap check and the save. Node.js runs it in one piece, so two requests for the same hour can never both succeed. The second gets `409`.

---

## Part D — Find booking

`BookingsService.findBooking(dto: FindBookingDto)` → `200` with `BookingResponse`.

1. Find by `dto.code`, then require `dto.customerPhone === booking.customerPhone` (the DTO already cleaned both).
2. If anything fails → `404 Booking not found. Check your phone number and booking code.` Use the **same** message for a wrong code and a wrong phone.

---

## Part E — Cancel booking

`BookingsService.cancelBooking(code, dto: CancelBookingDto)` → `200` with the updated `BookingResponse`. The `code` comes from `BookingCodeParamDto`.

Check in this order:

1. The booking exists and the phone matches, else `404 Booking not found. Check your phone number and booking code.`
2. The stored status is `Cancelled` → `400 This booking is already cancelled.`
3. The calculated status is `Completed` → `400 This booking is completed and cannot be cancelled.`
4. The match does not start in more than 2 hours → `400 Cancellation is no longer possible. The match starts in 2 hours or less.`
5. Otherwise: set the stored status to `Cancelled`, set `cancelledAt = now`, save, and return the response (`status: 'Cancelled'`, `canCancel: false`).

The slots are free right away, because `findActiveByPitchAndDate` skips cancelled bookings.

---

## Part F — Calculated values

```text
getBookingStatus(booking, now):
  stored Cancelled                         → 'Cancelled'
  toDateTime(date, endHour) <= now         → 'Completed'
  otherwise                                → 'Confirmed'

canCancel(booking, now):
  status === 'Confirmed'
  AND toDateTime(date, startHour) - now > CANCEL_LIMIT_HOURS hours

toBookingResponse(booking):
  adds pitchName (from PitchesService), the calculated status, and canCancel
```

`Completed` is **never stored**. It is calculated every time.

| Match starts in | `canCancel` |
| --- | --- |
| 3 hours | `true` |
| 2 hours 1 minute | `true` |
| exactly 2 hours | `false` |
| 1 hour | `false` |
| already started | `false` |
| already ended | `false` (status `Completed`) |

---

## Part G — Controller

```text
POST  /api/bookings              → createBooking(@Body() dto: CreateBookingDto)                    (201)
POST  /api/bookings/find         → findBooking(@Body() dto: FindBookingDto)                        (200)
PATCH /api/bookings/:code/cancel → cancelBooking(@Param() params: BookingCodeParamDto,
                                                 @Body() dto: CancelBookingDto)                    (200)
```

The controller only passes data to the service.

---

## Dependencies

- `PitchesService.findById` — Nawar
- validators, `normalizePhone`, `normalizeCode`, validation pipe — Nawar
- `PricingService.calculateTotalPrice` — Maya (stub from Phase 0)
- `time.util.ts` — Maya (start with the fixed names)
- `ClockService.now()` — Mohammad (Phase 0)

## Iyad must NOT

* calculate prices (use `PricingService`)
* build slots or slot status (Maya's availability)
* write custom validators (use Nawar's)
* check formats inside the service (the DTOs do that)
* write frontend code
* add a database or any storage
* use `new Date()` for "now" (use `ClockService`)
* use `2` or `14` outside `constants.ts`
* change error messages from `docs/API.md`

## Definition of Done

* The store loads the seed bookings and returns only active bookings for availability.
* Codes are unique and look like `PB-` plus four digits.
* The four DTOs use the exact messages and property order.
* A text duration (`"2"`) is rejected in the body.
* Create enforces every rule, in order, with the exact messages.
* Overlap (full and partial) is rejected. Back-to-back, other pitches, and cancelled bookings are allowed.
* The same request sent twice is rejected with `409`.
* The phone is saved cleaned. Find and cancel compare cleaned values.
* Find returns only a booking that matches **both** phone and code.
* A wrong phone and a wrong code give the same `404`.
* Cancel follows the documented order.
* The 2-hour limit works as in the table.
* `Completed` and `canCancel` are calculated every time and never stored.
* The seeded Completed and Cancelled bookings show the right status.
* After a cancel, the slots are available again.
* Code is committed and pushed.
* Iyad can explain the whole booking flow.

---

# 12. Shared Task — Final Integration Test

When all six tasks are merged, the whole team runs one full test on a clean checkout.

```text
Home
 ↓
Pitch Details
 ↓
Availability (choose a date)
 ↓
Select 1 hour → Booking Form → price shown
 ↓
Enter name + phone → Confirm
 ↓
Booking Confirmation (code, status Confirmed)
 ↓
Availability → the slot is now Booked
 ↓
My Booking → find with phone + code
 ↓
Cancel
 ↓
Status Cancelled → slot Available again
```

Also test every flow from the specification:

* Flow A — browse pitches, open one, check availability
* Flow B — book 1 hour and 2 hours
* Flow C — find a booking (correct, wrong phone, wrong code)
* Flow D — cancel (allowed and rejected)

### Business rules

* normal price, peak price, and a booking with both
* hour 22:00 costs the normal price
* overlap: full and partial (2-hour booking)
* same time on a different pitch is allowed
* a slot that already started today, and a past date
* 14 days ahead is allowed, 15 days ahead is rejected
* outside opening hours
* two slots that are not next to each other cannot be selected
* duration 3 is rejected through the API
* duration sent as text is rejected through the API
* empty name, invalid phone
* cancel more than 2 hours before the match
* cancel 2 hours or less before the match (make a booking that starts soon, then try to cancel it)
* cancel an already cancelled booking
* a seeded Completed booking shows `Completed`
* a seeded Cancelled booking shows `Cancelled`
* a cancelled booking never blocks its slot

### Consistency

* availability updates after every booking and cancellation
* every screen shows the same price, status, and times for the same booking
* a refresh on every page keeps the data
* an old page (two browser tabs) is rejected with a clear message
* double-clicking Confirm makes one booking

### Failures

* wrong pitch ID
* wrong route (404 page)
* stop the backend → every page shows a message and a retry button, never a blank page
* start the backend again → retry works

### Ready for the presentation

* backend and frontend start cleanly from a fresh clone
* demo data is ready
* at least one wrong action can be shown being rejected with a clear message

Every bug goes to the owner of that file.

---

# 13. Shared Task — README

Owner: Mohammad. Everyone reviews it.

A clean checkout must run by following the README only. It explains:

* what the project is
* the technologies
* the folder structure
* how to install and run the backend (`api/`)
* how to install and run the frontend (`client/`)
* the environment variable (`VITE_API_URL`)
* an API overview (link to `docs/API.md`)
* the business rules (hours, duration, peak pricing, cancellation, statuses)
* a note that data is in memory and resets when the server restarts
* the team and who built what

---

# 14. Shared Task — Final Presentation (English)

The presentation is in **English** and every member speaks.

Required parts:

1. The problem
2. Product walkthrough
3. Live demo (with at least one wrong action rejected with a clear message)
4. Business rules
5. Team

### Suggested speakers

| Part | Speaker |
| --- | --- |
| The problem: who it is for and what it solves | Mohammad |
| Walkthrough: Home, Pitch Details, Availability, slot selection | Hassan |
| Demo: Booking Form, confirmation, find, and cancel | Ali |
| Rules: pricing (normal, peak, mixed) and slot status | Maya |
| Rules: overlaps, cancellation, and statuses | Iyad |
| Architecture: backend modules, DTO validation, error messages, frontend contexts | Nawar |
| Team and closing | Mohammad |

### Preparation

- Each member prepares a short explanation of their area **and** one rule in their own words.
- Each member can answer one question about another area.
- Practice the full demo at least twice, with a timer.
- Prepare the wrong action ahead of time (for example: try to book a booked hour).
- Both servers must start cleanly before presenting.

---

# 15. Git Workflow

Every member works on a separate branch for each task.

## Before you start (every time)

```bash
git switch main
git pull origin main
git switch -c fe/availability-slot-selection
git branch --show-current
```

The last command must **not** print `main`.

## Branch names

Format: `be/<module>-<description>` or `fe/<page>-<description>`.

| Member | Branches |
| --- | --- |
| Mohammad | `fe/foundation-setup`, `fe/pitches-context`, `fe/pitch-details` |
| Hassan | `fe/shared-ui`, `fe/availability-context`, `fe/availability-page`, `fe/availability-slot-selection`, `fe/home-pitch-list`, `fe/not-found` |
| Ali | `fe/status-badge`, `fe/booking-context`, `fe/booking-form`, `fe/booking-confirmation`, `fe/my-booking` |
| Nawar | `be/validators`, `be/validation-pipe`, `be/exception-filter`, `be/pitches-module`, `be/endpoint-tests` |
| Maya | `be/time-utils`, `be/pricing-service`, `be/availability-service`, `be/quote-endpoint` |
| Iyad | `be/bookings-store`, `be/bookings-dtos`, `be/bookings-create`, `be/bookings-find`, `be/bookings-cancel` |

## After your work

```bash
git status
git add <your files>
git commit -m "feat(bookings): reject overlapping slots"
git push -u origin be/bookings-create
```

Then open a Pull Request into `main`.

## Commit messages

Format: `type(scope): message`

```text
feat(availability): add slot selection with two-hour limit
fix(pricing): treat 22:00 as a normal hour
style(home): use theme colors for pitch cards
docs(api): add quote endpoint
refactor(bookings): extract overlap check
chore: add editorconfig
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`.

## Update your branch

Before you open a PR, bring in the latest `main`:

```bash
git fetch origin
git merge origin/main
```

Fix conflicts only in your own files. A conflict in a file you do not own? Stop and tell the team lead.

## Pull Request template

File `.github/pull_request_template.md`:

```markdown
## What does this PR do?

## Area
- [ ] Frontend
- [ ] Backend

## How did you test it?

## Screenshots (frontend)

## Checklist
- [ ] I am not on `main`
- [ ] I changed only files I own
- [ ] Names follow docs/PROJECT-STRUCTURE.md
- [ ] No hardcoded colors; CSS classes use my prefix
- [ ] Error and loading states are handled
- [ ] The app starts and builds
- [ ] I updated docs/API.md if the contract changed
```

## CODEOWNERS

File `.github/CODEOWNERS` (use the real GitHub username):

```text
* @mohammad-username
```

It asks Mohammad to review every PR automatically.

## Branch protection on `main` (team lead, once)

In GitHub: **Settings → Branches** (or **Rulesets**) → add a rule for `main`:

* Require a pull request before merging
* Require 1 approval
* Dismiss old approvals when new commits are pushed
* Block force pushes
* Restrict deletions
* **Do not allow bypassing** these settings (also for admins)

This is the real protection. GitHub itself rejects a direct push to `main`.

Team agreement: Mohammad approves everyone's PRs. Hassan approves Mohammad's PRs.

---

# 16. Git Rules

* **Never push directly to `main`.**
* Run `git branch --show-current` before every commit.
* One task = one branch. Do not mix tasks.
* Pull the latest `main` before you start and before you open a PR.
* Keep PRs small (a few hours of work, ideally under 300 changed lines). Open one or two PRs a day, not one huge PR at the end.
* Every PR is reviewed before it is merged.
* Change only files you own (section 4).
* Never commit `node_modules`, `dist`, `.env`, or secrets.
* Never run `npm install <package>` yourself. Ask the team lead (this avoids `package-lock.json` conflicts).
* Never use `git push --force` on a shared branch.
* Never edit another member's branch.
* Format your code with Prettier before you commit.
* Use meaningful commits in the `type(scope): message` format.
* Blocked by someone? Say it in the team chat right away.

### Code freeze

Two hours before the final demo, only bug-fix PRs approved by the team lead are allowed. No new features.

---

# 17. Order of Work

The project is built in phases. Total time: **under 3 days**. The hours are targets, not promises.

### Phase 0 — Foundation (Mohammad) — about 2 hours

The others read the specification and the docs, clone the repo, and prepare their setup.

Result: skeleton on `main`, stubs answering, branch protection on.

### Phase 1 — Parallel work — rest of Day 1

All six work at the same time, each in their own folder.

**First small PRs (merge within the first 2 to 3 hours):**

1. Nawar — validators, `normalize.util.ts`, validation pipe, exception filter
2. Maya — `time.util.ts`
3. Iyad — booking types and store
4. Hassan — shared UI components and utilities
5. Ali — `StatusBadge` and `lastBooking.ts`
6. Mohammad — `PitchesContext` and Pitch Details

Then:

* Nawar — pitches module, then `api.http`
* Maya — DTOs, pricing, availability, quote endpoint
* Iyad — DTOs, create, then find, then cancel
* Hassan — `AvailabilityContext`, Availability page, Home, Not Found
* Ali — `BookingContext`, Booking Form, Confirmation, My Booking
* Mohammad — reviews and integration

Merge order that avoids blocking:

```text
Phase 0 foundation
 ↓
validators + time.util + bookings.store + shared UI   (the "base" PRs)
 ↓
DTOs, pitches, pricing, availability, bookings create/find/cancel
 ↓
contexts and pages replace the stub assumptions
```

### Phase 2 — Real integration — end of Day 1 and morning of Day 2

Everyone:

* replaces every stub with the real code
* connects each context to the real endpoints
* checks errors and messages
* checks refresh behavior
* Nawar runs `api.http` on the full backend and reports failures
* Mohammad runs the full test (section 12)

### Phase 3 — Fix and strengthen — Day 2

* owners fix bugs in their own files
* check every rule and every error case from the specification
* check desktop and mobile layout
* stop-the-backend test

### Phase 4 — Polish and documents — end of Day 2

* polish the UI with the base colors
* README
* check the demo data
* start rehearsing the presentation

### Phase 5 — Final test and presentation — Day 3 (morning)

* code freeze, then the final full test on a clean clone
* two full rehearsals
* both servers start cleanly before presenting

### Optional bonus (only after the minimum works)

Frontend only, no new endpoints, no new technologies:

* filter pitches by type and price range
* sort pitches by price

A bonus never replaces a missing core requirement.

### Daily sync (15 minutes)

* What did I finish?
* What will I do next?
* What blocks me?

---

# 18. Final Definition of Done

The project is complete only when:

### Frontend

* React + TypeScript
* React Router
* React Context for state (`PitchesContext`, `AvailabilityContext`, `BookingContext`)
* all required screens exist and are reachable through navigation
* Home, Pitch Details, Availability, Booking Form, Booking Confirmation, My Booking, Not Found
* the API service layer is used only by the contexts
* loading views
* error views with retry
* empty views
* slot selection with the 1-or-2-hour limit
* calculated prices shown from the API
* booking status badges
* cancel only when allowed
* a clear message for every rejection
* responsive UI
* a consistent look from the base colors

### Backend

* Node.js + NestJS
* in-memory data with seeded pitches and bookings
* GET pitches and pitch details
* GET availability
* GET quote
* POST booking
* POST find booking
* PATCH cancel booking
* DTO classes with validation in every module
* `400`, `404`, and `409` answers with `{ "message": "..." }`
* independent endpoint testing

### Business Rules

* whole-hour bookings only
* inside opening hours
* no past bookings
* up to 14 days ahead
* only 1 or 2 consecutive hours
* no overlap on the same pitch
* different pitches at the same time are allowed
* cancelled bookings do not block slots
* peak hours 18:00–22:00, priced hour by hour
* the system always calculates the price
* name and valid phone required
* unique booking code
* find needs both phone and code
* cancel only more than 2 hours before the match
* cancelled or completed bookings cannot be cancelled
* statuses Confirmed, Cancelled, and Completed shown correctly

### Data

* at least 4 pitches of at least 2 types with different prices
* several bookings in the coming days, including peak hours
* at least one Completed and one Cancelled booking
* every screen shows the latest data, also after a refresh

### Project Quality

* clear, original user interface
* clean folders and consistent names
* no forbidden technologies
* meaningful Git history, no direct pushes to `main`
* a README that works on a clean checkout
* the full test passed
* the demo works without manual fixes
* every member understands the whole project
* every member speaks in the English presentation

These requirements follow the project's functional, technical, team, and presentation expectations.
