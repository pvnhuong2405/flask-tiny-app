document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Gọi API lấy danh sách bài viết từ hai trang post.html & post_next.html
    let response1 = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=10"
    ); // Lấy 10 bài đầu
    let response2 = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_start=10&_limit=10"
    ); // Lấy 10 bài tiếp theo

    let posts1 = await response1.json();
    let posts2 = await response2.json();
    let posts = [...posts1, ...posts2]; // Gộp bài viết từ 2 trang

    const postsList = document.getElementById("posts-list");
    postsList.innerHTML = "";

    posts.forEach((post) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.body}</td>
                <td>User ${post.userId}</td>
                <td>
                    <button class="delete-btn" data-post-id="${post.id}">Xóa</button>
                </td>
            `;
      postsList.appendChild(row);
    });

    // Xử lý sự kiện xóa bài viết
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        let postId = this.dataset.postId;
        if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
          document
            .querySelector(`button[data-post-id='${postId}']`)
            .closest("tr")
            .remove();
          alert(`Đã xóa bài viết ${postId}`);
        }
      });
    });
  } catch (error) {
    console.error("Lỗi khi tải bài viết:", error);
  }
});
