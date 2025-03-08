document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/admin/users") // Gửi request để lấy danh sách người dùng
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const userTable = document.getElementById("user-table");
        userTable.innerHTML = "";

        data.users.forEach((user) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${user.email}</td> 
              <td>
                  <select class="role-select" data-user-email="${user.email}">
                      <option value="user" ${
                        user.role === "user" ? "selected" : ""
                      }>User</option>
                      <option value="admin" ${
                        user.role === "admin" ? "selected" : ""
                      }>Admin</option>
                  </select>
              </td>
              <td>
                  <button class="block-user" data-user-email="${user.email}">
                      ${user.is_blocked ? "Unblock" : "Block"}
                  </button>
                  <button class="reset-password" data-user-email="${
                    user.email
                  }">Reset Password</button>
              </td>
          `;
          userTable.appendChild(row);
        });

        // Xử lý sự kiện khóa/mở khóa user
        document.querySelectorAll(".block-user").forEach((button) => {
          button.addEventListener("click", function () {
            const userEmail = this.dataset.userEmail;
            fetch(`/api/admin/block_user/${userEmail}`, { method: "POST" })
              .then((response) => response.json())
              .then((data) => {
                alert(data.message);
                location.reload();
              });
          });
        });

        // Xử lý sự kiện reset mật khẩu
        document.querySelectorAll(".reset-password").forEach((button) => {
          button.addEventListener("click", function () {
            const userEmail = this.dataset.userEmail;
            fetch(`/api/admin/reset_password/${userEmail}`, { method: "POST" })
              .then((response) => response.json())
              .then((data) => alert(data.message));
          });
        });

        // Xử lý sự kiện thay đổi vai trò user
        document.querySelectorAll(".role-select").forEach((select) => {
          select.addEventListener("change", function () {
            const userEmail = this.dataset.userEmail;
            const newRole = this.value;

            fetch(`/api/admin/set_role/${userEmail}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role: newRole }),
            })
              .then((response) => response.json())
              .then((data) => {
                alert(data.message);
              });
          });
        });
      } else {
        console.error("Lỗi tải danh sách user:", data.message);
      }
    })
    .catch((error) => console.error("Lỗi khi tải user:", error));
});
function logout() {
  fetch("/api/auth/logout", { method: "POST" })
    .then(() => {
      sessionStorage.clear(); // Xóa thông tin user khỏi trình duyệt
      window.location.href = "/";
    })
    .catch((error) => console.error("Error logging out:", error));
}
