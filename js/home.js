let page = 1;
let lastPage = false;
const postsContainer = document.getElementById("posts");

// Initialize by fetching the first page of posts
getPosts(page);

// PAGINATION
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

window.addEventListener(
  "scroll",
  debounce(() => {
    const endOfPageReached =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

    if (endOfPageReached && !lastPage) {
      page++;
      getPosts(page);
    }
  }, 100)
);

// FETCH POSTS FOR THE GIVEN PAGE
async function getPosts(page = 1, reload = false) {
  loader(true);
  try {
    const response = await axios.get(
      `https://tarmeezacademy.com/api/v1/posts?limit=9&page=${page}`
    );
    const { data, last_page } = response.data;

    if (reload || page === 1) {
      postsContainer.innerHTML = "";
    }

    data.forEach((post) => {
      const content = createPostHTML(post);
      postsContainer.insertAdjacentHTML("beforeend", content);
    });

    lastPage = last_page;
  } catch (error) {
    successAlert(error.response.data.message, "danger");
  } finally {
    loader(false);
  }
}

// CREATE HTML FOR A SINGLE POST
function createPostHTML(post) {
  const user = JSON.parse(localStorage.getItem("user"));
  const isMyPost = user != null && post.author.id === user.id;

  const editButtons = isMyPost
    ? `<div class="d-flex align-items-center justify-content-between">
         <i onclick="editPostModal('${encodeURIComponent(
           JSON.stringify(post)
         )}')" 
            class="fa-regular fa-pen-to-square text-primary me-2 fs-3 cursor-pointer"></i>
         <i onclick="delBtnClicked(${
           post.id
         })" class="fa-solid fa-trash text-danger fs-3"></i>
       </div>`
    : "";

  return `
    <div class="card shadow mb-5 mt-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <img onclick="toProfile(${post.author.id})" role="button"
            src="${post.author.profile_image}"
            class="img rounded-circle border border-2"
            alt=""
          />
          <b onclick="toProfile(${post.author.id})" role="button">${post.author.username}</b>
        </div>
        <div class="d-flex align-items-center justify-content-center">
          ${editButtons}
        </div>
      </div>
      <div class="card-body pb-0" onclick="postClicked(${post.id})" style="cursor:pointer;">
        <div class="card-title">
          <img src="${post.image}" alt="" class="img-fluid"/>
          <span class="text-black-50">${post.created_at}</span>
        </div>
        <div class="card-text">
          <h4>${post.title}</h4>
          <p>${post.body}</p>
        </div>
        <hr>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
          </svg>
          (${post.comments_count}) comments
        </p>
      </div>
    </div>`;
}
