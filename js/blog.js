// This file contains JavaScript functions for managing the blog section, such as loading posts and handling user interactions.

document.addEventListener("DOMContentLoaded", function() {
    loadBlogPosts();
});

function loadBlogPosts() {
    const blogContainer = document.getElementById("blog-posts");
    const posts = [
        {
            title: "First Blog Post",
            date: "2023-10-01",
            content: "This is the content of the first blog post."
        },
        {
            title: "Second Blog Post",
            date: "2023-10-05",
            content: "This is the content of the second blog post."
        }
    ];

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("blog-post");
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p class="date">${post.date}</p>
            <p>${post.content}</p>
        `;
        blogContainer.appendChild(postElement);
    });
}