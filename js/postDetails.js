// GET ID FROM URL PARAMS //
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postsId");
// GET ID FROM URL PARAMS //

document.getElementById("posts").innerHTML = "";

// GET DETAILS POST CLICKED //
async function getClickedPost() {
  loader(true);
  try {
    const response = await axios.get(
      `https://tarmeezacademy.com/api/v1/posts/${id}`
    );
    const data = response.data.data;
    const comments = data.comments;
    let contentComment =
      comments.length > 0
        ? comments
            .map(
              (comment) => `
        <div class="comment d-flex mb-2">
          <img src="${comment.author.profile_image}" class="rounded-circle img me-2" alt="" />
          <div class="p-3 flex-grow-1 overflow-hidden" style="background-color: #f0f2f5; border-radius: 35px">
            <b>${comment.author.username}</b>
            <p>${comment.body}</p>
          </div>
        </div>
      `
            )
            .join("")
        : "";

    const content = `
      <div class="card shadow mt-5 mb-5">
        <div class="card-header d-flex align-items-center">
          <img src="${data.author.profile_image}" class="img rounded-circle border border-2 me-2" alt="" />
          <b>${data.author.username}</b>
        </div>
        <div class="card-body pb-0">
          <div class="card-title">
            <img src="${data.image}" alt="" class="img-fluid" />
            <span class="text-black-50">${data.created_at}</span>
          </div>
          <div class="card-text">
            <h4>${data.title}</h4>
            <p>${data.body}</p>
          </div>
          <hr />
          <p onclick="toggleComments()" style="cursor:pointer;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
            </svg>
            (${data.comments_count}) comments
          </p>
        </div>
        <div class="comments " id="comments">
          ${contentComment}
        </div>
        <div id="divComment" class="addComment d-flex">
          <input type="text" placeholder="Add your comment" id="addComment" class="yourComment form-control me-2" />
          <button type="button" id="submitComment" class="btn btn-primary" onclick="addComment()">Send</button>
        </div>
        <p id="error" class="ms-3 d-block"></p>
      </div>
    `;

    document.getElementById("posts").innerHTML = content;
    document.getElementById("name").innerHTML = data.author.username;
  } catch (error) {
    sucessAlert("Something went wrong", "danger");
  } finally {
    loader(false);
  }
}
// GET DETAILS POST CLICKED //

// ADD COMMENT TO THE POST  //
async function addComment() {
  const inputComment = document.querySelector(".yourComment").value.trim();
  const token = localStorage.getItem("token");

  if (!inputComment) {
    document.getElementById("error").textContent = "Comment cannot be empty.";
    return;
  }

  const params = { body: inputComment };
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  loader(true);

  try {
    await axios.post(
      `https://tarmeezacademy.com/api/v1/posts/${id}/comments`,
      params,
      { headers }
    );
    await getClickedPost();
    toggleComments();
    sucessAlert("The comment has been added successfully", "success");
  } catch (error) {
    let errorMessage = error.response?.data?.message ?? "An error occurred";
    if (errorMessage === "Unauthenticated.") {
      errorMessage = "Please login to add a comment.";
    }
    sucessAlert(errorMessage, "danger");
  } finally {
    loader(false);
  }
}
// ADD COMMENT TO THE POST  //

// TOGGLE COMMENTS FUNCTION  //
function toggleComments() {
  const comments = document.getElementById("comments");
  comments.classList.toggle("show");
}
// TOGGLE COMMENTS FUNCTION  //

getClickedPost();
