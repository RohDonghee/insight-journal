"use client";

import { useState } from "react";
import { Post, INDUSTRIES } from "@/lib/supabase";
import IndustryValueChain, { ValueChainData } from "@/components/valuechain/IndustryValueChain";

type Props = {
  onClose: () => void;
  onSuccess: (post: Post) => void;
};

type Step = "password" | "form";

export default function NewPostModal({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>("password");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [title, setTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [insight, setInsight] = useState("");
  const [valueChain, setValueChain] = useState<ValueChainData | null>(null);
  const [showValueChain, setShowValueChain] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setPasswordError("비밀번호를 입력해주세요.");
      return;
    }
    setPasswordError("");
    setStep("form");
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !insight.trim()) {
      setFormError("제목, 요약, 인사이트는 필수 항목입니다.");
      return;
    }
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          industry: industry || null,
          source_url: sourceUrl.trim() || null,
          summary: summary.trim(),
          insight: insight.trim(),
          value_chain: valueChain || null,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setStep("password");
          setPasswordError(data.error || "비밀번호가 올바르지 않습니다.");
        } else {
          setFormError(data.error || "저장 중 오류가 발생했습니다.");
        }
        return;
      }

      onSuccess(data);
    } catch {
      setFormError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — 세로 스크롤 가능, 화면 높이 최대 활용 */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 flex flex-col"
        style={{ maxHeight: "92vh" }}>

        {/* 고정 헤더 */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === "password" ? "접근 확인" : "새 글 작성"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 스크롤 영역 */}
        <div className="overflow-y-auto px-8 py-6 flex-1">

          {/* Step 1: 비밀번호 */}
          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <p className="text-sm text-gray-500">
                글을 작성하려면 비밀번호를 입력하세요.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="비밀번호 입력"
                  autoFocus
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-red-500">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                확인
              </button>
            </form>
          )}

          {/* Step 2: 글 작성 폼 */}
          {step === "form" && (
            <form id="post-form" onSubmit={handleFormSubmit} className="space-y-6">

              {/* 리포트/기사 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  리포트 / 기사 제목 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="예) McKinsey — The State of AI 2024"
                  autoFocus
                />
              </div>

              {/* 산업군 분류 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  산업군 분류 <span className="text-gray-400 font-normal">(선택)</span>
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

              {/* 원문 URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  원문 URL <span className="text-gray-400 font-normal">(선택)</span>
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="https://"
                />
              </div>

              {/* 핵심 요약 / 원문 분석 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  핵심 요약 / 원문 분석 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="리포트의 핵심 내용, 주요 데이터, 논지를 요약해주세요."
                  rows={6}
                />
              </div>

              {/* 나의 인사이트 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  나의 인사이트 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={insight}
                  onChange={(e) => setInsight(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="이 내용을 읽고 나만의 생각, 느낀 점, 업무에 적용할 수 있는 아이디어를 기록하세요."
                  rows={10}
                />
              </div>

              {/* 밸류체인 분석 (선택) */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowValueChain((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">밸류체인 분석 <span className="text-gray-400 font-normal">(선택)</span></span>
                  <span className="text-gray-400 text-xs">{showValueChain ? "▲ 접기" : "▼ 펼치기"}</span>
                </button>
                {showValueChain && (
                  <div className="px-4 pb-5 pt-2 border-t border-gray-100">
                    <IndustryValueChain onChange={(data) => setValueChain(data)} />
                  </div>
                )}
              </div>

              {formError && (
                <p className="text-sm text-red-500">{formError}</p>
              )}
            </form>
          )}
        </div>

        {/* 고정 하단 버튼 (form 밖에 있어도 form= 속성으로 연결) */}
        {step === "form" && (
          <div className="px-8 py-5 border-t border-gray-100 shrink-0">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("password")}
                className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                이전
              </button>
              <button
                type="submit"
                form="post-form"
                disabled={isSubmitting}
                className="flex-1 bg-gray-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "저장 중..." : "게시하기"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
