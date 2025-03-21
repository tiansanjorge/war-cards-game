import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Deck, CardsDrawn } from "./types";


interface AppState {
  deckId: string;
  pcCounter: number;
  globalPcCounter: number;
  playerCounter: number;
  globalPlayerCounter: number;
  cardsDrawn: boolean;
  draw: boolean;
  roundWinner: string;
  playerCard: any;
  pcCard: any;
  winner: string;
  game: boolean;
  playerImgLoaded: boolean;
  pcImgLoaded: boolean;
}

function App() {
  const [deckId, setDeckId] = useState<AppState["deckId"]>("");
  const [pcCounter, setPcCounter] = useState<AppState["pcCounter"]>(0);
  const [globalPcCounter, setGlobalPcCounter] = useState<
    AppState["globalPcCounter"]
  >(0);
  const [playerCounter, setPlayerCounter] = useState<AppState["playerCounter"]>(
    0
  );
  const [globalPlayerCounter, setGlobalPlayerCounter] = useState<
    AppState["globalPlayerCounter"]
  >(0);
  const [cardsDrawn, setCardsDrawn] = useState<AppState["cardsDrawn"]>(false);
  const [draw, setDraw] = useState<AppState["draw"]>(true);
  const [roundWinner, setRoundWinner] = useState<AppState["roundWinner"]>("");
  const [playerCard, setPlayerCard] = useState<AppState["playerCard"]>({});
  const [pcCard, setPcCard] = useState<AppState["pcCard"]>({});
  const [winner, setWinner] = useState<AppState["winner"]>("");
  const [game, setGame] = useState<AppState["game"]>(false);
  const [playerImgLoaded, setPlayerImgLoaded] = useState<
    AppState["playerImgLoaded"]
  >(false);
  const [pcImgLoaded, setPcImgLoaded] = useState<AppState["pcImgLoaded"]>(
    false
  );

  // Fetching a new deck from a French-suited playing cards API every new game
  useEffect(() => {
    async function fetchNewDeck(): Promise<void> {
      try {
        const response: Response = await fetch(
          "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
        );
        if (response.ok) {
          const data: Deck = await response.json();
          setDeckId(data.deck_id);
          setGame(true);
        } else {
          throw new Error("Failed to fetch deck");
        }
      } catch (error) {
        console.error("Error fetching deck:", error);
      }
    }
    fetchNewDeck();
  }, [game]);

  // Fetching 2 cards from the deck, it executes after clicking the button
  async function drawCard(): Promise<void> {
    setDraw(false);
    setRoundWinner("");
    if (!deckId) return;

    try {
      const response: Response = await fetch(
        `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
      );
      if (response.ok) {
        const data: CardsDrawn = await response.json();
        const playerDrawnCard = data.cards[0];
        const pcDrawnCard = data.cards[1];

        setPlayerCard(playerDrawnCard);
        setPcCard(pcDrawnCard);
        setCardsDrawn(true);
      } else {
        throw new Error("Failed to draw cards");
      }
    } catch (error) {
      console.error("Error drawing cards:", error);
    }
  }

  const playerImgLoad = () => {
    setPlayerImgLoaded(true);
  };
  const pcImgLoad = () => {
    setPcImgLoaded(true);
  };

  // Triggering the battle when the cards load succesfully
  useEffect(() => {
    if (playerImgLoaded && pcImgLoaded) {
      compareCards(playerCard, pcCard);
    }
  }, [playerImgLoaded, pcImgLoaded, playerCard, pcCard]);

  // Comparing values and setting the round winner
  const compareCards = (
    playerCard: CardsDrawn["cards"][0],
    pcCard: CardsDrawn["cards"][1]
  ) => {
    // Converting possible string type card values to number type
    const cardValueToNumber = (value: string) => {
      switch (value) {
        case "JACK":
          return 11;
        case "QUEEN":
          return 12;
        case "KING":
          return 13;
        case "ACE":
          return 14;
        default:
          return parseInt(value);
      }
    };

    const playerValue: number = cardValueToNumber(playerCard.value);
    const pcValue: number = cardValueToNumber(pcCard.value);

    if (playerValue > pcValue) {
      setPlayerCounter((prevCounter) => prevCounter + 1);
      setRoundWinner("Player wins");
      setDraw(true);
      setPlayerImgLoaded(false);
      setPcImgLoaded(false);
    } else if (playerValue < pcValue) {
      setPcCounter((prevCounter) => prevCounter + 1);
      setRoundWinner("PC wins");
      setDraw(true);
      setPlayerImgLoaded(false);
      setPcImgLoaded(false);
    }else {
      setRoundWinner("Draw");
      setDraw(true);
      setPlayerImgLoaded(false);
      setPcImgLoaded(false);
    }

    if (playerCounter === 9 || pcCounter === 9) {
      if (playerCounter === 9 && playerValue > pcValue) {
        setWinner("PLAYER");
        setCardsDrawn(false);
      } else if (pcCounter === 9 && playerValue < pcValue) {
        setWinner("PC");
        setCardsDrawn(false);
      }
    }
  };

  // initializing new game, turning all values back to default
  const newGame = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setGame(false);
    setPcCounter(0);
    setPlayerCounter(0);
    setCardsDrawn(false);
    setDraw(true)
    setPlayerCard({});
    setPcCard({});
    setPlayerImgLoaded(false);
    setPcImgLoaded(false);

    // Adding 1 point to the winner in the globalscore
    if (winner === "PLAYER") {
      setGlobalPlayerCounter((prevCounter) => prevCounter + 1);
      setWinner("");
    } else {
      setGlobalPcCounter((prevCounter) => prevCounter + 1);
      setWinner("");
    }
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
          <div className="col-10 d-flex flex-column text-center mx-auto">
            <h1 className="mt-4 mb-5 text-white">WAR Cards Game</h1>
            <div className="d-flex justify-content-center">
              <div className="col-4 d-flex flex-column">
                <h3 className="mb-3">ROUND SCORE</h3>
                <div className="d-flex justify-content-evenly">
                  <div>
                    <b>Player</b>
                    <p>{playerCounter}</p>
                  </div>
                  <div>
                    <b>PC</b>
                    <p>{pcCounter}</p>
                  </div>
                </div>
              </div>

              <div className="col-4 d-flex flex-column">
                <h3 className="mb-3">GAME SCORE</h3>
                <div className="d-flex justify-content-evenly">
                  <div>
                    <b>Player</b>
                    <p>{globalPlayerCounter}</p>
                  </div>
                  <div>
                    <b>PC</b>
                    <p>{globalPcCounter}</p>
                  </div>
                </div>
              </div>
            </div>
            {!winner && (
              <button onClick={drawCard} className="my-3 col-2 mx-auto rounded" disabled={!draw}>
                Draw Cards
              </button>
            )}
            {winner && (
              <button onClick={newGame} className="mb-2 mt-5 col-2 mx-auto rounded">
                Next Game
              </button>
            )}
            {cardsDrawn ? (
              <div className="d-flex">
                <div className="col-5 d-flex flex-column">
                  <h4>Player</h4>
                  {playerCard.image && (
                    <img
                      className="col-3 img-fluid mt-2 mx-auto"
                      src={playerCard.image}
                      alt="Player Card"
                      onLoad={playerImgLoad}
                    />
                  )}
                </div>
                <div className="col-2 d-flex flex-column justify-content-center text-white">
                  {roundWinner && (
                    <h3 className="text-warning">{roundWinner}</h3>
                  )}
                </div>
                <div className="col-5 d-flex flex-column">
                  <h4>PC</h4>
                  {pcCard.image && (
                    <img
                      className="col-3 img-fluid mt-2 mx-auto"
                      src={pcCard.image}
                      alt="PC Card"
                      onLoad={pcImgLoad}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="d-flex">
                <div className="col-5 d-flex flex-column">
                  <h4>Player</h4>
                  {playerCard.image && (
                    <img
                      className="col-3 img-fluid mt-2 mx-auto"
                      src={playerCard.image}
                      alt="Player Card"
                      onLoad={playerImgLoad}
                    />
                  )}
                </div>
                <div className="col-2 d-flex flex-column justify-content-center text-white">
                {winner && (
                  <div className="d-flex flex-column mx-auto text-white">
                    <h2> Round Winner</h2>
                    <h1 className="text-warning">{winner}</h1>
                  </div>
                )}
                </div>
                <div className="col-5 d-flex flex-column">
                  <h4>PC</h4>
                  {pcCard.image && (
                    <img
                      className="col-3 img-fluid mt-2 mx-auto"
                      src={pcCard.image}
                      alt="PC Card"
                      onLoad={pcImgLoad}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
