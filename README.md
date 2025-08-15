# Technical Assessment: Client Onboarding (Next.js + React Hook Form + Zod)

## Submission by Theshawa Dasun

### 🚀 Setup

#### 1. Clone the repo

```bash
git clone https://github.com/logan2k02/client-onboarding-form-simple.git
cd client-onboarding-form-simple
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Run Tests

```bash
npx vitest
```

### 📂 Project Structure

```
├── .env                            # Env variables(file is not available initially, create one if needed.)
├── src/globals.css                 # Global CSS of course
├── src/constants.ts                # Global constants at one place
├── src/page.tsx                    # The main code...
├── src/layout.tsx                  # Layout file(applied font styles)
├── src/onboarding.schema.ts        # Zod schema definition
└── src/onboarding.schema.test.ts   # Vitest test suite
```

### How RHF + Zod Wired

- Zod Schema and SchemaType is defined in `onboarding.schema.ts`.
- Imported those to `page.tsx` where code for form is located.
- Used `useForm()` hook with resolver parameter.
- `zodResolver` from `@hookform/resolvers` is used to bind a valid resolver to useForm hook
- Each field is registered with `register()` function.

### Env Var

`NEXT_PUBLIC_ONBOARD_URL`

### 😁 Thanks for the oppurtunity.

2025/08/16 12.06 PM
