"use client";

import { useState } from "react";
import { Post, INDUSTRIES } from "@/lib/supabase";

type Props = {
  post: Post;
  onUpdate: (updated: Post) => void;
  onDelete: (id: string) => void;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({ post, onUpdate, onDelete }: Props) {
  const [mode, setMode] = useState<"view" | "edit" | "confirmDelete">("view");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 수정 폼 상태
  const [title, setTitle] = useState(post.title);
  const [industry, setIndustry] = useState(post.industry ?? "");
  const [sourceUrl, setSourceUrl] = useState(post.source_url ?? "");
  const [summary, setSummary] = useState(post.summary);
  const [insight, setInsight] = useState(post.insight);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleEditClick() {
    setMode("edit");
    setPassword("");
    setPasswordError("");
    setFormError("");
    // 최신 데이터로 폼 초기화
    setTitle(post.title);
    setIndustry(post.industry ?? "");
    setSourceUrl(post.source_url ?? "");
    setSummary(post.summary);
    setInsight(post.insight);
  }

  function handleDeleteClick() {
    setMode("confirmDelete");
    setPassword("");
    setPasswordError("");
  }

  function handleCancel() {
    setMode("view");
    setPassword("");
    setPasswordError("");
    setFormError("");
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !insight.trim()) {
      setFormError("제목, 요약, 인사이트는 필수 항목입니다.");
      return;
    }
    if (!password) {
      setFormError("비밀번호를 입력해주세요.");
      return;
    }
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          industry: industry || null,
          source_url: sourceUrl.trim() || null,
          summary: summary.trim(),
          insight: insight.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "수정 중 오류가 발생했습니다.");
        return;
      }

      onUpdate(data);
      setMode("view");
    } catch {
      setFormError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "삭제 중 오류가 발생했습니다.");
        return;
      }

      onDelete(post.id);
    } catch {
      setPasswordError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── 수정 모드 ──────────────────────────────────────────
  if (mode === "edit") {
    return (
      <article className="border border-indigo-100 rounded-xl p-8 bg-white">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-6">
          글 수정
        </p>
        <form onSubmit={handleEditSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              제목 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              산업군 분류 <span className="text-gray-300 font-normal">(선택)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setIndustry(industry === item ? "" : item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    industry === item
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              원문 URL <span className="text-gray-300 font-normal">(선택)</span>
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              핵심 요약 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              나의 인사이트 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={insight}
              onChange={(e) => setInsight(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              비밀번호 확인 <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="비밀번호 입력"
            />
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </article>
    );
  }

  // ── 삭제 확인 모드 ─────────────────────────────────────
  if (mode === "confirmDelete") {
    return (
      <article className="border border-red-100 rounded-xl p-8 bg-white">
        <p className="text-sm font-medium text-gray-900 mb-1">정말 삭제하시겠습니까?</p>
        <p className="text-xs text-gray-400 mb-6">
          &ldquo;{post.title}&rdquo; — 삭제하면 복구할 수 없습니다.
        </p>
        <form onSubmit={handleDeleteSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            placeholder="비밀번호 입력"
            autoFocus
          />
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-red-400 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </form>
      </article>
    );
  }

  // ── 기본 보기 모드 ─────────────────────────────────────
  return (
    <article className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-200 bg-white group">

      {/* 날짜 배너 */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-100 px-6 py-3">
        <div className="flex items-center gap-3">
          <time className="text-sm font-semibold text-gray-700">
            {formatDate(post.created_at)}
          </time>
          {post.industry && (
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full border border-indigo-100">
              {post.industry}
            </span>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEditClick}
            className="text-xs text-gray-400 hover:text-indigo-500 transition-colors px-2.5 py-1 rounded hover:bg-indigo-50"
          >
            수정
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2.5 py-1 rounded hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* 제목 */}
        <h2 className="text-xl font-semibold text-gray-900 leading-snug">
          {post.source_url ? (
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {post.title}
              <span className="ml-2 text-sm font-normal text-blue-400">↗</span>
            </a>
          ) : (
            post.title
          )}
        </h2>

        <div className="mt-6 grid gap-5">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              핵심 요약
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {post.summary}
            </p>
          </div>
          <div className="border-t border-gray-100" />
          <div>
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
              My Insight
            </h3>
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line italic">
              {post.insight}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
