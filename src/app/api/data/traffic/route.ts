export const runtime = 'edge';

type Point = { day: string; value: number };

function generateTraffic(days: number): Point[] {
  const out: Point[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = d.toISOString().slice(0, 10); // YYYY-MM-DD

    // Simple weekday lift and tiny noise to feel organic
    const wd = d.getDay(); // 0-6
    const base = 300 + (wd >= 1 && wd <= 5 ? 80 : -40);
    const noise = Math.sin(d.getTime() / (1000 * 60 * 60 * 24)) * 30;

    out.push({ day: label, value: Math.max(0, Math.round(base + noise)) });
  }
  return out;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const daysParam = Number(url.searchParams.get('days') ?? 14);
  const days = Math.min(60, Math.max(7, isFinite(daysParam) ? daysParam : 14));
  return Response.json({
    series: generateTraffic(days),
    updatedAt: new Date().toISOString(),
  });
}
