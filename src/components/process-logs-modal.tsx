"use client";

import { useState, useEffect, useRef } from "react";
import { X, Terminal, Copy, Check } from "lucide-react";
import { getProcessLogs, type LogEntry, type LogLevel } from "@/data/process-logs";
import { cn } from "@/lib/utils";

const levelColors: Record<LogLevel, string> = {
  INFO: "text-blue-400",
  WARN: "text-amber-400",
  ERROR: "text-red-400",
  SUCCESS: "text-green-400",
  DEBUG: "text-slate-500",
};

const levelBadgeColors: Record<LogLevel, string> = {
  INFO: "bg-blue-500/20 text-blue-400",
  WARN: "bg-amber-500/20 text-amber-400",
  ERROR: "bg-red-500/20 text-red-400",
  SUCCESS: "bg-green-500/20 text-green-400",
  DEBUG: "bg-slate-500/20 text-slate-500",
};

function LogLine({
  entry,
  visible,
}: {
  entry: LogEntry;
  visible: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 py-1 px-4 hover:bg-white/5 transition-all font-mono text-[13px] leading-relaxed",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <span className="text-slate-600 shrink-0 select-none w-16 text-right">
        {entry.timestamp}
      </span>
      <span
        className={cn(
          "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded w-16 text-center",
          levelBadgeColors[entry.level]
        )}
      >
        {entry.level}
      </span>
      <span className={cn("break-all", levelColors[entry.level])}>
        {entry.message}
      </span>
    </div>
  );
}

export function ProcessLogsModal({
  processId,
  processName,
  onClose,
}: {
  processId: string;
  processName: string;
  onClose: () => void;
}) {
  const allLogs = getProcessLogs(processId);
  const [visibleCount, setVisibleCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate logs appearing one by one
  useEffect(() => {
    if (visibleCount >= allLogs.length) return;
    const delay = visibleCount === 0 ? 200 : 120 + Math.random() * 250;
    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [visibleCount, allLogs.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleCount]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleCopy() {
    const text = allLogs
      .map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[80vh] flex flex-col bg-[#0d1117] rounded-xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#161b22] border-b border-white/10">
          <div className="flex items-center gap-3">
            <Terminal className="size-4 text-green-400" />
            <span className="text-sm font-mono font-bold text-slate-300">
              {processId}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              — {processName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-md transition-all cursor-pointer font-mono"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-green-400" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copiar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-all cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Log Content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto py-3 min-h-[300px] max-h-[60vh]"
        >
          {allLogs.slice(0, visibleCount).map((entry, i) => (
            <LogLine key={i} entry={entry} visible={true} />
          ))}

          {/* Cursor blink */}
          {visibleCount < allLogs.length && (
            <div className="flex items-center gap-2 px-4 py-1">
              <span className="w-2 h-4 bg-green-400 animate-pulse" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#161b22] border-t border-white/10 text-[11px] font-mono text-slate-500">
          <span>
            {visibleCount}/{allLogs.length} entradas
          </span>
          <span>
            Presiona <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-slate-400">ESC</kbd> para cerrar
          </span>
        </div>
      </div>
    </div>
  );
}
