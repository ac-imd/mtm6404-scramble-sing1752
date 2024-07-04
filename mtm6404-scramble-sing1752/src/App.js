import React, { useState, useEffect } from 'react';
import './App.css';

/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src];
  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }
  if (typeof src === 'string') {
    return copy.join('');
  }
  return copy;
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words = ["react", "javascript", "coding", "frontend", "backend", "webdev", "html", "css", "node", "redux"];

function App() {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [input, setInput] = useState('');
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('scrambleGameState'));
    if (savedState) {
      setCurrentWord(savedState.currentWord);
      setScrambledWord(savedState.scrambledWord);
      setPoints(savedState.points);
      setStrikes(savedState.strikes);
      setPasses(savedState.passes);
      setGameOver(savedState.gameOver);
    } else {
      startNewGame();
    }
  }, []);

  useEffect(() => {
    if (!gameOver) {
      localStorage.setItem('scrambleGameState', JSON.stringify({ currentWord, scrambledWord, points, strikes, passes, gameOver }));
    }
  }, [currentWord, scrambledWord, points, strikes, passes, gameOver]);

  function startNewGame() {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(newWord);
    setScrambledWord(shuffle(newWord));
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setGameOver(false);
    localStorage.removeItem('scrambleGameState');
  }

  function handleGuess(e) {
    e.preventDefault();
    if (input === currentWord) {
      setPoints(points + 1);
      if (points + 1 === words.length) {
        setGameOver(true);
        return;
      }
      const newWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(newWord);
      setScrambledWord(shuffle(newWord));
    } else {
      setStrikes(strikes + 1);
      if (strikes + 1 >= 3) {
        setGameOver(true);
      }
    }
    setInput('');
  }

  function handlePass() {
    if (passes > 0) {
      setPasses(passes - 1);
      const newWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(newWord);
      setScrambledWord(shuffle(newWord));
    }
  }

  if (gameOver) {
    return (
      <div>
        <h1>Game Over</h1>
        <p>Points: {points}</p>
        <button onClick={startNewGame}>Play Again</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Scramble</h1>
      <p>Points: {points}</p>
      <p>Strikes: {strikes}</p>
      <p>Passes: {passes}</p>
      <p>Scrambled Word: {scrambledWord}</p>
      <form onSubmit={handleGuess}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Guess</button>
      </form>
      <button onClick={handlePass} disabled={passes === 0}>Pass</button>
    </div>
  );
}

export default App;
