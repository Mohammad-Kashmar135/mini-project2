# Weekly Mini Project 02 — Football Pitch Booking

## 1. Purpose

This document explains how the project is organized.

The project is simple: React + TypeScript (with Context for state) on the frontend, NestJS (with DTO validation) on the backend, and data kept in memory.

The backend decides everything important: slots, prices, rules, statuses, and cancellation. The frontend only shows what the backend says.

**Every name in this document is fixed.** Need a new shared name or a change? Ask the team lead first.

## 2. Root Structure

```text
football-pitch-booking/
├── api/
│   ├── src/
│   ├── requests/
│   ├── package.json
│   └── nest-cli.json
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── API.md
│   ├── PROJECT-STRUCTURE.md
│   └── TASKS.md
├── .github/
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── .editorconfig
├── .prettierrc
├── .gitignore
└── README.md
```

| Item | Value |
| --- | --- |
| Backend folder | `api/` |
| Frontend folder | `client/` |
| API prefix | `/api` |
| API URL (local) | `http://localhost:3000/api` |
| Client URL (local) | `http://localhost:5173` |
| Client env variable | `VITE_API_URL` |

## 3. Technology

### Frontend

- React, TypeScript, Vite, React Router
- **React Context** for state (one context per feature)
- Hooks: `useState`, `useEffect`, `useCallback`, `useMemo`, `useContext`
- Plain CSS, one file per page or component
- API service layer in `client/src/services/`
- `sessionStorage` only for the last booking (section 11)

### Backend

- Node.js, NestJS, TypeScript
- In-memory data
- Controllers, services, modules
- **DTO classes** with `class-validator` and `class-transformer`
- One global `ValidationPipe` (`common/validation.pipe.ts`)

### Not allowed

- database, login, user accounts, JWT, sessions, cookies
- external AI services, cloud services, paid APIs
- Redux, React Query, Zustand, or any other state library
- Tailwind or any CSS framework
- payments, maps, SMS, email, notifications, an admin area

Only the team lead installs packages. Need a package? Ask first. This avoids `package-lock.json` conflicts.

## 4. Frontend Structure

```text
client/src/
├── components/
│   ├── common/
│   │   ├── Loading.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Button.tsx
│   │   ├── StatusBadge.tsx
│   │   └── PageContainer.tsx
│   └── layout/
│       ├── Layout.tsx
│       └── Navbar.tsx
├── context/
│   ├── PitchesContext.tsx
│   ├── AvailabilityContext.tsx
│   └── BookingContext.tsx
├── pages/
│   ├── Home/
│   │   ├── HomePage.tsx
│   │   ├── HomePage.css
│   │   └── PitchCard.tsx
│   ├── PitchDetails/
│   │   ├── PitchDetailsPage.tsx
│   │   └── PitchDetailsPage.css
│   ├── Availability/
│   │   ├── AvailabilityPage.tsx
│   │   ├── AvailabilityPage.css
│   │   ├── SlotGrid.tsx
│   │   └── SelectionSummary.tsx
│   ├── BookingForm/
│   │   ├── BookingFormPage.tsx
│   │   ├── BookingFormPage.css
│   │   ├── PriceSummary.tsx
│   │   └── CustomerFields.tsx
│   ├── BookingConfirmation/
│   │   ├── BookingConfirmationPage.tsx
│   │   └── BookingConfirmationPage.css
│   ├── MyBooking/
│   │   ├── MyBookingPage.tsx
│   │   ├── MyBookingPage.css
│   │   ├── FindBookingForm.tsx
│   │   └── BookingDetails.tsx
│   └── NotFound/
│       ├── NotFoundPage.tsx
│       └── NotFoundPage.css
├── routes/
│   └── AppRouter.tsx
├── services/
│   ├── http.ts
│   ├── pitches.api.ts
│   ├── availability.api.ts
│   └── bookings.api.ts
├── types/
│   ├── pitch.types.ts
│   ├── availability.types.ts
│   └── booking.types.ts
├── utils/
│   ├── format.ts
│   ├── date.ts
│   └── lastBooking.ts
├── styles/
│   ├── theme.css
│   └── global.css
├── constants.ts
├── App.tsx
└── main.tsx
```

