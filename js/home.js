let page = 1;
let lastPage;
getPosts(page);

// ====  PAGINATION ==== //
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
    const endpage =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

    if (endpage && !lastPage) {
      page++;
      console.log(page);

      getPosts(page);
    }
  }, 100)
);
// ====  PAGINATION ==== //

// GET POSTS IN THE PAGE //

// GET POSTS IN THE PAGE //
async function getPosts(page = 1, reload = false) {
  loader(true);
  try {
    const response = await axios.get(
      `https://tarmeezacademy.com/api/v1/posts?limit=9&page=${page}`
    );
    const posts = response.data.data;

    if (reload || page === 1) {
      document.getElementById("posts").innerHTML = "";
    }

    posts.forEach((tweet) => {
      const content = createPostHTML(tweet);
      document.getElementById("posts").innerHTML += content;
    });

    // Check if this is the last page
    lastPage = response.data.last_page;
  } catch (error) {
    sucessAlert(error.response.data.message, "danger");
  } finally {
    loader(false);
  }
}

function createPostHTML(tweet) {
  let user = JSON.parse(localStorage.getItem("user"));
  let isMyPost = user != null && tweet.author.id === user.id;

  let btnEditedContent = isMyPost
    ? `<div  class="d-flex align-items-center justify-content-between">
        <i onclick="editPostModal('${encodeURIComponent(
          JSON.stringify(tweet)
        )}')" class="fa-regular fa-pen-to-square text-primary me-2 fs-3 cursor-pointer"></i>
        <i onclick="delBtnClicked(${
          tweet.id
        })"class="fa-solid fa-trash text-danger fs-3"></i>
     </div>
    `
    : "";

  return `
    <div class="card shadow mb-5 mt-4">
      <div class="card-header d-flex justify-content-between align-items-center ">
      <div>
        <img onclick="toProfile(${tweet.author.id})" role='button'
          src="${tweet.author.profile_image}"
          class="img rounded-circle border border-2"
          alt=""
        />
        <b onclick="toProfile(${tweet.author.id})" role='button'>${tweet.author.username}</b> 
      </div>
        <div class="d-flex align-items-center justify-content-center">
          ${btnEditedContent}
        </div>
      </div>
      <div class="card-body pb-0" onclick="postClicked(${tweet.id})" style="cursor:pointer;">
        <div class="card-title"><img src="${tweet.image}" alt=""> <span class="text-black-50">${tweet.created_at}</span></div>
        <div class="card-text">
          <h4>${tweet.title}</h4>
          <p>${tweet.body}</p>
        </div>
        <hr>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
          </svg> (${tweet.comments_count}) comments
        </p>
      </div>
    </div>`;
}
