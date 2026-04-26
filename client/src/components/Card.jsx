export default function Card({ card, onClick }) {
  const handleClick = () => {
    if (!card.isMatched && !card.isFlipped) onClick(card.id);
  };

  return (
    <div
      className="card-wrapper w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 cursor-pointer select-none"
      onClick={handleClick}
    >
      <div className={`card-inner w-full h-full ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}>
        {/* 裏面 */}
        <div className="card-face card-back-face text-2xl sm:text-3xl">
          🎴
        </div>
        {/* 表面 */}
        <div className={`card-face card-front-face text-2xl sm:text-3xl ${card.isMatched ? 'matched' : ''}`}>
          {card.symbol}
        </div>
      </div>
    </div>
  );
}
