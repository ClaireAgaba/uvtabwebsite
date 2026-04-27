"use client";

import { useEffect } from "react";

// Replace these with your actual Tawk.to IDs from the dashboard
const TAWK_PROPERTY_ID = "69ef2c14fb92e01c33a9aa43";
const TAWK_WIDGET_ID = "1jn748crs";

export default function TawkTo() {
  useEffect(() => {
    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.head.appendChild(s1);

    return () => {
      document.head.removeChild(s1);
    };
  }, []);

  return null;
}
