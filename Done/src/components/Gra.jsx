import React, { useState, useEffect } from "react";

const API_KEY = "live_vjTfQGn1hpRTF6Zski12ym3bSfkwrAhRa9SIEbp";

//karty postaci do wyboru do gry
function GameCharacterCard({ character, onSelect, disabled, index, onImageError }) {
  const imageUrl = `https://images.weserv.nl/?url=${encodeURIComponent(
    character.img.replace(/^https?:\/\//, "")
  )}`;

  return (
    <div
      className={`game-card ${disabled ? "game-card--disabled" : ""}`}
      onClick={() => !disabled && onSelect(character)}
    >
      <img
        src={imageUrl}
        alt={character.name}
        onError={() => onImageError(index)}
        className="game-card__image"
      />
      <h4 className="game-card__name">{character.name}</h4>
      <p className="game-card__stat">HP: {character.hp}</p>
      <p className="game-card__stat">Atak: {character.attack}</p>
      <p className="game-card__stat">Obrona: {character.defense}</p>
    </div>
  );
}

//ogolna gra
function GameBattle({ player, enemy, onRestart }) {
  const [playerHP, setPlayerHP] = useState(player.hp);
  const [maxPlayerHP, setMaxPlayerHP] = useState(player.hp);
  const [enemyHP, setEnemyHP] = useState(enemy.hp);
  const [message, setMessage] = useState("Walka się rozpoczęła!");
  const [turn, setTurn] = useState("player");

  const [playerAttackBuff, setPlayerAttackBuff] = useState(0);
  const [playerBuffTurns, setPlayerBuffTurns] = useState(0);

  const [enemyAttackBuff, setEnemyAttackBuff] = useState(0);
  const [enemyBuffTurns, setEnemyBuffTurns] = useState(0);

  const [skipPlayerTurn, setSkipPlayerTurn] = useState(false);

  const [potionsLeft, setPotionsLeft] = useState(2);

  // Losowy event po turze (50% szansy)
  const randomEvent = () => {
    if (Math.random() > 0.5) {
      // 50% szansy na event
      const events = [
        "enemyRevenge",
        "playerBuff",
        "enemyBuff",
        "playerSlip",
        "regenerate",
      ];
      const event = events[Math.floor(Math.random() * events.length)];

      switch (event) {
        case "enemyRevenge": {
          setMessage((msg) => msg + " Niespodziewany atak tytana!");
          const damage = Math.max(enemy.attack + enemyAttackBuff - player.defense, 1);
          setPlayerHP((hp) => Math.max(hp - damage, 0));
          return "enemyRevenge";
        }
        case "playerBuff": {
          setPlayerAttackBuff(15);
          setPlayerBuffTurns(2);
          setMessage((msg) => msg + " Czujesz przypływ siły! +15 ataku na 2 tury.");
          return "playerBuff";
        }
        case "enemyBuff": {
          setEnemyAttackBuff(15);
          setEnemyBuffTurns(2);
          setMessage((msg) => msg + " Tytan się wzmocnił! +15 ataku na 2 tury.");
          return "enemyBuff";
        }
        case "playerSlip": {
          setSkipPlayerTurn(true);
          setMessage((msg) => msg + " Poślizgnąłeś się i tracisz turę!");
          return "playerSlip";
        }
        case "regenerate": {
          const who = Math.random() < 0.5 ? "player" : "enemy";
          const regen = 20;
          if (who === "player") {
            setPlayerHP((hp) => Math.min(hp + regen, player.hp));
            setMessage((msg) => msg + ` Odzyskujesz ${regen} HP!`);
          } else {
            setEnemyHP((hp) => Math.min(hp + regen, enemy.hp));
            setMessage((msg) => msg + ` Tytan regeneruje ${regen} HP!`);
          }
          return "regenerate";
        }
        default:
          return null;
      }
    }
    return null;
  };

  //zwykly atak gracza
  const handleAttack = () => {
    if (turn === "player") {
      if (skipPlayerTurn) {
        setMessage("Tracisz turę z powodu poślizgu!");
        setSkipPlayerTurn(false);
        setTurn("enemy");
        return;
      }
      const damage = Math.max(player.attack + playerAttackBuff - enemy.defense, 1);
      setEnemyHP((hp) => Math.max(hp - damage, 0));
      setMessage(`${player.name} zadaje ${damage} obrażeń!`);
      setTurn("enemy");
    }
  };

  //uzywanie eliksiru
  const handleUsePotion = () => {
    if (potionsLeft <= 0) {
      setMessage("Nie masz już eliksirów!");
    return;
  }

  setPotionsLeft(prev => prev - 1);

  const chance = Math.random();

  if (chance < 0.5) {
    //50% na eliksir ktory dodaje 40
    const healAmount = 40;
    setPlayerHP(hp => Math.min(hp + healAmount, maxPlayerHP));
    setMessage(`Użyłeś eliksiru i odzyskałeś ${healAmount} HP!`);
  } else if (chance < 0.7) {
    //20% na eliksir ktory dodaje 70
    const healAmount = 70;
    setPlayerHP(hp => Math.min(hp + healAmount, maxPlayerHP));
    setMessage(`Użyłeś mocnego eliksiru i odzyskałeś ${healAmount} HP!`);
  } else {
    //30% na eliksir ktory odejmuje 15
    const damage = 15;
    setPlayerHP(hp => Math.max(hp - damage, 0));
    setMessage(`Eliksir był skażony! Straciłeś ${damage} HP!`);
  }

  setTurn("enemy");
};

//buffy : dodawanie/ odejmowanie hp, atak, zmiany tur przeciwnikow
  useEffect(() => {
  if (playerBuffTurns > 0) setPlayerBuffTurns(playerBuffTurns - 1);
  if (enemyBuffTurns > 0) setEnemyBuffTurns(enemyBuffTurns - 1);

  if (playerBuffTurns === 1) setPlayerAttackBuff(0);
  if (enemyBuffTurns === 1) setEnemyAttackBuff(0);

  if (enemyHP <= 0) {
    setMessage("Wygrałeś!");
    return;
  }
  if (playerHP <= 0) {
    setMessage("Przegrałeś!");
    return;
  }

  if (turn === "enemy") {
    const timeout = setTimeout(() => {
      const eventResult = randomEvent();

      if (eventResult !== "enemyRevenge") {
        // normalny atak przeciwnika
        const damage = Math.max(enemy.attack + enemyAttackBuff - player.defense, 1);
        setPlayerHP((hp) => Math.max(hp - damage, 0));
        setMessage(`${enemy.name} atakuje i zadaje ${damage} obrażeń!`);
      }

      setTurn("player");
    }, 1000);

    return () => clearTimeout(timeout);
  }

  if (turn === "player" && skipPlayerTurn) {
    const timeout = setTimeout(() => {
      setSkipPlayerTurn(false);
      setTurn("enemy");
    }, 1000);
    return () => clearTimeout(timeout);
  }
  }, [turn, playerBuffTurns, enemyBuffTurns, enemyHP, playerHP, skipPlayerTurn]);

  return (
    <div className="game-battle">
      <div className="game-combatants">
        <div>
          <img
            src={`https://images.weserv.nl/?url=${encodeURIComponent(
              player.img.replace(/^https?:\/\//, "")
            )}`}
            alt={player.name}
            className="character-image"
          />
          <h3>{player.name}</h3>
          <p>HP: {playerHP}</p>
          <p>Eliksiry: {potionsLeft}</p>
        </div>
        <div>
          <img
            src={`https://images.weserv.nl/?url=${encodeURIComponent(
              enemy.img.replace(/^https?:\/\//, "")
            )}`}
            alt={enemy.name}
            className="character-image"
          />
          <h3>{enemy.name}</h3>
          <p>HP: {enemyHP}</p>
        </div>
      </div>
      <p className="game-message">{message}</p>
      {playerHP > 0 && enemyHP > 0 && turn === "player" && (
        <div className="action-buttons">
          <button onClick={handleAttack} className="game-attack-btn">
            Atakuj
          </button>
          <button onClick={handleUsePotion} className="game-potion-btn" disabled={potionsLeft === 0}>
            Użyj eliksiru
          </button>
        </div>
      )}
      {(playerHP <= 0 || enemyHP <= 0) && (
        <button onClick={onRestart} className="game-restart-btn">
          Zagraj ponownie
        </button>
      )}
    </div>
  );
}

