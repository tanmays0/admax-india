import Sidebar from "./Sidebar";

export default function DashboardLayout({ children, activePage, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden lg:block">
        <Sidebar activePage={activePage} />
      </div>
      <main className="min-w-0 flex-1">
        {(title || subtitle) && (
          <div className="border-b border-gray-200 bg-white px-4 py-6 sm:px-8">
            {title && <h1 className="font-display text-2xl font-bold text-dark">{title}</h1>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
        )}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
