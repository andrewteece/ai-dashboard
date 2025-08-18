export const runtime = 'edge';

type KPI = { label: string; value: number };

function generateKpis(): KPI[] {
  // Light variation so values change a bit between requests
  const now = Date.now();
  const wobble = (seed: number, base: number, span: number) =>
    base + Math.floor(((now / 1000 + seed) % span) - span / 2);

  return [
    { label: 'Visitors', value: Math.max(120, 480 + wobble(1, 0, 80)) },
    { label: 'Signups', value: Math.max(5, 45 + wobble(2, 0, 20)) },
    { label: 'Revenue', value: Math.max(800, 6000 + wobble(3, 0, 1200)) },
  ];
}

export async function GET() {
  return Response.json({
    stats: generateKpis(),
    updatedAt: new Date().toISOString(),
  });
}
