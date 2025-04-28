/**
 * Player management for the AI Character Battle Game
 */

// Player class
class Player {
  constructor(id, name, imageUrl) {
    this.id = id || generateId();
    this.name = name || "무명 플레이어";
    this.imageUrl = imageUrl || "https://via.placeholder.com/200x200/333333/FFFFFF?text=캐릭터";
    this.elo = 1500;
    this.wins = 0;
    this.losses = 0;
    this.lastActive = new Date().toISOString();
  }

  updateStats(isWinner, eloChange) {
    this.elo += eloChange;
    if (isWinner) {
      this.wins += 1;
    } else {
      this.losses += 1;
    }
    this.lastActive = new Date().toISOString();
  }

  getRecord() {
    return `${this.wins}승 ${this.losses}패`;
  }
}

// PlayerManager class
class PlayerManager {
  constructor() {
    this.players = [];
    this.currentPlayer = null;
    this.loadPlayers();
  }

  loadPlayers() {
    const savedPlayers = loadFromLocalStorage('aiCharacterPlayers');
    if (savedPlayers) {
      this.players = savedPlayers;
    }

    const savedCurrentPlayer = loadFromLocalStorage('aiCharacterCurrentPlayer');
    if (savedCurrentPlayer) {
      this.currentPlayer = savedCurrentPlayer;
      this.updateCurrentPlayerUI();
    }
  }

  savePlayers() {
    saveToLocalStorage('aiCharacterPlayers', this.players);
    if (this.currentPlayer) {
      saveToLocalStorage('aiCharacterCurrentPlayer', this.currentPlayer);
    }
  }

  createPlayer(name, imageUrl) {
    const player = new Player(null, name, imageUrl);
    this.players.push(player);
    this.savePlayers();
    return player;
  }

  getPlayerById(id) {
    return this.players.find(player => player.id === id);
  }

  updatePlayer(id, updates) {
    const playerIndex = this.players.findIndex(player => player.id === id);
    if (playerIndex !== -1) {
      this.players[playerIndex] = { ...this.players[playerIndex], ...updates };
      
      // If updating current player, also update current player reference
      if (this.currentPlayer && this.currentPlayer.id === id) {
        this.currentPlayer = { ...this.currentPlayer, ...updates };
        this.updateCurrentPlayerUI();
      }
      
      this.savePlayers();
      return true;
    }
    return false;
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
    this.updateCurrentPlayerUI();
    saveToLocalStorage('aiCharacterCurrentPlayer', player);
  }

  updateCurrentPlayerUI() {
    if (!this.currentPlayer) return;

    // Update profile image
    const profileImage = document.getElementById('current-player-image');
    if (profileImage) {
      profileImage.src = this.currentPlayer.imageUrl;
    }

    // Update name field
    const nameInput = document.getElementById('current-player-name');
    if (nameInput) {
      nameInput.value = this.currentPlayer.name;
    }

    // Update stats
    setTextContent('current-player-elo', this.currentPlayer.elo);
    setTextContent('current-player-record', `${this.currentPlayer.wins}승 ${this.currentPlayer.losses}패`);
  }

  getRandomOpponents(count = 3, excludeCurrentPlayer = true) {
    let availablePlayers = [...this.players];
    
    // Remove current player from potential opponents if needed
    if (excludeCurrentPlayer && this.currentPlayer) {
      availablePlayers = availablePlayers.filter(player => player.id !== this.currentPlayer.id);
    }
    
    // If not enough players, return all available
    if (availablePlayers.length <= count) {
      return availablePlayers;
    }
    
    // Shuffle and take the first 'count' players
    return availablePlayers
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  }

  getAllPlayersSortedByElo() {
    return [...this.players].sort((a, b) => b.elo - a.elo);
  }
}

// Initialize PlayerManager
const playerManager = new PlayerManager();

// Set up event listeners for player management
document.addEventListener('DOMContentLoaded', () => {
  const playerImageContainer = document.getElementById('current-player-image-container');
  const playerUpload = document.getElementById('current-player-upload');
  const playerNameInput = document.getElementById('current-player-name');
  
  if (playerImageContainer) {
    playerImageContainer.addEventListener('click', () => {
      playerUpload.click();
    });
  }
  
  if (playerUpload) {
    playerUpload.addEventListener('change', (event) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          document.getElementById('current-player-image').src = imageUrl;
          
          if (playerManager.currentPlayer) {
            playerManager.updatePlayer(playerManager.currentPlayer.id, { imageUrl });
          } else {
            const newPlayer = playerManager.createPlayer(playerNameInput.value || "새 플레이어", imageUrl);
            playerManager.setCurrentPlayer(newPlayer);
          }
        };
        
        reader.readAsDataURL(file);
      }
    });
  }
  
  if (playerNameInput) {
    playerNameInput.addEventListener('blur', () => {
      const name = playerNameInput.value.trim();
      if (name) {
        if (playerManager.currentPlayer) {
          playerManager.updatePlayer(playerManager.currentPlayer.id, { name });
        } else {
          const imageUrl = document.getElementById('current-player-image').src;
          const newPlayer = playerManager.createPlayer(name, imageUrl);
          playerManager.setCurrentPlayer(newPlayer);
        }
      }
    });
  }
});