import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EXCLADE 2K26 | KSR College of Engineering" },
      { name: "description", content: "EXCLADE 2K26 — enter the lab. Technical operations of the Department of CSE (IoT), KSR College of Engineering." },
      { property: "og:title", content: "EXCLADE 2K26 | Enter The Lab" },
      { property: "og:description", content: "Technical operations, classified case files and the EXCLADE 2K26 laboratory experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
