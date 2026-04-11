"use client";

import { useEffect, useState } from "react";
import { Post } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import NewPostModal from "@/components/NewPostModal";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPosts(data);
    } catch {
      setError("글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewPost(post: Post) {
    setPosts((prev) => [post, ...prev]);
    setIsModalOpen(false);
  }

  function handleUpdatePost(updated: Post) {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleDeletePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
              Insight Journal
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              컨설팅 리포트 및 기사 분석 & 인사이트
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 글 작성
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl p-8 animate-pulse"
              >
                <div className="h-3 bg-gray-100 rounded w-24 mb-4" />
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-6" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                  <div className="h-3 bg-gray-100 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-sm">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 text-sm text-indigo-500 hover:underline"
            >
              다시 시도
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">아직 작성된 글이 없습니다.</p>
            <p className="text-gray-300 text-xs mt-1">첫 번째 인사이트를 기록해보세요.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-8">
              총 {posts.length}개의 인사이트
            </p>
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUpdate={handleUpdatePost}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Write Modal */}
      {isModalOpen && (
        <NewPostModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleNewPost}
        />
      )}
    </div>
  );
}
