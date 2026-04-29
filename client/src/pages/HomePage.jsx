import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHero from '../components/HomeHero.jsx';

const DIFFICULTIES = [
  { value: 'easy', label: 'かんたん', sub: '8枚 / 4ペア' },
  { value: 'normal', label: 'ふつう', sub: '16枚 / 8ペア' },
  { value: 'hard', label: 'むずかしい', sub: '24枚 / 12ペア' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('solo');
  const [difficulty, setDifficulty] = useState('normal');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleStart = () => {
    navigate('/game', {
      state: {
        mode,
        difficulty,
        playerNames: { 1: player1 || 'Player 1', 2: player2 || 'Player 2' },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <HomeHero title="神経衰弱" subtitle="Memory Card Game" />

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 space-y-6">
          {/* Mode selection */}
          <div>
            <h2 className="text-white/70 text-xs uppercase tracking-widest mb-3">モード</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'solo', label: '1人プレイ', icon: '🧑' },
                { value: 'versus', label: '2人対戦', icon: '👥' },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setMode(value)}
                  className={`py-3 rounded-xl font-semibold text-sm transition-all ${mode === value
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                >
                  <span className="mr-1">{icon}</span> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Player names (versus only) */}
          {mode === 'versus' && (
            <div className="space-y-3">
              <h2 className="text-white/70 text-xs uppercase tracking-widest">プレイヤー名</h2>
              <input
                type="text"
                placeholder="Player 1"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                maxLength={20}
                className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Player 2"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                maxLength={20}
                className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}

          {/* Difficulty selection */}
          <div>
            <h2 className="text-white/70 text-xs uppercase tracking-widest mb-3">難易度</h2>
            <div className="space-y-2">
              {DIFFICULTIES.map(({ value, label, sub }) => (
                <button
                  key={value}
                  onClick={() => setDifficulty(value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${difficulty === value
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                >
                  <span>{label}</span>
                  <span className={`text-xs ${difficulty === value ? 'text-indigo-200' : 'text-white/40'}`}>
                    {sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
          >
            ゲームスタート
          </button>
        </div>

        {/* Ranking link */}
        <button
          onClick={() => navigate('/ranking')}
          className="w-full mt-4 py-3 text-white/60 hover:text-white text-sm transition-colors"
        >
          🏆 ランキングを見る
        </button>
      </div>
    </div>
  );
}
