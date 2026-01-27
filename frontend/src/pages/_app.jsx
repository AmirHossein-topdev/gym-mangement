// frontend\src\pages\_app.jsx
import { useRouter } from "next/router";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactModal from "react-modal";
// مسیرهای استایل عمومی

import "../styles/globals.css";
import "../styles/dashboard.css";

import { useEffect } from "react";

const NEXT_PUBLIC_GOOGLE_CLIENT_ID =
  "768004342999-p4ivhapdmh7sm1pv02vft691vlt9d38n.apps.googleusercontent.com";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      ReactModal.setAppElement("body");
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </GoogleOAuthProvider>
  );
}
