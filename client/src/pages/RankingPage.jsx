import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RankingTable from '../components/RankingTable.jsx';
import { getRanking } from '../api/scores.js';

const DIFFICULTIES = [
  { value: 'easy', label: 'かんたん' },
  { value: 'normal', label: 'ふつう' },
  { value: 'hard', label: 'むずかしい' },
];

export default function RankingPage() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('normal');
  const [mode, setMode] = useState('solo');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getRanking({ difficulty, mode })
      .then(setRows)
      .catch(() => setError('ランキングを取得できませんでした。サーバーが起動しているか確認してください。'))
      .finally(() => setLoading(false));
  }, [difficulty, mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex flex-col items-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between py-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← ホーム
          </button>
          <h1 className="text-xl font-bold text-white">🏆 ランキング</h1>
          <div className="w-12" />
        </div>

        {/* Mode toggle */}
        <div className="flex bg-white/10 rounded-xl p-1 mb-4">
          {[
            { value: 'solo', label: '1人プレイ' },
            { value: 'versus', label: '2人対戦' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === value ? 'bg-indigo-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Difficulty tabs */}
        <div className="flex gap-2 mb-4">
          {DIFFICULTIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setDifficulty(value)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                difficulty === value
                  ? 'bg-white text-indigo-900'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          {loading ? (
            <p className="text-center text-white/50 py-8">読み込み中...</p>
          ) : error ? (
            <p className="text-center text-red-400/70 py-8 text-sm">{error}</p>
          ) : (
            <RankingTable rows={rows} mode={mode} />
          )}
        </div>
      </div>
    </div>
  );
}
