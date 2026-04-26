import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Board from '../components/Board.jsx';
import ScoreBoard from '../components/ScoreBoard.jsx';
import { useGame } from '../hooks/useGame.js';

const DIFFICULTY_LABELS = { easy: 'かんたん', normal: 'ふつう', hard: 'むずかしい' };

export default function GamePage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Redirect home if accessed without state
  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);

  const { mode = 'solo', difficulty = 'normal', playerNames = {} } = state ?? {};

  const {
    cards, flipCard, moves, currentPlayer, scores,
    elapsedSeconds, gameOver, matchedCount, totalPairs, resetGame,
  } = useGame(difficulty, mode);

  // Navigate to result when game is over
  useEffect(() => {
    if (!gameOver) return;
    const timer = setTimeout(() => {
      navigate('/result', {
        state: { mode, difficulty, moves, timeSeconds: elapsedSeconds, scores, playerNames },
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [gameOver]);

  if (!state) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between py-4">
        <button
          onClick={() => navigate('/')}
          className="text-white/60 hover:text-white text-sm transition-colors"
        >
          ← ホーム
        </button>
        <div className="text-white/60 text-sm">
          {DIFFICULTY_LABELS[difficulty]} — {mode === 'solo' ? '1人プレイ' : '2人対戦'}
        </div>
        <button
          onClick={resetGame}
          className="text-white/60 hover:text-white text-sm transition-colors"
        >
          リセット ↺
        </button>
      </div>

      {/* Progress */}
      <div className="text-white/40 text-xs mb-4">
        {matchedCount} / {totalPairs} ペア成立
      </div>

      {/* ScoreBoard */}
      <div className="w-full max-w-sm mb-6">
        <ScoreBoard
          mode={mode}
          moves={moves}
          elapsedSeconds={elapsedSeconds}
          currentPlayer={currentPlayer}
          scores={scores}
          playerNames={playerNames}
        />
      </div>

      {/* Game Board */}
      <div className="bg-white/5 rounded-2xl">
        <Board cards={cards} difficulty={difficulty} onCardClick={flipCard} />
      </div>

      {/* Game over overlay */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-5xl mb-3">🎉</div>
            <div className="text-2xl font-bold">クリア！</div>
          </div>
        </div>
      )}
    </div>
  );
}