//wybory postaci i trudnosci, ladowanie danych, przekierowywanie do walki
export default function GameRPG() {
  const [characters, setCharacters] = useState([]);
  const [titans, setTitans] = useState([]);
  const [player, setPlayer] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState(new Set());
  const [difficultyLevel, setDifficultyLevel] = useState(null);

  //laduje postacie tytanow i postaci z api
  useEffect(() => {
    async function fetchCharactersAndTitans() {
      setLoading(true);
      try {
        const charRes = await fetch(`https://api.attackontitanapi.com/characters?page=1`, {
          headers: { "x-api-key": API_KEY, Accept: "application/json" },
        });
        if (!charRes.ok) throw new Error(`Characters API error: ${charRes.status}`);
        const charData = await charRes.json();

        const wantedNames = ["armin", "mikasa", "levi", "hange"];
        const chars = charData.results
          .filter(char => char.img && char.img.startsWith("http") &&
            wantedNames.some(name => char.name.toLowerCase().includes(name))
          )
          //dane postaci
          .map(char => {
            let stats = { hp: 100, attack: 20, defense: 10 };
            if (char.name.toLowerCase().includes("armin")) stats = { hp: 160, attack: 30, defense: 20 };
            else if (char.name.toLowerCase().includes("mikasa")) stats = { hp: 130, attack: 45, defense: 15 };
            else if (char.name.toLowerCase().includes("levi")) stats = { hp: 110, attack: 65, defense: 15 };
            else if (char.name.toLowerCase().includes("hange")) stats = { hp: 145, attack: 55, defense: 10 };
            return { name: char.name, img: char.img, ...stats };
          });

        const titanRes = await fetch(`https://api.attackontitanapi.com/titans?page=1`, {
          headers: { "x-api-key": API_KEY, Accept: "application/json" },
        });
        if (!titanRes.ok) throw new Error(`Titans API error: ${titanRes.status}`);
        const titanData = await titanRes.json();

        const titansList = titanData.results
          .filter(titan => titan.img && titan.img.startsWith("http"))
          .map(titan => ({
            name: titan.name,
            img: titan.img,
          }));

        setCharacters(chars);
        setTitans(titansList);
      } catch (err) {
        console.error("Błąd ładowania:", err);
      }
      setLoading(false);
    }

    fetchCharactersAndTitans();
  }, []);

  //dane tytanow
  const titanDifficulties = [
    { name: "Easy", hp: 80, attack: 20, defense: 5 },
    { name: "Medium", hp: 125, attack: 35, defense: 10 },
    { name: "Hard", hp: 180, attack: 50, defense: 25 },
  ];

  const handleSelectCharacter = (char) => {
  setPlayer(char);
};

  const handleSelectDifficulty = (levelIndex) => {
    setDifficultyLevel(levelIndex);
    const difficulty = titanDifficulties[levelIndex];

    if (titans.length === 0) {
      const titan = {
        name: `Tytan - poziom ${difficulty.name}`,
        img: "https://i.imgur.com/3lhqOC3.png",
        hp: difficulty.hp,
        attack: difficulty.attack,
        defense: difficulty.defense,
      };
      setEnemy(titan);
      return;
    }

    const randomTitan = titans[Math.floor(Math.random() * titans.length)];

    // ustawiamy statystyki wg poziomu trudnosci
    const titanWithStats = {
      name: randomTitan.name,
      img: randomTitan.img,
      hp: difficulty.hp,
      attack: difficulty.attack,
      defense: difficulty.defense,
    };

    setEnemy(titanWithStats);
  };

  const resetGame = () => {
    setPlayer(null);
    setEnemy(null);
    setDifficultyLevel(null);
  };

  if (loading) return <p className="loading-text">Ładowanie gry...</p>;

if (!player) {
  return (
    <div className="character-selection-screen">
      <h2>Wybierz swoją postać</h2>
      <div className="character-grid">
        {characters.map((char, i) =>
          brokenImages.has(i) ? null : (
            <GameCharacterCard
              key={char.name}
              character={char}
              index={i}
              onSelect={handleSelectCharacter}
              onImageError={(index) => setBrokenImages((prev) => new Set(prev).add(index))}
            />
          )
        )}
      </div>
    </div>
  );
}

if (player && enemy === null) {
  return (
    <div className="difficulty-selection-screen">
      <h2>Wybierz poziom trudności</h2>
      <div className="difficulty-buttons">
        {titanDifficulties.map((diff, idx) => (
          <button
            key={diff.name}
            onClick={() => handleSelectDifficulty(idx)}
            className={`difficulty-button ${difficultyLevel === idx ? 'selected' : ''}`}
          >
            {diff.name}
          </button>
        ))}
      </div>
    </div>
  );
}

if (player && enemy) {
  return <GameBattle player={player} enemy={enemy} onRestart={resetGame} />;
}

return null;
}
