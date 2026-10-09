# Football Pitch Booking API

## 1. Overview

The API is the **source of truth** for the whole application. The frontend only shows what the API returns.

The backend decides:

- which slots are available, booked, or past
- the price of every hour (normal or peak)
- if a booking is accepted or rejected
- the booking code
- the booking status (Confirmed, Cancelled, Completed)
- if a booking can still be cancelled

The API uses Node.js, NestJS, and in-memory data. There is no database, login, or user account.

## 2. Base URL

```text
http://localhost:3000/api
```

Frontend environment variable:

```text
VITE_API_URL=http://localhost:3000/api
```

All routes below start with `/api`.

## 3. Endpoint Summary

| Method | Endpoint | Purpose | Backend owner |
| --- | --- | --- | --- |
| GET | `/pitches` | List all pitches | Nawar |
| GET | `/pitches/:pitchId` | One pitch | Nawar |
| GET | `/pitches/:pitchId/availability?date=YYYY-MM-DD` | Hourly slots for one date | Maya |
| GET | `/pitches/:pitchId/quote?date=&startTime=&durationHours=` | Price of a selection | Maya |
| POST | `/bookings` | Create a booking | Iyad |
| POST | `/bookings/find` | Find a booking (phone + code) | Iyad |
| PATCH | `/bookings/:code/cancel` | Cancel a booking | Iyad |

## 4. Data Shapes

All JSON fields use `camelCase`.

```text
date     YYYY-MM-DD     example: 2026-10-16
time     HH:mm          example: 20:00  (always on the hour)
```

### 4.1 Pitch

```json
{
  "id": "pitch-a",
  "name": "Pitch A",
  "type": "5-a-side",
  "description": "Compact indoor pitch, ideal for quick matches with friends.",
  "surface": "Artificial grass",
  "normalPricePerHour": 20,
  "peakPricePerHour": 30,
  "openingTime": "08:00",
  "closingTime": "23:00"
}
```

### 4.2 Slot

```json
{
  "startTime": "20:00",
  "endTime": "21:00",
  "status": "available",
  "price": 30,
  "isPeak": true
}
```

`status` is `available`, `booked`, or `past` (lowercase).

### 4.3 DayAvailability

```json
{
  "pitchId": "pitch-a",
  "date": "2026-10-16",
  "slots": []
}
```

`slots` is a list of Slot, ordered by `startTime`.

### 4.4 Quote

```json
{
  "pitchId": "pitch-a",
  "date": "2026-10-16",
  "startTime": "17:00",
  "endTime": "19:00",
  "durationHours": 2,
  "hours": [
    { "startTime": "17:00", "price": 20, "isPeak": false },
    { "startTime": "18:00", "price": 30, "isPeak": true }
  ],
  "totalPrice": 50
}
```

### 4.5 Booking

```json
{
  "code": "PB-4821",
  "pitchId": "pitch-a",
  "pitchName": "Pitch A",
  "date": "2026-10-16",
  "startTime": "20:00",
  "endTime": "22:00",
  "durationHours": 2,
  "customerName": "Karim",
  "customerPhone": "0912345678",
  "totalPrice": 60,
  "status": "Confirmed",
  "canCancel": true
}
```

`status` is `Confirmed`, `Cancelled`, or `Completed` (capitalized). `status` and `canCancel` are calculated by the backend every time (section 12).

## 5. GET /pitches

```http
GET /api/pitches
```

```text
200 OK
```

Returns a list of Pitch. The app always has at least 4 pitches of at least 2 types.

## 6. GET /pitches/:pitchId

```text
200 OK    → one Pitch
```

Unknown pitch:

```text
404 Not Found
```

```json
{ "message": "Pitch not found." }
```

## 7. GET /pitches/:pitchId/availability

Returns every hourly slot of one date.

```http
GET /api/pitches/pitch-a/availability?date=2026-10-16
```

```json
{
  "pitchId": "pitch-a",
  "date": "2026-10-16",
  "slots": [
    { "startTime": "08:00", "endTime": "09:00", "status": "available", "price": 20, "isPeak": false },
    { "startTime": "19:00", "endTime": "20:00", "status": "booked", "price": 30, "isPeak": true }
  ]
}
```

(Shortened. A real response has one slot for every hour from opening time up to, but not including, closing time. For 08:00–23:00 that is 15 slots.)

### Slot rules

- `price` is the price of that one hour. It is the peak price when the hour starts between 18:00 and 21:00 (the last peak hour is 21:00–22:00), otherwise the normal price.
- `isPeak` is `true` when `price` is the peak price.
- `past`: the slot has already started. This covers the earlier hours of today and every slot of a past date.
- `booked`: an active booking covers the slot (and the slot is not past).
- `available`: everything else.
- `past` wins over `booked`.
- A cancelled booking never blocks a slot.

### Date rules

