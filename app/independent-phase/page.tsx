"use client";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import SettingsAlert from "@/components/settings-alert";
export default function IndependentPhase() {
  return (
    <>
      <SettingsAlert />
      <MaxWidthWrapper className="flex flex-col pt-12 pb-16">
        <div className="mb-8">
          <h1 className="order-1 text-2xl font-semibold tracking-tight text-black">
            Independent Phase
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The Independent Phase is the stage where the disciplined financial
            habits developed in the earlier phases pay off. This phase is all
            about reaping the rewards of your hard work and smart financial
            decisions.
          </p>
        </div>
        <h2 className="font-heading scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          tl;dr
        </h2>
        <ul className="ml-6 list-disc space-y-2 leading-7 [&:not(:first-child)]:mt-6">
          <li>
            <span className="font-medium ">Financial Independence</span> -
            Achieved when net worth reaches 25 times your annual expenses.
          </li>
          <li>
            <span className="font-medium ">Luxury Spending</span> - Enjoy the
            freedom to spend on luxuries like a unique car or bigger home, using
            current earnings not savings.
          </li>
          <li>
            <span className="font-medium ">Key Rule</span> - Do not touch your
            nest egg of 25 times annual expenses. All spending should come from
            ongoing income.
          </li>
          <li>
            <span className="font-medium ">Total Freedom</span> - Choose to
            retire or continue working, and enjoy the lifestyle of your choice
            without financial constraints.
          </li>
        </ul>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Financial Independence Achieved
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          For those in the FIRE (Financial Independence, Retire Early)
          community, reaching a net worth of 25 times your annual expenses
          signals that you're ready to retire. However, in this phase, we go
          beyond simply retiring. If you choose to continue working, you now
          have the freedom to use your earnings for luxuries without the
          pressure to save.
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Indulging in Luxuries
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          This is the time to enjoy the luxuries you may have deferred in
          earlier phases. Whether it’s purchasing that unique luxury car you’ve
          always dreamed of or upgrading to a larger, more comfortable home,
          these expenditures are now within reach. In this phase, spending on
          luxury items won't hinder your wealth-building efforts, as long as
          you're still earning an income.
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Maintaining Financial Discipline
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Despite the newfound freedom, it's crucial to adhere to one important
          rule: Do not touch your nest egg the 25 times your annual expenses
          that you’ve accumulated. All luxury spending should come from your
          current earnings, not from your carefully built nest egg. This
          discipline ensures that your financial independence remains intact,
          allowing you to enjoy your wealth without jeopardizing your long-term
          financial security.
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          The Freedom to Choose
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The Independent Phase grants you total freedom. You have the choice to
          retire or continue working, to indulge in luxuries, or maintain a
          simple lifestyle. The key is that these decisions are now yours to
          make, without the constraints of financial necessity.
        </p>
      </MaxWidthWrapper>
    </>
  );
}
