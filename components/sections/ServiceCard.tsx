import { Icon } from "@/components/ui/IconResolver";
import type { Service } from "@/content/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="rounded-2xl border border-black/5 p-6 shadow-sm transition-shadow hover:shadow-md">
      <Icon name={service.icon} className="h-8 w-8 text-primary" />
      <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{service.title}</h3>
      <p className="mt-2 text-sm text-foreground/70">{service.description}</p>
    </div>
  );
}
