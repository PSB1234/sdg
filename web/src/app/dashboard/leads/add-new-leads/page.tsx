"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconHome,
  IconCreditCard,
  IconId,
  IconCurrency,
  IconChartBar,
  IconCurrencyRupee,
  IconPlus,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react";

export default function LeadForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    phoneNumber: z.string().min(10, "Phone number is required"),
    productType: z.enum(
      [
        "Home Loan",
        "Car Loan",
        "Credit Card",
        "Personal Loan",
        "Business Loan",
      ],
      {
        errorMap: () => ({ message: "Please select a valid product type" }),
      },
    ),
    address: z.string().optional(),
    existingRelationship: z.string().optional(),
    aadharCard: z.string().optional(),
    loanAmount: z.number().min(1, "Loan amount is required"),
    creditScore: z
      .number()
      .min(300)
      .max(850, "Credit score must be between 300-850"),
    annualIncome: z.number().min(1, "Annual income is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      productType: "Home Loan" as const,
      address: "",
      existingRelationship: "",
      aadharCard: "",
      loanAmount: 0,
      creditScore: 0,
      annualIncome: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api";

    setIsSubmitting(true);
    try {
      const validatedData = formSchema.parse(values);

      const response = await fetch(`${API_BASE}/customer/lead-submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          phoneNumber: validatedData.phoneNumber,
          productType: validatedData.productType,
          address: validatedData.address,
          existingRelationship: validatedData.existingRelationship,
          aadharCard: validatedData.aadharCard,
          loanAmount: validatedData.loanAmount,
          creditScore: validatedData.creditScore,
          annualIncome: validatedData.annualIncome,
        }),
      });

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => ({ message: "form failed" }))) as { message?: string };
        throw new Error(errorData.message ?? "form error");
      }
      toast.success("Lead created successfully!");
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create lead",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create New Lead</h1>
        <p className="text-muted-foreground">
          Fill in the customer details to create a new lead in the system.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic customer details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconUser className="h-4 w-4" />
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter customer's full name"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconMail className="h-4 w-4" />
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="customer@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconPhone className="h-4 w-4" />
                        Phone Number *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+91 98XXXXXXXX"
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconHome className="h-4 w-4" />
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Complete address"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Complete residential address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="existingRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconCreditCard className="h-4 w-4" />
                        Existing Relationship
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Current accounts, past loans, etc."
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Any existing banking relationship
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aadharCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconId className="h-4 w-4" />
                        Aadhar Card
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="XXXX XXXX XXXX"
                          type="text"
                          maxLength={12}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        12-digit Aadhar number (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCreditCard className="h-5 w-5" />
                Product Information
              </CardTitle>
              <CardDescription>
                Loan details and product requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <FormLabel className="flex items-center gap-2">
                      <IconCreditCard className="h-4 w-4" />
                      Product Type *
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value || "Select product type..."}
                            <span className="opacity-50">⌄</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search product type..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No product found.</CommandEmpty>
                              <CommandGroup>
                                {[
                                  "Home Loan",
                                  "Car Loan",
                                  "Credit Card",
                                  "Personal Loan",
                                  "Business Loan",
                                ].map((opt) => (
                                  <CommandItem
                                    key={opt}
                                    value={opt}
                                    onSelect={(currentValue) => {
                                      field.onChange(currentValue);
                                    }}
                                  >
                                    {opt}
                                    <IconCheck
                                      className={`ml-auto h-4 w-4 ${
                                        field.value === opt
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }`}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      Select the banking product customer is interested in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconCurrencyRupee className="h-4 w-4" />
                        Loan Amount *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="5,00,000"
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || 0)
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>Amount in Indian Rupees</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="creditScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconChartBar className="h-4 w-4" />
                        Credit Score *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="750"
                          type="number"
                          min="300"
                          max="850"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || 0)
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>Range: 300-850</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconCurrency className="h-4 w-4" />
                        Annual Income *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10,00,000"
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || 0)
                          }
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Gross annual income in INR
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <IconPlus className="mr-2 h-4 w-4" />
                      Create Lead
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
