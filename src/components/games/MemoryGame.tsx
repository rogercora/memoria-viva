'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Trophy, RotateCcw, Star } from 'lucide-react';

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🧠', '❤️', '🌸', '🎵', '📸', '🍎', '🐱', '🌟'];

export default function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Criar pares de cartas
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5);

    const newCards: MemoryCard[] = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameWon(false);
  };

  const handleCardClick = (id: number) => {
    // Ignora se já estiver verificando, se a carta já estiver virada ou combinada
    if (isChecking || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    // Virar carta
    const newCards = cards.map(c =>
      c.id === id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // Se duas cartas viradas, verificar combinação
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Combinação encontrada!
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      } else {
        // Sem combinação - desvirar
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1500);
      }
    }
  };

  // Verificar vitória
  useEffect(() => {
    if (matchedPairs === EMOJIS.length && matchedPairs > 0) {
      setGameWon(true);
    }
  }, [matchedPairs]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Jogo da Memória
          </h2>
          <p className="text-gray-600 text-lg">
            Encontre os pares iguais
          </p>
        </div>
        <div className="flex gap-4">
          <Card className="px-6 py-3 text-center" padding="none">
            <p className="text-sm text-gray-600">Movimentos</p>
            <p className="text-2xl font-bold text-blue-600">{moves}</p>
          </Card>
          <Card className="px-6 py-3 text-center" padding="none">
            <p className="text-sm text-gray-600">Pares</p>
            <p className="text-2xl font-bold text-green-600">
              {matchedPairs}/{EMOJIS.length}
            </p>
          </Card>
        </div>
      </div>

      {/* Grid de Cartas */}
      <div className="grid grid-cols-4 gap-3 md:gap-4 mb-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isFlipped || card.isMatched || isChecking}
            className={`
              aspect-square rounded-xl text-5xl md:text-6xl font-bold
              transition-all duration-300 transform
              focus:outline-none focus:ring-4 focus:ring-blue-500
              ${card.isFlipped || card.isMatched
                ? 'bg-white rotate-0'
                : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }
              ${card.isMatched ? 'ring-4 ring-green-500 scale-95' : 'shadow-lg hover:scale-105'}
            `}
            aria-label={card.isFlipped || card.isMatched ? card.emoji : 'Carta virada'}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="animate-bounce">{card.emoji}</span>
            ) : (
              <span className="text-white text-3xl">?</span>
            )}
          </button>
        ))}
      </div>

      {/* Controles */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={initializeGame}
          variant="secondary"
          size="large"
          icon={<RotateCcw size={24} />}
        >
          Reiniciar Jogo
        </Button>
      </div>

      {/* Modal de Vitória */}
      {gameWon && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full text-center" padding="large">
            <div className="w-24 h-24 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-yellow-600" />
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Parabéns!
            </h3>
            <p className="text-xl text-gray-700 mb-4">
              Você completou o jogo da memória!
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">
                  {moves} movimentos
                </span>
              </div>
              <p className="text-gray-600">
                {moves <= 10 && 'Excelente! Você é incrível! 🌟'}
                {moves > 10 && moves <= 15 && 'Muito bom! Continue assim! 👏'}
                {moves > 15 && 'Bom trabalho! Pratique mais! 💪'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={initializeGame}
                variant="primary"
                size="large"
                className="flex-1"
                icon={<RotateCcw size={20} />}
              >
                Jogar Novamente
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
