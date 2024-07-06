const cardProfile = document.getElementById("cardProfile");
const baseUrl = `https://tarmeezacademy.com/api/v1`;

// Helper function to show or hide loader

// Helper function to hide modal
function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    bootstrap.Modal.getInstance(modal)?.hide();
  }
}

// Helper function to get user ID from URL params
function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("postsId");
}

// Function to delete post //
async function delPost() {
  const id = document.getElementById("inputHidenPassIdForDelPost").value;
  const token = localStorage.getItem("token");

  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  loader(true);

  try {
    await axios.delete(`${baseUrl}/posts/${id}`, { headers });
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

// Function to get user details and display them on the page //
async function detailsUser() {
  const id = getCurrentUserId();
  loader(true);
  try {
    const response = await axios.get(`${baseUrl}/users/${id}`);
    const user = response.data.data;

    const content = generateUserProfileHTML(user);
    cardProfile.innerHTML = content;
    document.getElementById("name").innerHTML = `${user.username}'s`;
  } catch (error) {
  } finally {
    loader(false);
  }
}

// FUNCTION TO GENERATE HTML FOR DETAILS USER PROFILE //
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
      <div class="col-lg-5 col-sm-7 d-flex flex-column justify-content-evenly" style="font-weight: 500; font-size: 20px">
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

// Function to get user's posts and display them on the page
async function getPostsUser() {
  const id = getCurrentUserId();
  loader(true);

  try {
    const response = await axios.get(`${baseUrl}/users/${id}/posts`);
    const posts = response.data.data;
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    posts.forEach((tweet) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const isMyPost = user && tweet.author.id === user.id;

      const btnEditedContent = isMyPost
        ? `<div class="d-flex align-items-center justify-content-between">
            <i onclick="editPostModal('${encodeURIComponent(
              JSON.stringify(tweet)
            )}')" class="fa-regular fa-pen-to-square text-primary me-2 fs-3 cursor-pointer"></i>
            <i onclick="delBtnClicked(${
              tweet.id
            })" class="fa-solid fa-trash text-danger fs-3"></i>
           </div>`
        : "";

      const content = `
        <div class="card shadow mb-5 mt-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              <img onclick="toProfile(${tweet.author.id})" role='button' src="${tweet.author.profile_image}" class="img rounded-circle border border-2" alt="" />
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
      postsContainer.innerHTML += content;
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "An error occurred while fetching posts";
    sucessAlert(errorMessage, "danger");
  } finally {
    loader(false);
  }
}

// Initial function calls to fetch user details and posts
detailsUser();
getPostsUser();
