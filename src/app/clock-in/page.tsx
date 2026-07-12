import { ClockInForm } from "@/components/office/clock-in-form";

export default function ClockInPage() {
  return (
    <main className="mx-auto grid w-full max-w-4xl gap-6 px-5 py-8 sm:px-8">
      <section className="space-y-2">
        <p className="text-sm font-medium text-floor-green">Clock In</p>
        <h1 className="text-3xl font-semibold text-floor-ink">Choose your floor for today</h1>
        <p className="max-w-2xl text-sm leading-6 text-floor-muted">
          You can join with a product, an idea, or just a direction you want to
          explore. Project information is optional.
        </p>
      </section>
      <section className="border border-floor-line bg-white/80 p-5">
        <ClockInForm />
      </section>
    </main>
  );
}
