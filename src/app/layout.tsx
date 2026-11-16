import type { Metadata } from "next";
import Script from "next/script";
import GoogleAnalyticsPageView from "@/components/google-analytics-page-view";
import "./globals.css";

const siteUrl = "https://olagunju-portfoloi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Olagunju Oluwaseyi | Technology & Cybersecurity Portfolio",
    template: "%s | Olagunju Oluwaseyi",
  },
  description:
    "Explore the technology portfolio of Olagunju Oluwaseyi, featuring cybersecurity projects, IT systems, cloud learning and practical software solutions.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Olagunju Oluwaseyi",
    title: "Olagunju Oluwaseyi | Technology & Cybersecurity Portfolio",
    description:
      "Cybersecurity, IT systems, cloud learning and practical technology projects by Olagunju Oluwaseyi.",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Olagunju Oluwaseyi | Technology & Cybersecurity Portfolio",
    description:
      "Cybersecurity, IT systems, cloud learning and practical technology projects by Olagunju Oluwaseyi.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
