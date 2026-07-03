import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { PlatformPage } from "@/pages/PlatformPage";
import { SkillsIndexPage } from "@/pages/SkillsIndexPage";
import { SkillDetailPage } from "@/pages/SkillDetailPage";
import { ScriptsIndexPage } from "@/pages/ScriptsIndexPage";
import { ScriptDetailPage } from "@/pages/ScriptDetailPage";
import { GraphPage } from "@/pages/GraphPage";
import { SearchPage } from "@/pages/SearchPage";
import { WritingIndexPage } from "@/pages/WritingIndexPage";
import { WritingPostPage } from "@/pages/WritingPostPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/skills" element={<SkillsIndexPage />} />
      <Route path="/skills/:id" element={<SkillDetailPage />} />
      <Route path="/scripts" element={<ScriptsIndexPage />} />
      <Route path="/scripts/:id" element={<ScriptDetailPage />} />
      <Route path="/graph" element={<GraphPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/writing" element={<WritingIndexPage />} />
      <Route path="/writing/:slug" element={<WritingPostPage />} />
    </Routes>
  );
}
