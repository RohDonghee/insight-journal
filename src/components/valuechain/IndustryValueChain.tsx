"use client";

import { useState, useEffect, useRef, useMemo, memo } from "react";
import ChevronNode from "./ChevronNode";
import StageDetailPanel from "./StageDetailPanel";

// ── Types ────────────────────────────────────────────────────────────────────
export type MarginLevel = "high" | "mid" | "low" | null;
export type RiskLevel = "high" | "mid" | "low" | null;

export type Stage = {
  id: string;
  name: string;
  short?: string;
  isCustom?: boolean;
};

export type StageData = {
  stageId: string;
  margin: MarginLevel;
  risk: RiskLevel;
  players: string[];
  keypoint: string;
  strategic: string;
};

export type ValueChainData = {
  industry: string;
  selectedStages: StageData[];
};

// ── Presets ───────────────────────────────────────────────────────────────────
type Preset = { id: string; label: string; stages: Stage[] };

const PRESETS: Preset[] = [
  {
    id: "manufacturing",
    label: "제조업",
    stages: [
      { id: "s1", name: "원자재 조달" },
      { id: "s2", name: "부품/소재" },
      { id: "s3", name: "생산/가공" },
      { id: "s4", name: "품질관리" },
      { id: "s5", name: "물류/SCM" },
      { id: "s6", name: "영업/마케팅" },
      { id: "s7", name: "유통/채널" },
      { id: "s8", name: "A/S" },
    ],
  },
  {
    id: "semiconductor",
    label: "반도체/전자",
    stages: [
      { id: "s1", name: "소재·가스" },
      { id: "s2", name: "장비" },
      { id: "s3", name: "웨이퍼 제조" },
      { id: "s4", name: "패키징/테스트" },
      { id: "s5", name: "설계(팹리스)" },
      { id: "s6", name: "유통" },
      { id: "s7", name: "OEM/ODM" },
      { id: "s8", name: "최종재" },
    ],
  },
  {
    id: "automotive",
    label: "자동차/모빌리티",
    stages: [
      { id: "s1", name: "원자재" },
      { id: "s2", name: "부품(Tier2)" },
      { id: "s3", name: "모듈(Tier1)" },
      { id: "s4", name: "완성차 OEM" },
      { id: "s5", name: "딜러/판매" },
      { id: "s6", name: "금융/리스" },
      { id: "s7", name: "정비·A/S" },
      { id: "s8", name: "중고차" },
    ],
  },
  {
    id: "pharma",
    label: "제약/바이오",
    stages: [
      { id: "s1", name: "기초연구" },
      { id: "s2", name: "후보물질 도출" },
      { id: "s3", name: "전임상" },
      { id: "s4", name: "임상(1-3상)" },
      { id: "s5", name: "허가/규제" },
      { id: "s6", name: "생산(CMO)" },
      { id: "s7", name: "마케팅·MR" },
      { id: "s8", name: "유통·도매" },
      { id: "s9", name: "병의원·약국" },
    ],
  },
  {
    id: "meddevice",
    label: "의료기기",
    stages: [
      { id: "s1", name: "R&D" },
      { id: "s2", name: "임상시험" },
      { id: "s3", name: "인허가" },
      { id: "s4", name: "생산/OEM" },
      { id: "s5", name: "국내영업" },
      { id: "s6", name: "수출·해외허가" },
      { id: "s7", name: "병원·클리닉" },
      { id: "s8", name: "A/S" },
    ],
  },
  {
    id: "fmcg",
    label: "소비재/FMCG",
    stages: [
      { id: "s1", name: "원재료 소싱" },
      { id: "s2", name: "제조/OEM" },
      { id: "s3", name: "브랜딩" },
      { id: "s4", name: "물류/창고" },
      { id: "s5", name: "현대유통(MT)" },
      { id: "s6", name: "전통유통(TT)" },
      { id: "s7", name: "이커머스" },
      { id: "s8", name: "소비자" },
    ],
  },
  {
    id: "retail",
    label: "유통/리테일",
    stages: [
      { id: "s1", name: "상품기획(MD)" },
      { id: "s2", name: "소싱/구매" },
      { id: "s3", name: "물류·풀필먼트" },
      { id: "s4", name: "오프라인 매장" },
      { id: "s5", name: "온라인몰" },
      { id: "s6", name: "마케팅/CRM" },
      { id: "s7", name: "CS·반품" },
    ],
  },
  {
    id: "finance",
    label: "금융/보험",
    stages: [
      { id: "s1", name: "상품설계" },
      { id: "s2", name: "영업·모집" },
      { id: "s3", name: "심사·인수" },
      { id: "s4", name: "계약관리" },
      { id: "s5", name: "운용(투자)" },
      { id: "s6", name: "청구·보상" },
      { id: "s7", name: "고객관리(CRM)" },
    ],
  },
  {
    id: "energy",
    label: "에너지/자원",
    stages: [
      { id: "s1", name: "탐사·개발" },
      { id: "s2", name: "생산·추출" },
      { id: "s3", name: "운송·파이프라인" },
      { id: "s4", name: "정제·처리" },
      { id: "s5", name: "트레이딩" },
      { id: "s6", name: "발전·전환" },
      { id: "s7", name: "송배전" },
      { id: "s8", name: "소매판매" },
    ],
  },
  {
    id: "renewable",
    label: "재생에너지",
    stages: [
      { id: "s1", name: "소재·부품" },
      { id: "s2", name: "모듈/시스템 제조" },
      { id: "s3", name: "EPC(시공)" },
      { id: "s4", name: "금융·투자" },
      { id: "s5", name: "발전·운영(O&M)" },
      { id: "s6", name: "전력거래" },
      { id: "s7", name: "ESS·그리드" },
    ],
  },
  {
    id: "realestate",
    label: "부동산/건설",
    stages: [
      { id: "s1", name: "토지매입" },
      { id: "s2", name: "인허가" },
      { id: "s3", name: "설계·엔지니어링" },
      { id: "s4", name: "시공(GC)" },
      { id: "s5", name: "분양·임대" },
      { id: "s6", name: "운영·관리(PM)" },
      { id: "s7", name: "매각·Exit" },
    ],
  },
  {
    id: "logistics",
    label: "물류/운송",
    stages: [
      { id: "s1", name: "화주" },
      { id: "s2", name: "포워딩" },
      { id: "s3", name: "통관" },
      { id: "s4", name: "간선운송" },
      { id: "s5", name: "창고·보관" },
      { id: "s6", name: "라스트마일" },
      { id: "s7", name: "역물류" },
    ],
  },
  {
    id: "media",
    label: "미디어/엔터",
    stages: [
      { id: "s1", name: "IP 개발·기획" },
      { id: "s2", name: "제작(콘텐츠)" },
      { id: "s3", name: "후반작업" },
      { id: "s4", name: "배급·유통" },
      { id: "s5", name: "플랫폼(OTT·방송)" },
      { id: "s6", name: "광고·마케팅" },
      { id: "s7", name: "부가사업(MD·공연)" },
    ],
  },
  {
    id: "tech",
    label: "테크/SaaS",
    stages: [
      { id: "s1", name: "연구개발" },
      { id: "s2", name: "제품설계(PM)" },
      { id: "s3", name: "개발(Engineering)" },
      { id: "s4", name: "QA·보안" },
      { id: "s5", name: "GTM·세일즈" },
      { id: "s6", name: "고객 온보딩" },
      { id: "s7", name: "CS·서포트" },
      { id: "s8", name: "갱신·업셀" },
    ],
  },
  {
    id: "agrifood",
    label: "농식품",
    stages: [
      { id: "s1", name: "농업 투입재" },
      { id: "s2", name: "재배·수확" },
      { id: "s3", name: "수집·선별" },
      { id: "s4", name: "가공·식품제조" },
      { id: "s5", name: "콜드체인" },
      { id: "s6", name: "유통(도매·소매)" },
      { id: "s7", name: "외식·푸드서비스" },
      { id: "s8", name: "소비자" },
    ],
  },
];

