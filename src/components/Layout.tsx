import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div style={{ backgroundColor: "#F7F9FC", minHeight: "100vh" }}>
      <Header />
      <main style={{ padding: "40px 80px" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}