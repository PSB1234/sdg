import LoginForm from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="bg-grid-slate-100 absolute inset-0 -z-10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />

      <div className="w-full max-w-md">
        {/* Logo and Title Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/favicon.ico"
              width={32}
              height={32}
              alt="SDG Finance Logo"
              className="h-8 w-8"
            />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to SDG Finance Inc.</p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
