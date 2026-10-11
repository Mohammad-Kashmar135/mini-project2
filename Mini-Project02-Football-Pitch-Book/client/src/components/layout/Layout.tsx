import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout-main">
      <Navbar />
      <main
        style={{ padding: "24px 16px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {children}
      </main>
    </div>
  );
}
