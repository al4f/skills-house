export type WritingPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  eyebrow?: string;
  ogImage?: string;
};

export const writingPosts: WritingPost[] = [
  {
    slug: "agent-skills-at-scale",
    title: "Agent Skills at Scale: Why You Need a Build Pipeline",
    description:
      "Why a source-to-dist build step matters when authoring Agent Skills at scale. By al4f, author of skills-house.",
    date: "Jul 2026",
    readTime: "12 min read",
    eyebrow: "Agent Skills engineering",
    ogImage: "assets/diagram-pipeline.svg",
  },
  {
    slug: "how-i-built-skill-auditor",
    title: "How I Built skill-auditor in skills-house",
    description: "A walkthrough of authoring a second reference skill in the skills-house monorepo.",
    date: "Jul 2026",
    readTime: "8 min read",
    eyebrow: "Build log",
  },
  {
    slug: "authoring-conventions-v2",
    title: "Authoring Conventions I'd Propose for Agent Skills v2",
    description: "Constructive proposals for the Agent Skills specification based on skills-house learnings.",
    date: "Jul 2026",
    readTime: "10 min read",
    eyebrow: "Specification",
  },
  {
    slug: "skills-house-distribution-rfc",
    title: "RFC: skills-house Distribution Model",
    description: "Public RFC for npx skills add and per-skill npm distribution.",
    date: "Jul 2026",
    readTime: "6 min read",
    eyebrow: "RFC",
  },
];

export function getWritingPost(slug: string) {
  return writingPosts.find((p) => p.slug === slug);
}

// Article HTML bodies extracted from legacy static pages
import agentSkillsAtScale from "../content/writing/agent-skills-at-scale.html?raw";
import howIBuiltSkillAuditor from "../content/writing/how-i-built-skill-auditor.html?raw";
import authoringConventionsV2 from "../content/writing/authoring-conventions-v2.html?raw";
import skillsHouseDistributionRfc from "../content/writing/skills-house-distribution-rfc.html?raw";

const bodies: Record<string, string> = {
  "agent-skills-at-scale": agentSkillsAtScale,
  "how-i-built-skill-auditor": howIBuiltSkillAuditor,
  "authoring-conventions-v2": authoringConventionsV2,
  "skills-house-distribution-rfc": skillsHouseDistributionRfc,
};

export function getWritingBody(slug: string): string {
  const body = bodies[slug] ?? "";
  return body
    .replace(/\.\.\/assets\//g, "./assets/")
    .replace(/href="([^"]+)\.html"/g, 'href="./$1"');
}
