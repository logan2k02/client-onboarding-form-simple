import { z } from "zod";
import { Constants } from "./constants";

export const onboardingSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must be under 80 characters")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "Only letters, spaces, apostrophes, and hyphens allowed"
    ),
  email: z.string().email("Invalid email address"),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be under 100 characters"),
  services: z
    .array(z.enum(Constants.ServicesList))
    .min(1, "Select at least one service"),
  budgetUsd: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine(
      (val) =>
        val === undefined || (!isNaN(val) && val >= 100 && val <= 1_000_000),
      {
        message: "Budget must be a number between 100 and 1,000,000",
      }
    ),
  projectStartDate: z.string().refine((val) => {
    const today = new Date();
    const date = new Date(val);
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, "Start date must be today or later"),
  acceptTerms: z.literal<boolean>(true, {
    error: () => ({ message: "You must accept terms" }),
  }),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
