import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const tabs = [
  {
    name: "General",
    segment: "/general"
  }
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex h-36 items-center">
        <MaxWidthWrapper>
          <div className="flex items-center justify-between">
            <h1 className="order-1 text-2xl font-semibold tracking-tight text-black">
              Settings
            </h1>
          </div>
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper className="grid items-start gap-5 py-10 lg:grid-cols-5">
        <div className="top-36 flex gap-1 lg:sticky lg:grid">
          {tabs.map(({ name, segment }) => (
            <Link
              key={name}
              href={`/settings/${segment}`}
              className={cn(
                "rounded-md p-2.5 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200 font-semibold text-black"
              )}
            >
              {name}
            </Link>
          ))}
        </div>
        <div className="grid gap-5 lg:col-span-4">{children}</div>
      </MaxWidthWrapper>
    </>
  );
}
