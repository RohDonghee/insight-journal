"use client";

import { useState, KeyboardEvent } from "react";

interface Props {
  players: string[];
  onChange: (players: string[]) => void;
}

export default function PlayerTagInput({ players, onChange }: Props) {
  const [input, setInput] = useState("");

  function add(val: string) {
    const v = val.trim();
    if (v && !players.includes(v)) onChange([...players, v]);
    setInput("");
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
    }
    if (e.key === "Backspace" && !input && players.length > 0) {
      onChange(players.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 p-2.5 border border-gray-200 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-shadow">
      {players.map((p, i) => (
        <span
          key={i}
          className="flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md border border-indigo-100"
        >
          {p}
          <button
            type="button"
            onClick={() => onChange(players.filter((_, j) => j !== i))}
            className="text-indigo-300 hover:text-indigo-600 leading-none text-sm ml-0.5"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => { if (input.trim()) add(input); }}
        placeholder={players.length === 0 ? "입력 후 Enter 또는 쉼표로 추가" : ""}
        className="flex-1 min-w-[140px] text-sm outline-none placeholder-gray-300 bg-transparent"
      />
    </div>
  );
}
