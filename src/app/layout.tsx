import type { Metadata } from "next";
import Script from "next/script";
import GoogleAnalyticsPageView from "@/components/google-analytics-page-view";
import "./globals.css";

export const metadata: Metadata = {
  title: "Olagunju Oluwaseyi — Portfolio",
  description: "Technology, cybersecurity, IT support and production portfolio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.gtag = function(){window.dataLayer.push(arguments);};
              window.gtag("js", new Date());
              window.gtag("config", "G-650YQW3VGN", { send_page_view: false });
            `,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-650YQW3VGN"
          strategy="afterInteractive"
        />
        <GoogleAnalyticsPageView />
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <div id="main-content" tabIndex={-1}>{children}</div>
      </body>
    </html>
  );
}
