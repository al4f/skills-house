import type { Registry } from "./types";
import registryData from "../../public/data/registry.json";

export const registry = registryData as Registry;

export function getSkill(id: string) {
  return registry.skills.find((s) => s.id === id);
}
