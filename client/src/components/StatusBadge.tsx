import clsx from "clsx";

type Status = "planning" | "in_production" | "review" | "completed" | "pending" | "in_progress" | "high" | "medium" | "low";

interface StatusBadgeProps {
  status: Status | string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const getStyles = (s: string) => {
    switch (s.toLowerCase()) {
      case "completed":
      case "final":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in_production":
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse";
      case "planning":
      case "pending":
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "review":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "low":
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <span className={clsx(
      "inline-flex items-center justify-center rounded px-2.5 py-0.5 border font-mono uppercase tracking-wider font-semibold",
      getStyles(status),
      size === "sm" ? "text-[10px]" : "text-xs"
    )}>
      {status.replace("_", " ")}
    </span>
  );
}