Every component has its own `.css` file. Page owners may add more small components inside their own page folder.

### 4.1 Routes

All routes are created in Phase 0 and point to placeholder pages. Only the team lead edits `AppRouter.tsx`.

| Route | Page | Owner |
| --- | --- | --- |
| `/` | `HomePage` | Hassan |
| `/pitches/:pitchId` | `PitchDetailsPage` | Mohammad |
| `/pitches/:pitchId/availability?date=YYYY-MM-DD` | `AvailabilityPage` | Hassan |
| `/pitches/:pitchId/book?date=YYYY-MM-DD&start=HH:mm&duration=1\|2` | `BookingFormPage` | Ali |
| `/confirmation/:code` | `BookingConfirmationPage` | Ali |
| `/my-booking` | `MyBookingPage` | Ali |
| `*` | `NotFoundPage` | Hassan |

The date, start time, and duration live in the **URL**, so a page refresh never loses the selection.

The Navbar has: the app name, **Pitches** (`/`), and **My Booking** (`/my-booking`). The other screens are reached through the booking flow.

### 4.2 State with Context

Server data (with its loading and error state) lives in **three contexts**, one for each feature:

```text
client/src/context/
├── PitchesContext.tsx        owner: Mohammad
├── AvailabilityContext.tsx   owner: Hassan
└── BookingContext.tsx        owner: Ali
```

Each file exports a **Provider** and a **hook**:

```text
PitchesProvider       usePitches()
AvailabilityProvider  useAvailability()
BookingProvider       useBooking()
```

`App.tsx` wraps the router with all three providers.

#### The pattern (all three contexts use it)

```tsx
const PitchesContext = createContext<PitchesContextValue | undefined>(undefined);

export function PitchesProvider({ children }: { children: ReactNode }) {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [isPitchesLoading, setIsPitchesLoading] = useState(false);
  const [pitchesError, setPitchesError] = useState<string | null>(null);

  const loadPitches = useCallback(async () => {
    setIsPitchesLoading(true);
    setPitchesError(null);
    try {
      setPitches(await getPitches());
    } catch (err) {
      setPitchesError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsPitchesLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ pitches, isPitchesLoading, pitchesError, loadPitches }),
    [pitches, isPitchesLoading, pitchesError, loadPitches],
  );

  return <PitchesContext.Provider value={value}>{children}</PitchesContext.Provider>;
}

export function usePitches() {
  const context = useContext(PitchesContext);
  if (!context) throw new Error('usePitches must be used inside PitchesProvider');
  return context;
}
```

A page loads its data when it opens:

```tsx
const { pitches, isPitchesLoading, pitchesError, loadPitches } = usePitches();

useEffect(() => {
  loadPitches();
}, [loadPitches]);
```

#### Rules

- Every action that can fail catches the error and saves a readable message. A page is never left loading forever.
- Pages and components never call `services/` or `fetch`. Only contexts do.
- A page reloads its data every time it opens, so it always shows current data.
- A context only holds what the API returned. It never decides business rules.
- The URL is the source for values that must survive a refresh (date, start, duration).

#### Fixed context shapes

**`PitchesContext`** (Mohammad)

```ts
pitches: Pitch[];
isPitchesLoading: boolean;
pitchesError: string | null;
loadPitches(): Promise<void>;

currentPitch: Pitch | null;
isPitchLoading: boolean;
pitchError: string | null;
loadPitch(pitchId: string): Promise<void>;
```

**`AvailabilityContext`** (Hassan)

```ts
availability: DayAvailability | null;
isAvailabilityLoading: boolean;
availabilityError: string | null;
loadAvailability(pitchId: string, date: string): Promise<void>;

selectedIndexes: number[];          // positions in availability.slots, sorted
selectedSlots: Slot[];              // calculated from selectedIndexes
selectionMessage: string | null;    // message when a selection is rejected
toggleSlot(index: number): void;
clearSelection(): void;
```

**`BookingContext`** (Ali)

