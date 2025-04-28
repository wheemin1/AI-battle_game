/**
 * Utility functions for the AI Character Battle Game
 */

// Generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Format date to readable string
function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString('ko-KR', options);
}

// Calculate Elo rating changes
function calculateEloChange(playerRating, opponentRating, result) {
  const K = 32; // K-factor
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  const actualScore = result === 'win' ? 1 : 0;
  return Math.round(K * (actualScore - expectedScore));
}

// Save data to local storage
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

// Load data from local storage
function loadFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

// Get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a battle story
function generateBattleStory(winner, loser) {
  const scenarios = [
    `${winner.name}의 캐릭터가 갑자기 반짝이는 빛을 내뿜으며 ${loser.name}의 캐릭터를 압도했습니다. 놀라운 승리였습니다!`,
    `치열한 접전 끝에 ${winner.name}의 캐릭터가 마지막 순간에 결정적인 한 방을 날려 승리를 거머쥐었습니다.`,
    `${loser.name}의 캐릭터가 강력한 공격을 펼쳤지만, ${winner.name}의 캐릭터는 더 기민하게 대응하여 승리했습니다.`,
    `${winner.name}의 캐릭터는 특유의 카리스마로 관중들의 마음을 사로잡았고, 결국 심사위원들의 높은 점수를 받아 승리했습니다.`,
    `두 캐릭터의 능력이 엇비슷했지만, ${winner.name}의 캐릭터가 약간의 우위를 점하며 승리를 차지했습니다.`,
    `${loser.name}의 캐릭터가 초반에 우세했으나, ${winner.name}의 캐릭터가 놀라운 역전극을 펼쳤습니다!`,
    `${winner.name}의 캐릭터는 독특한 전략으로 ${loser.name}의 캐릭터를 당황시켰고, 이로 인해 승리를 차지했습니다.`,
    `${winner.name}의 캐릭터가 시작부터 끝까지 압도적인 기세로 ${loser.name}의 캐릭터를 제압했습니다.`
  ];

  // Add more personalized elements
  const openings = [
    "환상적인 대결이었습니다!",
    "멋진 대결이 펼쳐졌습니다!",
    "관중들을 열광시킨 대결이었습니다!",
    "이번 대결은 역사에 남을 만합니다!",
    "숨막히는 긴장감이 감돌았던 대결이었습니다!"
  ];

  const closings = [
    `이번 승리로 ${winner.name}의 명성이 더욱 높아졌습니다.`,
    `${loser.name}는 다음 대결을 위해 더 강해질 것입니다.`,
    `많은 관중들이 다음 대결을 기대하고 있습니다.`,
    `${winner.name}와 ${loser.name} 모두에게 박수를 보냅니다!`,
    `이번 대결은 AI 캐릭터 대결 역사상 가장 인상적인 순간 중 하나로 기록될 것입니다.`
  ];

  const randomScenario = scenarios[getRandomInt(0, scenarios.length - 1)];
  const randomOpening = openings[getRandomInt(0, openings.length - 1)];
  const randomClosing = closings[getRandomInt(0, closings.length - 1)];

  return `${randomOpening} ${randomScenario} ${randomClosing}`;
}

// Safely update text content
function setTextContent(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
  }
}

// Safely update element attribute
function setElementAttribute(elementId, attribute, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

// Safely add/remove classes
function toggleClass(elementId, className, force) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.toggle(className, force);
  }
}

// Create element from template
function createElementFromTemplate(templateId, dataObj) {
  const template = document.getElementById(templateId);
  if (!template) return null;
  
  const clone = document.importNode(template.content, true);
  return clone;
}