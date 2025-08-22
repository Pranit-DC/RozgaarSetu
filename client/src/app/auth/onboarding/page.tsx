import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Link from "next/link";

export default function Onboarding() {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">How Rozgaar Setu helps</h2>
      <div className="grid gap-4">
        <Card>
          <p className="text-lg font-semibold">📍 Nearby matches</p>
          <p className="text-sm text-gray-600">We find workers/customers close to your location.</p>
        </Card>
        <Card>
          <p className="text-lg font-semibold">✅ Verified profiles</p>
          <p className="text-sm text-gray-600">Ratings, past jobs, and ID checks where available.</p>
        </Card>
        <Card>
          <p className="text-lg font-semibold">💬 Easy chat & booking</p>
          <p className="text-sm text-gray-600">Fix time, price, and address quickly.</p>
        </Card>
      </div>
      <Link href="/auth/role-select">
        <Button className="w-full">Get Started</Button>
      </Link>
    </div>
  );
}
