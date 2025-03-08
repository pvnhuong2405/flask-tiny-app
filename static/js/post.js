document.addEventListener("DOMContentLoaded", function () {
  fetch("https://jsonplaceholder.typicode.com/posts") // API giả lập
    .then((response) => response.json()) // Chuyển dữ liệu thành JSON
    .then((posts) => {
      let postList = document.getElementById("post-list");
      postList.innerHTML = ""; // Xóa nội dung cũ (nếu có)

      posts.slice(0, 10).forEach((post) => {
        // Hiển thị 10 bài viết đầu tiên
        let postDiv = document.createElement("div");
        postDiv.classList.add("post-item");

        postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
            `;

        postList.appendChild(postDiv);
      });
    })
    .catch((error) => console.error("Lỗi tải bài viết:", error));
});
