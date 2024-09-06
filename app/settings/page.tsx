"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IndianRupee, Percent, Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useWealthStore } from '@/providers/wealth-store-provider'
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const { inflation, salary, age, expense } = useWealthStore(state => state.settings);
  const form = useForm({
    defaultValues: {
      age: age,
      inflation: inflation,
      salary: salary,
      expense: expense
    }
  });
  const setSettings = useWealthStore(state => state.setSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onSubmit(values: {
    inflation: any;
    salary: any;
    age: any;
    expense: any;
  }) {
    const { inflation, salary, age, expense } = values;
    setIsSubmitting(true);
    setTimeout(() => {
      setSettings({
        inflation,
        salary,
        age,
        expense
      });
      toast({
        title: "Settings Updated",
        description: "Your financial data have been successfully saved."
      });
      setIsSubmitting(false);
    }, 2000);
  }

  useEffect(() => {
    form.reset({
      inflation,
      salary,
      age,
      expense
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inflation, salary, age, expense]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between w-full max-w-md">
                    <FormLabel className="font-medium text-base">Age</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          className="text-right text-lg w-24 border-0 rounded-none border-b-2 appearance-none p-0"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      onValueChange={vals => {
                        field.onChange(vals[0]);
                      }}
                      min={18}
                      max={60}
                      step={1}
                      className=" w-full max-w-md !mt-6"
                      value={[form.getValues("age")]}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500 !mt-4">
                    This is used to calculate your progression through the
                    phases of wealth building.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between w-full max-w-md">
                    <FormLabel className="font-medium text-base">
                      Annual Expenses
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          className="text-right text-lg w-24 border-0 rounded-none border-b-2 appearance-none p-0"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      onValueChange={vals => {
                        field.onChange(vals[0]);
                      }}
                      min={5000}
                      max={2000000}
                      step={500}
                      className=" w-full max-w-md !mt-6"
                      value={[form.getValues("expense")]}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500 !mt-4">
                    The estimated yearly expenses after retirement.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between w-full max-w-md">
                    <FormLabel className="font-medium text-base">
                      Annual Salary
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <IndianRupee size={18} />
                        <Input
                          type="number"
                          className="text-right text-lg w-24 border-0 rounded-none border-b-2 appearance-none p-0"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      onValueChange={vals => {
                        field.onChange(vals[0]);
                      }}
                      max={10000000}
                      step={1000}
                      className=" w-full max-w-md !mt-6"
                      value={[form.getValues("salary")]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inflation"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between w-full max-w-md">
                    <FormLabel className="font-medium text-base">
                      Inflation
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          className="text-right text-lg w-24 border-0 rounded-none border-b-2 appearance-none p-0"
                          {...field}
                        />
                        <Percent size={18} />
                      </div>
                    </FormControl>
                  </div>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      onValueChange={vals => {
                        field.onChange(vals[0]);
                      }}
                      min={1}
                      max={15}
                      step={1}
                      className=" w-full max-w-md !mt-6"
                      value={[form.getValues("inflation")]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="!mt-16"
              type="submit"
              disabled={!form.formState.isValid || isSubmitting}
            >
              {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
