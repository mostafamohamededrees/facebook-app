// ==== HEADER COMPONENT  ==== //
const template = document.createElement("template");
template.innerHTML = `
  <div class="w-100">
      <nav class="navbar navbar-expand-lg bg-body-tertiary pb-3 shadow ">
        <div class="container-fluid mx-lg-5">
          <a class="navbar-brand fw-bold fs-4 text-primary" href="index.html">FACEBOOK</a>
            <div class="d-flex flex-grow-1 justify-content-end" id="divLogin">
              <button
                type="button"
                class="btn btn-primary mx-2"
                data-bs-toggle="modal"
                data-bs-target="#login_submit"
                data-bs-whatever="@mdo"
              >
                Login
              </button>
              <button
                type="button"
                class="btn btn-primary me-2"
                data-bs-toggle="modal"
                data-bs-target="#register_submit"
              >
                Register
              </button>
            </div>
            <div
              class="d-flex flex-grow-1 divLogout justify-content-end"
              id="divLogout"
            >
              <div class="dataUser" onclick="profileClicked()">
                <img
                  id="nav_imgUser"
                  class="img rounded-circle border border-2"
                  alt=""
                />
                <span id="userName"></span>
              </div>
              <button
                type="button"
                class="btn btn-danger mx-2"
                data-bs-toggle="modal"
                onclick="logOut()"
                id="logout_submit"
                data-bs-whatever="@mdo"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
`;

class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = template.innerHTML;
  }
}

customElements.define("header-component", Header);
// ====   HEADER COMPONENT ==== //

//====  MODEL FOR LOGIN ==== //
const modelLoginTemplate = document.createElement("template");

modelLoginTemplate.innerHTML = `
    <div
      class="modal fade"
      id="login_submit"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Login</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="username_input" class="col-form-label"
                  >Username</label
                >
                <input type="text" class="form-control" id="username_input" />
              </div>
              <div class="mb-3">
                <label for="password_input" class="col-form-label"
                  >Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="password_input"
                />
                <span id="errorPassword"></span>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              onclick="loginSubmit()"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
`;

class LoginModel extends HTMLElement {
  connectedCallback() {
    this.innerHTML = modelLoginTemplate.innerHTML;
  }
}

customElements.define("model-login-component", LoginModel);
//====  MODEL FOR LOGIN ==== //

//====  MODEL FOR REGISTER ==== //
const modelRegisterTemplate = document.createElement("template");
modelRegisterTemplate.innerHTML = `
 <div
      class="modal fade"
      id="register_submit"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Register New User
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="register_image_input" class="col-form-label"
                  >Profile Image
                </label>
                <input
                  type="file"
                  class="form-control"
                  id="register_image_input"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="register_name_input" class="col-form-label"
                  >Name</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="register_name_input"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="register_username_input" class="col-form-label"
                  >Username</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="register_username_input"
                  required
                />
                <span id="taken"></span>
              </div>
              <div class="mb-3">
                <label for="register_password_input" class="col-form-label"
                  >Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="register_password_input"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              onclick="registerSubmit()"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
`;
class RegisterModel extends HTMLElement {
  connectedCallback() {
    this.innerHTML = modelRegisterTemplate.innerHTML;
  }
}

customElements.define("model-register-component", RegisterModel);
//====  MODEL FOR REGISTER ==== //

//====  MODEL FOR CREATE POST ==== //
const modelCreatePostTemplate = document.createElement("template");
modelCreatePostTemplate.innerHTML = `
   <div
      class="modal fade"
      id="create_post"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="post_modal_title">
              Create New Post
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="create_post_title" class="col-form-label"
                  >Title</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="create_post_title"
                />
                <input type="hidden" id="input-hidden-forPassId" value="" />
              </div>
              <div>
                <textarea
                  class="textarea"
                  name=""
                  id="create_post_body"
                ></textarea>
                <span id="wrongResponse"></span>
              </div>
              <div class="mb-3">
                <label for="create_post_image" class="col-form-label"
                  >Image</label
                >
                <input
                  type="file"
                  class="form-control"
                  id="create_post_image"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              id="btnCreatePost"
              class="btn btn-primary"
              onclick="createOrEditPost()"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
`;
class CreatePost extends HTMLElement {
  connectedCallback() {
    this.innerHTML = modelCreatePostTemplate.innerHTML;
  }
}

customElements.define("model-create-post-component", CreatePost);
//====  MODEL FOR CREATE POST ==== //

//====  MODEL FOR DELETE POST ==== //
const modelDeletePostTemplate = document.createElement("template");
modelDeletePostTemplate.innerHTML = `
       <div
      class="modal fade"
      id="delete_post_modal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="delete_post_modal">
              Are you sure you want to delete this post ?
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal">
              Close
            </button>
            <button
              type="button"
              id="btnCreatePost"
              class="btn btn-danger"
              onclick="delPost()"
            >
              Yes,Delete
            </button>
            <input type="hidden" id="inputHidenPassIdForDelPost" value="" />
          </div>
        </div>
      </div>
    </div>
`;
class DeletePost extends HTMLElement {
  connectedCallback() {
    this.innerHTML = modelDeletePostTemplate.innerHTML;
  }
}

customElements.define("model-delete-post-component", DeletePost);

//====  MODEL FOR DELETE POST ==== //
