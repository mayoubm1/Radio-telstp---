import { Link, useLocation } from "wouter";
import { LayoutDashboard, Film, Users, Database, Radio, Activity } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/episodes", label: "Episodes", icon: Film },
  { href: "/team", label: "Team", icon: Users },
  { href: "/assets", label: "Assets", icon: Database },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 border-r border-border bg-card/50 flex flex-col h-screen fixed left-0 top-0 backdrop-blur-sm z-50">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-primary/10 border border-primary/20 text-primary">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-widest text-primary">TELsTP</h1>
            <p className="text-xs text-muted-foreground font-mono">PMO FRAMEWORK v1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group cursor-pointer border border-transparent",
                  isActive 
                    ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon className={clsx("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                <span className="font-medium tracking-wide">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_var(--primary)]" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border/50">
        <div className="bg-secondary/50 rounded-lg p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground uppercase tracking-wider font-mono">
            <Activity className="w-3 h-3 text-green-500" /> System Status
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          </div>
          <div className="mt-2 text-xs font-mono text-green-500">
            ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </div>
    </div>
  );
}