```ts
quote: Quote | null;
isQuoteLoading: boolean;
quoteError: string | null;
loadQuote(pitchId: string, date: string, startTime: string, durationHours: number): Promise<void>;

booking: Booking | null;            // the booking on screen (created, found, or cancelled)
isBookingLoading: boolean;          // true while submit / lookup / cancel runs
bookingError: string | null;
submitBooking(payload: CreateBookingPayload): Promise<Booking | null>;   // null if it failed
lookupBooking(payload: FindBookingPayload): Promise<boolean>;            // false if it failed
cancelCurrentBooking(): Promise<boolean>;                                // false if it failed
clearBooking(): void;
```

If `cancelCurrentBooking` fails, it reloads the booking with `findBooking`, so the screen shows the real current state.

## 5. Pages

### Home (`/`)

Uses `usePitches()`. Shows one card per pitch with: name, type, normal price, peak price, opening hours, and a **View pitch** link. It also has a dark hero section with one sentence about the app. It has loading, error (with retry), and empty states.

### Pitch Details (`/pitches/:pitchId`)

Uses `usePitches()` (`currentPitch`, `loadPitch`). Shows all pitch information and this explanation:

```text
Peak hours are 18:00–22:00, every day. Any hour that starts inside this period is charged at the peak price.
```

It has a **Check availability** button. An unknown pitch shows `Pitch not found.` and a link to Home.

### Availability (`/pitches/:pitchId/availability`)

Uses `useAvailability()` and `usePitches()` (for the pitch name). Shows:

- the pitch name
- a **date input** (from today to today + 14 days)
- every hourly slot: time, price, a peak tag, and its status (available, booked, or past)
- a legend
- a summary of the selected slots

How selecting works (`toggleSlot`):

1. Click an available slot: it is selected.
2. Click a second available slot **next to the first**: both are selected (2 hours).
3. Click a slot that is not next to it, or a third slot: nothing changes, and the message `Please choose one or two consecutive hours.` is shown.
4. Click a selected slot: it is removed.
5. Booked and past slots cannot be selected.
6. Changing the date or pitch clears the selection.
7. **Continue to booking** is enabled when at least one slot is selected. It opens the Booking Form with `date`, `start`, and `duration` in the URL.

The page never decides if a slot is free or what it costs. It shows the API values.

### Booking Form (`/pitches/:pitchId/book`)

Uses `useBooking()` and `usePitches()`. Reads `date`, `start`, and `duration` from the URL. If one is missing, it shows a message and a link to Availability.

It loads the pitch and the quote, then shows: pitch, date, start and end time, duration, the price of each hour, and the total (all from the quote). It has name and phone fields and a **Confirm booking** button.

On submit:

- the button is disabled while the request runs (no double submit)
- success: save the last booking (section 11) and open `/confirmation/:code`
- failure: show `bookingError` inside the form, with a link back to Availability

### Booking Confirmation (`/confirmation/:code`)

Uses `useBooking()`. It always reloads the booking from the backend, so the **current** status is shown (also after a refresh). Shows: code, pitch, date, start and end time, duration, total price, name, phone, status badge, and a reminder:

```text
You can cancel this booking until 2 hours before the match starts.
```

No saved last booking? It shows a friendly message and a link to My Booking.

### My Booking (`/my-booking`)

Uses `useBooking()`. A form with phone + code. After **Find booking**:

- found: details, status badge, and the cancel area
- not found: `Booking not found. Check your phone number and booking code.`
- **Cancel booking** shows only when `canCancel` is `true`, and asks to confirm first
- when `canCancel` is `false`, an explanation shows instead:
  - `Cancelled`: `This booking has been cancelled.`
  - `Completed`: `This match has already been played.`
  - `Confirmed`: `The cancellation deadline has passed. Matches can only be cancelled more than 2 hours before they start.`

### Not Found

A friendly 404 page with a link to Home.

## 6. Components

### Shared components (`components/common/`)

Props are fixed:

| Component | Props | Owner |
| --- | --- | --- |
| `Loading` | `message?: string` | Hassan |
| `ErrorMessage` | `message: string`, `onRetry?: () => void` | Hassan |
| `EmptyState` | `title: string`, `description?: string` | Hassan |
| `Button` | `variant?: 'primary' \| 'secondary' \| 'danger' \| 'accent'`, `isLoading?: boolean`, plus normal button props | Hassan |
| `StatusBadge` | `status: BookingStatus` | Ali |
| `PageContainer` | `title?: string`, `children` | Mohammad |

