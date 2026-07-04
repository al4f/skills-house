import { Navigate, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { PlatformPage } from "@/pages/PlatformPage";
import { SkillDetailPage } from "@/pages/SkillDetailPage";
import { WritingIndexPage } from "@/pages/WritingIndexPage";
import { WritingPostPage } from "@/pages/WritingPostPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/skills" element={<Navigate to="/platform" replace />} />
      <Route path="/skills/:id" element={<SkillDetailPage />} />
      <Route path="/scripts" element={<Navigate to="/platform" replace />} />
      <Route path="/scripts/:id" element={<Navigate to="/platform" replace />} />
      <Route path="/graph" element={<Navigate to="/platform" replace />} />
      <Route path="/search" element={<Navigate to="/platform" replace />} />
      <Route path="/writing" element={<WritingIndexPage />} />
      <Route path="/writing/:slug" element={<WritingPostPage />} />
    </Routes>
  );
}
