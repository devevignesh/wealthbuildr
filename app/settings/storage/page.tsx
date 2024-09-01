"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const { toast } = useToast();

  const handleClearData = () => {
    localStorage.clear();
    toast({
      title: "Data Cleared",
      description: "Your data has been successfully cleared."
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="rounded-lg border border-red-600 bg-white">
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="text-xl font-medium">Storage</h2>
        <p className="text-sm text-gray-500">
          The application state and the data stored in your browser local
          storage. If you would like to clear the data, please proceed with
          caution.
        </p>
      </div>
      <div className="border-b border-red-600"></div>
      <div className="flex items-center justify-end px-5 py-4 sm:px-10">
        <Button variant="destructive" onClick={handleClearData}>
          <div className="min-w-0 truncate">Clear Data</div>
        </Button>
      </div>
    </div>
  );
}
