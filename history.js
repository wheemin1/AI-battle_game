/**
 * Battle history management for the AI Character Battle Game
 */

class BattleHistoryManager {
  constructor() {
    this.battles = [];
    this.loadBattles();
  }

  loadBattles() {
    const savedBattles = loadFromLocalStorage('aiCharacterBattles');
    if (savedBattles) {
      this.battles = savedBattles;
      this.updateHistoryUI();
    }
  }

  saveBattles() {
    saveToLocalStorage('aiCharacterBattles', this.battles);
  }

  addBattle(battle) {
    // Create a simplified battle record
    const battleRecord = {
      id: battle.id,
      player1Id: battle.player1.id,
      player2Id: battle.player2.id,
      winnerId: battle.winner.id,
      loserId: battle.loser.id,
      player1EloChange: battle.player1EloChange,
      player2EloChange: battle.player2EloChange,
      story: battle.story,
      date: new Date().toISOString()
    };
    
    // Add to beginning of battles array (newest first)
    this.battles.unshift(battleRecord);
    
    // Limit history to 50 battles
    if (this.battles.length > 50) {
      this.battles = this.battles.slice(0, 50);
    }
    
    // Save and update UI
    this.saveBattles();
    this.updateHistoryUI();
  }

  updateHistoryUI() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    
    // Clear current list
    historyList.innerHTML = '';
    
    // If no battles, show message
    if (this.battles.length === 0) {
      historyList.innerHTML = `<p class="empty-history-message">아직 대결 기록이 없습니다.</p>`;
      return;
    }
    
    // Add history items
    this.battles.forEach(battle => {
      const player1 = playerManager.getPlayerById(battle.player1Id);
      const player2 = playerManager.getPlayerById(battle.player2Id);
      
      // Skip if players don't exist anymore
      if (!player1 || !player2) return;
      
      const winner = battle.winnerId === player1.id ? player1 : player2;
      
      // Create history item from template
      const template = document.getElementById('battle-history-template');
      const clone = document.importNode(template.content, true);
      
      // Fill in battle data
      const playerImages = clone.querySelectorAll('.history-player-image');
      playerImages[0].src = player1.imageUrl;
      playerImages[1].src = player2.imageUrl;
      
      const playerNames = clone.querySelectorAll('.history-player-name');
      playerNames[0].textContent = player1.name;
      playerNames[1].textContent = player2.name;
      
      const winnerName = clone.querySelector('.history-winner-name');
      winnerName.textContent = `승자: ${winner.name}`;
      
      const historyDate = clone.querySelector('.history-date');
      historyDate.textContent = formatDate(battle.date);
      
      // Add click event to show full battle details
      const historyItem = clone.querySelector('.history-item');
      historyItem.addEventListener('click', () => {
        this.showBattleDetails(battle);
      });
      
      historyList.appendChild(clone);
    });
    
    // Display history section
    document.getElementById('history-section').style.display = 'block';
  }

  showBattleDetails(battle) {
    // Update the result section with the battle details
    const player1 = playerManager.getPlayerById(battle.player1Id);
    const player2 = playerManager.getPlayerById(battle.player2Id);
    const winner = battle.winnerId === player1.id ? player1 : player2;
    
    // Show result section
    const resultSection = document.getElementById('result-section');
    if (resultSection) {
      resultSection.style.display = 'block';
    }
    
    // Update player images and names
    document.getElementById('result-current-image').src = player1.imageUrl;
    document.getElementById('result-current-name').textContent = player1.name;
    document.getElementById('result-opponent-image').src = player2.imageUrl;
    document.getElementById('result-opponent-name').textContent = player2.name;
    
    // Update winner
    document.getElementById('winner-name').textContent = winner.name;
    
    // Update ELO changes
    const player1EloElement = document.getElementById('current-player-elo-change');
    player1EloElement.textContent = battle.player1EloChange > 0 ? `+${battle.player1EloChange}` : battle.player1EloChange;
    player1EloElement.className = 'elo-change ' + (battle.player1EloChange > 0 ? 'positive' : 'negative');
    
    const player2EloElement = document.getElementById('opponent-elo-change');
    player2EloElement.textContent = battle.player2EloChange > 0 ? `+${battle.player2EloChange}` : battle.player2EloChange;
    player2EloElement.className = 'elo-change ' + (battle.player2EloChange > 0 ? 'positive' : 'negative');
    
    // Update battle story
    document.getElementById('battle-story').innerHTML = `<p>${battle.story}</p>`;
    
    // Scroll to result section
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }

  getBattlesByPlayerId(playerId, limit = 10) {
    return this.battles
      .filter(battle => battle.player1Id === playerId || battle.player2Id === playerId)
      .slice(0, limit);
  }

  clearHistory() {
    this.battles = [];
    this.saveBattles();
    this.updateHistoryUI();
  }
}

// Initialize BattleHistoryManager
const battleHistoryManager = new BattleHistoryManager();