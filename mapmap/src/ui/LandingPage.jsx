import { useNavigate } from "react-router-dom";

//SVG
import sign_up_img from ".././asserts/undraw_adventure_map_hnin.svg";
import sign_in_img from ".././asserts/undraw_navigator_a479.svg";

//CSS
import "./LandingPage.css";

// Navigate
// const ProtectedRoute = ({ user, children }) => {
//   if (!user) {
//     return <Navigate to="/landing" replace />;
//   }

//   return children;
// };

function LandingPage() {
  const navigate = useNavigate();

  function signUp() {
    document.querySelector(".container").classList.add("sign-up-mode");
  }

  function signIn() {
    document.querySelector(".container").classList.remove("sign-up-mode");
  }

  function signInSubmit(event) {
    event.preventDefault();
    console.log("signInSubmit..............");

    let signInEmail = document.getElementById("signInEmail").value;
    let signInPass = document.getElementById("signInPass").value;

    navigate("/MapMap");

    console.log(`signInEmail: ${signInEmail}`);
    console.log(`signInPass: ${signInPass}`);
  }

  function signUpSubmit(event) {
    event.preventDefault();
    console.log("signUpSubmit..............");

    let signUpEmail = document.getElementById("signUpEmail").value;
    let signUpPass = document.getElementById("signUpPass").value;

    console.log(`signInEmail: ${signUpEmail}`);
    console.log(`signInPass: ${signUpPass}`);
  }

  return (
    <div className="App">
      <div className="container">
        <div className="forms-container">
          <div className="signin-signup">
            <form className="sign-in-form">
              <h1 className=" font-semibold text-3xl">
                Welcome to <span className="start_letter">MapMap</span>
              </h1>

              <div className="input-field">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                  className="icon"
                >
                  <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                </svg>
                <input id="signInEmail" type="email" placeholder="Email" />
              </div>
              <div className="input-field">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                  className="icon"
                >
                  <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
                </svg>
                <input id="signInPass" type="password" placeholder="Password" />
              </div>

              <input
                type="submit"
                value="Submit"
                onClick={(event) => {
                  signInSubmit(event);
                }}
                className="btn solid"
              />
            </form>
            <form className="sign-up-form">
              <h1 className=" font-semibold text-3xl">
                Sign up for <span className="start_letter">MapMap</span>
              </h1>

              <div className="input-field">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                  className="icon"
                >
                  <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                </svg>
                <input id="signUpEmail" type="email" placeholder="Email" />
              </div>
              <div className="input-field">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                  className="icon"
                >
                  <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
                </svg>
                <input id="signUpPass" type="password" placeholder="Password" />
              </div>

              <input
                type="submit"
                className="btn"
                value="Submit"
                onClick={(event) => {
                  signUpSubmit(event);
                }}
              />
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>Map, Share, Connect: Your Journey Begins Here!</p>
              <button
                className="btn transparent"
                id="sign-up-btn"
                onClick={() => {
                  signUp();
                }}
              >
                Sign up
              </button>
            </div>
            <img src={sign_in_img} className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>Navigate Your World: Where Every Pin Tells a Story!</p>
              <button
                className="btn transparent"
                id="sign-in-btn"
                onClick={() => {
                  signIn();
                }}
              >
                Sign in
              </button>
            </div>
            <img src={sign_up_img} className="image" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
