const divLogin = document.getElementById("divLogin"),
  divLogout = document.getElementById("divLogout"),
  token = localStorage.getItem("token");
setupUi();

// LOADER FUNCTION //
function loader(show = true) {
  document.getElementById("loader").style.visibility = show
    ? "visible"
    : "hidden";
}
// LOADER FUNCTION //

// MAKE DIFFERENT UI FOR LOGIN AND LOGOUT //
function setupUi() {
  const btnPost = document.getElementById("addPost"),
    token = localStorage.getItem("token"),
    // here we need to turn json because we storge it formData //
    user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    if (btnPost) {
      btnPost.style.setProperty("display", "none", "important");
    }
    // not loged in
    divLogout.style.setProperty("display", "none", "important");
    divLogin.style.setProperty("display", "flex", "important");
    document.getElementById("userName").innerHTML = "";
  } else {
    if (btnPost) {
      btnPost.style.setProperty("display", "block", "important");
    }
    divLogin.style.setProperty("display", "none", "important");
    divLogout.style.setProperty("display", "flex", "important");
    document.getElementById("userName").innerHTML = user.username;
    document.getElementById("nav_imgUser").src = user.profile_image;
  }
}
// MAKE DIFFERENT UI FOR LOGIN AND LOGOUT //

// ALERT FUNCTION //
function successAlert(customMessage, type) {
  const alertPlaceholder = document.getElementById("success_alert");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible" role="alert">
      <div>${customMessage}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  alertPlaceholder.append(wrapper);
}
// ALERT FUNCTION //

// EDIT POST MODAL FUNCTION //
function editPostModal(obj) {
  const tweet = JSON.parse(decodeURIComponent(obj));
  document.getElementById("input-hidden-forPassId").value = tweet.id;
  document.getElementById("post_modal_title").innerHTML = "Edit Post";
  document.getElementById("create_post_title").value = tweet.title;
  document.getElementById("create_post_body").innerHTML = tweet.body;
  document.getElementById("btnCreatePost").innerHTML = "Update";
  const postModal = new bootstrap.Modal(document.getElementById("create_post"));
  postModal.toggle();
}
// EDIT POST MODAL FUNCTION //

// CREATE POST MODAL FUNCTION //
function createModalPost() {
  document.getElementById("post_modal_title").innerHTML = "Create New Post";
  document.getElementById("create_post_title").value = "";
  document.getElementById("create_post_body").innerHTML = "";
  document.getElementById("btnCreatePost").innerHTML = "Create";
  const postModal = new bootstrap.Modal(document.getElementById("create_post"));
  postModal.toggle();
}
// CREATE POST MODAL FUNCTION //

// DELETE POST MODAL FUNCTION //
function delBtnClicked(id) {
  const postModal = new bootstrap.Modal(
    document.getElementById("delete_post_modal")
  );
  postModal.toggle();
  document.getElementById("inputHidenPassIdForDelPost").value = id;
}
// DELETE POST MODAL FUNCTION //

// LOGIN FUNCTION //
async function loginSubmit() {
  const password = document.getElementById("password_input").value,
    userName = document.getElementById("username_input").value;

  const params = { username: userName, password };

  try {
    const response = await axios.post(
      "https://tarmeezacademy.com/api/v1/login",
      params
    );
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    const modal = document.getElementById("login_submit");
    bootstrap.Modal.getInstance(modal).hide();
    setupUi();
    getPosts(page);
    successAlert("Logged in Successfully", "success");
  } catch (error) {
    document.getElementById("errorPassword").innerHTML =
      "Wrong Password or Username";
    successAlert("Wrong Password or Username", "danger");
  }
}
// LOGIN FUNCTION //

// REGISTER FUNCTION //
async function registerSubmit() {
  const userName = document.getElementById("register_username_input").value,
    name = document.getElementById("register_name_input").value,
    password = document.getElementById("register_password_input").value,
    profileImage = document.getElementById("register_image_input").files[0];

  const formData = new FormData();
  formData.append("username", userName);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("image", profileImage);

  const headers = { "Content-Type": "multipart/form-data" };

  loader(true);

  try {
    const response = await axios.post(
      "https://tarmeezacademy.com/api/v1/register",
      formData,
      { headers }
    );
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    const modal = document.getElementById("register_submit");
    bootstrap.Modal.getInstance(modal).hide();
    setupUi();
    successAlert("New User Registered Successfully", "success");
  } catch (error) {
    document.getElementById("taken").innerHTML = error.response.data.message;
    successAlert(error.response.data.message, "danger");
  } finally {
    loader(false);
  }
}
// REGISTER FUNCTION //

// LOG OUT FUNCTION //
function logOut() {
  loader(true);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUi();
  getPosts(page);
  loader(false);
  successAlert("Logged Out Successfully", "danger");
}
// LOG OUT FUNCTION //

// CREATE OR EDIT POST FUNCTION //
async function createOrEditPost() {
  setupUi();

  const tweetId = document.getElementById("input-hidden-forPassId").value;
  const isCreate = !tweetId;
  const title = document.getElementById("create_post_title").value;
  const body = document.getElementById("create_post_body").value;
  const image = document.getElementById("create_post_image").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  const baseUrl = `https://tarmeezacademy.com/api/v1`;
  const url = isCreate ? `${baseUrl}/posts` : `${baseUrl}/posts/${tweetId}`;
  if (!isCreate) {
    formData.append("_method", "PUT");
  }

  loader(true);

  try {
    await axios.post(url, formData, { headers });
    const modal = document.getElementById("create_post");
    bootstrap.Modal.getInstance(modal).hide();
    const alertMessage = isCreate
      ? "New Post Added Successfully"
      : "Post Updated Successfully";
    successAlert(alertMessage, "success");
    isCreate
      ? getPosts(page)
      : window.location.pathname.includes("profile")
      ? getPostsUser()
      : getPosts(page);
  } catch (error) {
    document.getElementById("wrongResponse").innerHTML =
      error.response.data.message;
    successAlert(error.response.data.message, "danger");
  } finally {
    loader(false);
  }
}
// CREATE OR EDIT POST FUNCTION //

// DELETE POST FUNCTION //
async function delPost() {
  const id = document.getElementById("inputHidenPassIdForDelPost").value;
  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  loader(true);
  try {
    await axios.delete(`https://tarmeezacademy.com/api/v1/posts/${id}`, {
      headers,
    });
    const modal = document.getElementById("delete_post_modal");
    bootstrap.Modal.getInstance(modal).hide();
    successAlert("The Post Has Been Removed Successfully", "success");
    getPosts(page);
  } catch (error) {
    successAlert(error.response.data.message, "danger");
  } finally {
    loader(false);
  }
}
// DELETE POST FUNCTION //

// NAVIGATION FUNCTIONS //
function profileCurrentUser() {
  const user = JSON.parse(localStorage.getItem("user"));
  window.location.href = `../profilePageUser.html?postsId=${user.id}`;
}

function toProfile(id) {
  window.location.href = `../profilePageUser.html?postsId=${id}`;
}

function postClicked(id) {
  window.location = `../postDetails.html?postsId=${id}`;
}
// NAVIGATION FUNCTIONS //
