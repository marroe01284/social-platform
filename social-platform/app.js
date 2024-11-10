import './src/styles/tailwind.css';

document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('loginFormContainer');
    if (formContainer) {
        setTimeout(() => {
            formContainer.classList.remove('opacity-0', 'translate-y-5');
            formContainer.classList.add('opacity-100', 'translate-y-0');
        }, 100);
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;


    if (!isLoggedIn && !currentPage.includes('index.html') && !currentPage.includes('register.html')) {
        window.location.href = 'index.html';
    }


    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;


            if (!password || password.length < 8) {
                alert('Password must be at least 8 characters long.');
                return;
            }

            if (email && password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                window.location.href = 'feed.html';
            }
        });
    }


    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;


            if (!password || password.length < 8) {
                alert('Password must be at least 8 characters long.');
                return;
            }

            if (username && email && password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('username', username);
                window.location.href = 'feed.html';
            }
        });
    }


    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            window.location.href = 'login.html';
        });
    }


    const imageUrlInput = document.getElementById('imageUrl');
    const imagePreview = document.getElementById('imagePreview');

    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', () => {
            const url = imageUrlInput.value;
            if (url) {

                try {
                    new URL(url);
                    imagePreview.textContent = '✓ Valid image URL';
                    imagePreview.className = 'text-sm text-green-600';
                } catch {
                    imagePreview.textContent = '✗ Invalid URL format';
                    imagePreview.className = 'text-sm text-red-600';
                }
            } else {
                imagePreview.textContent = '';
            }
        });
    }


    const createPostBtn = document.getElementById('createPost');
    if (createPostBtn) {
        createPostBtn.addEventListener('click', () => {
            const content = document.getElementById('postContent').value;
            const imageUrl = document.getElementById('imageUrl').value;

            if (content.trim() || imageUrl) {
                createPost(content, imageUrl);
                document.getElementById('postContent').value = '';
                document.getElementById('imageUrl').value = '';
                imagePreview.textContent = '';
            }
        });
    }


    const feedPosts = document.getElementById('feedPosts');
    if (feedPosts) {
        loadPosts();
    }


    const userPosts = document.getElementById('userPosts');
    if (userPosts) {
        loadUserPosts();

        document.getElementById('profileName').textContent =
            localStorage.getItem('username') || 'User Name';
    }
});


function createPost(content, imageUrl = '') {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const newPost = {
        id: Date.now(),
        content,
        imageUrl,
        author: localStorage.getItem('username'),
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
    };
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
}

function loadPosts() {
    const feedPosts = document.getElementById('feedPosts');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');

    feedPosts.innerHTML = posts
        .map(
            (post) => `
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
          <div class="flex justify-between items-start">
              <div>
                  <h3 class="font-bold">${post.author}</h3>
                  <p class="text-gray-600 text-sm">
                  ${new Date(post.timestamp).toLocaleString()}
                  </p>
                  </div>
                  <button class="bg-blue-600  text-white px-4 py-4 rounded-lg hover:bg-blue-700" >Follow</button>
                  </div>
                  ${post.content ? `<p class="mt-2">${post.content}</p>` : ''}
                  ${post.imageUrl ? `
                  <div class="mt-3">
                  <img src="${post.imageUrl}" 
                  alt="Post image" 
                  class="rounded-lg max-h-96 w-full object-cover"
                  onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect width=%221%22 height=%221%22 fill=%22%23eee%22/></svg>'; this.className='rounded-lg w-full h-48 bg-gray-200';">
                  </div>
                  <button onclick="likePost(${post.id})" class="text-blue-600 hover:text-blue-700">
                  ❤️ ${post.likes}
                  </button>
          ` : ''}
          <p class="text-gray-600 text-sm">
              ${new Date(post.timestamp).toLocaleString()}
          </p>
          
          <!-- Comments Section -->
          <div class="mt-4 border-t pt-3">
              <div class="flex space-x-2">
                  <input type="text" 
                         placeholder="Add a comment..." 
                         class="flex-1 p-2 border rounded-lg"
                         id="comment-${post.id}">
                  <button onclick="addComment(${post.id})" 
                          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Comment
                  </button>
              </div>
              <div class="mt-3 space-y-2">
                  ${(post.comments || []).map(
                (comment) => `
                      <div class="bg-gray-50 p-2 rounded">
                          <p class="text-sm font-medium">${comment.author}</p>
                          <p class="text-sm">${comment.text}</p>
                      </div>
                  `
            ).join('')}
              </div>
          </div>
      </div>
  `
        )
        .join('');
}


window.likePost = function (postId) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
        posts[postIndex].likes += 1;
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
};


window.addComment = function (postId) {
    const commentInput = document.getElementById(`comment-${postId}`);
    const commentText = commentInput.value.trim();

    if (commentText) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const postIndex = posts.findIndex((post) => post.id === postId);

        if (postIndex !== -1) {

            if (!posts[postIndex].comments) {
                posts[postIndex].comments = [];
            }


            posts[postIndex].comments.push({
                id: Date.now(),
                text: commentText,
                author: localStorage.getItem('username'),
                timestamp: new Date().toISOString(),
            });


            localStorage.setItem('posts', JSON.stringify(posts));
            commentInput.value = '';
            loadPosts(); // Re-render the posts after adding the comment
        }
    }
};

function loadUserPosts() {
    const userPosts = document.getElementById('userPosts');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const username = localStorage.getItem('username');

    const filteredPosts = posts.filter((post) => post.author === username);

    userPosts.innerHTML = filteredPosts
        .map(
            (post) => `
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
          <p class="text-gray-600 text-sm">${new Date(post.timestamp).toLocaleString()}</p>
          ${post.content ? `<p class="mt-2">${post.content}</p>` : ''}
          ${post.imageUrl ? `
              <div class="mt-3">
                  <img src="${post.imageUrl}" 
                       alt="Post image" 
                       class="rounded-lg max-h-96 w-full object-cover"
                       onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect width=%221%22 height=%221%22 fill=%22%23eee%22/></svg>'; this.className='rounded-lg w-full h-48 bg-gray-200';">
              </div>
          ` : ''}
          <div class="mt-2 text-blue-600">❤️ ${post.likes} likes</div>
          
          <!-- Comments Section -->
          <div class="mt-4 border-t pt-3">
              <div class="flex space-x-2">
                  <input type="text" 
                         placeholder="Add a comment..." 
                         class="flex-1 p-2 border rounded-lg"
                         id="comment-${post.id}">
                  <button onclick="addComment(${post.id})" 
                          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Comment
                  </button>
              </div>
              <div class="mt-3 space-y-2">
                  ${(post.comments || []).map(
                (comment) => `
                      <div class="bg-gray-50 p-2 rounded">
                          <p class="text-sm font-medium">${comment.author}</p>
                          <p class="text-sm">${comment.text}</p>
                      </div>
                  `
            ).join('')}
              </div>
          </div>
      </div>
  `
        )
        .join('');
}
