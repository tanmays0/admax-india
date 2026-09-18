export default function Card({ children, className = "", padding = "p-6" }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${padding} ${className}`}>
      {children}
    </div>
  );
}
