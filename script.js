"use strice";

// Data
const account1 = {
  owner: "Pezhman Yazdankhah",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.3, // %
  pin: 1111,
};

const account2 = {
  owner: "Ansar Mirzayi",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.1,
  pin: 2222,
};

const account3 = {
  owner: "Mehran Hamedi",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.9,
  pin: 3333,
};

const account4 = {
  owner: "M.Hossein Rahmani",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const enterEL = document.querySelector(".enter");
const loginForm = document.querySelector(".login");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.querySelector(".login-btn");
const errMsgEl = document.querySelector(".error-message");
const app = document.querySelector(".main");
const movementsEl = document.querySelector(".transactions");
const currentBalance = document.querySelector(".current-balance");
const incomeEl = document.querySelector(".income");
const outgoEl = document.querySelector(".outgo");
const interestEl = document.querySelector(".interest");
const messageEl = document.querySelector(".message");
const logoutBtn = document.querySelector(".logout");
const timerEl = document.querySelector(".timer-wrapper");
const transferToInput = document.getElementById("transfer-to");
const transferAmountInput = document.getElementById("transfer-amount");
const transferBtn = document.querySelector(".transfer-btn");
const loanAmountInput = document.getElementById("loan-amount");
const loanCard = document.querySelector(".loan");
const requestLoanBtn = document.querySelector(".loan-btn");
const closeUserInput = document.getElementById("user-to-close");
const closePassInput = document.getElementById("pass-to-close");
const closeAccBtn = document.querySelector(".close-btn");
// Important Variables
let currentAccount;

// Helper functions
const createUsernames = function () {
  accounts.forEach((acc) => {
    const fullName = acc.owner.toLowerCase().split(" ");
    acc.username = `${fullName[0][0]}${fullName[1][0]}`;
  });
};

const renderErrorMsg = function (msg = "") {
  errMsgEl.textContent = msg;
};

const renderLoginError = function (user, pass) {
  if (!user && !pass) return renderErrorMsg("Enter your info.");
  if (!pass && user) return renderErrorMsg("Enter your password.");
  if (pass && !user) return renderErrorMsg("Enter your username.");
};

const showHeaderMsg = function (msg = "Login to start...") {
  messageEl.textContent = msg;
};

const showApp = () => {
  app.classList.remove("hidden");
  app.style.opacity = 1;
};
const hideApp = () => app.classList.add("hidden");

const showTimer = () => timerEl.classList.remove("hidden");

const hideTimer = () => timerEl.classList.add("hidden");

const init = function () {
  //hide the app
  hideApp();

  //hide the timer
  hideTimer();

  //hide login form
  loginForm.classList.add("hidden");

  //hide logout btn
  logoutBtn.classList.add("hidden");

  //show entry btns
  enterEL.classList.remove("hidden");

  // reset the current acc.
  currentAccount = undefined;

  // reset app msg
  showHeaderMsg();
};

const clearBlurInputs = function (...inputs) {
  inputs.forEach((input) => {
    input.value = "";
    input.blur();
  });
};

const showMovements = function (currentAccount) {
  movementsEl.innerHTML = "";
  currentAccount.movements.forEach((mov, i) => {
    const movRow = `
            <li class="transaction ${mov > 0 ? "deposit" : "withdrawal"}">
              <span class="transaction-label">${i + 1} ${
      mov > 0 ? "deposit" : "withdrawal"
    }</span>
              <span class="transaction-value">${mov} $</span>
            </li>
        `;
    movementsEl.insertAdjacentHTML("afterbegin", movRow);
  });
};

const calcDisplayBalance = function (currentAccount) {
  const balance = currentAccount.movements.reduce((bal, cur) => bal + cur, 0);
  currentBalance.textContent = `${balance} $`;
};

const calcDisplaySummary = function (currentAccount) {
  const income = currentAccount.movements
    .filter((mov) => mov > 0)
    .reduce((inc, cur) => inc + cur, 0);
  incomeEl.textContent = `${income} $`;
  const outgo = currentAccount.movements
    .filter((mov) => mov < 0)
    .reduce((out, cur) => out + cur, 0);
  outgoEl.textContent = `${Math.abs(outgo)} $`;
  const interest = currentAccount.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * currentAccount.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((int, cur) => int + cur, 0);
  interestEl.textContent = `${interest.toFixed(4)} $`;
};

const updateUI = function (currentAccount) {
  //show movements
  showMovements(currentAccount);

  // calc & display balance
  calcDisplayBalance(currentAccount);

  // calc & display summary
  calcDisplaySummary(currentAccount);
};

const handleLoginLogic = function (user, pass) {
  if (user && pass) {
    renderErrorMsg();
    // login logic
    currentAccount = accounts.find(
      (acc) => acc.username === user && acc.pin === +pass
    );
    if (!currentAccount) return renderErrorMsg("Enter info correctly!");

    // show welcome message
    showHeaderMsg(`Welcome back ${currentAccount.owner.split(" ")[0]}`);

    // show the app
    showApp();

    // clear inputs
    clearBlurInputs(usernameInput, passwordInput);

    // hide entry and login and show logout btn
    loginForm.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    enterEL.classList.add("hidden");

    // show movements, balance and summaries
    updateUI(currentAccount);

    //show timer
    showTimer();
  }
};

const renderActionMsg = function (msg = "🔴Enter valid values!", action) {
  const errEL = `<p class="error-action">${msg}</p>`;
  document.querySelector(`.${action}`).insertAdjacentHTML("afterbegin", errEL);
  setTimeout(() => {
    document.querySelector(".error-action").remove();
  }, 2000);
};

// Handler functions
const handleEnter = function (e) {
  if (e.target.classList.contains("enter-login")) {
    enterEL.classList.add("hidden");
    loginForm.classList.remove("hidden");
    usernameInput.focus();
  } else return;
};

const handleLogin = function (e) {
  e.preventDefault();
  const user = usernameInput.value;
  const pass = passwordInput.value;

  renderLoginError(user, pass);

  handleLoginLogic(user, pass);

  console.log(user);
  console.log(pass);
};

const handleLogout = function () {
  const sure = prompt(`Are you sure?
    (Yes/No)`);
  if (sure.toLowerCase() === "yes") init();
  else return;
};

const handleTransfer = function (e) {
  e.preventDefault();
  const transferToAcc = transferToInput.value;
  const transferAmount = transferAmountInput.value;
  clearBlurInputs(transferToInput, transferAmountInput);

  console.log(transferToAcc, transferAmount);

  if (
    transferAmount &&
    transferToAcc &&
    transferToAcc !== currentAccount.username &&
    +transferAmount > 0 &&
    currentAccount.movements.reduce((bal, cur) => bal + cur, 0) >
      +transferAmount &&
    accounts.some((acc) => acc.username === transferToAcc)
  ) {
    console.log("valid");
    renderActionMsg("🟢Transfer done.", "transfer");
    currentAccount.movements.push(-+transferAmount);
    updateUI(currentAccount);
    accounts
      .find((acc) => acc.username === transferToAcc)
      .movements.push(+transferAmount);
    return;
  } else {
    console.log("invalid");
    return renderActionMsg(undefined, "transfer");
  }
};

const handleLoan = function (e) {
  e.preventDefault();
  const loanAmount = loanAmountInput.value;
  clearBlurInputs(loanAmountInput);
  console.log(+loanAmount);
  if (
    loanAmount &&
    currentAccount.movements
      .filter((mov) => mov > 0)
      .some((mov) => mov > +loanAmount * 0.1) &&
    +loanAmount <
      5 * currentAccount.movements.reduce((bal, cur) => bal + cur, 0)
  ) {
    console.log("valid: loan accepted");
    renderActionMsg("🟢Loan accepted.", "loan");
    currentAccount.movements.push(+loanAmount);
    updateUI(currentAccount);
  } else return renderActionMsg(undefined, "loan");
};

const handleCloseAccount = function (e) {
  e.preventDefault();
  const closeUser = closeUserInput.value;
  const closePin = closePassInput.value;
  clearBlurInputs(closeUserInput, closePassInput);

  if (
    closeUser &&
    closePin &&
    closeUser === currentAccount.username &&
    +closePin === currentAccount.pin
  ) {
    console.log("valid");
    const sure = prompt(`Are you sure?
          (Yes/No)`);
    if (sure.toLowerCase() === "yes") {
      renderActionMsg("🧧Your account has been closed.", "close");
      accounts.splice(
        accounts.findIndex((acc) => acc.username === closeUser),
        1
      );
      setTimeout(init, 3000);
    } else return;
  } else {
    console.log("invalid");
    return renderActionMsg(undefined, "close");
  }
};

// Function calls
createUsernames();
init();

// fake login
// handleLoginLogic("py", "1111");

// Event handlers
enterEL.addEventListener("click", handleEnter);

loginBtn.addEventListener("click", handleLogin);

logoutBtn.addEventListener("click", handleLogout);

transferBtn.addEventListener("click", handleTransfer);

requestLoanBtn.addEventListener("click", handleLoan);

closeAccBtn.addEventListener("click", handleCloseAccount);
