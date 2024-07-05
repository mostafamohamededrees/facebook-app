const divLogin = document.getElementById("divLogin"),
  divLogout = document.getElementById("divLogout"),
  token = localStorage.getItem("token");
setupUi();

// LOADER FUNCTION //
function loader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "vidible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
// LOADER FUNCTION //

// MAKE DIFFERENT UI FOR LOGIN AND LOGOUT //
function setupUi() {
  const btnPost = document.getElementById("addPost"),
    token = localStorage.getItem("token"),
    // here we need to turn json because we storge it formData //
    user = JSON.parse(localStorage.getItem("user"));

  if (token == null) {
    if (btnPost != null) {
      btnPost.style.setProperty("display", "none", "important");
    }
    // not loged in
    divLogout.style.setProperty("display", "none", "important");
    divLogin.style.setProperty("display", "flex", "important");
    document.getElementById("userName").innerHTML = "";
  } else {
    if (btnPost != null) {
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
function sucessAlert(customMessage, type) {
  const alertPlaceholder = document.getElementById("success_alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(customMessage, type);
}
// ALERT FUNCTION //

// ==== CUSTOM EDIT MODAL FOR POST ==== //
function editPostModal(obj) {
  let tweet = JSON.parse(decodeURIComponent(obj));
  console.log(tweet);

  document.getElementById("input-hidden-forPassId").value = tweet.id;

  // custom  Modal for Edit post //
  document.getElementById("post_modal_title").innerHTML = "Edit Post";
  document.getElementById("create_post_title").value = tweet.title;
  document.getElementById("create_post_body").innerHTML = tweet.body;
  document.getElementById("btnCreatePost").innerHTML = "Update";

  let postMpdal = new bootstrap.Modal(
    document.getElementById("create_post"),
    {}
  );
  postMpdal.toggle();
}
// ==== CUSTOM EDIT MODAL FOR POST ==== //

// ==== CUSTOM MODAL FOR CREATE POST + ====  //
function createModalPost() {
  // custom  Modal for create Post + //
  document.getElementById("post_modal_title").innerHTML = " Create New Post";
  document.getElementById("create_post_title").value = "";
  document.getElementById("create_post_body").innerHTML = "";
  document.getElementById("btnCreatePost").innerHTML = "Create";
  let postMpdal = new bootstrap.Modal(
    document.getElementById("create_post"),
    {}
  );
  postMpdal.toggle();
}
// ==== CUSTOM MODAL FOR CREATE POST + ====  //

// ==== CUSTOM MODAL FOR DELETE POST ====  //
function delBtnClicked(id) {
  let postMpdal = new bootstrap.Modal(
    document.getElementById("delete_post_modal"),
    {}
  );
  postMpdal.toggle();
  document.getElementById("inputHidenPassIdForDelPost").value = id;
}
// ==== CUSTOM MODAL FOR DELETE POST ====  //

// ==== LOGIN FUNCTION  ==== //
function loginSubmit() {
  const password = document.getElementById("password_input").value,
    userName = document.getElementById("username_input").value;

  const params = {
    username: userName,
    password: password,
  };

  axios
    .post("https://tarmeezacademy.com/api/v1/login", params)
    .then((response) => {
      const token = response.data.token,
        user = response.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const modal = document.getElementById("login_submit");
      bootstrap.Modal.getInstance(modal).hide();
      setupUi();
      sucessAlert("Logged in Successfully", "success");
    })
    .catch((error) => {
      console.log(error);
      document.getElementById("errorPassword").innerHTML =
        "Wrong Password or Username";
      sucessAlert("Wrong Password or Username", "danger");
    });
}
// ==== LOGIN FUNCTION  ==== //

// ==== REGISTER FUNCTION ==== //
function registerSubmit() {
  const userName = document.getElementById("register_username_input").value;
  const name = document.getElementById("register_name_input").value;
  const password = document.getElementById("register_password_input").value;
  const profile_image = document.getElementById("register_image_input")
    .files[0];

  // here we use formData instead of JSON because we send image //
  const formData = new FormData();
  formData.append("username", userName);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("image", profile_image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  loader(true);

  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData, {
      headers: headers,
    })
    .then((response) => {
      loader(false);

      console.log(response.data);

      const token = response.data.token,
        user = response.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const modal = document.getElementById("register_submit");
      bootstrap.Modal.getInstance(modal).hide();

      setupUi();

      sucessAlert("New User Register Successfully", "success");
    })
    .catch((error) => {
      document.getElementById("taken").innerHTML += error.response.data.message;
      sucessAlert(error.response.data.message, "danger");
      // console.log(error);

      // setTimeout(() => {
      //   document.getElementById("taken").innerHTML = "";
      //   document.getElementById("success_alert").innerHTML = "";
      // }, 5000);
    })
    .finally(() => {
      loader(false);
    });
}
// ====  REGISTER FUNCTION ==== //

// ==== LOG OUT FUNCTION ==== //
function logOut() {
  loader(true);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUi();
  loader(false);
  sucessAlert("Logged Out Successfully", "danger");
}
// LOG OUT FUNCTION //

// === CREATE OR EDIT POST FUNCTION  === //
async function createOrEditPost() {
  setupUi();

  const tweetId = document.getElementById("input-hidden-forPassId").value;
  const isCreate = !tweetId;
  const title = document.getElementById("create_post_title").value;
  const body = document.getElementById("create_post_body").value;
  const image = document.getElementById("create_post_image").files[0];
  const token = localStorage.getItem("token");

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
    console.log(tweetId);
    const response = await axios.post(url, formData, { headers });
    const modal = document.getElementById("create_post");
    bootstrap.Modal.getInstance(modal).hide();
    const alertMessage = isCreate
      ? "New Post Added Successfully"
      : "Post Updated Successfully";
    sucessAlert(alertMessage, "success");
    if (isCreate) {
      getPosts(page);
    } else {
      // Check if on profile page or home page
      const isProfilePage = window.location.pathname.includes("profile");
      if (isProfilePage) {
        getPostsUser();
      } else {
        getPosts(page);
      }
    }
  } catch (error) {
    document.getElementById("wrongResponse").innerHTML =
      error.response.data.message;
    sucessAlert(error.response.data.message, "danger");
  } finally {
    loader(false);
  }
}
// === CREATE OR EDIT POST FUNCTION  === //

// ==== DELETE POST FUNCTION ==== //
function delPost() {
  const id = document.getElementById("inputHidenPassIdForDelPost").value;
  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  loader(true);
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${id}`, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("delete_post_modal");
      bootstrap.Modal.getInstance(modal).hide();
      sucessAlert("The Post Has Been Removed Successfully", "success");
      getPosts(page);
    })
    .catch((error) => {
      sucessAlert(error.response.data.message, "danger");
    })
    .finally(() => loader(false));
}
// ==== DELETE POST FUNCTION ==== //

// TO GO TO PROFILE PAGE FOR CURRENT USER  ==> //
function profileCurrentUser() {
  user = JSON.parse(localStorage.getItem("user"));
  let id = user.id;

  window.location.href = `../profilePageUser.html?postsId=${id}`;
}
// TO GO TO PROFILE PAGE FOR CURRENT USER  ==> //

// TO GO TO PROFILE PAGE FOR OTHER USER  ==> //
function toProfile(id) {
  window.location.href = `../profilePageUser.html?postsId=${id}`;
}
// TO GO TO PROFILE PAGE FOR OTHER USER  ==> //

// POST CLICKED FUNCTION ==>  this function throw id to next page to allow me use id to get the post that i clicked it to show it in the next page //
function postClicked(id) {
  window.location = `../postDetails.html?postsId=${id}`;
}

