//CSS
import "./App.css";

//REACT
import { useCallback, useEffect, useState } from "react";

//DATA
import { wordsList } from "./data/words";

//COMPONENTS
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPikedCategory] = useState("");
  const [letters, SetLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //pegando uma categoria aleatória
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    // mathrandom gera um número aleatório, mas em Float. mathfloor aredonda a um inteiro pra baixo
    // console.log(category);

    //pegando uma Palavra aleatória
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    // console.log(word);

    return { word, category };
  }, [words]);

  //inicio do jogo
  const startGame = useCallback( () => {
    //limpando todas as letras
    clearLetterStates();
    //pick word and pick category
    const { word, category } = pickWordAndCategory();

    //criando um array de letras
    let wordLetters = word.split("");

    // aceita as letras como maiúsculas ou mnúsculas, perde case sensitive
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // console.log(word, category);
    // console.log(wordLetters);

    //preencher os estados (states)
    setPickedWord(word);
    setPikedCategory(category);
    SetLetters(wordLetters);

    setGameStage(stages[1].name);
  } , [pickWordAndCategory]);

  //procesamento de entrada da letra
  const verifyLetter = (letter) => {
    //padronizando letra como minúscula
    const normalizedLetter = letter.toLowerCase();

    //checando se a letra já foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //pegar letra adivinhada ou perder vida
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // console.log(guessedLetters);
  // console.log(wrongLetters);

  //Testar se ass tentativas terminaram
  useEffect(() => {
    if (guesses <= 0) {
      //resetar todos os states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //Checkar condição de vitória
  useEffect(() => {
    //cria array de letras ùnicas
    const uniqueLetters = [...new Set(letters)];

    //consdição de vitória
    if (guessedLetters.length === uniqueLetters.length) {
      //adcionar score
      setScore((actualScore) => (actualScore += 100));

      //reiniciar o jogo com uma palavra nova
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  //restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {/* <h1>Secret Word</h1> */}
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
