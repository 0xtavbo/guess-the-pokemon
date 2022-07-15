import { useState, useEffect, useRef } from "react";
import { Pokemon } from "./types";
import api from "./api";

function App() {
  
  const inputValue = useRef<HTMLInputElement>(null);
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [showPokemon, setShowPokemon] = useState<boolean>(false);
  const [guessFailed, setGuessFailed] = useState<boolean>(false);
  const [guessSuccess, setGuessSuccess] = useState<boolean>(false);
  const [pokemonInput, setPokemonInput] = useState("");
  const [counterVictory, setCounterVictory] = useState(0);
  const [counterDefeat, setCounterDefeat] = useState(0);

  // on load
  useEffect(() => {
    // fetch random pokémon
    api.random().then(data => setPokemon(data));

    // fetch counters from localStorage object
    setCounterVictory(Number(window.localStorage.getItem("counterVictory")));
    setCounterDefeat(Number(window.localStorage.getItem("counterDefeat")));
  }, [])

  // update localStorage win counter
  useEffect(() => {
    window.localStorage.setItem("counterVictory", JSON.stringify(counterVictory));
  }, [counterVictory])

  // update localStorage lose counter
  useEffect(() => {
    window.localStorage.setItem("counterDefeat", JSON.stringify(counterDefeat));
  }, [counterDefeat])

  const revealPokemon = (e: any) => {
    e.preventDefault();

    const answer = pokemonInput.replace(/[^A-Za-z]/g, "").toLowerCase();
    const result = answer === pokemon?.name;
    
    if (result) {
      setGuessSuccess(true);
      setCounterVictory(counterVictory + 1);
    } else {
      setGuessFailed(true);
      setCounterDefeat(counterDefeat + 1);
    }

    // show Pokémon image
    setShowPokemon(true);
  }

  // reset states
  const resetGame = () => {
    setShowPokemon(false);
    setPokemonInput("");
    setGuessFailed(false);
    setGuessSuccess(false);
    api.random().then(data => setPokemon(data));
    inputValue.current?.focus();
  }

  const resetCounter = () => {
    setCounterDefeat(0);
    setCounterVictory(0);
  }

  const handleInputChange = (event: any) => {
    setPokemonInput(event.target.value)
  }
  
  return (

    <main>

      <div className={"game-wrapper nes-container is-dark"}>
        
        <h1>Who's That Pokémon?</h1>
        
        <div className="img-counter-wrapper">
          <img
            className={!showPokemon ? "hidden" : ""}
            src={pokemon ? pokemon.image : "#"}
          />

          <div className="counter-container">
            <p className="nes-text is-success">Total Wins: {counterVictory}</p>
            <p className="nes-text is-error">Total Loses: {counterDefeat}</p>
            <button
              className={"reset-btn nes-btn is-warning"}
              onClick={resetCounter}
            >
              Reset
            </button>
          </div>
        </div>

        { showPokemon ? (

        // showPokemon = true
        <div className="input-result-wrapper">
          <h3>
            It's {" " +
              pokemon?.name.charAt(0).toUpperCase() +
              pokemon?.name.slice(1) +
              "!"}
            {guessSuccess ? " You won!" : ""}
            {guessFailed ? " You lose!" : ""}
          </h3>
          <button
            className={"nes-btn is-success"}
            onClick={resetGame}
          >
            Play again
          </button>
        </div>

        ) : (

        // showPokemon = false
        <form onSubmit={revealPokemon}>
          <div className="input-result-wrapper">
            <input autoFocus
              className={
                `input nes-input
                ${guessFailed ? "is-error" : ""}
                ${guessSuccess ? "is-success" : ""}`
              }
              type="text"
              value={pokemonInput}
              ref={inputValue}
              placeholder="Enter the name of the Pokémon!"
              onChange={handleInputChange}
            />

            <button
              className={"nes-btn is-primary"}
              type="submit"
            >
              Guess
            </button>
          </div>
        </form>

        )}

      </div>

    </main>
  );
}

export default App;
