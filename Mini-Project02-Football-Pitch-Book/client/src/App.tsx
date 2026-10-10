import { PitchesProvider } from "./context/PitchesContext";
import { AvailabilityProvider } from "./context/AvailabilityContext.tsx";
import { BookingProvider } from "./context/BookingContext";
import AppRouter from "./routes/AppRouter";

function App() {
  return (

    <PitchesProvider>
      <AvailabilityProvider>
        <BookingProvider>
          <AppRouter />
        </BookingProvider>
      </AvailabilityProvider>
    </PitchesProvider>

  );
}

export default App;
