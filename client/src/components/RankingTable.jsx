function formatTime(seconds) {
  if (seconds == null) return '—';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function RankingTable({ rows, mode }) {
  if (rows.length === 0) {
    return (
      <p className="text-center text-white/50 py-8">まだスコアがありません</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="text-white/60 text-xs uppercase tracking-wide border-b border-white/10">
            <th className="py-2 px-3 text-left">#</th>
            <th className="py-2 px-3 text-left">名前</th>
            {mode === 'solo' ? (
              <>
                <th className="py-2 px-3 text-right">回数</th>
                <th className="py-2 px-3 text-right">時間</th>
              </>
            ) : (
              <th className="py-2 px-3 text-left">勝者</th>
            )}
            <th className="py-2 px-3 text-right">日付</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-2 px-3 font-bold text-yellow-400">{i + 1}</td>
              <td className="py-2 px-3">{row.player_name}</td>
              {mode === 'solo' ? (
                <>
                  <td className="py-2 px-3 text-right font-mono">{row.moves}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatTime(row.time_seconds)}</td>
                </>
              ) : (
                <td className="py-2 px-3">{row.winner}</td>
              )}
              <td className="py-2 px-3 text-right text-white/50 text-xs">
                {new Date(row.created_at).toLocaleDateString('ja-JP')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
