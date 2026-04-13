import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-background pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
