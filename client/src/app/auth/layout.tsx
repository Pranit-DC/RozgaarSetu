export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {children}
      </div>
    </div>
  );
}
