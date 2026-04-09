export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Jera Capital</h1>
          <p className="mt-2 text-sm text-slate-400">
            Calculadora de Investimentos
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
