import dynamic from "next/dynamic";

const ArchitectureClient = dynamic(() => import("./ArchitectureClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-sm text-gray-400">Loading architecture explorer…</div>
    </div>
  ),
});

export default function ArchitecturePage() {
  return <ArchitectureClient />;
}
