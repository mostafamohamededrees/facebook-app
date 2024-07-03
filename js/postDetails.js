document.getElementById("posts").innerHTML = "";

// id in url Search //
const urlParams = new URLSearchParams(window.location.search);
console.log(window.location.search);
const id = urlParams.get("postsId");
// id in url Search //

// GET DETAILS POST THAT I CLICKED //
function getClickedPost() {
  loader(true);
  try {
    axios
      .get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
      .then((response) => {
        loader(false);

        const data = response.data.data;
        const comments = data.comments;
        let contentComment = ``;

        for (comment of comments) {
          contentComment += `<div class="comment d-flex mb-2">
              <img
                src="${comment.author.profile_image}"
                class="rounded-circle img me-2"
                alt=""
              />
              <div
              class="p-3  flex-grow-1 overflow-hidden "
                style="background-color: #f0f2f5; border-radius: 35px"
              >
                <b>${comment.author.username}</b>
                <p>
                  ${comment.body}
                </p>
              </div>
            </div>`;
        }
        const content = ` <div class="card shadow mt-5 mb-5">
    <div class="card-header">
      <img
        src="${data.author.profile_image}"
        class="img rounded-circle border border-2"
        alt=""
      />
      <b>${data.author.username}</b>
    </div>
    <div class="card-body pb-0">
      <div class="card-title">
        <img src="${data.image}"" alt="" />
        <span class="text-black-50">${data.created_at}</span>
      </div>
      <div class="card-text">
        <h4>${data.body}</h4>
        <p>
         ${data.title}
        </p>
      </div>
      <hr />
      <p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-pen"
          viewBox="0 0 16 16"
        >
          // <path
          //   d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
          // />
        </svg>
        (${data.comments_count})comments
      </p>
    </div>
    <div class="comments p-3" id="comments">
      ${contentComment}
  </div>

    <div id="divComment" class="addComment d-flex">
      <input type="text" placeholder="add your comment" id="addComment" class="yourComment">
      <input type="submit" id="addComment" value="send" onclick="addComment()">
      </div>
      <p id="error" class=" ms-3 d-block"></p>
   </div>
 </div>
</div>`;

        document.getElementById("posts").innerHTML = content;
        document.getElementById("name").innerHTML = data.author.username;
      });
  } catch (error) {
    sucessAlert("Something went wrong", "danger");
  } finally {
    loader(false);
  }
}
// GET DETAILS POST THAT I CLICKED //
async function addComment() {
  let inputComment = document.querySelector(".yourComment").value;
  let token = localStorage.getItem("token");

  const params = {
    body: inputComment,
  };

  loader(true);

  try {
    await axios.post(
      `https://tarmeezacademy.com/api/v1/posts/${id}/comments`,
      params,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    getClickedPost(id);
    console.log("Comment added successfully");
    sucessAlert("The comment has been added successfully", "success");
  } catch (error) {
    let errorMessage = error.response.data.message;
    if (errorMessage == "Unauthenticated.") {
      errorMessage = "Please login, to add a comment";
    }
    sucessAlert(errorMessage, "danger");
  } finally {
    loader(false);
  }
}

getClickedPost();
