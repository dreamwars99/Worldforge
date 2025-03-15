// "시작하기" 버튼 클릭 시 새 프로젝트 페이지로 이동
document.getElementById("start-button").addEventListener("click", function() {
    window.location.href = "/new_project"; // 새 프로젝트 생성 라우트로
  });
  
  // "스토리 쓰기" 버튼 클릭 시 해당 시작점 페이지로 이동
  const startButtons = document.querySelectorAll("section#story-writing button");
  startButtons.forEach(button => {
    button.addEventListener("click", function() {
      const startType = this.dataset.start; // data-start 속성 값 (sequence, climax, 등)
      window.location.href = `/start_story/${startType}`; // /start_story/<시작점> 라우트로
    });
  });