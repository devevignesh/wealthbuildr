import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { ReactNode } from "react";
import NavTabs from "./nav-tabs";
import { SettingsNavMobile } from "./nav-mobile";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-112px)] bg-white">
      <MaxWidthWrapper className="grid items-start gap-8 py-10 lg:grid-cols-5">
      <div className="lg:hidden">
          <SettingsNavMobile>
            <NavTabs />
          </SettingsNavMobile>
        </div>
      
        <div className="hidden flex-wrap gap-4 lg:sticky lg:grid top-16">
          <NavTabs />
        </div>
      <div className="grid gap-5 lg:col-span-4">{children}</div>
    </MaxWidthWrapper>
    </div>
  );
}
