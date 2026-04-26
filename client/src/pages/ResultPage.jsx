import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { postScore } from '../api/scores.js';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ResultPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);

  const {
    mode = 'solo', difficulty = 'normal',
    moves = 0, timeSeconds = 0,
    scores = { 1: 0, 2: 0 }, playerNames = {},
  } = state ?? {};

  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Determine winner for versus mode
  const winner =
    mode === 'versus'
      ? scores[1] > scores[2]
        ? playerNames[1] || 'Player 1'
        : scores[2] > scores[1]
        ? playerNames[2] || 'Player 2'
        : null // draw
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = mode === 'solo' ? playerName.trim() : winner;
    if (!name) return;

    setSubmitting(true);
    setError('');
    try {
      await postScore({
        player_name: name,
        mode,
        difficulty,
        moves: mode === 'solo' ? moves : null,
        time_seconds: mode === 'solo' ? timeSeconds : null,
        winner: mode === 'versus' ? winner : null,
      });
      setSubmitted(true);
    } catch {
      setError('スコアの登録に失敗しました。サーバーが起動しているか確認してください。');
    } finally {
      setSubmitting(false);
    }
  };

  if (!state) return null;

  const DIFFICULTY_LABELS = { easy: 'かんたん', normal: 'ふつう', hard: 'むずかしい' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Result card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center mb-4">
          <div className="text-5xl mb-4">
            {mode === 'versus' && !winner ? '🤝' : '🎉'}
          </div>

          {mode === 'solo' ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">クリア！</h1>
              <p className="text-white/60 text-sm mb-5">{DIFFICULTY_LABELS[difficulty]}</p>
              <div className="flex justify-center gap-8">
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wide">時間</div>
                  <div className="text-3xl font-bold font-mono text-white">{formatTime(timeSeconds)}</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wide">めくった回数</div>
                  <div className="text-3xl font-bold text-white">{moves}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-4">
                {winner ? `${winner} の勝利！` : '引き分け！'}
              </h1>
              <div className="flex justify-center gap-8 mb-2">
                {[1, 2].map((p) => (
                  <div key={p} className={winner === (playerNames[p] || `Player ${p}`) ? 'text-yellow-400' : 'text-white/70'}>
                    <div className="text-xs">{playerNames[p] || `Player ${p}`}</div>
                    <div className="text-3xl font-bold">{scores[p]}</div>
                    <div className="text-xs opacity-70">ペア</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Score registration */}
        {!submitted ? (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-4">
            <h2 className="text-white font-semibold mb-4 text-center">
              スコアを登録する
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'solo' && (
                <input
                  type="text"
                  placeholder="プレイヤー名"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={20}
                  required
                  className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                />
              )}
              {mode === 'versus' && (
                <p className="text-white/60 text-sm text-center">
                  {winner ? `${winner} のスコアを登録します` : '引き分けのため登録をスキップできます'}
                </p>
              )}
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button
                type="submit"
                disabled={submitting || (mode === 'solo' && !playerName.trim()) || (mode === 'versus' && !winner)}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
              >
                {submitting ? '登録中...' : '登録する'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-green-500/20 rounded-2xl p-4 mb-4 text-center text-green-300 font-medium">
            ✓ スコアを登録しました！
          </div>
        )}

        {/* Navigation buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/game', { state: { mode, difficulty, playerNames } })}
            className="py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all"
          >
            もう一度
          </button>
          <button
            onClick={() => navigate('/')}
            className="py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all"
          >
            ホームへ
          </button>
        </div>
      </div>
    </div>
  );
}
