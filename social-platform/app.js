// app.js
import './src/styles/tailwind.css'
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const currentPage = window.location.pathname;

  // Redirect logic
  if (!isLoggedIn && !currentPage.includes('login.html') && !currentPage.includes('register.html')) {
      window.location.href = 'login.html';
  }

  // Handle login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          // Simple validation
          if (email && password) {
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('userEmail', email);
              window.location.href = 'index.html';
          }
      });
  }

  // Handle register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const username = document.getElementById('username').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          // Simple validation
          if (username && email && password) {
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('userEmail', email);
              localStorage.setItem('username', username);
              window.location.href = 'index.html';
          }
      });
  }

  // Handle logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userEmail');
          window.location.href = 'login.html';
      });
  }

  // Image URL preview
  const imageUrlInput = document.getElementById('imageUrl');
  const imagePreview = document.getElementById('imagePreview');
  
  if (imageUrlInput) {
      imageUrlInput.addEventListener('input', () => {
          const url = imageUrlInput.value;
          if (url) {
              // Check if URL is valid
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

  // Handle post creation with image
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

  // Load posts on feed page
  const feedPosts = document.getElementById('feedPosts');
  if (feedPosts) {
      loadPosts();
  }

  // Load user posts on profile page
  const userPosts = document.getElementById('userPosts');
  if (userPosts) {
      loadUserPosts();
      // Set profile information
      document.getElementById('profileName').textContent = 
          localStorage.getItem('username') || 'User Name';
  }
});

// Post management functions
function createPost(content, imageUrl = '') {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const newPost = {
      id: Date.now(),
      content,
      imageUrl,
      author: localStorage.getItem('username'),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [] // Adding support for comments
  };
  posts.unshift(newPost);
  localStorage.setItem('posts', JSON.stringify(posts));
  loadPosts();
}

function loadPosts() {
  const feedPosts = document.getElementById('feedPosts');
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  
  feedPosts.innerHTML = posts.map(post => `
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
          <div class="flex justify-between items-start">
              <div>
                  <h3 class="font-bold">${post.author}</h3>
                  <p class="text-gray-600 text-sm">
                      ${new Date(post.timestamp).toLocaleString()}
                  </p>
              </div>
              <button onclick="likePost(${post.id})" class="text-blue-600 hover:text-blue-700">
                  ❤️ ${post.likes}
              </button>
          </div>
          ${post.content ? `<p class="mt-2">${post.content}</p>` : ''}
          ${post.imageUrl ? `
              <div class="mt-3">
                  <img src="${post.imageUrl}" 
                       alt="Post image" 
                       class="rounded-lg max-h-96 w-full object-cover"
                       onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect width=%221%22 height=%221%22 fill=%22%23eee%22/></svg>'; this.className='rounded-lg w-full h-48 bg-gray-200';">
              </div>
          ` : ''}
          
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
                  ${(post.comments || []).map(comment => `
                      <div class="bg-gray-50 p-2 rounded">
                          <p class="text-sm font-medium">${comment.author}</p>
                          <p class="text-sm">${comment.text}</p>
                      </div>
                  `).join('')}
              </div>
          </div>
      </div>
  `).join('');
}

function loadUserPosts() {
  const userPosts = document.getElementById('userPosts');
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const username = localStorage.getItem('username');
  
  const filteredPosts = posts.filter(post => post.author === username);
  
  userPosts.innerHTML = filteredPosts.map(post => `
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
                  ${(post.comments || []).map(comment => `
                      <div class="bg-gray-50 p-2 rounded">
                          <p class="text-sm font-medium">${comment.author}</p>
                          <p class="text-sm">${comment.text}</p>
                      </div>
                  `).join('')}
              </div>
          </div>
      </div>
  `).join('');
}

function likePost(postId) {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const postIndex = posts.findIndex(post => post.id === postId);
  if (postIndex !== -1) {
      posts[postIndex].likes += 1;
      localStorage.setItem('posts', JSON.stringify(posts));
      loadPosts();
  }
}

function addComment(postId) {
  const commentInput = document.getElementById(`comment-${postId}`);
  const commentText = commentInput.value.trim();
  
  if (commentText) {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const postIndex = posts.findIndex(post => post.id === postId);
      
      if (postIndex !== -1) {
          // Initialize comments array if it doesn't exist
          if (!posts[postIndex].comments) {
              posts[postIndex].comments = [];
          }
          
          // Add new comment
          posts[postIndex].comments.push({
              id: Date.now(),
              text: commentText,
              author: localStorage.getItem('username'),
              timestamp: new Date().toISOString()
          });
          
          // Save and refresh
          localStorage.setItem('posts', JSON.stringify(posts));
          commentInput.value = '';
          loadPosts();
      }
  }
}