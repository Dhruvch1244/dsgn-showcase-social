import { AppShell } from "@/components/app-shell";

/**
 * The one route.
 *
 * A server component whose entire job is to mount the shell — the client
 * boundary starts one level down, in components/app-shell.tsx, rather than
 * being declared here. Keeping the route itself server-rendered means the
 * page's metadata, fonts, and the accent bootstrap in layout.tsx are all
 * decided before any client JavaScript is involved.
 */
export default function Home() {
  return (
    <>
      {/*
        The first tab stop on the page. Every view is one long column of
        cards behind a persistent nav, so without this a keyboard reader
        would tab the whole rail again on every navigation.
      */}
      <a
        href="#main"
        className="sr-only rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>
      <AppShell />
    </>
  );
}
