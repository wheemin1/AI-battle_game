/**
 * Main application script for AI Character Battle Game
 */

// Supabase 라이브러리 로드 확인
if (typeof supabase === "undefined") {
  console.error("Supabase 객체가 정의되지 않았습니다. Supabase 라이브러리가 제대로 로드되었는지 확인하세요.");
  // UI에 에러 메시지 표시
  document.addEventListener('DOMContentLoaded', () => {
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.textContent = '애플리케이션 로드 실패: Supabase 라이브러리가 필요합니다.';
    document.body.prepend(errorDiv);
  });
} else {
  console.log("Supabase 객체 로드 성공:", typeof supabase);
}

// Supabase 클라이언트 초기화
const supabaseClient = supabase.createClient(
  'https://nfplumzdnkvixyxpomzo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcGx1bXpkbmt2aXh5eHBvbXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjU4NDksImV4cCI6MjA2MTQwMTg0OX0.CAzXzfkoMTJBkX6jEaHTZvHdlgmiURgKeZwcVoxGzBQ'
);

// 입력값 Sanitize 함수 (XSS 방지)
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Add sample data if none exists (기존 코드 유지)
function addSampleData() {
  // ... (기존 코드 유지)
}

// 에러 메시지 표시 함수
function showError(elementId, message) {
  const errorDiv = document.getElementById(elementId);
  if (errorDiv) {
    errorDiv.style.color = 'red';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000); // 5초 후 에러 메시지 숨김
  }
}

// 메인 화면 표시 함수
function showMainScreen() {
  const loginScreen = document.getElementById("loginScreen");
  const mainScreen = document.getElementById("mainScreen");
  if (loginScreen && mainScreen) {
    loginScreen.style.display = "none";
    mainScreen.style.display = "block";
    // 로그아웃 버튼 표시
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.style.display = "block";
    }
  }
}

// 로그인 화면 표시 함수 (로그아웃 후 호출)
function showLoginScreen() {
  const loginScreen = document.getElementById("loginScreen");
  const mainScreen = document.getElementById("mainScreen");
  if (loginScreen && mainScreen) {
    loginScreen.style.display = "block";
    mainScreen.style.display = "none";
    // 로그아웃 버튼 숨김
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.style.display = "none";
    }
  }
}

// Initialize the application
function initApp() {
  // DOM 요소 초기화
  const resultSection = document.getElementById('result-section');
  if (resultSection) {
    resultSection.style.display = 'none';
  }

  // Google 로그인 이벤트 리스너 추가
  const googleLoginButton = document.getElementById("googleLogin");
  if (googleLoginButton) {
    googleLoginButton.addEventListener("click", async () => {
      const { user, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google'
      });
      if (error) {
        showError("login-error", "Google 로그인 실패: " + error.message);
        return;
      }
      showMainScreen();
    });
  }

  // Email 로그인 이벤트 리스너 추가
  const emailLoginButton = document.getElementById("emailLogin");
  if (emailLoginButton) {
    emailLoginButton.addEventListener("click", async () => {
      const email = sanitizeInput(document.getElementById("email").value);
      const password = sanitizeInput(document.getElementById("password").value);
      if (!email || !password) {
        showError("login-error", "이메일과 비밀번호를 입력해주세요.");
        return;
      }
      const { user, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });
      if (error) {
        showError("login-error", "이메일 로그인 실패: " + error.message);
        return;
      }
      showMainScreen();
    });
  }

  // 로그아웃 이벤트 리스너 추가
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        showError("logout-error", "로그아웃 실패: " + error.message);
        return;
      }
      showLoginScreen();
    });
  }

  // 세션 확인
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session) {
      showMainScreen();
    } else {
      showLoginScreen();
    }
  });

  // Add sample data if needed
  addSampleData();

  // Update rankings
  rankingManager.updateRanking();
}

// Start the application
// 스크립트가 HTML 끝부분에 있으므로 DOMContentLoaded 불필요
initApp();