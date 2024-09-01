"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { Cog, Database } from "lucide-react";

const tabs = [
  {
    group: "App Settings",
    tabs: [
      {
        name: "General",
        icon: Cog,
        segment: null
      }
    ]
  },
  {
    group: "Data Settings",
    tabs: [
      {
        name: "Storage",
        icon: Database,
        segment: "storage"
      }
    ]
  }
];

export default function NavTabs() {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const { slug } = useParams() as {
    slug?: string;
  };

  const href = (segment: string | null) =>
    `/settings${segment ? `/${segment}` : ""}`;

  const isSelected = (segment: string | null) =>
    selectedLayoutSegment === segment;

  return (
    <>
      {tabs.map(({ group, tabs }) => (
        <div key={group} className="flex flex-col gap-y-0.5">
          {group && (
            <span className="pb-1.5 text-sm text-gray-500">{group}</span>
          )}

          {tabs.map(({ name, icon: Icon, segment }) => (
            <Link
              key={href(segment)}
              href={href(segment)}
              className={cn(
                "flex items-center gap-2.5 whitespace-nowrap rounded-lg p-2 text-sm text-gray-950 outline-none transition-all duration-75",
                "ring-black/50 focus-visible:ring-2",
                isSelected(segment)
                  ? "bg-gray-950/5"
                  : "hover:bg-gray-950/5 active:bg-gray-950/10"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isSelected(segment) ? "text-gray-950" : "text-gray-700"
                )}
              />
              {name}
            </Link>
          ))}
        </div>
      ))}
    </>
  );
}