// ── 유틸 ─────────────────────────────────────────────────────────────────────
function makeEmptyData(stageId: string): StageData {
  return { stageId, margin: null, risk: null, players: [], keypoint: "", strategic: "" };
}

function uniqueId() {
  return `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
interface Props {
  onChange?: (data: ValueChainData) => void;
}

function IndustryValueChain({ onChange }: Props) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [stages, setStages] = useState<Stage[]>([]);
  const [stageDataMap, setStageDataMap] = useState<Record<string, StageData>>({});
  const [activeIds, setActiveIds] = useState<string[]>([]);

  // 드래그 상태
  const [dragSourceId, setDragSourceId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // 단계 추가 상태
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const newStageInputRef = useRef<HTMLInputElement>(null);

  // onChange 콜백 — useMemo로 payload 메모이제이션 (매 키스트로크 재계산 방지)
  const valueChainPayload = useMemo<ValueChainData | null>(() => {
    if (!selectedIndustry) return null;
    return {
      industry: selectedIndustry,
      selectedStages: Object.values(stageDataMap).filter(
        (d) => d.margin || d.risk || d.players.length > 0 || d.keypoint || d.strategic
      ),
    };
  }, [selectedIndustry, stageDataMap]);

  useEffect(() => {
    if (onChange && valueChainPayload) onChange(valueChainPayload);
  }, [valueChainPayload, onChange]);

  // 인라인 추가 input auto-focus
  useEffect(() => {
    if (isAddingStage) newStageInputRef.current?.focus();
  }, [isAddingStage]);

  // ── 핸들러 ──────────────────────────────────────────────
  function handleSelectIndustry(id: string) {
    if (id === selectedIndustry) return;

    const hasData = Object.values(stageDataMap).some(
      (d) => d.margin || d.risk || d.players.length > 0 || d.keypoint || d.strategic
    );
    if (hasData && !confirm("현재 편집 내용이 초기화됩니다. 계속하시겠습니까?")) return;

    const preset = PRESETS.find((p) => p.id === id)!;
    setSelectedIndustry(id);
    setStages(preset.stages);
    setStageDataMap({});
    setActiveIds([]);
    setIsAddingStage(false);
  }

  function toggleStage(id: string) {
    setActiveIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    // 데이터 초기화 (없으면)
    if (!stageDataMap[id]) {
      setStageDataMap((prev) => ({ ...prev, [id]: makeEmptyData(id) }));
    }
  }

  function updateStageData(id: string, data: StageData) {
    setStageDataMap((prev) => ({ ...prev, [id]: data }));
  }

  function renameStage(id: string, name: string) {
    setStages((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  }

  function deleteStage(id: string) {
    setStages((prev) => prev.filter((s) => s.id !== id));
    setActiveIds((prev) => prev.filter((x) => x !== id));
    setStageDataMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function confirmAddStage() {
    const name = newStageName.trim();
    if (name) {
      const id = uniqueId();
      setStages((prev) => [...prev, { id, name, isCustom: true }]);
    }
    setNewStageName("");
    setIsAddingStage(false);
  }

  // ── 드래그 앤 드롭 ──────────────────────────────────────
  function handleDragStart(e: React.DragEvent, id: string) {
    setDragSourceId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== dragSourceId) setDragOverId(id);
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!dragSourceId || dragSourceId === targetId) return;
    setStages((prev) => {
      const srcIdx = prev.findIndex((s) => s.id === dragSourceId);
      const tgtIdx = prev.findIndex((s) => s.id === targetId);
      const next = [...prev];
      const [moved] = next.splice(srcIdx, 1);
      next.splice(tgtIdx, 0, moved);
      return next;
    });
    setDragOverId(null);
    setDragSourceId(null);
  }

  function handleDragEnd() {
    setDragSourceId(null);
    setDragOverId(null);
  }

  // ── 요약: 데이터가 있는 단계만 ──────────────────────────
  const analyzedStages = stages.filter((s) => {
    const d = stageDataMap[s.id];
    return d && (d.margin || d.risk || d.players.length > 0 || d.keypoint || d.strategic);
  });

  const MARGIN_LABEL: Record<string, string> = { high: "높음", mid: "중간", low: "낮음" };
  const RISK_LABEL: Record<string, string> = { high: "높음", mid: "중간", low: "낮음" };
  const MARGIN_COLOR: Record<string, string> = {
    high: "text-emerald-600 bg-emerald-50",
    mid: "text-amber-600 bg-amber-50",
    low: "text-red-600 bg-red-50",
  };
  const RISK_COLOR: Record<string, string> = {
    high: "text-red-600 bg-red-50",
    mid: "text-amber-600 bg-amber-50",
    low: "text-emerald-600 bg-emerald-50",
  };

  return (
    <div className="space-y-6">
      {/* ── 프리셋 선택 ────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          산업 프리셋 선택
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectIndustry(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedIndustry === p.id
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 밸류체인 (프리셋 선택 후) ──────────────────── */}
      {stages.length > 0 && (
        <>
          {/* 데스크탑: 가로 Chevron */}
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              밸류체인 단계 <span className="normal-case font-normal text-gray-300 ml-1">클릭으로 분석 · 더블클릭으로 이름 수정 · 드래그로 순서 변경</span>
            </p>
            <div className="flex items-center flex-wrap gap-y-6 pt-3 pb-1 overflow-x-auto">
              {stages.map((stage, index) => (
                <ChevronNode
                  key={stage.id}
                  stage={stage}
                  index={index}
                  isFirst={index === 0}
                  isSelected={activeIds.includes(stage.id)}
                  data={stageDataMap[stage.id] ?? null}
                  isDragOver={dragOverId === stage.id}
                  isDragging={dragSourceId === stage.id}
                  onClick={() => toggleStage(stage.id)}
                  onDelete={() => deleteStage(stage.id)}
                  onRename={(name) => renameStage(stage.id, name)}
                  onDragStart={(e) => handleDragStart(e, stage.id)}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDrop={(e) => handleDrop(e, stage.id)}
                  onDragEnd={handleDragEnd}
                />
              ))}

              {/* 단계 추가 인라인 */}
              {isAddingStage ? (
                <div
                  className="flex-shrink-0 h-10 flex items-center border-2 border-dashed border-indigo-300 rounded px-4 ml-2"
                  style={{ minWidth: 100 }}
                >
                  <input
                    ref={newStageInputRef}
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmAddStage();
                      if (e.key === "Escape") {
                        setNewStageName("");
                        setIsAddingStage(false);
                      }
                    }}
                    onBlur={confirmAddStage}
                    placeholder="단계명"
                    className="text-xs outline-none w-full text-indigo-600 placeholder-indigo-300 bg-transparent"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingStage(true)}
                  className="flex-shrink-0 h-10 px-4 ml-2 border-2 border-dashed border-gray-200 rounded text-xs text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
                >
                  + 단계 추가
                </button>
              )}
            </div>
          </div>

          {/* 모바일: 세로 스택 카드 */}
          <div className="sm:hidden space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              밸류체인 단계
            </p>
            {stages.map((stage) => {
              const isActive = activeIds.includes(stage.id);
              const d = stageDataMap[stage.id];
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => toggleStage(stage.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium text-left transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <span>{stage.name}</span>
                  <div className="flex gap-1">
                    {d?.margin && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          d.margin === "high" ? "bg-emerald-400" : d.margin === "mid" ? "bg-amber-400" : "bg-red-400"
                        }`}
                      />
                    )}
                    {d?.risk && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          d.risk === "high" ? "bg-red-400" : d.risk === "mid" ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setIsAddingStage(true)}
              className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
            >
              + 단계 추가
            </button>
            {isAddingStage && (
              <input
                ref={newStageInputRef}
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmAddStage();
                  if (e.key === "Escape") { setNewStageName(""); setIsAddingStage(false); }
                }}
                onBlur={confirmAddStage}
                placeholder="단계명 입력 후 Enter"
                className="w-full border-2 border-indigo-300 rounded-lg px-4 py-2.5 text-sm outline-none"
                autoFocus
              />
            )}
          </div>

          {/* ── 분석 패널 ─────────────────────────────── */}
          {activeIds.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                단계별 분석
              </p>
              {activeIds.map((id) => {
                const stage = stages.find((s) => s.id === id);
                if (!stage) return null;
                const data = stageDataMap[id] ?? makeEmptyData(id);
                return (
                  <StageDetailPanel
                    key={id}
                    stageName={stage.name}
                    data={data}
                    onChange={(d) => updateStageData(id, d)}
                  />
                );
              })}
            </div>
          )}

          {/* ── 분석 요약 ──────────────────────────────── */}
          {analyzedStages.length > 0 && (
            <div className="border border-gray-100 rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                분석 요약
              </p>
              <div className="space-y-3">
                {analyzedStages.map((stage) => {
                  const d = stageDataMap[stage.id]!;
                  return (
                    <div key={stage.id} className="flex flex-wrap items-start gap-2 text-xs">
                      <span className="font-semibold text-gray-700 min-w-[100px]">{stage.name}</span>
                      {d.margin && (
                        <span className={`px-2 py-0.5 rounded-full font-medium ${MARGIN_COLOR[d.margin]}`}>
                          마진 {MARGIN_LABEL[d.margin]}
                        </span>
                      )}
                      {d.risk && (
                        <span className={`px-2 py-0.5 rounded-full font-medium ${RISK_COLOR[d.risk]}`}>
                          리스크 {RISK_LABEL[d.risk]}
                        </span>
                      )}
                      {d.players.length > 0 && (
                        <span className="text-gray-500">{d.players.join(", ")}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default memo(IndustryValueChain);
