import Card from './Card.jsx';

const GRID_COLS = {
  easy: 'grid-cols-4',
  normal: 'grid-cols-4',
  hard: 'grid-cols-4 sm:grid-cols-6',
};

export default function Board({ cards, difficulty, onCardClick }) {
  return (
    <div className={`grid ${GRID_COLS[difficulty]} gap-2 sm:gap-3 p-4`}>
      {cards.map((card) => (
        <Card key={card.id} card={card} onClick={onCardClick} />
      ))}
    </div>
  );
}
