# **Football Pitch Booking** 

#### **Weekly Mini Project 02 — Team 3 · Project Specification** 

|**Project**|Football Pitch Booking|
|---|---|
|**Team leader**|Mohammad Kashmar|
|**Team members**|Ali Al Hamwi, Iyad Ibrahim, Nawar Hasan, Hassan Alloush, Maya Al Hamwi|



See which hours are free, book your match, and never double-book a pitch again. 

## **1. Project Overview** 

Booking a football pitch usually means phone calls, a paper notebook and the occasional argument when two teams arrive for the same hour. Players cannot see which hours are free, and prices change at busy times without anyone explaining why. 

**Football Pitch Booking** lets players browse a venue's pitches, see the free time slots for any day, book one or two hours at a price calculated by the system, and later find or cancel their booking using their phone number and booking code. 

## **2. Team** 

The team leader and members are listed in the table at the top of this document. 

### **Team Responsibility** 

The leader coordinates the internal work split and makes sure the team reaches a working integrated result. 

- Frontend/backend ownership is not assigned by the instructor. 

- The team should decide how responsibilities are distributed. 

- Every member must make a meaningful contribution. 

- Every member should understand the project at a high level. 

- Every member must participate in the final English presentation. 

## **3. Project Goal** 

Build a web application where a customer can: 

- browse the available pitches and their prices; 

- choose a pitch and a date and see which time slots are free; 

- book one or two consecutive hours at a correctly calculated price; 

- receive a booking confirmation with a booking code; 

- later find their booking and cancel it when cancellation is still allowed. 

Availability, prices, conflicts and booking statuses must always reflect the current bookings and remain consistent on every screen. 

## **4. Technology Constraints** 

|**Area**|**Requirement**|
|---|---|
|Frontend|React + TypeScript|



1 / 7 

|**Area**|**Requirement**|
|---|---|
|Backend|NestJS|
|Data|In-memory only|
|Database|Not required|



The application's working data is kept in memory and may reset when the application server restarts. 

How you organize your application is your team's decision. 

Do **not** add a database, user accounts/login, external AI services, cloud services or paid APIs. 

## **5. User Scenario** 

Karim wants to play with his friends on Friday evening. He opens the app and sees four pitches. He chooses "Pitch A — 5-a-side", selects Friday, and sees the day's slots: 19:00 is already taken, but 20:00 and 21:00 are free. 

He books 20:00–22:00 (two hours, the maximum). Both hours are peak hours, so the system shows the peak price for each hour and the total. He enters his name and phone number and receives booking code **PB-4821** with the status **Confirmed** . 

On Friday afternoon plans change. He opens "My Booking", enters his phone number and code, and cancels — allowed because the match is more than two hours away. The 20:00 and 21:00 slots on Pitch A immediately become available again for other players. 

## **6. Required Features** 

|**Feature**|**Description**|
|---|---|
|Browse pitches|View all pitches with their key information.|
|Pitch details|Open one pitch and see its full information and prices.|
|Choose a date|Select a date for a chosen pitch.|
|Available time slots|See every hourly slot of that date as available, booked or past.|
|Create a booking|Book one or two consecutive hours.|
|Booking confirmation|Receive a confirmation with a booking code and all booking details.|
|Find a booking|Find an existing booking using phone number + booking code.|
|Cancel a booking|Cancel a booking when the rules allow it.|
|Booking status|See the current status of a booking.|



### **Pitch information** 

The application must support **multiple pitches** . Each pitch must present at least: 

- name 

pitch type (for example: 5-a-side, 7-a-side) 

- normal price per hour 

- peak-hour price per hour 

- opening hours (for example: 08:00–23:00) 

### **Booking information** 

Each booking must present at least: booking code, pitch, date, start time, end time, duration, customer name, customer phone number, total price and status. 

2 / 7 

## **7. Business Rules** 

### **Time slots** 

1. Bookings are made in **whole hours** that start on the hour (for example 18:00, 19:00 — not 18:30). 

2. A booking must start and end within the pitch's opening hours. 

3. Past times cannot be booked — a slot that has already started today, or any slot on a past date, is not bookable. 

4. Bookings can be made up to **14 days** in advance. 

### **Duration and conflicts** 

1. One booking covers **one or two consecutive hours** — never more than two. 

2. Two bookings must **never overlap** on the same pitch. A booking must be rejected if the pitch is already booked during **any part** of the requested time. 

3. Bookings on **different pitches** at the same time are allowed. 

4. A cancelled booking does not block its time slot — the slot becomes available again. 

### **Pricing** 

1. Peak hours are **18:00–22:00** every day. Any hour that starts inside this period is charged at the pitch's peak price. 

