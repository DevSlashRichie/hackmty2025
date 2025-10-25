import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <div className="flex justify-center items-center h-64">
        <Button variant="primary" size="lg">
          Iniciar Llamada
        </Button>

        <elevenlabs-convai agent-id="agent_6101k8eb8nzaepxtjr2k1behrwx5"></elevenlabs-convai>
        <script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          async
          type="text/javascript"
        ></script>
      </div>
    </div>
  );
}
