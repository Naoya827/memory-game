export default function HomeHero({ title="神経衰弱", subtitle="Memory Card Game" }) {
    return (
        <div className="text-center mb-10">
            <div className="flex justify-center mb-3">
                <div className="home-card-back-icon" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-white/50 mt-2 text-sm">{subtitle}</p>
        </div>
    );
}