`StatusBadge` colors: `Confirmed` is success, `Cancelled` is error, `Completed` is info.

In Phase 0 the team lead creates simple placeholder versions with these exact props, so every page can import them from day one.

### Rules

- Components do not know prices, slot statuses, or cancellation rules. They show values from the API.
- Components never call `fetch` or `services/`.
- Page-only components stay inside the page folder.

## 7. Backend Structure

```text
api/src/
├── common/
│   ├── constants.ts
│   ├── clock.service.ts
│   ├── common.module.ts
│   ├── time.util.ts
│   ├── normalize.util.ts
│   ├── validators.ts
│   ├── validation.pipe.ts
│   └── all-exceptions.filter.ts
├── data/
│   └── seed.data.ts
├── pitches/
│   ├── dto/pitch-id-param.dto.ts
│   ├── pitches.module.ts
│   ├── pitches.controller.ts
│   ├── pitches.service.ts
│   └── pitch.types.ts
├── availability/
│   ├── dto/availability-query.dto.ts
│   ├── availability.module.ts
│   ├── availability.controller.ts
│   ├── availability.service.ts
│   └── availability.types.ts
├── pricing/
│   ├── dto/quote-query.dto.ts
│   ├── pricing.module.ts
│   ├── pricing.controller.ts
│   ├── pricing.service.ts
│   └── pricing.types.ts
├── bookings/
│   ├── dto/
│   │   ├── create-booking.dto.ts
│   │   ├── find-booking.dto.ts
│   │   ├── cancel-booking.dto.ts
│   │   └── booking-code-param.dto.ts
│   ├── bookings.module.ts
│   ├── bookings.controller.ts
│   ├── bookings.service.ts
│   ├── bookings.store.ts
│   ├── booking-code.util.ts
│   └── booking.types.ts
├── app.module.ts
└── main.ts

api/requests/
└── api.http
```

### 7.1 `common/`

| File | What it does | Owner |
| --- | --- | --- |
| `constants.ts` | Business constants (below) | Mohammad |
| `clock.service.ts` | `ClockService.now()`, the only source of the current time | Mohammad |
| `common.module.ts` | Global module that exports `ClockService` | Mohammad |
| `time.util.ts` | Time and date helpers | Maya |
| `normalize.util.ts` | `normalizePhone`, `normalizeCode` | Nawar |
| `validators.ts` | Custom validation decorators | Nawar |
| `validation.pipe.ts` | `createValidationPipe()`, one readable message per error | Nawar |
| `all-exceptions.filter.ts` | Turns every error into `{ "message": "..." }` | Nawar |

Business constants live **only** in `constants.ts`:

```ts
export const PEAK_START_HOUR = 18;
export const PEAK_END_HOUR = 22;
export const MAX_ADVANCE_DAYS = 14;
export const MAX_DURATION_HOURS = 2;
export const CANCEL_LIMIT_HOURS = 2;
export const BOOKING_CODE_PREFIX = 'PB-';
```

### 7.2 Data

`data/seed.data.ts` has the starting pitches and bookings. It exports `SEED_PITCHES` and `createSeedBookings()`. `PitchesService` reads the pitches. `BookingsStore` loads the bookings when the server starts.

### 7.3 Validation and DTOs

Every backend member writes the DTOs for **their own module**. Validation has two layers:

| Layer | Where | Examples |
| --- | --- | --- |
| Format | DTO classes | real date, time on the hour, duration 1 or 2, name not empty, valid phone |
| Rules | Services | 14-day limit, opening hours, past times, overlap, cancellation |

#### Custom decorators (`validators.ts`, Nawar)

| Decorator | Passes when |
| --- | --- |
| `@IsCalendarDate()` | string `YYYY-MM-DD` and a real date (`2026-02-31` fails) |
| `@IsOnTheHour()` | string `HH:00` (`18:30` fails) |
| `@IsValidPhone()` | optional `+`, then 8 to 15 digits (spaces and dashes are removed first) |

Other decorators used: `@IsString`, `@IsNotEmpty`, `@IsIn`, `@Type`, `@Transform`.

#### DTO classes

