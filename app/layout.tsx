import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/dsgn/toaster";
import { TooltipProvider } from "@/components/dsgn/tooltip";
import { ACCENT_BOOTSTRAP, DEFAULT_ACCENT } from "@/lib/accent";
import "./globals.css";

/*
 * Three faces, three jobs, no system-font fallback doing display work.
 *
 * Bricolage Grotesque carries the 200-800 weight axis the startup voice's
 * "a thin word next to a bold one in a single headline" rule actually needs
 * — a two-weight static family can't do that without a visible jump.
 * Jakarta is the body face; JetBrains Mono is reserved for handles, counts,
 * and keyboard hints so a `@handle` never gets confused for prose.
 */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "500", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Thrum — the room where you make things at 2am",
  description:
    "A fictional community feed app, built to show what a fresh project gets from the dsgn component registry and design-philosophy skill.",
};

export const viewport: Viewport = {
  themeColor: "#0b0518",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-accent={DEFAULT_ACCENT}
      className={`${bricolage.variable} ${jakarta.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Runs before first paint so a stored accent preset is applied to
          <html> ahead of the initial render — without it, a visitor who
          picked "Ember" sees one frame of Aurora on every load. It mutates
          the same attribute React reads through useSyncExternalStore, hence
          suppressHydrationWarning above: the server renders the default and
          the client is intentionally allowed to differ.
        */}
        <script dangerouslySetInnerHTML={{ __html: ACCENT_BOOTSTRAP }} />
      </head>
      <body className="min-h-[100dvh] font-sans antialiased">
        <div className="aurora" aria-hidden="true" />
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        {/*
          Mounted at the root, outside every animated wrapper. ToastViewport
          is position:fixed and does not self-portal, so nesting it under any
          ancestor with a non-none `transform` (every [data-reveal] element
          in this app, mid-animation) would create a new containing block and
          silently break its fixed-to-viewport positioning.
        */}
        <Toaster />
      </body>
    </html>
  );
}
