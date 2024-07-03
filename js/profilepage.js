const cardProfile = document.getElementById("cardProfile");
let baseUrl = `https://tarmeezacademy.com/api/v1`;

// CREATE POST  + //
async function createPost() {
  setupUi();

  const tweetId = document.getElementById("input-hidden-forPassId").value,
    title = document.getElementById("create_post_title").value,
    body = document.getElementById("create_post_body").value,
    image = document.getElementById("create_post_image").files[0],
    token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);
  formData.append("_method", "PUT");

  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  let url = `${baseUrl}/posts/${tweetId}`;
  loader(true);
  try {
    const response = await axios.post(url, formData, { headers });
    console.log(response);
    const modal = document.getElementById("create_post");
    bootstrap.Modal.getInstance(modal).hide();
    sucessAlert("New Post Added Successfully", "success");
    getPostsUser();
  } catch (error) {
    document.getElementById("wrongResponse").innerHTML =
      error.response.data.message;
    sucessAlert(error.response.data.message, "danger");
  } finally {
    loader(false);
  }
}
// CREATE POST  + //

// DELETE POST //
async function delPost() {
  const id = document.getElementById("inputHidenPassIdForDelPost").value;
  const token = localStorage.getItem("token");

  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  loader(true);

  try {
    const response = await axios.delete(
      `https://tarmeezacademy.com/api/v1/posts/${id}`,
      { headers }
    );
    hideModal("delete_post_modal");
    sucessAlert("The Post Has Been Removed Successfully", "success");
    getPostsUser();
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "An error occurred while deleting the post";
    showAlert(errorMessage, "danger");
  } finally {
    loader(false);
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    bootstrap.Modal.getInstance(modal)?.hide();
  }
}

// DELETE POST //

// GET USER ID FROM URL PARAMS
function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("postsId");
}
// GET USER ID FROM URL PARAMS

// GET USER DETAILS IN THE PAGE //
async function detailsUser() {
  const id = getCurrentUserId();
  loader(true);
  try {
    const response = await axios.get(
      `https://tarmeezacademy.com/api/v1/users/${id}`
    );
    loader(false);
    const user = response.data.data;

    const content = generateUserProfileHTML(user);
    cardProfile.innerHTML = content;
    document.getElementById("name").innerHTML = `${user.username}'s`;
  } catch (error) {
    loader(false);
    console.error("Failed to fetch user details:", error);
  }
}

function generateUserProfileHTML(user) {
  return `
    <div class="row">
      <div class="col-sm-12 col-lg">
        <img
          style="width: 120px; height: 120px"
          src="${user.profile_image}"
          class="rounded-circle border border-2"
          alt=""
        />
      </div>
      <div
        class="col-lg-5 col-sm-7 d-flex flex-column justify-content-evenly"
        style="font-weight: 500; font-size: 20px"
      >
        <div>${user.name}</div>
        <div class="text-danger">${
          user.email === null ? "User doesn't have email" : user.email
        }</div>
        <div>${user.username}</div>
      </div>
      <div class="col-lg-4 col-sm-3 d-flex flex-column justify-content-evenly">
        <div class="text-black-50 numberComent">
          <span>${user.posts_count}</span> posts
        </div>
        <div class="text-black-50 numberComent">
          <span>${user.comments_count}</span> comments
        </div>
      </div>
    </div>`;
}
// GET USER DETAILS IN THE PAGE //

// GET POST'S USER IN THE PAGE //
async function getPostsUser() {
  const id = getCurrentUserId();

  try {
    loader(true);
    const response = await axios.get(
      `https://tarmeezacademy.com/api/v1/users/${id}/posts`
    );
    loader(false);
    const posts = response.data.data;
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    posts.forEach((tweet) => {
      let user = JSON.parse(localStorage.getItem("user"));
      let isMyPost = user && tweet.author.id == user.id;

      let btnEditedContent = isMyPost
        ? `
        <button type="button" class="btn btn-info ms-2" style="float:right;" onclick="editPost('${encodeURIComponent(
          JSON.stringify(tweet)
        )}')">Edit</button>
        <button type="button" class="btn btn-danger float-end" onclick="delBtnClicked(${
          tweet.id
        })">Delete</button>`
        : "";

      const content = `
        <div class="card shadow mb-5 mt-5">
          <div class="card-header">
            <img onclick="toProfile(${tweet.author.id})" role='button' src="${tweet.author.profile_image}" class="img rounded-circle border border-2" alt="" />
            <b onclick="toProfile(${tweet.author.id})" role='button'>${tweet.author.username}</b>
            ${btnEditedContent}
          </div>
          <div class="card-body pb-0" onclick="postClicked(${tweet.id})" style="cursor:pointer;">
            <div class="card-title"><img src="${tweet.image}" alt=""> <span class="text-black-50">${tweet.created_at}</span></div>
            <div class="card-text">
              <h4>${tweet.title}</h4>
              <p>${tweet.body}</p>
            </div>
            <hr>
            <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
            </svg> (${tweet.comments_count}) comments</p>
          </div>
        </div>`;
      postsContainer.innerHTML += content;
    });
  } catch (error) {
    loader(false);
    sucessAlert(error.response.data.message, "danger");
  }
}
// GET POSTS USER IN THE PAGE //

// Initial calls
detailsUser();
getPostsUser();