| Date | Result |
| --- | --- |
| Today up to today + 14 days | `200` |
| A past date | `200`, every slot is `past` |
| More than 14 days ahead | `400` |
| Missing, wrong format, or not a real date | `400` |

```json
{ "message": "Invalid date. Use the format YYYY-MM-DD." }
```

```json
{ "message": "Bookings can only be made up to 14 days in advance." }
```

An unknown pitch returns `404` with `Pitch not found.`

## 8. GET /pitches/:pitchId/quote

Gives the price of a selection **before** booking. The Booking Form uses it, so the frontend never calculates prices.

```http
GET /api/pitches/pitch-a/quote?date=2026-10-16&startTime=17:00&durationHours=2
```

```text
200 OK    → Quote (section 4.4)
```

### Pricing

Each hour is priced alone. An hour is peak when it starts at 18:00, 19:00, 20:00, or 21:00.

```text
17:00–19:00 = normal (17:00) + peak (18:00)
21:00–23:00 = peak (21:00) + normal (22:00)
```

### Errors

The quote checks the format and the opening hours. Past times and conflicts are checked only when the booking is created.

| Problem | Status | Message |
| --- | --- | --- |
| Unknown pitch | 404 | `Pitch not found.` |
| Bad date | 400 | `Invalid date. Use the format YYYY-MM-DD.` |
| More than 14 days ahead | 400 | `Bookings can only be made up to 14 days in advance.` |
| Start time not on the hour | 400 | `Start time must be on the hour, for example 18:00.` |
| Duration is not 1 or 2 | 400 | `A booking can be one or two hours only.` |
| Outside opening hours | 400 | `The booking must be within the pitch's opening hours.` |

## 9. POST /bookings

Creates a booking.

```http
POST /api/bookings
Content-Type: application/json
```

```json
{
  "pitchId": "pitch-a",
  "date": "2026-10-16",
  "startTime": "20:00",
  "durationHours": 2,
  "customerName": "Karim",
  "customerPhone": "0912345678"
}
```

The customer never sends a price, status, or code.

### Success

```text
201 Created    → Booking with status "Confirmed" and a unique code
```

### Checks (in this order, the first problem is returned)

**Part 1 — format (DTO).** Fields are checked in this order:

1. `pitchId` is not empty
2. `date` is a real date `YYYY-MM-DD`
3. `startTime` is on the hour
4. `durationHours` is the number `1` or `2`
5. `customerName` is not empty
6. `customerPhone` is valid

**Part 2 — rules (service).**

7. the pitch exists
8. the date is not more than 14 days ahead
9. the booking is inside opening hours
10. the start time has not already started
11. the time does not overlap an active booking on the same pitch

### Errors

| Problem | Status | Message |
| --- | --- | --- |
| Missing `pitchId` | 400 | `Pitch ID is required.` |
| Bad date | 400 | `Invalid date. Use the format YYYY-MM-DD.` |
| Not on the hour | 400 | `Start time must be on the hour, for example 18:00.` |
| Duration not 1 or 2 | 400 | `A booking can be one or two hours only.` |
| Missing name | 400 | `Customer name is required.` |
| Missing or invalid phone | 400 | `A valid phone number is required.` |
| Unknown pitch | 404 | `Pitch not found.` |
| More than 14 days ahead | 400 | `Bookings can only be made up to 14 days in advance.` |
| Outside opening hours | 400 | `The booking must be within the pitch's opening hours.` |
| Already started or past | 400 | `This time has already started or passed. Please choose a future time.` |
| Overlaps an active booking (any part) | 409 | `This time is already booked on this pitch. Please choose another time.` |

### Good to know

- Bookings on **different pitches** at the same time are allowed.
- Two bookings on the same pitch must never overlap, even by one hour.
- A cancelled booking does not block its slot.
- Sending the same request twice (double click) must not create two bookings. The second one gets `409`.
- The overlap check and the save run together, with no `await` between them.

## 10. POST /bookings/find

Finds a booking. Phone and code must both match the same booking.

```json
{
  "customerPhone": "0912345678",
  "code": "PB-4821"
}
```

```text
200 OK    → Booking with its current status and canCancel
```

- The code is trimmed and not case-sensitive (`pb-4821` equals `PB-4821`).
- The phone is cleaned first (section 13) and then compared.
- A wrong phone and a wrong code give the **same** answer. Nobody can see another customer's booking.

| Problem | Status | Message |
| --- | --- | --- |
| Missing or invalid phone | 400 | `A valid phone number is required.` |
| Missing code | 400 | `Booking code is required.` |
| No booking matches both | 404 | `Booking not found. Check your phone number and booking code.` |

## 11. PATCH /bookings/:code/cancel

```http
PATCH /api/bookings/PB-4821/cancel
```

```json
{
  "customerPhone": "0912345678"
}
```

```text
200 OK    → updated Booking with status "Cancelled" and canCancel false
```

The slots become `available` again immediately.

### When can a booking be cancelled?

