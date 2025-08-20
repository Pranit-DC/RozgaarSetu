import Link from "next/link";
// Update the import path below if Button is located elsewhere, for example:
import Button from "../components/ui/Button";
export default function Home() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center text-center">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Hire local help in minutes
        </h1>
        <p className="max-w-xl text-gray-600">
          Electrician, plumber, cleaner, and more. Fast response, verified profiles, clear pricing.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/auth/login">
            <Button>Get Started</Button>
          </Link>
          <Link href="/customer">
            <Button variant="secondary">I’m a Customer</Button>
          </Link>
          <Link href="/worker">
            <Button variant="secondary">I’m a Worker</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
