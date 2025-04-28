/**
 * Ranking system for the AI Character Battle Game
 */

class RankingManager {
  constructor() {
    this.rankings = [];
    this.updateRanking();
  }

  updateRanking() {
    // Get all players sorted by Elo
    this.rankings = playerManager.getAllPlayersSortedByElo();
    
    // Update ranking table
    this.updateRankingTable();
  }

  updateRankingTable() {
    const rankingBody = document.getElementById('ranking-body');
    if (!rankingBody) return;
    
    // Clear current table
    rankingBody.innerHTML = '';
    
    // Add rows for each player
    this.rankings.forEach((player, index) => {
      const row = document.createElement('tr');
      
      // Rank
      const rankCell = document.createElement('td');
      rankCell.textContent = index + 1;
      row.appendChild(rankCell);
      
      // Name
      const nameCell = document.createElement('td');
      nameCell.textContent = player.name;
      row.appendChild(nameCell);
      
      // Elo
      const eloCell = document.createElement('td');
      eloCell.textContent = player.elo;
      row.appendChild(eloCell);
      
      // Record
      const recordCell = document.createElement('td');
      recordCell.textContent = `${player.wins}승 ${player.losses}패`;
      row.appendChild(recordCell);
      
      rankingBody.appendChild(row);
    });
    
    // If no players, add empty message
    if (this.rankings.length === 0) {
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = 4;
      emptyCell.textContent = '등록된 플레이어가 없습니다.';
      emptyCell.style.textAlign = 'center';
      emptyCell.style.padding = '20px 0';
      emptyRow.appendChild(emptyCell);
      rankingBody.appendChild(emptyRow);
    }
  }

  getPlayerRank(playerId) {
    const index = this.rankings.findIndex(player => player.id === playerId);
    return index === -1 ? null : index + 1;
  }

  getTopPlayers(count = 10) {
    return this.rankings.slice(0, count);
  }
}

// Initialize RankingManager
const rankingManager = new RankingManager();

// Update ranking when page loads
document.addEventListener('DOMContentLoaded', () => {
  rankingManager.updateRanking();
});