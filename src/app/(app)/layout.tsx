import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-full bg-background pb-16">
        {children}
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
