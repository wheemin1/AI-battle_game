/**
 * Battle logic for the AI Character Battle Game
 */

// Battle class
class Battle {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.winner = null;
    this.loser = null;
    this.battleDate = new Date();
    this.player1EloChange = 0;
    this.player2EloChange = 0;
    this.story = "";
    this.id = generateId();
  }

  // Determine winner based on some algorithm
  determineWinner() {
    // Simple algorithm: Higher Elo has advantage, but with randomness
    const player1Strength = this.player1.elo + getRandomInt(-200, 200);
    const player2Strength = this.player2.elo + getRandomInt(-200, 200);
    
    if (player1Strength >= player2Strength) {
      this.winner = this.player1;
      this.loser = this.player2;
      this.player1EloChange = calculateEloChange(this.player1.elo, this.player2.elo, 'win');
      this.player2EloChange = -this.player1EloChange;
    } else {
      this.winner = this.player2;
      this.loser = this.player1;
      this.player2EloChange = calculateEloChange(this.player2.elo, this.player1.elo, 'win');
      this.player1EloChange = -this.player2EloChange;
    }
    
    // Generate battle story
    this.story = generateBattleStory(this.winner, this.loser);
    
    return {
      winner: this.winner,
      loser: this.loser,
      player1EloChange: this.player1EloChange,
      player2EloChange: this.player2EloChange,
      story: this.story
    };
  }

  // Update player stats based on battle outcome
  updatePlayerStats() {
    if (!this.winner || !this.loser) {
      this.determineWinner();
    }
    
    // Update player 1
    playerManager.updatePlayer(this.player1.id, {
      elo: this.player1.elo + this.player1EloChange,
      wins: this.player1 === this.winner ? this.player1.wins + 1 : this.player1.wins,
      losses: this.player1 === this.loser ? this.player1.losses + 1 : this.player1.losses
    });
    
    // Update player 2
    playerManager.updatePlayer(this.player2.id, {
      elo: this.player2.elo + this.player2EloChange,
      wins: this.player2 === this.winner ? this.player2.wins + 1 : this.player2.wins,
      losses: this.player2 === this.loser ? this.player2.losses + 1 : this.player2.losses
    });
    
    // Add battle to history
    battleHistoryManager.addBattle(this);
    
    // Update ranking
    rankingManager.updateRanking();
  }

  // Display battle results in UI
  displayResults() {
    // Show result section
    const resultSection = document.getElementById('result-section');
    if (resultSection) {
      resultSection.style.display = 'block';
    }
    
    // Update player images and names
    document.getElementById('result-current-image').src = this.player1.imageUrl;
    document.getElementById('result-current-name').textContent = this.player1.name;
    document.getElementById('result-opponent-image').src = this.player2.imageUrl;
    document.getElementById('result-opponent-name').textContent = this.player2.name;
    
    // Update winner
    document.getElementById('winner-name').textContent = this.winner.name;
    
    // Update ELO changes
    const player1EloElement = document.getElementById('current-player-elo-change');
    player1EloElement.textContent = this.player1EloChange > 0 ? `+${this.player1EloChange}` : this.player1EloChange;
    player1EloElement.className = 'elo-change ' + (this.player1EloChange > 0 ? 'positive' : 'negative');
    
    const player2EloElement = document.getElementById('opponent-elo-change');
    player2EloElement.textContent = this.player2EloChange > 0 ? `+${this.player2EloChange}` : this.player2EloChange;
    player2EloElement.className = 'elo-change ' + (this.player2EloChange > 0 ? 'positive' : 'negative');
    
    // Update battle story
    document.getElementById('battle-story').innerHTML = `<p>${this.story}</p>`;
    
    // Scroll to result section
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// BattleManager class
class BattleManager {
  constructor() {
    this.currentOpponent = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const findOpponentButton = document.getElementById('find-opponent-button');
    const battleButton = document.getElementById('battle-button');
    
    if (findOpponentButton) {
      findOpponentButton.addEventListener('click', () => this.findOpponents());
    }
    
    if (battleButton) {
      battleButton.addEventListener('click', () => this.startBattle());
    }
  }

  findOpponents() {
    if (!playerManager.currentPlayer) {
      alert('먼저 캐릭터를 생성하세요!');
      return;
    }
    
    const opponents = playerManager.getRandomOpponents(3);
    const opponentsContainer = document.getElementById('opponents-container');
    
    if (!opponentsContainer) return;
    
    // Clear previous opponents
    opponentsContainer.innerHTML = '';
    
    // If no opponents, show message
    if (opponents.length === 0) {
      opponentsContainer.innerHTML = `
        <div class="no-opponents-message">
          <p>아직 대결 가능한 상대가 없습니다.</p>
          <p>첫 번째 상대가 되어보세요!</p>
        </div>
      `;
      return;
    }
    
    // Create opponent cards
    opponents.forEach(opponent => {
      const template = document.getElementById('opponent-template');
      const clone = document.importNode(template.content, true);
      
      // Fill in opponent data
      const opponentCard = clone.querySelector('.opponent-card');
      opponentCard.dataset.opponentId = opponent.id;
      
      const opponentImage = clone.querySelector('.opponent-image');
      opponentImage.src = opponent.imageUrl;
      
      const opponentName = clone.querySelector('.opponent-name');
      opponentName.textContent = opponent.name;
      
      const opponentElo = clone.querySelector('.opponent-elo');
      opponentElo.textContent = `Elo: ${opponent.elo}`;
      
      const opponentRecord = clone.querySelector('.opponent-record');
      opponentRecord.textContent = `${opponent.wins}승 ${opponent.losses}패`;
      
      const battleWithButton = clone.querySelector('.battle-with-button');
      battleWithButton.addEventListener('click', () => {
        this.selectOpponent(opponent);
      });
      
      opponentsContainer.appendChild(clone);
    });
    
    // Enable battle button
    document.getElementById('battle-button').disabled = true;
  }

  selectOpponent(opponent) {
    this.currentOpponent = opponent;
    
    // Update selected opponent UI
    const opponentCards = document.querySelectorAll('.opponent-card');
    opponentCards.forEach(card => {
      card.classList.remove('selected');
      if (card.dataset.opponentId === opponent.id) {
        card.classList.add('selected');
      }
    });
    
    // Enable battle button
    document.getElementById('battle-button').disabled = false;
  }

  async startBattle() {
    if (!playerManager.currentPlayer || !this.currentOpponent) {
      alert('캐릭터와 대결 상대를 선택하세요!');
      return;
    }
    
    // Show battle animation
    const battleAnimation = document.getElementById('battle-animation');
    battleAnimation.style.display = 'flex';
    
    // Create battle
    const battle = new Battle(
      playerManager.currentPlayer,
      this.currentOpponent
    );
    
    // Simulate battle calculation
    setTimeout(() => {
      // Determine winner and update stats
      battle.determineWinner();
      battle.updatePlayerStats();
      
      // Hide battle animation
      battleAnimation.style.display = 'none';
      
      // Display results
      battle.displayResults();
    }, 2000);
  }
}

// Initialize BattleManager
const battleManager = new BattleManager();