| DTO | File | Owner | Properties (in order) |
| --- | --- | --- | --- |
| `PitchIdParamDto` | `pitches/dto/pitch-id-param.dto.ts` | Nawar | `pitchId` |
| `AvailabilityQueryDto` | `availability/dto/availability-query.dto.ts` | Maya | `date` |
| `QuoteQueryDto` | `pricing/dto/quote-query.dto.ts` | Maya | `date`, `startTime`, `durationHours` |
| `CreateBookingDto` | `bookings/dto/create-booking.dto.ts` | Iyad | `pitchId`, `date`, `startTime`, `durationHours`, `customerName`, `customerPhone` |
| `FindBookingDto` | `bookings/dto/find-booking.dto.ts` | Iyad | `customerPhone`, `code` |
| `CancelBookingDto` | `bookings/dto/cancel-booking.dto.ts` | Iyad | `customerPhone` |
| `BookingCodeParamDto` | `bookings/dto/booking-code-param.dto.ts` | Iyad | `code` |

DTO rules:

- Write the properties **in the order above**. The first failing property decides the message.
- Every decorator has its own `message` from `docs/API.md`.
- The name is trimmed and the phone is cleaned with `@Transform`, **before** validation. The code is cleaned with `normalizeCode`.
- In a **body**, `durationHours` must be the number `1` or `2` (`@IsIn([1, 2])`). The text `"2"` is rejected.
- In a **query**, `durationHours` arrives as text, so use `@Type(() => Number)` first.
- DTOs hold no business rules.

#### Validation pipe (Nawar)

`createValidationPipe()` returns a `ValidationPipe` with:

```text
transform: true
whitelist: true
stopAtFirstError: true
exceptionFactory → one BadRequestException with ONE message (the first error)
```

`main.ts` registers it globally.

### 7.4 Fixed method names

| Service | Public methods | Owner |
| --- | --- | --- |
| `PitchesService` | `findAll()`, `findById(id)` (throws `NotFoundException('Pitch not found.')`) | Nawar |
| `PricingService` | `isPeakHour(hour)`, `getHourPrice(pitch, hour)`, `calculateTotalPrice(pitch, startHour, durationHours)`, `getQuote(pitch, date, startTime, durationHours)` | Maya |
| `AvailabilityService` | `getDayAvailability(pitchId, date)` | Maya |
| `BookingsStore` | `findAll()`, `findByCode(code)`, `findActiveByPitchAndDate(pitchId, date)`, `save(booking)`, `generateUniqueCode()` | Iyad |
| `BookingsService` | `createBooking(dto)`, `findBooking(dto)`, `cancelBooking(code, dto)`, `getBookingStatus(booking, now)`, `canCancel(booking, now)`, `toBookingResponse(booking)` | Iyad |
| `ClockService` | `now()` | Mohammad |

`time.util.ts` (Maya):

```ts
parseHour(time: string): number            // '08:00' -> 8
formatHour(hour: number): string           // 8 -> '08:00'
toDateString(date: Date): string           // local date -> 'YYYY-MM-DD'
toDateTime(date: string, hour: number): Date
isPastSlot(date: string, hour: number, now: Date): boolean
isWithinBookingWindow(date: string, now: Date): boolean
```

`normalize.util.ts` (Nawar):

```ts
normalizePhone(value: string): string      // removes spaces and dashes
normalizeCode(value: string): string       // trim + uppercase
```

Controller methods:

| Controller | Methods |
| --- | --- |
| `PitchesController` | `getPitches`, `getPitchById` |
| `AvailabilityController` | `getDayAvailability` |
| `PricingController` | `getQuote` |
| `BookingsController` | `createBooking`, `findBooking`, `cancelBooking` |

### 7.5 Who calls whom

```text
PitchesController       -> PitchesService
AvailabilityController  -> AvailabilityService -> PitchesService, PricingService, BookingsStore
PricingController       -> PitchesService, PricingService
BookingsController      -> BookingsService     -> PitchesService, PricingService, BookingsStore
```

Module imports:

```text
PitchesModule       exports PitchesService
PricingModule       imports PitchesModule, exports PricingService
BookingsModule      imports PitchesModule, PricingModule, exports BookingsStore
AvailabilityModule  imports PitchesModule, PricingModule, BookingsModule
```

There are no circular imports. `BookingsService` does its own overlap check with `BookingsStore`.

