import { describe, expect, it } from "vitest";
import { Constants } from "./constants";
import { onboardingSchema } from "./onboarding.schema";

describe("onboardingSchema", () => {
  it("should pass with valid data", () => {
    const result = onboardingSchema.safeParse({
      fullName: "John Doe",
      email: "john@example.com",
      companyName: "Example Inc",
      services: Constants.ServicesList.slice(0, 2), // Select first two services
      budgetUsd: 5000,
      projectStartDate: "2025-08-20",
      acceptTerms: true,
    });

    expect(result.success).toBe(true);
  });

  it("should fail when required fields are missing", () => {
    const result = onboardingSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.path[0]);

      expect(messages).toContain("fullName");
      expect(messages).toContain("email");
    }
  });

  it("should fail when acceptTerms is false", () => {
    const result = onboardingSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      companyName: "Company",
      services: ["UI/UX"],
      budgetUsd: 3000,
      projectStartDate: "2025-08-20",
      acceptTerms: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((e) => e.message.includes("accept terms"))
      ).toBe(true);
    }
  });

  it("should fail when service is invalid", () => {
    const result = onboardingSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      companyName: "Company",
      services: ["Hacking"], // not in Services list
      budgetUsd: 3000,
      projectStartDate: "2025-08-20",
      acceptTerms: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((e) => e.path.includes("services"))).toBe(
        true
      );
    }
  });
});
