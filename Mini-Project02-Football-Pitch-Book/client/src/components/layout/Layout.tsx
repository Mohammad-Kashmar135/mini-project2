import type { ReactNode } from "react";
import Navbar from "./Navbar";
import "./Layout.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout-main">
      <Navbar />

      <div className="layout-main__content">{children}</div>
    </div>
  );
}
