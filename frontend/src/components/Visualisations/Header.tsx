// src/components/Header.tsx
export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex flex-col w-full px-6 pt-6 pb-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Global Energy Dashboard
        </h1>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 items-center">{children}</div>
    </header>
  );
}
