// write javascript here
document.addEventListener("DOMContentLoaded", () => {
  const incomeAmountEl = document.querySelector(".income-amount");
  const balanceAmountEl = document.querySelector(".balance-amount");
  const expenseAmountEl = document.querySelector(".expense-amount");
  const transcationForm = document.getElementById("tran-form");
  const transcationsContainer = document.querySelector(".details");
  const resetBtn = document.querySelector(".btn-reset");

  let income = 0;
  let expense = 0;
  let transcations = [];
 
  updateUI();
  loadFromLocalStorage();

  transcationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector(".input-name").value;
    const amount = parseFloat(document.querySelector(".input-amount").value);
    const date = document.querySelector(".input-date").value;
    const type = document.querySelector(".input-type").value;
    const action = e.submitter.getAttribute("data-action");

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    if (action === "expense") {
      expense += amount;
    } else {
      income += amount;
    }

    transcations.push({
      id: generateRandomId(),
      name,
      amount,
      date,
      type,
      action,
    });
    saveToLocalStorage();

    updateUI();
    transcationForm.reset();
  });

  function loadFromLocalStorage() {
    const savedTransactions = localStorage.getItem("transcations");

    if (savedTransactions) {
      transcations = JSON.parse(savedTransactions);

      income = transcations
        .filter((transcation) => transcation.action === "income")
        .reduce((acc, curr) => acc + curr.amount, 0);
      expense = transcations
        .filter((transcation) => transcation.action === "expense")
        .reduce((acc, curr) => acc + curr.amount, 0);

      updateUI();
    }
  }

  function generateRandomId() {
    return Math.floor(Math.random() * 1000).toString();
  }

  function saveToLocalStorage() {
    localStorage.setItem("transcations", JSON.stringify(transcations));
  }

  function updateUI() {
    incomeAmountEl.textContent = `₹ ${income}`;
    balanceAmountEl.textContent = `₹ ${income - expense}`;
    expenseAmountEl.textContent = `₹ ${expense}`;

    transcationsContainer.innerHTML = "";
    transcations.forEach((transcation) => {
      const transcationEl = document.createElement("div");
      transcationEl.classList.add("detail");
      transcationEl.setAttribute("data-id", transcation.id);
      transcationEl.innerHTML = `
        <div class="tran-date">${transcation.date}</div>
        <div class="tran-name">
              ${transcation.name}
              </div>
        <div class="tran-type">${transcation.type}</div>
        <div class="tran-amount">${
          transcation.action === "income" ? "+" : "-"
        }₹ ${Math.abs(transcation.amount)}
        </div>
        <div class="btn-edit">
            <ion-icon name="create-outline" class="edit"></ion-icon>
        </div>
        <div class="btn-delete">
                <ion-icon name="trash-outline" class="delete"></ion-icon>
        </div>`;
      if (transcation.action === "income") {
        transcationEl.classList.add("tran-income");
      } else {
        transcationEl.classList.add("tran-expense");
      }
      transcationsContainer.appendChild(transcationEl);
    });
  }

const updateDisplay = function () {
        transcations.forEach((transcation) => {
          income = 0;
          expense = 0;
          if (transcation.action === "expense") {
            expense += transcation.amount;
          } else {
            income += transcation.amount;
          }
        });
        if (transcations.length === 0) {
          income = 0;
          expense = 0;
        }
      };
  
  transcationsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete")) {
      const transcationElement = e.target.closest(".detail");
      const idToDelete = transcationElement.getAttribute("data-id");

      const indexToDelete = transcations.findIndex(
        (transcation) => transcation.id === idToDelete
      );

      

      if (indexToDelete !== -1) {
        transcations.splice(indexToDelete, 1);
        updateDisplay();
        saveToLocalStorage();
        updateUI();
      }
    }
  });

  transcationsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit")) {
      const transcationElement = e.target.closest(".detail");
      const idToEdit = transcationElement.getAttribute("data-id");

      const transactionToEdit = transcations.find(
        (transcation) => transcation.id === idToEdit
      );

      if (transactionToEdit) {
        const nameElement = transcationElement.querySelector(".tran-name");
        const amountElement = transcationElement.querySelector(".tran-amount");
        const typeElement = transcationElement.querySelector(".tran-type");

        const nameValue = nameElement.textContent.split("[")[0].trim();
        let amountValue;
        if (transactionToEdit.action === "income") {
          amountValue = amountElement.textContent.replace("+₹", "");
        } else {
          amountValue = amountElement.textContent.replace("-₹", "");
        }

        const typeValue = typeElement.textContent;

        nameElement.innerHTML = `<input class="edit-input" value="${nameValue}" />`;
        amountElement.innerHTML = `<input class="edit-input" value="${Number(
          amountValue
        )}" />`;
        typeElement.innerHTML = `<input class="edit-input" value="${typeValue}" />`;

        console.log(typeElement.innerHTML);
        const editInputs = transcationElement.querySelectorAll(".edit-input");

        const applyButton = document.createElement("button");
        applyButton.textContent = "Apply changes";
        applyButton.classList.add("apply-btn");
        transcationElement.appendChild(applyButton);

        applyButton.addEventListener("click", () => {
          const newName = editInputs[0].value;
          const newAmount = parseFloat(editInputs[2].value);
          const newType = editInputs[1].value;

          transactionToEdit.name = newName;
          transactionToEdit.amount = newAmount;
          transactionToEdit.type = newType;

          updateDisplay();
          saveToLocalStorage();
          updateUI();

          nameElement.innerHTML = `${nameValue}`;
          amountElement.innerHTML = `${
            transactionToEdit.action === "income" ? "+" : "-"
          }₹ ${parseFloat(amountValue)}`;
          typeElement.textContent = `${typeValue}`;

          transcationElement.removeChild(applyButton);
        });

        document.addEventListener("click", (event) => {
          if (!transcationElement.contains(event.target)) {
            nameElement.innerHTML = `${nameValue}`;
            amountElement.innerHTML = `${
              transactionToEdit.action === "income" ? "+" : "-"
            }₹ ${parseFloat(amountValue)}`;
            typeElement.textContent = `${typeValue}`;

            transcationElement.removeChild(applyButton);
          }
        });
      }
    }
  });

  resetBtn.addEventListener("click", () => {
    localStorage.removeItem("transcations");
    transcations = [];
    income = 0;
    expense = 0;
    updateUI();
  });
});
