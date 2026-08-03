import { Outlet } from "react-router-dom";
import Header from "../components/Header";

interface Props {
  onLogout: () => void;
}

export default function AdminLayout({
  onLogout,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}