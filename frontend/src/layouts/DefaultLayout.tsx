export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900">
      <main className="flex-grow">{children}</main>
    </div>
  );
}