Only when **both** are true:

- its status is `Confirmed`
- the match starts **more than 2 hours** from now (exactly 2 hours is too late)

### Errors (checked in this order)

| Problem | Status | Message |
| --- | --- | --- |
| Missing or invalid phone | 400 | `A valid phone number is required.` |
| Code and phone do not match | 404 | `Booking not found. Check your phone number and booking code.` |
| Already cancelled | 400 | `This booking is already cancelled.` |
| Completed | 400 | `This booking is completed and cannot be cancelled.` |
| Starts in 2 hours or less | 400 | `Cancellation is no longer possible. The match starts in 2 hours or less.` |

## 12. Calculated Values

The backend calculates these on every read. They are never stored.

```text
status:
  stored as Cancelled                  → Cancelled
  otherwise, end time has passed       → Completed
  otherwise                            → Confirmed

canCancel:
  status is Confirmed AND the match starts in more than 2 hours

endTime:
  startTime + durationHours

totalPrice:
  sum of the price of each booked hour (calculated when the booking is created)
```

## 13. Validation Rules

The **format** rules are checked by the DTO classes. The **business** rules are checked by the services.

**Phone.** Spaces and dashes are removed first. Then: an optional `+`, followed by 8 to 15 digits.

```text
0912345678        valid
+963 912 345 678  valid (saved as +963912345678)
12345             invalid (too short)
09123abc78        invalid
```

**Name.** A string with at least one character that is not a space.

**Date.** `YYYY-MM-DD` and a real calendar date.

**Start time.** `HH:00` only. `18:30` is rejected.

**Duration.** The number `1` or `2`. The text `"2"`, `0`, `3`, and negative numbers are rejected.

## 14. Errors

Every error from every endpoint has this shape:

```json
{ "message": "Human-readable reason." }
```

| Status | Meaning |
| --- | --- |
| 200 | Success |
| 201 | Booking created |
| 400 | Invalid input or a rule was broken |
| 404 | Pitch, booking, or endpoint not found |
| 409 | The time is already booked |
| 500 | Unexpected server error |

Other messages:

```json
{ "message": "Endpoint not found." }
```

```json
{ "message": "Invalid request body." }
```

```json
{ "message": "Something went wrong. Please try again." }
```

The messages in this document are fixed. The frontend shows them as they are.

The frontend service turns a network failure into an error with the message `Cannot reach the server. Please check your connection and try again.`

## 15. Runtime State

Data is kept in memory:

```text
pitches    loaded from seed data at startup, never changed
bookings   loaded from seed data at startup, then changed by the API
```

A stored booking has: `code`, `pitchId`, `date`, `startTime`, `endTime`, `durationHours`, `customerName`, `customerPhone`, `totalPrice`, `status` (Confirmed or Cancelled), `createdAt`, `cancelledAt` (optional).

`Completed` is never stored. All data resets when the server restarts. This is expected.

## 16. Time

All "now" checks use `ClockService.now()`. Dates and times use the server's local time zone.

## 17. Frontend API Service

```text
client/src/services/
├── http.ts
├── pitches.api.ts
├── availability.api.ts
└── bookings.api.ts
```

Functions:

```ts
getPitches()
getPitchById(pitchId)
getDayAvailability(pitchId, date)
getQuote(pitchId, date, startTime, durationHours)
createBooking(payload)
findBooking(payload)
cancelBooking(code, payload)
```

The service builds URLs, sends JSON, reads responses, and turns every error into an `ApiError`. Only the React Contexts call these functions. Pages and components use the contexts.

## 18. Testing Checklist

Nawar keeps one request for each item in `api/requests/api.http`.

**Pitches:** list, one pitch, missing pitch.

**Availability:** a future date, a past date (all `past`), today + 14 (allowed), today + 15 (`400`), bad date, a booked slot, a slot of a cancelled booking.

**Quote:** a normal hour, a peak hour, normal + peak, outside opening hours, duration 3.

**Create booking:** valid 1 hour, valid 2 hours, overlap (full), overlap (partial), same time on another pitch (allowed), past time, over 14 days, outside opening hours, duration 3, missing name, invalid phone, missing pitch, same request twice (second is `409`).

**Find:** correct phone + code, wrong phone, wrong code, code in lowercase.

**Cancel:** more than 2 hours away, 2 hours or less, already cancelled, completed, wrong phone.

**Status:** new booking is `Confirmed`, cancelled is `Cancelled`, a past confirmed booking is `Completed`.

**Frontend:** an API failure shows a message and a retry button, never a blank page.

## 19. Changing the Contract

When an endpoint or response changes:

1. Update the backend.
2. Update this `docs/API.md`.
3. Update `client/src/services/` and `client/src/types/`.
4. Update `docs/PROJECT-STRUCTURE.md` if the structure changes.
5. Tell the affected owners (`docs/TASKS.md`, section 4).

Do not change a response shape, a field name, or an error message silently.
