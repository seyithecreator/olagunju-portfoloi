import type { Metadata } from "next";
import Script from "next/script";
import GoogleAnalyticsPageView from "@/components/google-analytics-page-view";
import "./globals.css";

const siteUrl = "https://olagunju-portfoloi.vercel.app";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Olagunju Oluwaseyi",
  url: siteUrl,
  description:
    "Technology-focused builder working across cybersecurity, IT systems, cloud and web development.",
  knowsAbout: [
    "Cybersecurity",
    "Information technology",
    "IT systems",
    "Cloud computing",
    "Web development",
    "Software development",
  ],
  sameAs: ["https://github.com/seyithecreator"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "Cybersecurity & IT Portfolio | Olagunju Oluwaseyi",
  description:
    "Explore Olagunju Oluwaseyi's practical cybersecurity projects, IT systems work, cloud learning and web development portfolio.",
  inLanguage: "en",
  publisher: { "@id": `${siteUrl}/#person` },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cybersecurity & IT Portfolio | Olagunju Oluwaseyi",
    template: "%s | Olagunju Oluwaseyi",
  },
  description:
    "Explore Olagunju Oluwaseyi's practical cybersecurity projects, IT systems work, cloud learning and web development portfolio.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Olagunju Oluwaseyi",
    title: "Cybersecurity & IT Portfolio | Olagunju Oluwaseyi",
    description:
      "Practical cybersecurity projects, IT systems work, cloud learning and web development by Olagunju Oluwaseyi.",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cybersecurity & IT Portfolio | Olagunju Oluwaseyi",
    description:
      "Practical cybersecurity projects, IT systems work, cloud learning and web development by Olagunju Oluwaseyi.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personSchema, websiteSchema]).replace(/</g, "\\u003c"),
          }}
        />
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
