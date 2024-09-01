"use client";
import { ReactNode } from "react";
import { Popover } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LucideIcon, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useSelectedLayoutSegment } from "next/navigation";
import { PropsWithChildren, useState } from "react";
import { Cog } from "lucide-react";

const tabs = [
  {
    group: "",
    tabs: [
      {
        name: "General",
        icon: Cog,
        segment: null
      },
      {
        name: "Security",
        icon: Cog,
        segment: "security"
      }
    ]
  }
];

export function SettingsNavMobile({
  children
}: PropsWithChildren) {
  const [openPopover, setOpenPopover] = useState(false);

  const selectedLayoutSegment = useSelectedLayoutSegment();
  // Find selected tab nested in the tabs array
  const selectedTab = tabs
    .flatMap(group => group.tabs)
    .find(tab => tab.segment === selectedLayoutSegment);

  const Icon = selectedTab?.icon ?? Menu;
  const label = selectedTab?.name ?? "Menu";

  return (
    <Popover
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
      align="start"
      content={
        <div
          className="flex w-full flex-col gap-4 px-5 sm:min-w-[200px] sm:px-4 sm:py-3"
          onClick={e => {
            if (e.target instanceof HTMLElement && e.target.tagName === "A")
              setOpenPopover(false);
          }}
        >
          {children}
        </div>
      }
    >
      <Button
        variant="secondary"
        className="group flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm transition-all border-gray-200 bg-white text-gray-900 focus-visible:border-gray-500 outline-none data-[state=open]:border-gray-500 data-[state=open]:ring-4 data-[state=open]:ring-gray-200 w-full hover:bg-white sm:w-auto sm:min-w-[200px] [&>div]:w-full"
      >
        <Icon className="h-4 w-4" />
        <span className="grow text-left font-normal">{label}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-gray-400 transition-transform", {
            "rotate-180": openPopover
          })}
        />
      </Button>
    </Popover>
  );
}
