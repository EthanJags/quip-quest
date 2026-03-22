"use client";

import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { usePathname } from "next/navigation";
import Footer from "./components/Footer";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <footer className={`fixed bottom-0 left-0 right-0 z-50 ${isLandingPage ? "" : "hidden md:block"}`}>
          <Footer />
        </footer>
      </PersistGate>
    </Provider>
  );
}
