import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "../components/layout/Layout";

import HomePage from "../pages/Home/HomePage";
import PitchDetailsPage from "../pages/PitchDetails/PitchDetailsPage";
import AvailabilityPage from "../pages/Availability/AvailabilityPage";
import BookingFormPage from "../pages/BookingForm/BookingFormPage";
import BookingConfirmationPage from "../pages/BookingConfirmation/BookingConfirmationPage";
import MyBookingPage from "../pages/MyBooking/MyBookingPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pitches/:pitchId" element={<PitchDetailsPage />} />
          <Route
            path="/pitches/:pitchId/availability"
            element={<AvailabilityPage />}
          />
          <Route path="/pitches/:pitchId/book" element={<BookingFormPage />} />
          <Route
            path="/confirmation/:code"
            element={<BookingConfirmationPage />}
          />
          <Route path="/my-booking" element={<MyBookingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
