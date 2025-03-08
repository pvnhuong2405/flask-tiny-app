document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/auth/status")
    .then((response) => response.json())
    .then((data) => {
      const userSection = document.getElementById("user-section");
      if (data.logged_in) {
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else {
          userSection.innerHTML = `
                      <span>Xin chào, ${data.username}!</span>
                      <button onclick="logout()">Đăng xuất</button>
                  `;
        }
      } else {
        userSection.innerHTML = `
                  <a href="/login" class = "login-btn">Đăng nhập</a> |
                  <a href="/register" class = "signup-btn">Đăng ký</a>
              `;
      }
    })
    .catch((error) => console.error("Error checking auth status:", error));
});

function logout() {
  fetch("/api/auth/logout", { method: "POST" })
    .then(() => {
      /*window.location.href = "/login";*/
      sessionStorage.clear(); // Xóa thông tin user khỏi trình duyệt
      window.location.href = "/"; // Quay về trang chủ
    })
    .catch((error) => console.error("Error logging out:", error));
}
