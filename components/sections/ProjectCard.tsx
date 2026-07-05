import { ExternalLink } from "lucide-react";
import type { Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-2xl border border-black/5 p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">{project.title}</h2>
          <p className="mt-1 text-sm text-foreground/60">{project.client}</p>
        </div>
        {project.links?.repo && (
          <a
            href={project.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
          >
            Ver repo <ExternalLink size={14} />
          </a>
        )}
      </div>

      <p className="mt-4 text-foreground/80">{project.summary}</p>

      <p className="mt-4 text-sm font-medium text-foreground">Rol: {project.role}</p>

      <ul className="mt-3 space-y-1.5 text-sm text-foreground/70">
        {project.highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <span className="text-accent">•</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span key={tech} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/70">
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
