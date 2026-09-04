import { createLazyFileRoute } from "@tanstack/react-router";
import { ExcladePage } from "@/components/ExcladePage";

export const Route = createLazyFileRoute("/")({
  component: ExcladePage,
});