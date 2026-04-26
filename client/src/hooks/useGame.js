import { useState, useEffect, useCallback, useRef } from 'react';

const SYMBOLS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];
const PAIR_COUNTS = { easy: 4, normal: 8, hard: 12 };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(difficulty) {
  const count = PAIR_COUNTS[difficulty];
  const pairs = shuffle([...SYMBOLS.slice(0, count), ...SYMBOLS.slice(0, count)]);
  return pairs.map((symbol, id) => ({ id, symbol, isFlipped: false, isMatched: false }));
}

export function useGame(difficulty, mode) {
  const [cards, setCards] = useState(() => createCards(difficulty));
  const [moves, setMoves] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Refs to avoid stale closures inside setTimeout callbacks
  const cardsRef = useRef(cards);
  const currentPlayerRef = useRef(1);
  const isCheckingRef = useRef(false);
  const flippedIdsRef = useRef([]);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);
  const gameOverRef = useRef(false);

  const syncCards = (newCards) => {
    cardsRef.current = newCards;
    setCards(newCards);
  };

  // Timer (solo mode only)
  useEffect(() => {
    if (mode !== 'solo') return;
    timerRef.current = setInterval(() => {
      if (!gameOverRef.current) {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [mode]);

  const flipCard = useCallback((cardId) => {
    if (isCheckingRef.current) return;
    if (flippedIdsRef.current.length >= 2) return;
    if (flippedIdsRef.current.includes(cardId)) return;

    const card = cardsRef.current.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // Flip the card
    const flippedCards = cardsRef.current.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c,
    );
    syncCards(flippedCards);
    flippedIdsRef.current = [...flippedIdsRef.current, cardId];

    if (flippedIdsRef.current.length !== 2) return;

    // Two cards are now face-up — check for match
    isCheckingRef.current = true;
    setMoves((m) => m + 1);

    const [id1, id2] = flippedIdsRef.current;
    const c1 = cardsRef.current.find((c) => c.id === id1);
    const c2 = cardsRef.current.find((c) => c.id === id2);

    if (c1.symbol === c2.symbol) {
      // Match — mark as matched after short delay
      setTimeout(() => {
        const matched = cardsRef.current.map((c) =>
          c.id === id1 || c.id === id2 ? { ...c, isMatched: true } : c,
        );
        syncCards(matched);

        if (mode === 'versus') {
          setScores((s) => ({
            ...s,
            [currentPlayerRef.current]: s[currentPlayerRef.current] + 1,
          }));
        }

        flippedIdsRef.current = [];
        isCheckingRef.current = false;

        if (matched.every((c) => c.isMatched)) {
          clearInterval(timerRef.current);
          gameOverRef.current = true;
          setGameOver(true);
        }
      }, 600);
    } else {
      // No match — flip back and switch player (versus)
      setTimeout(() => {
        const unflipped = cardsRef.current.map((c) =>
          c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c,
        );
        syncCards(unflipped);

        if (mode === 'versus') {
          const next = currentPlayerRef.current === 1 ? 2 : 1;
          currentPlayerRef.current = next;
          setCurrentPlayer(next);
        }

        flippedIdsRef.current = [];
        isCheckingRef.current = false;
      }, 1000);
    }
  }, [mode]);

  const resetGame = useCallback(() => {
    clearInterval(timerRef.current);
    const newCards = createCards(difficulty);
    syncCards(newCards);
    flippedIdsRef.current = [];
    isCheckingRef.current = false;
    currentPlayerRef.current = 1;
    gameOverRef.current = false;
    setMoves(0);
    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setElapsedSeconds(0);
    setGameOver(false);
    startTimeRef.current = Date.now();

    if (mode === 'solo') {
      timerRef.current = setInterval(() => {
        if (!gameOverRef.current) {
          setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    }
  }, [difficulty, mode]);

  const totalPairs = PAIR_COUNTS[difficulty];
  const matchedCount = cards.filter((c) => c.isMatched).length / 2;

  return {
    cards,
    flipCard,
    moves,
    currentPlayer,
    scores,
    elapsedSeconds,
    gameOver,
    matchedCount,
    totalPairs,
    resetGame,
  };
}
