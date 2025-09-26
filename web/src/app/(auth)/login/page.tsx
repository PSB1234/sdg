import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Image
              src="/favicon.ico"
              width={15}
              height={15}
              alt="SDG Finance Logo"
            />
          </div>
          SDG Finance Inc.
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
