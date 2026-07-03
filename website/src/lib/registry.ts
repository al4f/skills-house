import type { Registry, SearchEntry } from "./types";
import registryData from "../../public/data/registry.json";
import searchIndexData from "../../public/data/search-index.json";

export const registry = registryData as Registry;
export const searchIndex = searchIndexData as SearchEntry[];

export function getSkill(id: string) {
  return registry.skills.find((s) => s.id === id);
}

export function getScript(id: string) {
  return registry.scripts.find((s) => s.id === id);
}
