import * as icons from "lucide-react";
import { CircleDot, type LucideProps } from "lucide-react";

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const iconMap = icons as unknown as Record<string, React.ComponentType<LucideProps>>;
  const Resolved = iconMap[name] ?? CircleDot;
  return <Resolved {...props} />;
}
