import { ModalManager } from "@/components/ModalManager";
import { StoreProvider } from "@/providers/store-provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <Component {...pageProps} />;
      <ModalManager />
      <ToastContainer />
    </StoreProvider>
  );
}
