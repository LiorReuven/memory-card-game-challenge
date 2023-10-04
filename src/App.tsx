import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

interface TCard {
  revealed: boolean;
  value: number;
  state: 'DEFAULT' | 'CORRECT' | 'WRONG';
}

interface TPrevCard extends TCard {
  index: number;
}

const cardsArray: TCard[] = [
  { revealed: true, value: 0, state: 'DEFAULT' },
  { revealed: true, value: 0, state: 'DEFAULT' },
  { revealed: true, value: 1, state: 'DEFAULT' },
  { revealed: true, value: 1, state: 'DEFAULT' },
  { revealed: true, value: 2, state: 'DEFAULT' },
  { revealed: true, value: 2, state: 'DEFAULT' },
  { revealed: true, value: 3, state: 'DEFAULT' },
  { revealed: true, value: 3, state: 'DEFAULT' },
  { revealed: true, value: 4, state: 'DEFAULT' },
  { revealed: true, value: 4, state: 'DEFAULT' },
  { revealed: true, value: 5, state: 'DEFAULT' },
  { revealed: true, value: 5, state: 'DEFAULT' },
];

function App() {
  const [cards, setCards] = useState<TCard[]>(cardsArray);
  const [prevCard, setPrevCard] = useState<TPrevCard | undefined>();
  const [blockExecution, setBlockExecution] = useState(false);
  const timer = useRef<NodeJS.Timeout | undefined>();

  const resetCards = useCallback(() => {
    clearTimeout(timer.current);
    setBlockExecution(true);
    const resetArray: TCard[] = cards
      .sort(() => Math.random() - 0.5)
      .map((card) => ({
        ...card,
        revealed: true,
        state: 'DEFAULT',
      }));
    setCards([...resetArray]);
    timer.current = setTimeout(() => {
      const hiddenArray: TCard[] = resetArray.map((card) => ({
        ...card,
        revealed: false,
        state: 'DEFAULT',
      }));
      setCards([...hiddenArray]);
      setBlockExecution(false);
    }, 3000);
  }, [cards]);

  useEffect(() => {
    resetCards();

    return () => {
      if (timer) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  function checkCorrectWrong(card: TCard, cardIndex: number) {
    const newCardsArray = [...cards];
    const currentCard = newCardsArray[cardIndex];
    const prevClickedCard = newCardsArray[prevCard!.index];

    // if WRONG Pair
    if (prevCard!.value !== card.value) {
      currentCard.state = 'WRONG';
      prevClickedCard.state = 'WRONG';
      setTimeout(() => {
        currentCard.revealed = false;
        prevClickedCard.revealed = false;
        currentCard.state = 'DEFAULT';
        prevClickedCard.state = 'DEFAULT';
        setCards([...newCardsArray]);
        setBlockExecution(false);
      }, 1000);
      //  If Correct pair
    } else {
      currentCard.state = 'CORRECT';
      prevClickedCard.state = 'CORRECT';
      checkAllCorrect();
      setBlockExecution(false);
    }
  }

  function checkAllCorrect() {
    const allCorrect = cards.every((card) => card.state === 'CORRECT');
    if (allCorrect) {
      setTimeout(() => {
        alert('You Won Click to restart the game');
        resetCards();
      }, 1000);
    }
  }

  function onCardClick(card: TCard, cardIndex: number) {
    if (blockExecution || prevCard?.index === cardIndex) return;

    //reveal card on click
    const newCardsArray = [...cards];
    newCardsArray[cardIndex].revealed = true;
    setCards([...newCardsArray]);

    //check if prev card revlead
    if (prevCard) {
      setBlockExecution(true);
      checkCorrectWrong(card, cardIndex);
      setPrevCard(undefined);
    } else {
      setPrevCard({ ...card, index: cardIndex });
    }
  }

  return (
    <>
      <div
        onClick={() => {
          resetCards();
        }}
        className="buttons-container"
      >
        <button className="reset-btn">Reset Game</button>
      </div>
      <div className="grid">
        {cards.map((card, cardIndex) => (
          <div
            key={cardIndex}
            onClick={() => {
              onCardClick(card, cardIndex);
            }}
            style={{ cursor: blockExecution ? 'default' : 'pointer' }}
            className={`card ${
              card.state === 'CORRECT'
                ? 'correct'
                : card.state === 'WRONG'
                ? 'wrong'
                : ''
            }`}
          >
            {card.revealed ? card.value : ''}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
