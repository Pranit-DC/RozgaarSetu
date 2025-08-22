import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function CustomerProfile() {
  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h2 className="text-[24px] font-semibold tracking-tight">Profile</h2>
        <p className="text-[13px] text-[var(--apple-text-secondary)]">Manage your personal details</p>
      </header>
      <Card variant="soft" className="space-y-6 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Full name" placeholder="Your name" />
          <Input label="Mobile number" placeholder="10-digit number" inputMode="numeric" />
          <Input label="Address" placeholder="House no, street, area" className="md:col-span-2" />
        </div>
        <div className="pt-2">
          <Button className="w-full md:w-auto px-8">Save changes</Button>
        </div>
      </Card>
    </section>
  );
}
