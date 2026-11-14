export default function AuthShell({ title, bg = '#7ec9b9', children }) {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-8" style={{ background: bg }}>
      <div className="w-full max-w-sm rounded-[2.5rem] border border-black/60 bg-white px-8 pb-10 pt-7 sm:px-10">
        <p className="text-center text-xl font-bold">Sinow</p>
        <h1 className="mt-3 text-center text-xl">{title}</h1>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, ...props }) {
  return (
    <label className="block text-sm">
      {label}
      <input {...props}
        className="mt-1.5 block h-11 w-full rounded-xl bg-[#d9d9d9] px-4 text-base outline-none focus:ring-2 focus:ring-[#5b4b8a]" />
    </label>
  )
}