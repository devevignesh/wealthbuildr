"use client";
import { Info } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { useWealthStore } from '@/providers/wealth-store-provider'

export default function SettingsAlert() {
  const settings = useWealthStore(state => state.settings);

  if (!settings.showAlert) return null;

  return (
    <MaxWidthWrapper className="mt-4">
      <Alert className="bg-blue-600 text-white">
        <Info className="h-4 w-4" color="white" />
        <AlertDescription>
          You&apos;re currently viewing demo data. To see personalized results,
          please update the{" "}
          <Link
            className="underline underline-offset-4"
            href="/settings"
          >
            settings
          </Link>{" "}
          with your own information.
        </AlertDescription>
      </Alert>
    </MaxWidthWrapper>
  );
}