2. Each hour is priced separately: a two-hour booking that covers one normal hour and one peak hour costs one normal price plus one peak price. 

3. The booking price is always calculated by the system. The customer never enters a price. 

### **Identity and cancellation** 

1. A customer name and a valid phone number are required to book. 

2. Every booking receives a **unique booking code** , shown on the confirmation. 

3. A booking can only be found when **both** the phone number and the booking code match. 

4. A booking can only be cancelled when the match starts **more than two hours** from now. Otherwise the cancellation is rejected with a clear reason. 

5. A booking that is already cancelled or completed cannot be cancelled. 

### **Statuses** 

1. A booking's status is one of: **Confirmed** , **Cancelled** , **Completed** . 

2. A new booking is **Confirmed** . A cancelled booking is **Cancelled** . A confirmed booking whose end time has passed is shown as **Completed** . 

## **8. Required Screens / Views** 

|**Screen**|**Must show / allow**|
|---|---|
|**Home /**<br>**Pitches**|All pitches with name, type, normal price, peak price and opening hours; a way to open each pitch.|
|**Pitch Details**|All pitch information, including a clear explanation of when peak prices apply; a way to check<br>availability.|
|**Availability**|For the chosen pitch and date: every hourly slot within opening hours, each marked available, booked<br>or past, with its price; the ability to change the date and to select one or two consecutive available<br>slots.|
|**Booking Form**|The selected pitch, date, time and duration; the calculated price per hour and total; fields for customer<br>name and phone number.|



3 / 7 

|**Screen**|**Must show / allow**|
|---|---|
|**Booking**<br>**i**|Booking code, pitch, date, start and end time, duration, total price and status; a reminder of the|
|**Confirmation**|cancellation rule.|
|**My Booking /**|A form for phone number + booking code; the found booking's details and status; a cancel action that<br>f|
|**Find Booking**|is only offered when cancellation is allowed.|



All screens must be reachable through the application's navigation. 

## **9. Required User Flows** 

### **Flow A — Check availability** 

1. The user opens Home and selects a pitch. 

2. The user opens its availability and selects a date. 

3. The application shows each hourly slot as available, booked or past, with its price. 

4. The user changes the date and the slots update for the new date. 

### **Flow B — Book a match** 

1. On the Availability screen, the user selects one or two consecutive available slots. 

2. The Booking Form shows the calculated price and the total. 

3. The user enters name and phone number and confirms. 

4. The booking is accepted or rejected according to the rules (for example, if someone else booked the same hour a moment earlier, it is rejected). 

5. If accepted, the user sees the Booking Confirmation with a booking code, and the booked slots now appear as booked on the Availability screen. 

### **Flow C — Find a booking** 

1. The user opens My Booking. 

2. The user enters phone number and booking code. 

3. If both match a booking, its details and current status are shown. 

4. If they do not match, the user sees a clear "booking not found" message — no other customer's booking is ever shown. 

### **Flow D — Cancel a booking** 

1. The user finds their booking. 

2. If the match starts more than two hours from now, the user can cancel it. 

3. After cancelling, the status becomes **Cancelled** and the slots become available again. 

4. If the match is two hours away or less, the cancellation is rejected and the user sees why. 

## **10. Required Calculations / Derived Information** 

The application must produce and display: 

|**Derived information**|**Where it appears**|
|---|---|
|Available / booked / past status of every slot for a pitch and date|Availability|
|Price of each slot (normal or peak)|Availability, Booking Form|
|Booking duration (1 or 2 hours)|Booking Form, Confirmation, My Booking|
|Calculated total booking price|Booking Form, Confirmation, My Booking|



4 / 7 

|**Derived information**|**Where it appears**|
|---|---|
|Booking end time|Booking Form, Confirmation, My Booking|
|Current booking status (Confirmed / Cancelled / Completed)|Confirmation, My Booking|
|Whether the booking can still be cancelled|My Booking|



## **11. Validation & Error Scenarios** 

### **General expectations** 

Required information cannot be missing. 

- Numeric values must be sensible (no negative, zero or absurd values where they make no sense). 

- Invalid actions must be rejected — the system must never silently accept an invalid operation. 

- The user must always receive a clear, human-readable message explaining **why** an action failed. 

- Invalid operations must be rejected even if the user reaches them through an unexpected interaction (for example, an outdated page or a repeated submission). 

- When a request cannot be completed or something goes wrong, the screen must show a sensible message — never a blank page or a frozen screen. 

### **Project-specific scenarios** 

|**Situation**|**Expected behavior**|
|---|---|
|Booking a slot that overlaps an existing booking on the same<br>pitch|Rejected; the user is told the time is already booked.|
|Booking a past time or a past date|Rejected with a clear message.|
|Booking more than two hours, or two hours that are not<br>consecutive|Rejected with a clear message.|
|Booking outside opening hours or more than 14 days ahead|Rejected with a clear message.|
|Booking a pitch that does not exist|A clear "pitch not found" message.|
|Customer name or phone number missing, or phone number<br>not valid|Rejected with a clear message.|
|Phone number and booking code do not match any booking|A clear "booking not found" message.|
|Cancelling a booking that starts in two hours or less|Rejected; the user is told the cancellation deadline has<br>passed.|
|Cancelling a booking that is already cancelled or completed|Rejected with a clear message.|



## **12. In-Memory Data Requirements** 

#### **No database is required.** 

The application may start with seeded (pre-loaded) data. 

- Data created or changed while the application is running must behave normally during that run — every screen must reflect the latest data, including after a page refresh. 

- It is acceptable that all data resets when the application server restarts. This is an expected limitation of this assignment — do not spend time adding any other persistence technology. 

For this project specifically: 

The application must start with at least **4 pitches** of at least **2 different types** , with different prices. 

5 / 7 

The seeded data must include several existing bookings in the coming days (including at least one during peak hours), so that booked slots and overlap rejection can be demonstrated immediately. 

The seeded data must also include at least one booking that can be demonstrated as **Completed** and at least one as **Cancelled** . 

## **13. Out of Scope** 

The following are **not required** and should not be built as part of the core project: real payment; maps or location services; user accounts, login or registration; SMS, email or other notifications; a database; an administrator area for managing pitches. 

## **14. Minimum Deliverable** 

Your project counts as complete only when **all** of the following work: 

- `☐` A working React + TypeScript frontend. 

- `☐` A working NestJS backend. 

- `☐` The frontend and backend work together as one integrated application; every change a user makes is visible on all related screens. 

- `☐` Every required screen in section 8 exists and is reachable through the application's navigation. 

- `☐` Every business rule in section 7 is enforced. 

- `☐` Invalid operations are rejected with useful, clear feedback. 

- `☐` In-memory data changes correctly while the application is running. 

- `☐` The project can be demonstrated from start to finish without manual fixes during the demo. 

- `☐` Pitches can be browsed and opened in detail. 

- `☐` Availability is correct for any pitch and date, and updates after every booking and cancellation. 

- `☐` One- and two-hour bookings work, with correct normal and peak pricing. 

- `☐` Overlapping, past and over-long bookings are rejected. 

- `☐` A booking can be found with phone number + booking code. 

- `☐` Cancellation works only when the match is more than two hours away. 

- `☐` Statuses Confirmed, Cancelled and Completed are shown correctly. 

## **15. Optional Bonus Features** 

Bonus features are **optional** . They are not needed for full core completion and they never replace a missing core requirement. Only start a bonus after the minimum deliverable is complete and working. Bonus features must not add a database, login or new major technologies. 

**Pitch filters** — filter pitches by type and price range. 

- **Sort by price** — sort pitches from cheapest to most expensive. 

- **Daily occupancy summary** — for a chosen date, show how many hours of each pitch are booked and the occupancy percentage. 

- **Visual schedule** — a simple day grid showing all pitches and their booked hours side by side. 

## **16. Presentation Expectations** 

Your team will present the finished project **in English** . Your instructor will confirm the date and the time limit. 

The presentation must include: 

1. **The problem** — a brief explanation of who the product is for and what problem it solves. 

6 / 7 

2. **Product walkthrough** — a short tour of the main screens. 

3. **Live demonstration** — the main user flows working live, including at least one invalid case being rejected with a clear message. 

4. **Business rules** — an explanation, in your own words, of the most important rules your product enforces and how a user experiences them. 

5. **Team** — every member speaks. 

Before presenting, make sure the backend and frontend both start cleanly and the demo data is ready. 

## **17. Evaluation Focus** 

You will be assessed on: 

|**Area**|**What we look for**|
|---|---|
|Functional completeness|The required features and screens exist and work.|
|Correct business behavior|The business rules are enforced exactly as described.|
|Frontend/backend integration|The frontend and backend genuinely work together as one working application.|
|User experience|Screens are clear, readable and easy to use without explanation.|
|Handling invalid cases|Invalid input and invalid actions are rejected with clear messages.|
|Team collaboration|Work is shared; every member contributed meaningfully.|
|Code organization and readability|Your code is understandable and reasonably organized.|
|Explaining your own work|Every member can explain the product and its rules.|
|Presentation quality|Clear English presentation with a working live demo.|



7 / 7 

