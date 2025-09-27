"use client";
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

export default function LeadForm() {
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
      toast("Form submitted");
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8 py-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Harsh" type="text" {...field} />
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
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="harsh@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="98xxxxxxxx" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Type</FormLabel>
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
                  <PopoverContent className="w-[260px] p-0">
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
                              <span
                                className={`ml-auto ${
                                  field.value === opt
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              >
                                ✓
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123, Main Street" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="existingRelationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Existing Relationship</FormLabel>
              <FormControl>
                <Input
                  placeholder="Accounts, past loans"
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
          name="aadharCard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aadhar Card</FormLabel>
              <FormControl>
                <Input
                  placeholder="123412341234"
                  type="text"
                  maxLength={12}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="loanAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="500000"
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creditScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credit Score</FormLabel>
              <FormControl>
                <Input
                  placeholder="750"
                  type="number"
                  min="300"
                  max="850"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="annualIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Income</FormLabel>
              <FormControl>
                <Input
                  placeholder="1000000"
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
