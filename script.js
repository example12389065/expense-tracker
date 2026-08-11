let expenses =
    JSON.parse(
        localStorage.getItem("expenses")
    ) || [];


let budget =
    Number(
        localStorage.getItem("budget")
    ) || 0;


let editingIndex = -1;


/* ELEMENTS */

const descriptionInput =
    document.getElementById("description");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const addButton =
    document.getElementById("addButton");

const expenseList =
    document.getElementById("expenseList");

const totalDisplay =
    document.getElementById("total");

const expenseCount =
    document.getElementById("expenseCount");

const todayTotal =
    document.getElementById("todayTotal");

const searchInput =
    document.getElementById("search");

const filterCategory =
    document.getElementById("filterCategory");

const budgetDisplay =
    document.getElementById("budgetDisplay");

const budgetSpent =
    document.getElementById("budgetSpent");

const budgetRemaining =
    document.getElementById(
        "budgetRemaining"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

const budgetButton =
    document.getElementById(
        "budgetButton"
    );


/* DATE */

function getToday() {

    return new Date()
        .toISOString()
        .split("T")[0];
}


dateInput.value =
    getToday();


/* SAVE */

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}


function saveBudget() {

    localStorage.setItem(
        "budget",
        budget
    );
}


/* DASHBOARD */

function updateDashboard() {

    let total = 0;

    let todayAmount = 0;


    expenses.forEach(
        function(expense) {

            total += expense.amount;


            if (
                expense.date ===
                getToday()
            ) {

                todayAmount +=
                    expense.amount;
            }

        }
    );


    totalDisplay.textContent =
        "₹" + total;


    expenseCount.textContent =
        expenses.length;


    todayTotal.textContent =
        "₹" + todayAmount;


    /* BUDGET */

    budgetDisplay.textContent =
        "₹" + budget;


    budgetSpent.textContent =
        "₹" + total;


    const remaining =
        budget - total;


    if (remaining >= 0) {

        budgetRemaining.textContent =
            "₹" + remaining;

    } else {

        budgetRemaining.textContent =
            "-₹" +
            Math.abs(remaining);
    }


    /* PROGRESS */

    if (budget > 0) {

        let percentage =
            (total / budget) * 100;


        if (percentage > 100) {

            percentage = 100;
        }


        progressBar.style.width =
            percentage + "%";

    } else {

        progressBar.style.width =
            "0%";
    }
}


/* DISPLAY EXPENSES */

function displayExpenses() {

    expenseList.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        filterCategory.value;


    const filteredExpenses =
        expenses.filter(
            function(expense) {

                const matchesSearch =
                    expense.description
                        .toLowerCase()
                        .includes(
                            searchText
                        );


                const matchesCategory =
                    selectedCategory ===
                    "All" ||

                    expense.category ===
                    selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );
            }
        );


    if (
        filteredExpenses.length ===
        0
    ) {

        expenseList.innerHTML =
            '<div class="no-expenses">' +
            'No expenses found.' +
            '</div>';
    }


    filteredExpenses.forEach(
        function(expense) {

            const realIndex =
                expenses.indexOf(
                    expense
                );


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "expense-item";


            const top =
                document.createElement(
                    "div"
                );

            top.className =
                "expense-top";


            const name =
                document.createElement(
                    "div"
                );

            name.className =
                "expense-name";

            name.textContent =
                expense.description;


            const amount =
                document.createElement(
                    "div"
                );

            amount.className =
                "expense-amount";

            amount.textContent =
                "₹" + expense.amount;


            top.appendChild(name);

            top.appendChild(amount);


            const details =
                document.createElement(
                    "div"
                );

            details.className =
                "expense-details";

            details.textContent =
                expense.category +
                " • " +
                expense.date;


            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "actions";


            /* EDIT */

            const editButton =
                document.createElement(
                    "button"
                );

            editButton.className =
                "edit-button";

            editButton.textContent =
                "Edit";


            editButton.addEventListener(
                "click",
                function() {

                    descriptionInput.value =
                        expense.description;

                    amountInput.value =
                        expense.amount;

                    categoryInput.value =
                        expense.category;

                    dateInput.value =
                        expense.date;


                    editingIndex =
                        realIndex;


                    addButton.textContent =
                        "Update Expense";


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            );


            /* DELETE */

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.className =
                "delete-button";

            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                function() {

                    expenses.splice(
                        realIndex,
                        1
                    );


                    saveExpenses();

                    displayExpenses();

                    updateDashboard();
                }
            );


            actions.appendChild(
                editButton
            );

            actions.appendChild(
                deleteButton
            );


            item.appendChild(top);

            item.appendChild(details);

            item.appendChild(actions);


            expenseList.appendChild(item);

        }
    );


    updateDashboard();
}


/* ADD / UPDATE */

addButton.addEventListener(
    "click",
    function() {

        const description =
            descriptionInput.value
                .trim();

        const amount =
            Number(
                amountInput.value
            );

        const category =
            categoryInput.value;

        const date =
            dateInput.value;


        if (
            description === "" ||
            amount <= 0 ||
            date === ""
        ) {

            alert(
                "Please enter all details."
            );

            return;
        }


        if (
            editingIndex === -1
        ) {

            expenses.push({

                description:
                    description,

                amount:
                    amount,

                category:
                    category,

                date:
                    date
            });

        } else {

            expenses[
                editingIndex
            ] = {

                description:
                    description,

                amount:
                    amount,

                category:
                    category,

                date:
                    date
            };


            editingIndex = -1;


            addButton.textContent =
                "Add Expense";
        }


        saveExpenses();


        descriptionInput.value =
            "";

        amountInput.value =
            "";

        categoryInput.value =
            "Food";

        dateInput.value =
            getToday();


        displayExpenses();
    }
);


/* SEARCH */

searchInput.addEventListener(
    "input",
    function() {

        displayExpenses();
    }
);


/* FILTER */

filterCategory.addEventListener(
    "change",
    function() {

        displayExpenses();
    }
);


/* SET BUDGET */

budgetButton.addEventListener(
    "click",
    function() {

        const newBudget =
            prompt(
                "Enter your monthly budget:"
            );


        if (
            newBudget === null
        ) {

            return;
        }


        const value =
            Number(newBudget);


        if (
            value <= 0 ||
            isNaN(value)
        ) {

            alert(
                "Please enter a valid budget."
            );

            return;
        }


        budget = value;

        saveBudget();

        updateDashboard();
    }
);


/* START */

displayExpenses();

updateDashboard();