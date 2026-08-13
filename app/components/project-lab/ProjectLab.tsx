import type { CSSProperties } from "react";
import styles from "./ProjectLab.module.css";
import type { ProjectLabProject } from "./projectLabModel";

type ProjectLabProps = {
  projects: ProjectLabProject[];
  activeProjectIndex: number;
  onProjectChange: (index: number) => void;
};

export function ProjectLab({ projects, activeProjectIndex, onProjectChange }: ProjectLabProps) {
  const activeProject = projects[activeProjectIndex] ?? projects[0];
  if (!activeProject) return null;

  return (
    <section
      id="project-lab"
      className={styles.lab}
      data-project-lab="true"
      style={{ "--lab-accent": activeProject.accentColor } as CSSProperties}
    >
      <header className={styles.header}>
        <p>PROJECT LAB / ACTIVE SYSTEM</p>
        <nav aria-label="Select project">
          {projects.map((project, index) => (
            <button
              type="button"
              data-project-switch="true"
              aria-pressed={index === activeProjectIndex}
              onClick={() => onProjectChange(index)}
              key={project.id}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{project.title}</strong>
            </button>
          ))}
        </nav>
      </header>
      <div className={styles.shell}>
        <h2>{activeProject.title}</h2>
        <p>{activeProject.description}</p>
      </div>
      <noscript>
        <div className={styles.noScriptFallback}>
          {projects.map((project) => (
            <article key={project.id}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              {[...project.videos, ...project.gallery, ...project.nodes].map((item) => (
                <a href={item.src} key={item.src}>{item.name}</a>
              ))}
              {project.script && <a href={project.script.src}>{project.script.name}</a>}
            </article>
          ))}
        </div>
      </noscript>
    </section>
  );
}