`BookingsStore.findActiveByPitchAndDate` never returns cancelled bookings.

### 7.6 Application start (`main.ts`, Mohammad)

- global prefix `api`
- CORS for `http://localhost:5173`
- global validation pipe: `createValidationPipe()`
- global `AllExceptionsFilter`
- port `3000`

### 7.7 `api/requests/api.http`

One saved request for each item in `docs/API.md`, section 18. Owner: Nawar.

## 8. Where Each Rule Is Enforced

The backend enforces every rule. The frontend only guides the user.

| Rule | Backend (decides) | Frontend (guides) |
| --- | --- | --- |
| Whole hours | `@IsOnTheHour` | Slots are hourly buttons |
| Inside opening hours | `BookingsService`, `PricingService.getQuote` | Only slots inside opening hours |
| No past booking | `isPastSlot` | Past slots are disabled |
| Up to 14 days ahead | `isWithinBookingWindow` | Date input limited to 14 days |
| 1 or 2 hours | `@IsIn([1, 2])` | Maximum two slots |
| Consecutive hours | A booking is `startTime + durationHours` | Second slot must be next to the first |
| No overlap on one pitch | `BookingsService.createBooking` (409) | Booked slots disabled; backend message shown |
| Different pitches allowed | Overlap is checked per pitch | — |
| Cancelled does not block | `findActiveByPitchAndDate` skips cancelled | — |
| Peak 18:00–22:00 | `PricingService.isPeakHour` | Shows `isPeak` and the explanation |
| Price calculated by the system | `PricingService` | Shows quote values |
| Name + valid phone | `CreateBookingDto` | Empty-field check; backend message shown |
| Unique booking code | `BookingsStore.generateUniqueCode` | Shows the code |
| Find needs phone AND code | `FindBookingDto`, `BookingsService.findBooking` | Form with both fields |
| Cancel only if more than 2 hours away | `BookingsService.canCancel` | Cancel button only when `canCancel` is true |
| Cancelled or completed cannot be cancelled | `BookingsService.cancelBooking` | Explanation instead of the button |
| Statuses | `getBookingStatus` | `StatusBadge` |

## 9. What the Backend Calculates

Only the backend calculates:

```text
slot status, slot price, isPeak
quote and total price
booking code
booking status
canCancel
endTime
```

The frontend must not:

- calculate a price, a total, or an end time
- decide if a booking can be cancelled
- decide if a slot can be booked
- keep its own copy of bookings to find conflicts

The only constant the client repeats is `MAX_ADVANCE_DAYS = 14` in `client/src/constants.ts`. It only limits the date input. The backend enforces the rule anyway.

## 10. API Service

```text
client/src/services/
├── http.ts
├── pitches.api.ts
├── availability.api.ts
└── bookings.api.ts
```

| File | Exports | Used by |
| --- | --- | --- |
| `http.ts` | `request<T>(path, options?)`, `ApiError` | the other service files |
| `pitches.api.ts` | `getPitches()`, `getPitchById(pitchId)` | `PitchesContext` |
| `availability.api.ts` | `getDayAvailability(pitchId, date)` | `AvailabilityContext` |
| `bookings.api.ts` | `getQuote(...)`, `createBooking(payload)`, `findBooking(payload)`, `cancelBooking(code, payload)` | `BookingContext` |

The service builds URLs, sends JSON, reads responses, and turns errors into `ApiError` (using the backend `message`). A network failure gives `status: 0` and the message `Cannot reach the server. Please check your connection and try again.`

## 11. Last Booking Helper

After a booking succeeds, the Booking Form saves the code and phone. The Confirmation page uses them to reload the booking after a refresh.

```text
client/src/utils/lastBooking.ts      owner: Ali
```

```ts
saveLastBooking(code: string, customerPhone: string): void
getLastBooking(): { code: string; customerPhone: string } | null
```

It uses `sessionStorage` with the key `pb.lastBooking`. Wrap every read and write in `try/catch`.

## 12. TypeScript Types

`client/src/types/` copies `docs/API.md`. The team lead creates these files in Phase 0.

