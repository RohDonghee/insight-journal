"use client";

import { useState } from "react";
import { Stage, StageData } from "./IndustryValueChain";

interface Props {
  stage: Stage;
  index: number;
  isFirst: boolean;
  isSelected: boolean;
  data: StageData | null;
  isDragOver: boolean;
  isDragging: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

const ARROW = 14;

const MARGIN_DOT: Record<string, string> = {
  high: "bg-emerald-500",
  mid: "bg-amber-400",
  low: "bg-red-500",
};

const RISK_DOT: Record<string, string> = {
  high: "bg-red-500",
  mid: "bg-amber-400",
  low: "bg-emerald-500",
};

export default function ChevronNode({
  stage, index, isFirst, isSelected, data, isDragOver, isDragging,
  onClick, onDelete, onRename,
  onDragStart, onDragOver, onDrop, onDragEnd,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(stage.name);

  const clipPath = isFirst
    ? `polygon(0 0, calc(100% - ${ARROW}px) 0, 100% 50%, calc(100% - ${ARROW}px) 100%, 0 100%)`
    : `polygon(${ARROW}px 0, calc(100% - ${ARROW}px) 0, 100% 50%, calc(100% - ${ARROW}px) 100%, ${ARROW}px 100%, 0 50%)`;

  function confirmEdit() {
    const v = editVal.trim();
    if (v) onRename(v);
    else setEditVal(stage.name);
    setIsEditing(false);
  }

  const hasBadge = data && (data.margin || data.risk);

  return (
    <div
      className="relative flex-shrink-0 transition-opacity"
      style={{
        marginLeft: isFirst ? 0 : -ARROW,
        zIndex: isSelected ? 50 : index + 1,
        opacity: isDragging ? 0.4 : 1,
      }}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {/* 마진/리스크 배지 */}
      {hasBadge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1 z-10 pointer-events-none">
          {data!.margin && (
            <span
              className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${MARGIN_DOT[data!.margin]}`}
              title={`마진: ${data!.margin}`}
            />
          )}
          {data!.risk && (
            <span
              className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${RISK_DOT[data!.risk]}`}
              title={`리스크: ${data!.risk}`}
            />
          )}
        </div>
      )}

      {/* 드래그 오버 점선 하이라이트 */}
      {isDragOver && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            clipPath,
            outline: "2px dashed #818cf8",
            outlineOffset: "-2px",
          }}
        />
      )}

      {/* Chevron 버튼 */}
      <button
        type="button"
        onClick={onClick}
        style={{ clipPath }}
        className={`relative h-10 flex items-center justify-center text-xs font-medium transition-colors select-none ${
          isSelected
            ? "bg-indigo-600 text-white"
            : isDragOver
            ? "bg-indigo-100 text-indigo-700"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        // px: left padding accounts for arrow notch, right padding accounts for arrow point
        // We use inline style for dynamic values
        // min-width ensures short names still look like chevrons
        // Tailwind can't do dynamic pl/pr based on ARROW const so we use inline style
        {...{} /* typescript trick for inline style merge */}
      >
        <span
          style={{
            paddingLeft: isFirst ? 16 : ARROW + 8,
            paddingRight: ARROW + 8,
            minWidth: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isEditing ? (
            <input
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmEdit();
                if (e.key === "Escape") {
                  setEditVal(stage.name);
                  setIsEditing(false);
                }
                e.stopPropagation();
              }}
              onBlur={confirmEdit}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              className="bg-transparent outline-none text-center w-full"
              style={{ minWidth: 60 }}
            />
          ) : (
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditVal(stage.name);
                setIsEditing(true);
              }}
              className="truncate"
              style={{ maxWidth: 100 }}
            >
              {stage.name}
            </span>
          )}
        </span>
      </button>

      {/* 삭제 버튼 (선택 상태에서만) */}
      {isSelected && !isEditing && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-1.5 right-0.5 w-4 h-4 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:border-red-300 text-xs leading-none z-30 shadow-sm"
        >
          ×
        </button>
      )}
    </div>
  );
}
