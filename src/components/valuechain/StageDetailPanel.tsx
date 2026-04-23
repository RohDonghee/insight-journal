"use client";

import { MarginLevel, RiskLevel, StageData } from "./IndustryValueChain";
import PlayerTagInput from "./PlayerTagInput";

interface Props {
  stageName: string;
  data: StageData;
  onChange: (data: StageData) => void;
}

type SegmentOption = { value: string; label: string };

function SegmentControl({
  label,
  options,
  value,
  onChange,
  activeClass,
}: {
  label: string;
  options: SegmentOption[];
  value: string | null;
  onChange: (v: string | null) => void;
  activeClass: (v: string) => string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs font-medium">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(value === opt.value ? null : opt.value)}
            className={`flex-1 py-2 transition-colors border-r last:border-r-0 border-gray-100 ${
              value === opt.value
                ? activeClass(opt.value)
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const marginActiveClass = (v: string) =>
  v === "high"
    ? "bg-emerald-500 text-white"
    : v === "mid"
    ? "bg-amber-400 text-white"
    : "bg-red-500 text-white";

const riskActiveClass = (v: string) =>
  v === "high"
    ? "bg-red-500 text-white"
    : v === "mid"
    ? "bg-amber-400 text-white"
    : "bg-emerald-500 text-white";

const MARGIN_OPTS: SegmentOption[] = [
  { value: "high", label: "높음" },
  { value: "mid", label: "중간" },
  { value: "low", label: "낮음" },
];

const RISK_OPTS: SegmentOption[] = [
  { value: "high", label: "높음" },
  { value: "mid", label: "중간" },
  { value: "low", label: "낮음" },
];

export default function StageDetailPanel({ stageName, data, onChange }: Props) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-white p-6 space-y-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
        <h4 className="text-sm font-semibold text-indigo-700">{stageName}</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SegmentControl
          label="마진 풀"
          options={MARGIN_OPTS}
          value={data.margin}
          onChange={(v) => onChange({ ...data, margin: v as MarginLevel })}
          activeClass={marginActiveClass}
        />
        <SegmentControl
          label="와해 리스크"
          options={RISK_OPTS}
          value={data.risk}
          onChange={(v) => onChange({ ...data, risk: v as RiskLevel })}
          activeClass={riskActiveClass}
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
          핵심 플레이어
        </p>
        <PlayerTagInput
          players={data.players}
          onChange={(players) => onChange({ ...data, players })}
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
          리포트 핵심 발견
        </p>
        <textarea
          value={data.keypoint}
          onChange={(e) => onChange({ ...data, keypoint: e.target.value })}
          rows={3}
          placeholder="이 단계에서 리포트가 제시한 핵심 데이터 또는 발견을 기록하세요."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
          전략적 시사점
        </p>
        <textarea
          value={data.strategic}
          onChange={(e) => onChange({ ...data, strategic: e.target.value })}
          rows={3}
          placeholder="이 단계에서 도출할 수 있는 전략적 시사점을 기록하세요."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}