```ts
// pitch.types.ts
interface Pitch {
  id: string;
  name: string;
  type: string;
  description: string;
  surface: string;
  normalPricePerHour: number;
  peakPricePerHour: number;
  openingTime: string;
  closingTime: string;
}

// availability.types.ts
type SlotStatus = 'available' | 'booked' | 'past';

interface Slot {
  startTime: string;
  endTime: string;
  status: SlotStatus;
  price: number;
  isPeak: boolean;
}

interface DayAvailability {
  pitchId: string;
  date: string;
  slots: Slot[];
}

// booking.types.ts
type BookingStatus = 'Confirmed' | 'Cancelled' | 'Completed';

interface Booking {
  code: string;
  pitchId: string;
  pitchName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  status: BookingStatus;
  canCancel: boolean;
}

interface QuoteHour {
  startTime: string;
  price: number;
  isPeak: boolean;
}

interface Quote {
  pitchId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  hours: QuoteHour[];
  totalPrice: number;
}

interface CreateBookingPayload {
  pitchId: string;
  date: string;
  startTime: string;
  durationHours: 1 | 2;
  customerName: string;
  customerPhone: string;
}

interface FindBookingPayload {
  customerPhone: string;
  code: string;
}

interface CancelBookingPayload {
  customerPhone: string;
}
```

## 13. Base Colors

All colors are CSS variables in `client/src/styles/theme.css`. **Never write a color directly in a page or component.** In `main.tsx`, import `theme.css` first and `global.css` second.

| Variable | Value | Use |
| --- | --- | --- |
| `--color-primary` | `#15803d` | Main buttons, selected slot, links |
| `--color-primary-dark` | `#166534` | Hover |
| `--color-primary-light` | `#dcfce7` | Light green backgrounds, available slots |
| `--color-dark` | `#0b1f17` | Navbar and hero |
| `--color-accent` | `#a3e635` | Main button on dark backgrounds |
| `--color-peak` | `#f59e0b` | Peak price |
| `--color-bg` | `#f4f7f5` | Page background |
| `--color-surface` | `#ffffff` | Cards |
| `--color-border` | `#dce5df` | Borders |
| `--color-text` | `#0f1f18` | Text |
| `--color-text-muted` | `#5b6b63` | Secondary text |
| `--color-success` | `#16a34a` | Confirmed |
| `--color-error` | `#dc2626` | Cancelled, booked slot, errors |
| `--color-info` | `#2563eb` | Completed |

Slot colors: available is light green with a green border, selected is solid green, booked is red, past is gray. For a light tint of a color use `color-mix(in srgb, var(--color-error) 12%, white)`.

Color is never the only signal. Every slot and status also shows a text label.

## 14. CSS Rules

Plain CSS is global, so class names must never clash.

1. Colors come only from `theme.css`.
2. Every class starts with its owner prefix (BEM style: `prefix__element--modifier`).
3. No bare element selectors (`button`, `h1`, `a`) outside `global.css`.
4. A page's CSS file is imported only by that page.
5. Never style another owner's classes.

| Owner | Prefix | Example |
| --- | --- | --- |
| Home | `home-` | `.home-page__grid` |
| Pitch Details | `pitch-details-` | `.pitch-details-page__peak-note` |
| Availability | `availability-` | `.availability-page__slot--booked` |
| Booking Form | `booking-form-` | `.booking-form-page__field` |
| Booking Confirmation | `booking-confirmation-` | `.booking-confirmation-page__code` |
| My Booking | `my-booking-` | `.my-booking-page__result` |
| Not Found | `not-found-` | `.not-found-page__title` |
| Shared UI | `ui-` | `.ui-button--primary` |
| Layout | `layout-` | `.layout-navbar__link` |

## 15. Naming

### Data

- JSON fields: `camelCase`. Dates `YYYY-MM-DD`, times `HH:mm`.
- Slot status is lowercase. Booking status starts with a capital letter.
- Pitch IDs: `pitch-a`, `pitch-b`, ... Booking codes: `PB-` and four digits.

### Backend

- Files: `<name>.controller.ts`, `.service.ts`, `.module.ts`, `.store.ts`, `.util.ts`, `.types.ts`, and `<name>.dto.ts` inside `dto/`.
- Classes: `PascalCase` (DTOs end with `Dto`). Methods and variables: `camelCase`. Constants: `UPPER_SNAKE_CASE`.
- Use `ClockService.now()`. Never use `new Date()` for "now" in a service.

