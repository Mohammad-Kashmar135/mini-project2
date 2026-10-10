import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import PitchDetailsPage from "../pages/PitchDetails/PitchDetailsPage";
import BookingFormPage from "../pages/BookingForm/BookingFormPage.tsx";
import BookingConfirmationPage from "../pages/BookingConfirmation/BookingConfirmationPage.tsx";
import MyBookingPage from "../pages/MyBooking/MyBookingPage.tsx";

const HomePage = () => <div>Home Page (Hassan)</div>;
const AvailabilityPage = () => <div>Availability Page (Hassan)</div>;

const NotFoundPage = () => <div>404 Not Found (Hassan)</div>;

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
