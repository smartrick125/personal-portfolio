import type { MediaItem, TechnicalSummary } from "../../projectCatalog";

export type ProjectLabView = "result" | "gallery" | "logic" | "nodes" | "code";

export type ProjectLabMedia = MediaItem & {
  kind: "video" | "image" | "node" | "code";
};

export type ProjectLabProject = {
  id: string;
  folderName: string;
  title: string;
  description: string;
  tags: readonly string[];
  logic: readonly string[];
  promise: string;
  metric: string;
  metricLabel: string;
  accentName: "skill" | "shield" | "beam" | "fire";
  accentColor: string;
  videos: MediaItem[];
  gallery: MediaItem[];
  nodes: MediaItem[];
  script?: MediaItem;
  technicalSummary: TechnicalSummary;
};

export function getAvailableViews(project: ProjectLabProject): ProjectLabView[] {
  const views: ProjectLabView[] = ["result"];
  if (project.gallery.length > 0) views.push("gallery");
  if (project.logic.length > 0) views.push("logic");
  if (project.nodes.length > 0) views.push("nodes");
  if (project.script) views.push("code");
  return views;
}

export function getHeroMedia(project: ProjectLabProject): ProjectLabMedia | null {
  const video = project.videos[0];
  if (video) return { ...video, kind: "video" };
  const image = project.gallery[0];
  if (image) return { ...image, kind: "image" };
  return null;
}