### Frontend

- Components and pages: `PascalCase`. Each page has `<Name>Page.tsx` and `<Name>Page.css`.
- Contexts: `<Feature>Context.tsx`, exporting `<Feature>Provider` and `use<Feature>()`.
- Hooks start with `use`. Event handlers start with `handle`. Booleans start with `is`, `has`, or `can`.
- Shared utilities:

| File | Functions | Owner |
| --- | --- | --- |
| `utils/format.ts` | `formatDate(date)`, `formatTime(time)`, `formatPrice(amount)`, `formatDuration(hours)` | Hassan |
| `utils/date.ts` | `toDateString(date)`, `getTodayString()`, `addDaysToToday(days)` | Hassan |
| `utils/lastBooking.ts` | `saveLastBooking`, `getLastBooking` | Ali |

### Git

- Branches: `be/<module>-<description>` or `fe/<page>-<description>`.
- Commits: `type(scope): message` (types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`).

## 16. Ownership

One owner for every file. Edit only your own files.

### Frontend

| Owner | Files |
| --- | --- |
| Mohammad | `App.tsx`, `main.tsx`, `routes/`, `styles/`, `components/layout/`, `components/common/PageContainer*`, `services/http.ts`, `services/pitches.api.ts`, `types/pitch.types.ts`, `context/PitchesContext.tsx`, `pages/PitchDetails/` |
| Hassan | `pages/Home/`, `pages/NotFound/`, `pages/Availability/`, `context/AvailabilityContext.tsx`, `services/availability.api.ts`, `types/availability.types.ts`, `components/common/` (`Loading`, `ErrorMessage`, `EmptyState`, `Button`), `utils/format.ts`, `utils/date.ts`, `constants.ts` |
| Ali | `pages/BookingForm/`, `pages/MyBooking/`, `pages/BookingConfirmation/`, `context/BookingContext.tsx`, `services/bookings.api.ts`, `types/booking.types.ts`, `components/common/StatusBadge*`, `utils/lastBooking.ts` |

### Backend

| Owner | Files |
| --- | --- |
| Mohammad | `main.ts`, `app.module.ts`, `common/constants.ts`, `common/clock.service.ts`, `common/common.module.ts`, `data/seed.data.ts` |
| Nawar | `pitches/`, `common/validators.ts`, `common/normalize.util.ts`, `common/validation.pipe.ts`, `common/all-exceptions.filter.ts`, `api/requests/api.http` |
| Maya | `availability/`, `pricing/`, `common/time.util.ts` |
| Iyad | `bookings/` |

### Docs and repository

| Owner | Files |
| --- | --- |
| Mohammad | `docs/`, `README.md`, `.github/`, `.editorconfig`, `.prettierrc`, `.gitignore`, `package.json` files |

Need a change in someone else's file? Ask the owner. Do not edit it.

## 17. Loading and Errors

Every page that loads data must have:

- a loading view (`Loading`)
- an error view with the backend message and a retry button (`ErrorMessage`)
- an empty view where it makes sense (`EmptyState`)
- a disabled submit button while a request runs

A failed request must never leave a blank or frozen page. The user always gets a clear reason. Backend messages are shown as they are.

## 18. Architecture Rules

- Only contexts call `services/`. No `fetch` in pages or components.
- Server state lives in the three contexts. No other state library.
- No database, login, or user accounts.
- No price, status, or cancellation logic in the frontend.
- Backend "now" always comes from `ClockService`.
- Business constants only in `common/constants.ts`.
- Format checks only in DTOs. Business rules only in services.
- No hardcoded colors.
- Every CSS class uses its owner prefix.
- The overlap check and the save run together, with no `await` between them.
- Update `docs/API.md` when the contract changes.
- Only the team lead edits shared files and installs packages.

## 19. Checks Before Merging

- the backend starts (`npm run start:dev` in `api/`)
- the frontend builds (`npm run build` in `client/`)
- your feature works with the real API, not only the stubs
- loading, error, and empty states exist
- wrong input shows a clear message
- no console errors
- the page looks fine on a phone-sized screen
- only your own files changed

Before the final demo, run the full test in `docs/TASKS.md`, section 12.
