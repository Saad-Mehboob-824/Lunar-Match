import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

function Card({ card, onClick }) {
    return (
        <div
            className={`card ${card.isFlipped ? 'flipped' : ''}`}
            onClick={onClick}
        >
            {card.isFlipped || card.isMatched ? card.value : "?"}
        </div>
    );
}

export default function MemoryGame() {
    const [cards, setCards] = useState([]);
    const [flippedIndexes, setFlippedIndexes] = useState([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    // Initialize cards
    useEffect(() => {
        resetGame();
    }, []);

    // Timer effect
    useEffect(() => {
        if (gameCompleted) return;
        const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [gameCompleted]);

    const createCardPairs = () => {
        const values = ["🚀", "🌌", "🪐", "⭐", "🌠", "🌍", "🌑", "🌞"];
        return [...values, ...values]
            .map((value) => ({ value, isFlipped: false, isMatched: false }))
            .sort(() => Math.random() - 0.5);
    };

    const resetGame = () => {
        setCards(createCardPairs());
        setFlippedIndexes([]);
        setScore(0);
        setMoves(0);
        setTimer(0);
        setGameCompleted(false);
    };

    const handleFlip = (index) => {
        if (flippedIndexes.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

        const newFlippedIndexes = [...flippedIndexes, index];
        const newCards = cards.map((card, idx) => (
            idx === index ? { ...card, isFlipped: true } : card
        ));
        setCards(newCards);
        setFlippedIndexes(newFlippedIndexes);

        if (newFlippedIndexes.length === 2) {
            setMoves(moves + 1);
            const [firstIndex, secondIndex] = newFlippedIndexes;
            if (cards[firstIndex].value === cards[secondIndex].value) {
                const matchedCards = newCards.map((card, idx) =>
                    idx === firstIndex || idx === secondIndex ? { ...card, isMatched: true } : card
                );
                setCards(matchedCards);
                setScore(score + 100);
                setFlippedIndexes([]);
                if (matchedCards.every(card => card.isMatched)) {
                    setGameCompleted(true);
                    setScore(score + Math.max(0, 1000 - timer * 2)); // Time bonus
                }
            } else {
                setScore(score - 10);
                setTimeout(() => {
                    setCards(cards.map((card, idx) =>
                        idx === firstIndex || idx === secondIndex ? { ...card, isFlipped: false } : card
                    ));
                    setFlippedIndexes([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="memory-game">
            <h1>Space Memory</h1>
            <div className="stats">
                <span>⏱️ {timer}s</span>
                <span>❤️ {moves} moves</span>
                <span>Score: {score}</span>
                <button onClick={resetGame}>Reset</button>
            </div>
            <div className="card-grid">
                {cards.map((card, index) => (
                    <Card key={index} card={card} onClick={() => handleFlip(index)} />
                ))}
            </div>
            {gameCompleted && (
                <div className="game-over">
                    <h2>Game Completed!</h2>
                    <p>Final Score: {score}</p>
                    <button onClick={resetGame}>Play Again</button>
                </div>
            )}
        </div>
    );
}
