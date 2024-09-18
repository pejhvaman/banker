"use strice";

// Data
const account1 = {
  owner: "Pezhman Yazdankhah",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2023-11-18T21:31:17.178Z",
    "2023-12-23T07:42:02.383Z",
    "2024-01-28T09:15:04.904Z",
    "2024-09-11T10:17:24.185Z",
    "2024-09-16T14:11:59.604Z",
    "2024-09-17T17:01:17.194Z",
    "2024-09-18T18:36:17.929Z",
    "2024-09-19T00:30:36.790Z",
  ],
  currency: "IRR",
  locale: "fa-IR", // de-DE
};

const account2 = {
  owner: "Ansar Mirzayi",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const enterEL = document.querySelector(".enter"),
  loginForm = document.querySelector(".login"),
  usernameInput = document.getElementById("username"),
  passwordInput = document.getElementById("password"),
  loginBtn = document.querySelector(".login-btn"),
  errMsgEl = document.querySelector(".error-message"),
  app = document.querySelector(".main"),
  movementsEl = document.querySelector(".transactions"),
  currentBalance = document.querySelector(".current-balance"),
  incomeEl = document.querySelector(".income"),
  outgoEl = document.querySelector(".outgo"),
  interestEl = document.querySelector(".interest"),
  messageEl = document.querySelector(".message"),
  logoutBtn = document.querySelector(".logout"),
  timerEl = document.querySelector(".timer-wrapper"),
  transferToInput = document.getElementById("transfer-to"),
  transferAmountInput = document.getElementById("transfer-amount"),
  transferBtn = document.querySelector(".transfer-btn"),
  loanAmountInput = document.getElementById("loan-amount"),
  loanCard = document.querySelector(".loan"),
  requestLoanBtn = document.querySelector(".loan-btn"),
  closeUserInput = document.getElementById("user-to-close"),
  closePassInput = document.getElementById("pass-to-close"),
  closeAccBtn = document.querySelector(".close-btn"),
  sortBtn = document.querySelector(".sort"),
  currentDateEl = document.querySelector(".current-date");
// Important Variables
let currentAccount,
  sort = false;

// Helper functions
const createUsernames = function () {
  accounts.forEach((acc) => {
    const fullName = acc.owner.toLowerCase().split(" ");
    acc.username = `${fullName[0][0]}${fullName[1][0]}`;
  });
};

const renderErrorMsg = (msg = "") => (errMsgEl.textContent = msg);

const renderLoginError = function (user, pass) {
  if (!user && !pass) return renderErrorMsg("Enter your info.");
  if (!pass && user) return renderErrorMsg("Enter your password.");
  if (pass && !user) return renderErrorMsg("Enter your username.");
};

const showHeaderMsg = (msg = "Login to start...") =>
  (messageEl.textContent = msg);

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

const simpleDater = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = `${dateObj.getMonth() + 1}`.padStart(2, 0);
  const day = `${dateObj.getDate()}`.padStart(2, 0);
  return `${year}/${month}/${day}`;
};

const produceFormattedDate = (locale, date) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);
  // currentDateEl.textContent = formattedDate;
  return formattedDate;
};

const displayCurrentDate = (locale, date) => {
  currentDateEl.textContent = produceFormattedDate(locale, date);
};

const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date1 - date2) / (24 * 60 * 60 * 1000));

const movmentDateString = (date) => {
  const day = calcDaysPassed(date, new Date());
  if (day === 0) return "today";
  if (day === 1) return "yesterday";
  if (day > 1 && day < 7) return `${day} days ago`;
  if (day === 7) return "a week ago";
  else return produceFormattedDate(currentAccount.locale, date);
};

const numberFormatter = function (locale, currency, number) {
  const options = {
    style: "currency",
    currency: currency,
    // currencyDisplay: "code",
    // useGrouping: false,
  };

  const formattedNum = new Intl.NumberFormat(locale, options)
    .format(number)
    .replace("ریال", "ت")
    .replaceAll(" ", "")
    .trim();
  return formattedNum;
};

const showMovements = function (currentAccount, sort = false) {
  movementsEl.innerHTML = "";

  const movsArr = currentAccount.movements;

  const movsMap = new Map();

  movsArr.forEach((mov, i) => movsMap.set(mov, i));

  const sortedMovs = movsArr.slice().sort((a, b) => a - b);

  const movements = sort ? sortedMovs : movsArr;

  const movDates = currentAccount.movementsDates;

  movements.forEach((mov) => {
    const movRow = `
            <li class="transaction ${mov > 0 ? "deposit" : "withdrawal"}">
              <span class="transaction-label">${movsMap.get(mov) + 1} ${
      mov > 0 ? "deposit" : "withdrawal"
    }</span>
              <span class="transaction-date">${movmentDateString(
                new Date(movDates[movsMap.get(mov)])
              )}</span>
              <span class="transaction-value">${numberFormatter(
                currentAccount.locale,
                currentAccount.currency,
                mov
              )}</span>
            </li>
        `;
    movementsEl.insertAdjacentHTML("afterbegin", movRow);
  });
};

const calcDisplayBalance = function (currentAccount) {
  const balance = currentAccount.movements.reduce((bal, cur) => bal + cur, 0);
  currentBalance.textContent = `${numberFormatter(
    currentAccount.locale,
    currentAccount.currency,
    balance
  )}`;
};

const calcDisplaySummary = function (currentAccount) {
  const locale = currentAccount.locale;
  const currency = currentAccount.currency;

  const income = currentAccount.movements
    .filter((mov) => mov > 0)
    .reduce((inc, cur) => inc + cur, 0);
  incomeEl.textContent = `${numberFormatter(locale, currency, income)}`;
  const outgo = currentAccount.movements
    .filter((mov) => mov < 0)
    .reduce((out, cur) => out + cur, 0);
  outgoEl.textContent = `${numberFormatter(locale, currency, Math.abs(outgo))}`;
  const interest = currentAccount.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * currentAccount.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((int, cur) => int + cur, 0);
  interestEl.textContent = `${numberFormatter(locale, currency, interest)}`;
};

const updateUI = function (currentAccount) {
  //show movements
  showMovements(currentAccount);

  // calc & display balance
  calcDisplayBalance(currentAccount);

  // calc & display summary
  calcDisplaySummary(currentAccount);

  //display date
  displayCurrentDate(currentAccount.locale, new Date());
};

const takeCareLogin = function (user, pass) {
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

  takeCareLogin(user, pass);
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

const handleSort = function () {
  showMovements(currentAccount, !sort);
  sort = !sort;
};
// Function calls
createUsernames();
init();

// fake login
// takeCareLogin("am", "2222");
takeCareLogin("py", "1111");

// Event handlers
enterEL.addEventListener("click", handleEnter);

loginBtn.addEventListener("click", handleLogin);

logoutBtn.addEventListener("click", handleLogout);

transferBtn.addEventListener("click", handleTransfer);

requestLoanBtn.addEventListener("click", handleLoan);

closeAccBtn.addEventListener("click", handleCloseAccount);

sortBtn.addEventListener("click", handleSort);
