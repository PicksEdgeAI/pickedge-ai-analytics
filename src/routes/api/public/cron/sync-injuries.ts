import { createFileRoute } from "@tanstack/react-router";

// NOTE: The Odds API does not expose injury feeds. This endpoint is a
// placeholder so the cron schedule has a working target. Swap in a provider
// like SportsData.io, RotoWire, or ESPN scraping once an INJURIES_API_KEY
// secret is added — then write into public.injuries via supabaseAdmin.
export const Route = createFileRoute("/api/public/cron/sync-injuries")({
  server: {
    handlers: {
      POST: async () => {
        return new Response(
          JSON.stringify({
            ok: true,
            note: "No injury provider configured. Add INJURIES_API_KEY and wire a feed to populate public.injuries.",
          }),
          { headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});