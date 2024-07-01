const divLogin = document.getElementById("divLogin"),
  divLogout = document.getElementById("divLogout"),
  token = localStorage.getItem("token");
setupUi();

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
      document.getElementById("errorPassword").innerHTML =
        error.response.data.message;
      sucessAlert(error.response.data.message, "danger");
    });
}
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

// LOG OUT FUNCTION //
function logOut() {
  loader(true);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUi();
  loader(false);
  sucessAlert("Logged Out Successfully", "danger");
}
// LOG OUT FUNCTION //

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

  // setTimeout(() => {
  //   const hideAlert = bootstrap.Alert.getOrCreateInstance("#success_alert");
  //   hideAlert.close();
  // }, 2500);
}

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

      show();

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

// // Create ||  Edit  post //

// function createPost() {
//   setupUi();

//   // passed id post for known that post is created by me or any user and known type api i will use (create post OR Edit Post)

//   let tweetId = document.getElementById("input-hidden-forPassId").value;
//   let isCreate = tweetId == null || tweetId == "";

//   const title = document.getElementById("create_post_title").value;
//   const body = document.getElementById("create_post_body").value;
//   const image = document.getElementById("create_post_image").files[0];
//   const token = localStorage.getItem("token");

//   // here we use formData instead of JSON because we send image //
//   let formData = new FormData();
//   formData.append("title", title);
//   formData.append("body", body);
//   formData.append("image", image);

//   const headers = {
//     authorization: `Bearer ${token}`,
//     "Content-Type": "multipart/form-data",
//   };
//   let baseUrl = `https://tarmeezacademy.com/api/v1`;
//   let url = ``;

//   if (isCreate) {
//     // Create post //
//     loader(true);
//     let url = `${baseUrl}/posts`;
//     axios
//       .post(url, formData, {
//         headers: headers,
//       })
//       .then((response) => {
//         console.log(response);
//         const modal = document.getElementById("create_post");
//         bootstrap.Modal.getInstance(modal).hide();
//         sucessAlert("New Post Added Successfully", "success");

//         show(page);
//       })
//       .catch((error) => {
//         document.getElementById("wrongResponse").innerHTML =
//           error.response.data.message;
//         sucessAlert(error.response.data.message, "danger");
//       })
//       .finally(() => {
//         loader(false);
//       });
//   } else {
//     // Edit Post //
//     formData.append("_method", "PUT");
//     let url = `${baseUrl}/posts/${tweetId}`;
//     loader(true);
//     axios
//       .post(url, formData, {
//         headers: headers,
//       })
//       .then((response) => {
//         console.log(response);
//         const modal = document.getElementById("create_post");
//         bootstrap.Modal.getInstance(modal).hide();
//         sucessAlert("New Post Added Successfully", "success");

//         show();
//       })
//       .catch((error) => {
//         document.getElementById("wrongResponse").innerHTML =
//           error.response.data.message;
//         sucessAlert(error.response.data.message, "danger");
//       })
//       .finally(() => {
//         loader(false);
//       });
//   }
// }

// this function is very important for throw id to next page to allow me use id to get the post that i clicked it to show me
function postClicked(id) {
  window.location = `../postDetails.html?postsId=${id}`;
}

function editPost(obj) {
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

function clickPlus() {
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

function delBtnClicked(id) {
  let postMpdal = new bootstrap.Modal(
    document.getElementById("delete_post_modal"),
    {}
  );
  postMpdal.toggle();
  document.getElementById("inputHidenPassIdForDelPost").value = id;
}

function delPost() {
  // alert(id)
  const id = document.getElementById("inputHidenPassIdForDelPost").value;
  console.log(id);
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
      showPosts(page);
    })
    .catch((error) => {
      sucessAlert(error.response.data.message, "danger");
    })
    .finally(() => loader(false));
}

function profileClicked() {
  user = JSON.parse(localStorage.getItem("user"));
  let id = user.id;

  window.location.href = `../profilePageUser.html?postsId=${id}`;
}

function loader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "vidible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}

function toProfile(id) {
  window.location.href = `../profilePageUser.html?postsId=${id}`;
}
