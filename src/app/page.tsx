"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { Constants } from "./constants";
import { OnboardingFormData, onboardingSchema } from "./onboarding.schema";

const Alert: FC<{ close: () => void; message: string; isError?: boolean }> = ({
  close,
  message,
  isError,
}) => {
  useEffect(() => {
    const timeout = setTimeout(close, Constants.AlertDuration);
    return () => clearTimeout(timeout);
  }, [close]);
  return (
    <div
      className={twMerge(
        "flex items-start rounded-xl p-4 fixed top-6 right-5 max-w-[calc(100vw-32px)] sm:max-w-md shadow",
        isError ? "bg-red-600 text-red-50" : "bg-emerald-600 text-emerald-50"
      )}
    >
      <p className="flex-1 mr-5">{message}</p>
      <button onClick={close} className="cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

const HomePage = () => {
  const [response, setResponse] = useState<{
    message: string;
    isError?: boolean;
  } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset: resetForm,
    setValue,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      services: [],
      acceptTerms: false,
    },
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const serviceParams = searchParams
      .getAll("service")
      .filter((s) => Constants.ServicesList.includes(s));
    if (serviceParams.length > 0) {
      setValue("services", serviceParams);
    }

    const prefillMap = {
      fullName: searchParams.get("fullName"),
      email: searchParams.get("email"),
      companyName: searchParams.get("companyName"),
      budgetUsd: searchParams.get("budgetUsd"),
      projectStartDate: searchParams.get("projectStartDate"),
    };

    Object.entries(prefillMap).forEach(([key, value]) => {
      if (value)
        setValue(key as any, key === "budgetUsd" ? Number(value) : value);
    });
  }, [searchParams, setValue]);

  const onSubmit = async (data: OnboardingFormData) => {
    setResponse(null);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_ONBOARD_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}.`);
      }

      setResponse({
        message: `Your details have been submitted successfully! Here's a summary: ${
          data.fullName
        } from ${data.companyName} (${
          data.email
        }) interested in ${data.services.join(", ")}${
          data.budgetUsd
            ? ` with a budgetUsd of ${data.budgetUsd.toFixed(2)} ${
                Constants.Currency
              }`
            : ""
        }${
          data.projectStartDate ? ` starting ${data.projectStartDate}` : ""
        }. We'll be in touch soon!`,
        isError: false,
      });

      resetForm();
    } catch (err: any) {
      const message = err.message || "Something went wrong";
      setResponse({
        message: `An error occured while sending your details: ${message}`,
        isError: true,
      });
    }
  };
  return (
    <main className="min-h-screen w-full px-4 py-6 flex">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-auto w-full max-w-xl bg-slate-50 shadow rounded-small m-auto p-6"
      >
        <h2 className="text-slate-950">Let’s kickstart your project</h2>
        <p className="mt-2 text-sm text-slate-600">
          Fill out this short onboarding form so we can understand your needs
          and get your project moving. We’ll review your details and get back to
          you within 1–2 business days.
        </p>
        <div className="grid grid-cols-1 gap-5 mt-6">
          <div className={`input ${errors.fullName ? "error" : ""}`}>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!errors.fullName}
              type="text"
              placeholder="e.g., Ada Lovelace"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="message">{errors.fullName.message}</p>
            )}
          </div>
          <div className={`input ${errors.email ? "error" : ""}`}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              type="email"
              placeholder="e.g., ada@example.com"
              {...register("email")}
            />
            {errors.email && <p className="message">{errors.email.message}</p>}
          </div>
          <div className={`input ${errors.companyName ? "error" : ""}`}>
            <label htmlFor="companyName">Company name</label>
            <input
              id="companyName"
              autoComplete="organization"
              aria-required="true"
              aria-invalid={!!errors.companyName}
              type="text"
              placeholder="e.g., Analytical Engines Ltd"
              {...register("companyName")}
            />
            {errors.companyName && (
              <p className="message">{errors.companyName.message}</p>
            )}
          </div>
          <div className={`input ${errors.services ? "error" : ""}`}>
            <label>Services interested in</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {Constants.ServicesList.map((service) => (
                <label
                  key={service}
                  className="p-1 rounded-full cursor-pointer bg-slate-100 border border-slate-200 flex items-center no-padding"
                  htmlFor={service}
                >
                  <input
                    id={service}
                    type="checkbox"
                    value={service}
                    {...register("services")}
                    className="sr-only peer"
                  />
                  <span className="size-10 peer-focus-visible:ring-slate-300 ring-3 ring-transparent bg-slate-200 transition-colors duration-600 rounded-full flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 text-slate-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="px-4">{service}</span>
                </label>
              ))}
            </div>
            {errors.services && (
              <p className="message">{errors.services.message}</p>
            )}
          </div>
          <div className={`input ${errors.budgetUsd ? "error" : ""}`}>
            <label htmlFor="budgetUsd">Estimated budgetUsd</label>
            <div className="relative w-full">
              <input
                id="budgetUsd"
                type="number"
                autoComplete="off"
                aria-required="true"
                aria-invalid={!!errors.budgetUsd}
                step={100}
                placeholder="e.g., 50000"
                {...register("budgetUsd")}
                className="no-padding py-3 pl-4 pr-16 w-full"
              />
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-sm">
                {Constants.Currency}
              </div>
            </div>
            {errors.budgetUsd ? (
              <p className="message">{errors.budgetUsd.message}</p>
            ) : (
              <p className="message">This is optional</p>
            )}
          </div>
          <div className={`input ${errors.projectStartDate ? "error" : ""}`}>
            <label htmlFor="projectStartDate">
              When would you like to start?
            </label>
            <input
              id="projectStartDate"
              autoComplete="off"
              aria-required="true"
              aria-invalid={!!errors.projectStartDate}
              type="date"
              placeholder="e.g., 50000"
              {...register("projectStartDate")}
            />
            {errors.projectStartDate && (
              <p className="message">{errors.projectStartDate.message}</p>
            )}
          </div>
          <div className={`input ${errors.acceptTerms ? "error" : ""}`}>
            <label
              htmlFor="acceptTerms"
              className="flex items-center gap-2 no-padding cursor-pointer"
            >
              <input
                id="acceptTerms"
                type="checkbox"
                {...register("acceptTerms")}
                className="sr-only peer"
              />
              <span className="w-5 h-5 border border-gray-400 peer-focus-visible:ring-slate-300 ring-2 ring-transparent transition-colors duration-600 rounded flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <p>
                I accept the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  terms and conditions
                </a>
              </p>
            </label>
            {errors.acceptTerms && (
              <p className="message">{errors.acceptTerms.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label="Send my details"
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send my details"}
          </button>
        </div>
      </form>
      {response && <Alert {...response} close={() => setResponse(null)} />}
    </main>
  );
};

export default HomePage;
