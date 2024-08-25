import { ExternalLink } from "lucide-react";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function Home() {
  return (
    <MaxWidthWrapper className="flex flex-col pt-12 pb-16">
      <div>
        <div className="relative w-full rounded-lg border px-4 py-3 text-sm text-foreground bg-amber-50 border-amber-200 mb-8">
          <div className="text-sm [&_p]:leading-relaxed">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              This application and its content are inspired by the insightful{" "}
              <a
                target="_blank"
                className="inline-flex font-semibold gap-1 items-center underline-offset-4 underline"
                href="https://youtu.be/4cOE89J9zYE?si=snrTGd24-4ucQkVl"
              >
                How to build wealth
                <ExternalLink className="h-4 w-4" />
              </a>{" "}
              YouTube video. Thanks to Vijay Mohan for creating such
              valuable content and making significant contributions to the
              financial community.
            </p>
          </div>
        </div>
        <h1 className="order-1 text-2xl font-semibold tracking-tight text-black">
          Financial Knowledge and the Path to Wealth Building
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Building wealth is a journey that requires more than just a steady job
          or a high income; it demands a deep understanding of financial
          principles. Financial knowledge is the cornerstone of both
          accumulating and preserving wealth. Without it, even those who have
          earned substantial sums like actors or athletes can find themselves
          facing financial ruin. This isn't just a tale of the rich and famous;
          it’s a reality that could affect anyone. Imagine winning a lottery how
          would you manage that sudden influx of wealth? Without the right
          knowledge, many would quickly squander it on luxury items, only to
          face financial difficulties soon after.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          It's essential to realize that wealth cannot be built solely through
          professional success in fields like engineering or medicine. Financial
          knowledge is crucial, and it’s not something you can acquire
          overnight. It grows gradually, much like the power of compounding.
          With every new piece of knowledge, new questions arise, leading to
          deeper understanding. The extent to which you expand your financial
          knowledge depends entirely on your curiosity and willingness to learn.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          If "Financial Knowledge" is the architect of wealth building, then
          "Savings Rate" is the foundation. The strength of your financial
          foundation directly correlates to how much you can save. Many people
          can easily achieve a 20% savings rate, but surpassing that requires
          specific strategies. Often, as our incomes increase, so do our
          expenses, driven by lifestyle upgrades. We move from shared living
          spaces to private ones, upgrade from a small apartment to a larger
          home, or trade in a basic car for a more luxurious model. These
          upgrades, though they match our financial growth, can prevent us from
          accumulating wealth.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          After years of upgrading, many find themselves nearing retirement with
          little more than a home as their primary asset. This pattern repeats
          across generations, with people only realizing the need for serious
          financial planning later in life. By then, other priorities like
          children’s education and marriage often take precedence, leaving
          little room for wealth building.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          To break this cycle, there's a powerful concept known as Delayed Gratification. Instead
          of immediately upgrading your lifestyle with every increase in income,
          consider postponing those changes. This delay allows your salary
          increases to go directly into savings, thereby strengthening the
          foundation of your wealth-building efforts. Over an 80-year lifespan,
          delaying lifestyle upgrades by just a few years is a small sacrifice
          for the long-term benefits it brings.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          You have a choice: either upgrade your lifestyle to match your income
          now or delay those upgrades to build a robust financial future that
          could even benefit the next generation. As you embark on this
          "Marathon Race" called wealth building, remember that your financial
          journey can be divided into distinct phases, each with its own set of
          goals and strategies.
        </p>
      </div>
    </MaxWidthWrapper>
  );
}
