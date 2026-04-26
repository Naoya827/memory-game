function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ScoreBoard({ mode, moves, elapsedSeconds, currentPlayer, scores, playerNames }) {
  if (mode === 'solo') {
    return (
      <div className="flex gap-6 justify-center bg-white/10 rounded-xl px-6 py-3 text-white">
        <div className="text-center">
          <div className="text-xs opacity-70 uppercase tracking-wide">時間</div>
          <div className="text-2xl font-bold font-mono">{formatTime(elapsedSeconds)}</div>
        </div>
        <div className="w-px bg-white/20" />
        <div className="text-center">
          <div className="text-xs opacity-70 uppercase tracking-wide">めくった回数</div>
          <div className="text-2xl font-bold">{moves}</div>
        </div>
      </div>
    );
  }

  // versus mode
  return (
    <div className="flex gap-4 justify-center">
      {[1, 2].map((p) => (
        <div
          key={p}
          className={`flex-1 max-w-40 text-center rounded-xl px-4 py-3 transition-all ${
            currentPlayer === p
              ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
              : 'bg-white/10 text-white'
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
            {currentPlayer === p ? '▶ ' : ''}{playerNames?.[p] ?? `Player ${p}`}
          </div>
          <div className="text-3xl font-bold">{scores[p]}</div>
          <div className="text-xs opacity-70">ペア</div>
        </div>
      ))}
    </div>
  );
}
