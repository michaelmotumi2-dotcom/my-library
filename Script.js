"use strict";
const BOOKS = "libraryBooks";
const USERS = "libraryUsers";
const TRANS = "libraryTransactions";
const SESSION = "librarySession";
const defaultBooks = [
    {
        id: "b1",
        title: "Sesotho",
        author: "Nkabi",
        genre: "Language",
        isbn: "978-000000001",
        quantity: 5
    },
    {
        id: "b2",
        title: "English",
        author: "William",
        genre: "Language",
        isbn: "978-000000002",
        quantity: 5
    },
    {
        id: "b3",
        title: "Maths",
        author: "Motumi",
        genre: "Mathematics",
        isbn: "978-000000003",
        quantity: 5
    },
    {
        id: "b4",
        title: "Science",
        author: "James",
        genre: "Science",
        isbn: "978-000000004",
        quantity: 5
    },
    {
        id: "b5",
        title: "Economics",
        author: "John Smith",
        genre: "Economics",
        isbn: "978-000000005",
        quantity: 5
    },
    {
        id: "b6",
        title: "Information Technology",
        author: "Peter Brown",
        genre: "Information Technology",
        isbn: "978-000000006",
        quantity: 5
    },
    {
        id: "b7",
        title: "Business Studies",
        author: "Mary Johnson",
        genre: "Business",
        isbn: "978-000000007",
        quantity: 5
    }
];
function get(key, fallback = []) {
    try {
        const value = localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);
    } catch (error) {
        console.error("Storage read error:", error);
        return fallback;
    }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

if (!localStorage.getItem(BOOKS)) {
    save(BOOKS, defaultBooks);
}

if (!localStorage.getItem(USERS)) {
    save(USERS, []);
}

if (!localStorage.getItem(TRANS)) {
    save(TRANS, []);
}
const $ = id => document.getElementById(id);

const books = () => get(BOOKS, []);
const users = () => get(USERS, []);
const transactions = () => get(TRANS, []);
const currentUser = () => get(SESSION, null);
function createId(prefix) {
    return (
        prefix +
        Date.now() +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );
}
function createMemberId() {
    return (
        "MEM-" +
        Date.now().toString().slice(-6) +
        Math.floor(100 + Math.random() * 900)
    );
}

function createLibraryId() {
    return (
        "LIB-" +
        Date.now().toString().slice(-6) +
        Math.floor(100 + Math.random() * 900)
    );
}

function createAdminId() {
    return (
        "ADM-" +
        Date.now().toString().slice(-6) +
        Math.floor(100 + Math.random() * 900)
    );
}
function esc(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function message(element, text, type = "success") {
    const target = $(element);

    if (!target) {
        return;
    }

    target.textContent = text;
    target.className = `message ${type}`;

    setTimeout(() => {
        target.className = "message";
        target.textContent = "";
    }, 4000);
}
function loggedIn() {
    return !!currentUser();
}

function getRole() {
    return currentUser()?.role || null;
}

function isMember() {
    return getRole() === "Member";
}

function isLibrarian() {
    return getRole() === "Librarian";
}

function isAdmin() {
    return getRole() === "Admin";
}
function canBorrow() {
    return isMember();
}
function canLibrarianManageBooks() {
    return isLibrarian();
}
function canAdminManageBooks() {
    return isAdmin();
}

function canAdminManageUsers() {
    return isAdmin();
}


function canManageBooks() {
    return isAdmin() || isLibrarian();
}



function canAddStock() {
    return isAdmin() || isLibrarian();
}
if ($("showLogin")) {
    $("showLogin").onclick = () => {
        $("registerBox")?.classList.add("hidden");
        $("loginBox")?.classList.remove("hidden");
    };
}

if ($("showRegister")) {
    $("showRegister").onclick = () => {
        $("loginBox")?.classList.add("hidden");
        $("registerBox")?.classList.remove("hidden");
    };
}

const registrationRole =
    $("regRole");

if (registrationRole) {
    registrationRole.addEventListener(
        "change",
        updateRegistrationFields
    );

    updateRegistrationFields();
}
function updateRegistrationFields() {
    const role =
        $("regRole")?.value || "Member";

    const membershipLabel =
        $("regMembershipLabel");

    const membershipInput =
        $("regMembership");

    if (!membershipInput) {
        return;
    }

    if (role === "Member") {
        if (membershipLabel) {
            membershipLabel.textContent =
                "Membership ID";
        }

        membershipInput.placeholder =
            "Enter Membership ID";
    }

    if (role === "Librarian") {
        if (membershipLabel) {
            membershipLabel.textContent =
                "Library ID";
        }

        membershipInput.placeholder =
            "Enter Library ID";
    }

    if (role === "Admin") {
        if (membershipLabel) {
            membershipLabel.textContent =
                "Administration ID";
        }

        membershipInput.placeholder =
            "Enter Administration ID";
    }
}

if ($("registerForm")) {
    $("registerForm").onsubmit = e => {
        e.preventDefault();

        const name =
            $("regName")?.value.trim() || "";

        const suppliedId =
            $("regMembership")?.value.trim() || "";

        const password =
            $("regPassword")?.value || "";

        const role =
            $("regRole")?.value || "Member";

        if (!name) {
            message(
                "registerMessage",
                "Please enter your name.",
                "error"
            );
            return;
        }

        if (password.length < 4) {
            message(
                "registerMessage",
                "Password must be at least 4 characters.",
                "error"
            );
            return;
        }
const validRoles = [
            "Member",
            "Librarian",
            "Admin"
        ];

        if (!validRoles.includes(role)) {
            message(
                "registerMessage",
                "Invalid account type.",
                "error"
            );
            return;
        }

        const list = users();

       

        let accountId;

        if (role === "Member") {
            accountId =
                suppliedId ||
                createMemberId();
        }

        if (role === "Librarian") {
            accountId =
                suppliedId ||
                createLibraryId();
        }

        if (role === "Admin") {
            accountId =
                suppliedId ||
                createAdminId();
        }

        /*
            Make sure ID is unique.
        */

        const exists =
            list.some(
                user =>
                    String(
                        user.accountId
                    ).toLowerCase() ===
                    accountId.toLowerCase()
            );

        if (exists) {
            message(
                "registerMessage",
                "This ID is already registered. Please use another ID.",
                "error"
            );
            return;
        }

        /*
            Create account.
        */

        const newUser = {
            id: createId("user"),

            name: name,

            accountId: accountId,

            role: role,

            password: password,

            lastLogin: null,

            registeredAt:
                new Date().toLocaleString()
        };

        list.push(newUser);

        save(
            USERS,
            list
        );

        /*
            Clear registration form.
        */

        $("registerForm").reset();

        if ($("regRole")) {
            $("regRole").value = "Member";
        }

        updateRegistrationFields();

        /*
            Show generated/registered ID.
        */

        let roleName;

        if (role === "Member") {
            roleName = "Membership ID";
        }

        if (role === "Librarian") {
            roleName = "Library ID";
        }

        if (role === "Admin") {
            roleName = "Administration ID";
        }

        message(
            "registerMessage",
            `Registration successful. Your ${roleName} is ${accountId}. Please login.`,
            "success"
        );

        /*
            Automatically move to LOGIN.
        */

        setTimeout(() => {
            $("registerBox")?.classList.add(
                "hidden"
            );

            $("loginBox")?.classList.remove(
                "hidden"
            );

            /*
                Put the new ID into login.
            */

            if ($("loginMembership")) {
                $("loginMembership").value =
                    accountId;
            }

            if ($("loginPassword")) {
                $("loginPassword").value = "";
                $("loginPassword").focus();
            }

            /*
                Show correct login label.
            */

            updateLoginLabel(role);
        }, 1200);
    };
}

/* =========================================================
   LOGIN LABEL
========================================================= */

function updateLoginLabel(role) {
    const label =
        $("loginMembershipLabel");

    const input =
        $("loginMembership");

    if (!input) {
        return;
    }

    if (role === "Member") {
        if (label) {
            label.textContent =
                "Membership ID";
        }

        input.placeholder =
            "Enter Membership ID";
    }

    if (role === "Librarian") {
        if (label) {
            label.textContent =
                "Library ID";
        }

        input.placeholder =
            "Enter Library ID";
    }

    if (role === "Admin") {
        if (label) {
            label.textContent =
                "Administration ID";
        }

        input.placeholder =
            "Enter Administration ID";
    }
}

/* =========================================================
   LOGIN
========================================================= */

if ($("loginForm")) {
    $("loginForm").onsubmit = e => {
        e.preventDefault();

        const accountId =
            $("loginMembership")
                ?.value
                .trim() || "";

        const password =
            $("loginPassword")
                ?.value || "";

        if (!accountId || !password) {
            message(
                "loginMessage",
                "Please enter your ID and password.",
                "error"
            );
            return;
        }

        const list = users();

        /*
            Find account by its ID.
        */

        const user =
            list.find(
                account =>
                    String(
                        account.accountId
                    ).toLowerCase() ===
                        accountId.toLowerCase() &&
                    account.password ===
                        password
            );

        if (!user) {
            message(
                "loginMessage",
                "Invalid ID or password.",
                "error"
            );
            return;
        }

        /*
            Record login.
        */

        user.lastLogin =
            new Date().toLocaleString();

        save(
            USERS,
            list
        );

        /*
            Save session.
        */

        save(
            SESSION,
            user
        );

        /*
            OPEN THE CORRECT ROLE APPLICATION.
        */

        openApp(user);
    };
}

/* =========================================================
   OPEN APPLICATION
========================================================= */

function openApp(user) {
    if (!user) {
        return;
    }

    $("authScreen")?.classList.add(
        "hidden"
    );

    $("app")?.classList.remove(
        "hidden"
    );

    /*
        Show name + role + correct ID.
    */

    if ($("loggedUser")) {
        $("loggedUser").textContent =
            `${user.name} | ${user.role} | ${user.accountId}`;
    }


    applyRolePermissions();
 renderAll();

    if (user.role === "Member") {
        showPage("dashboard");
    }

    if (user.role === "Librarian") {
        showPage("books");
    }

    if (user.role === "Admin") {
        showPage("dashboard");
    }
}
function applyRolePermissions() {
    const user = currentUser();

    if (!user) {
        return;
    }

    const role =
        user.role;
    document
        .querySelectorAll(
            ".member-only"
        )
        .forEach(element => {
            element.style.display =
                "none";
        });

    document
        .querySelectorAll(
            ".librarian-only"
        )
        .forEach(element => {
            element.style.display =
                "none";
        });

    document
        .querySelectorAll(
            ".admin-only"
        )
        .forEach(element => {
            element.style.display =
                "none";
        });

    $("bookManagementCard")?.style.setProperty(
        "display",
        "none"
    );

    $("userManagementCard")?.style.setProperty(
        "display",
        "none"
    );

   

    document
        .querySelectorAll(
            ".nav-btn"
        )
        .forEach(button => {
            const page =
                button.dataset.page;

            

            if (page === "users") {
                button.style.display =
                    "none";
            }

            

            if (
                page === "books" &&
                role === "Member"
            ) {
                button.style.display =
                    "";
            }
        });

   
    if (role === "Member") {
        document
            .querySelectorAll(
                ".member-only"
            )
            .forEach(element => {
                element.style.display =
                    "";
            });


        if ($("bookManagementCard")) {
            $("bookManagementCard").style.display =
                "none";
        }

        if ($("addStockBtn")) {
            $("addStockBtn").style.display =
                "none";
        }

        if ($("borrowBtn")) {
            $("borrowBtn").style.display =
                "";
        }
    }

    if (role === "Librarian") {
        document
            .querySelectorAll(
                ".librarian-only"
            )
            .forEach(element => {
                element.style.display =
                    "";
            });

        

        if ($("bookManagementCard")) {
            $("bookManagementCard").style.display =
                "";
        }

        if ($("addStockBtn")) {
            $("addStockBtn").style.display =
                "";
        }

        if ($("borrowBtn")) {
            $("borrowBtn").style.display =
                "none";
        }
    }


    if (role === "Admin") {
        document
            .querySelectorAll(
                ".admin-only"
            )
            .forEach(element => {
                element.style.display =
                    "";
            });

       

        const usersNav =
            document.querySelector(
                '[data-page="users"]'
            );

        if (usersNav) {
            usersNav.style.display =
                "";
        }

        if ($("bookManagementCard")) {
            $("bookManagementCard").style.display =
                "";
        }

        if ($("userManagementCard")) {
            $("userManagementCard").style.display =
                "";
        }

        if ($("addStockBtn")) {
            $("addStockBtn").style.display =
                "";
        }


        if ($("borrowBtn")) {
            $("borrowBtn").style.display =
                "none";
        }
    }
}
if ($("logoutBtn")) {
    $("logoutBtn").onclick = () => {
        localStorage.removeItem(
            SESSION
        );

        $("app")?.classList.add(
            "hidden"
        );

        $("authScreen")?.classList.remove(
            "hidden"
        );

        $("loginBox")?.classList.remove(
            "hidden"
        );

        $("registerBox")?.classList.add(
            "hidden"
        );

        $("loginForm")?.reset();

        updateLoginLabel("Member");
    };
}
document
    .querySelectorAll(".nav-btn")
    .forEach(button => {
        button.onclick = () => {
            const page =
                button.dataset.page;

            if (
                page === "users" &&
                !isAdmin()
            ) {
                alert(
                    "Only Admins can manage users."
                );
                return;
            }
            if (
                page === "books" &&
                isMember()
            ) {
                

                showPage(page);
                return;
            }

            showPage(page);
        };
    });

function showPage(page) {


    if (
        page === "users" &&
        !isAdmin()
    ) {
        return;
    }

    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.page === page
            );
        });

    document
        .querySelectorAll(".page")
        .forEach(section => {
            section.classList.toggle(
                "active",
                section.id === page
            );
        });
}
function renderDashboard() {
    const list = books();

    if ($("totalBookTypes")) {
        $("totalBookTypes").textContent =
            list.length;
    }

    if ($("totalCopies")) {
        $("totalCopies").textContent =
            list.reduce(
                (sum, book) =>
                    sum +
                    Number(book.quantity),
                0
            );
    }

    if ($("lowStockBooks")) {
        $("lowStockBooks").textContent =
            list.filter(
                book =>
                    Number(book.quantity) < 2
            ).length;
    }

    if ($("totalUsers")) {
        if (isAdmin()) {
            $("totalUsers").textContent =
                users().length;
        } else {
            $("totalUsers").textContent =
                "—";
        }
    }

    if (!$("dashboardBooks")) {
        return;
    }

    $("dashboardBooks").innerHTML =
        list.length
            ? list
                  .map(
                      book => `
                <tr class="${
                    Number(book.quantity) < 2
                        ? "low-stock"
                        : ""
                }">

                    <td>
                        ${esc(book.title)}
                    </td>

                    <td>
                        ${esc(book.author)}
                    </td>

                    <td>
                        ${esc(book.genre)}
                    </td>

                    <td>
                        ${esc(book.isbn)}
                    </td>

                    <td>
                        <span class="stock-badge ${
                            Number(book.quantity) < 2
                                ? "low-badge"
                                : ""
                        }">
                            ${Number(book.quantity)}
                        </span>
                    </td>

                </tr>
            `
                  )
                  .join("")
            : `
                <tr>
                    <td colspan="5"
                        class="empty">
                        No books available.
                    </td>
                </tr>
            `;
}
function renderBooks() {
    if (!$("booksTable")) {
        return;
    }

    const list = books();

    $("booksTable").innerHTML =
        list.length
            ? list
                  .map(
                      book => `
                <tr class="${
                    Number(book.quantity) < 2
                        ? "low-stock"
                        : ""
                }">

                    <td>
                        ${esc(book.title)}
                    </td>

                    <td>
                        ${esc(book.author)}
                    </td>

                    <td>
                        ${esc(book.genre)}
                    </td>

                    <td>
                        ${esc(book.isbn)}
                    </td>

                    <td>
                        ${Number(book.quantity)}
                    </td>

                    <td>

                        ${
                            canManageBooks()
                                ? `
                            <div class="actions">

                                <button
                                    class="btn btn-warning"
                                    onclick="editBook('${book.id}')">
                                    Update
                                </button>

                                <button
                                    class="btn btn-danger"
                                    onclick="deleteBook('${book.id}')">
                                    Remove
                                </button>

                            </div>
                            `
                                : `
                            <span>
                                View only
                            </span>
                            `
                        }

                    </td>

                </tr>
            `
                  )
                  .join("")
            : `
                <tr>
                    <td colspan="6"
                        class="empty">
                        No books available.
                    </td>
                </tr>
            `;
}
if ($("bookForm")) {
    $("bookForm").onsubmit = e => {
        e.preventDefault();

        if (!canManageBooks()) {
            message(
                "bookMessage",
                "Only Admins and Librarians can manage books.",
                "error"
            );
            return;
        }

        const list = books();

        const editId =
            $("editBookId")?.value || "";

        const title =
            $("bookTitle")
                ?.value
                .trim() || "";

        const author =
            $("bookAuthor")
                ?.value
                .trim() || "";

        const genre =
            $("bookGenre")
                ?.value
                .trim() || "";

        const isbn =
            $("bookISBN")
                ?.value
                .trim() || "";

        const quantity =
            Number(
                $("bookQuantity")?.value
            );

        if (
            !title ||
            !author ||
            !genre ||
            !isbn ||
            !Number.isInteger(quantity) ||
            quantity < 0
        ) {
            message(
                "bookMessage",
                "Please enter valid book information.",
                "error"
            );
            return;
        }
        const duplicateISBN =
            list.some(
                book =>
                    String(book.isbn)
                        .toLowerCase() ===
                        isbn.toLowerCase() &&
                    book.id !== editId
            );

        if (duplicateISBN) {
            message(
                "bookMessage",
                "This ISBN already exists.",
                "error"
            );
            return;
        }
        if (editId) {
            const book =
                list.find(
                    b =>
                        b.id === editId
                );

            if (!book) {
                message(
                    "bookMessage",
                    "Book not found.",
                    "error"
                );
                return;
            }

            book.title =
                title;

            book.author =
                author;

            book.genre =
                genre;

            book.isbn =
                isbn;

            book.quantity =
                quantity;

            save(
                BOOKS,
                list
            );

            message(
                "bookMessage",
                `"${title}" updated successfully.`,
                "success"
            );
        }
        else {
            list.push({
                id: createId("book"),

                title:
                    title,

                author:
                    author,

                genre:
                    genre,

                isbn:
                    isbn,

                quantity:
                    quantity
            });

            save(
                BOOKS,
                list
            );

            message(
                "bookMessage",
                `"${title}" added successfully.`,
                "success"
            );
        }

        resetBookForm();

        renderAll();

        showPage("books");
    };
}
function editBook(bookId) {
    if (!canManageBooks()) {
        alert(
            "Only Admins and Librarians can update books."
        );
        return;
    }

    const book =
        books().find(
            b => b.id === bookId
        );

    if (!book) {
        return;
    }

    $("editBookId").value =
        book.id;

    $("bookTitle").value =
        book.title;

    $("bookAuthor").value =
        book.author;

    $("bookGenre").value =
        book.genre;

    $("bookISBN").value =
        book.isbn;

    $("bookQuantity").value =
        book.quantity;

    if ($("bookFormTitle")) {
        $("bookFormTitle").textContent =
            "Update Book";
    }

    if ($("saveBookBtn")) {
        $("saveBookBtn").textContent =
            "Update Book";
    }

    $("cancelBookEdit")?.classList.remove(
        "hidden"
    );

    showPage("books");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function deleteBook(bookId) {
    if (!canManageBooks()) {
        alert(
            "Only Admins and Librarians can remove books."
        );
        return;
    }

    const list = books();

    const book =
        list.find(
            b => b.id === bookId
        );

    if (!book) {
        return;
    }

    if (
        !confirm(
            `Remove "${book.title}" from the library?`
        )
    ) {
        return;
    }

    save(
        BOOKS,
        list.filter(
            b => b.id !== bookId
        )
    );

    message(
        "bookMessage",
        `"${book.title}" removed successfully.`,
        "success"
    );

    renderAll();

    showPage("books");
}
function resetBookForm() {
    $("bookForm")?.reset();

    if ($("editBookId")) {
        $("editBookId").value = "";
    }

    if ($("bookFormTitle")) {
        $("bookFormTitle").textContent =
            "Add New Book";
    }

    if ($("saveBookBtn")) {
        $("saveBookBtn").textContent =
            "Add Book";
    }

    $("cancelBookEdit")?.classList.add(
        "hidden"
    );
}

if ($("cancelBookEdit")) {
    $("cancelBookEdit").onclick =
        resetBookForm;
}function renderTransactionBooks() {
    if (!$("transactionBook")) {
        return;
    }

    const list = books();

    $("transactionBook").innerHTML =
        list.length
            ? list
                  .map(
                      book => `
                    <option value="${book.id}">
                        ${esc(book.title)}
                        — ${Number(
                            book.quantity
                        )} available
                    </option>
                `
                  )
                  .join("")
            : `
                <option value="">
                    No books available
                </option>
            `;
}
if ($("addStockBtn")) {
    $("addStockBtn").onclick = () => {
        if (!canAddStock()) {
            message(
                "transactionMessage",
                "Only Admins and Librarians can add stock.",
                "error"
            );
            return;
        }

        processTransaction(
            "Stock Added"
        );
    };
}

if ($("borrowBtn")) {
    $("borrowBtn").onclick = () => {
        if (!isMember()) {
            message(
                "transactionMessage",
                "Only Members can borrow books.",
                "error"
            );
            return;
        }

        processTransaction(
            "Borrowed"
        );
    };
}
function processTransaction(type) {
    const user =
        currentUser();

    if (!user) {
        return;
    }

    if (
        type === "Borrowed" &&
        !isMember()
    ) {
        message(
            "transactionMessage",
            "Only Members can borrow books.",
            "error"
        );
        return;
    }

    if (
        type === "Stock Added" &&
        !canAddStock()
    ) {
        message(
            "transactionMessage",
            "Only Admins and Librarians can add stock.",
            "error"
        );
        return;
    }

    const bookId =
        $("transactionBook")
            ?.value || "";

    const amount =
        Number(
            $("transactionQuantity")
                ?.value
        );

    if (
        !bookId ||
        !Number.isInteger(amount) ||
        amount < 1
    ) {
        message(
            "transactionMessage",
            "Select a book and enter a valid quantity.",
            "error"
        );
        return;
    }

    const list =
        books();

    const book =
        list.find(
            b => b.id === bookId
        );

    if (!book) {
        message(
            "transactionMessage",
            "Book not found.",
            "error"
        );
        return;
    }


    if (
        type === "Borrowed" &&
        Number(book.quantity) < amount
    ) {
        message(
            "transactionMessage",
            `Only ${Number(
                book.quantity
            )} copies available.`,
            "error"
        );
        return;
    }
if (
        type === "Stock Added"
    ) {
        book.quantity =
            Number(book.quantity) +
            amount;
    }

    if (
        type === "Borrowed"
    ) {
        book.quantity =
            Number(book.quantity) -
            amount;
    }

    save(
        BOOKS,
        list
    );

    /*
        Record transaction.
    */

    const history =
        transactions();

    history.unshift({
        id:
            createId(
                "transaction"
            ),

        date:
            new Date()
                .toLocaleString(),

        bookTitle:
            book.title,

        type:
            type,

        quantity:
            amount,

        performedBy:
            user.name,

        accountId:
            user.accountId,

        role:
            user.role,

        remainingStock:
            book.quantity
    });

    save(
        TRANS,
        history
    );

    if (
        type === "Borrowed"
    ) {
        message(
            "transactionMessage",
            `You borrowed ${amount} ${
                amount === 1
                    ? "copy"
                    : "copies"
            } of "${book.title}".`,
            "success"
        );
    }

    if (
        type === "Stock Added"
    ) {
        message(
            "transactionMessage",
            `${amount} ${
                amount === 1
                    ? "copy"
                    : "copies"
            } added to "${book.title}".`,
            "success"
        );
    }

    if ($("transactionQuantity")) {
        $("transactionQuantity").value =
            1;
    }

    renderAll();

    showPage(
        "transactions"
    );
}
function renderTransactions() {
    if (!$("transactionTable")) {
        return;
    }

    const all =
        transactions();

    let visible;

    

    if (isMember()) {
        const user =
            currentUser();

        visible =
            all.filter(
                transaction =>
                    transaction.accountId ===
                    user.accountId
            );
    }

    

    else if (isAdmin()) {
        visible = all;
    }


    else if (isLibrarian()) {
        visible = all;
    }

    else {
        visible = [];
    }

    $("transactionTable").innerHTML =
        visible.length
            ? visible
                  .map(
                      transaction => `
                    <tr>

                        <td>
                            ${esc(
                                transaction.date
                            )}
                        </td>

                        <td>
                            ${esc(
                                transaction.bookTitle
                            )}
                        </td>

                        <td>
                            <strong>
                                ${esc(
                                    transaction.type
                                )}
                            </strong>
                        </td>

                        <td>
                            ${Number(
                                transaction.quantity
                            )}
                        </td>

                        <td>
                            ${esc(
                                transaction.performedBy
                            )}
                        </td>

                        <td>
                            ${esc(
                                transaction.accountId
                            )}
                        </td>

                        <td>
                            ${Number(
                                transaction.remainingStock
                            )}
                        </td>

                    </tr>
                `
                  )
                  .join("")
            : `
                <tr>
                    <td colspan="7"
                        class="empty">
                        ${
                            isMember()
                                ? "You have no transactions yet."
                                : "No transactions recorded."
                        }
                    </td>
                </tr>
            `;
}
if ($("userForm")) {
    $("userForm").onsubmit = e => {
        e.preventDefault();

        if (!isAdmin()) {
            message(
                "userMessage",
                "Only Admins can manage users.",
                "error"
            );
            return;
        }

        const list =
            users();

        const editId =
            $("editUserId")
                ?.value || "";

        const name =
            $("userName")
                ?.value
                .trim() || "";

        const accountId =
            $("userMembership")
                ?.value
                .trim() || "";

        const role =
            $("userRole")
                ?.value || "Member";

        const password =
            $("userPassword")
                ?.value || "";

        if (
            !name ||
            !accountId
        ) {
            message(
                "userMessage",
                "Name and ID are required.",
                "error"
            );
            return;
        }

        const validRoles = [
            "Member",
            "Librarian",
            "Admin"
        ];

        if (
            !validRoles.includes(role)
        ) {
            message(
                "userMessage",
                "Invalid role.",
                "error"
            );
            return;
        }
        const duplicate =
            list.some(
                user =>
                    String(
                        user.accountId
                    ).toLowerCase() ===
                        accountId.toLowerCase() &&
                    user.id !== editId
            );

        if (duplicate) {
            message(
                "userMessage",
                "That ID is already registered.",
                "error"
            );
            return;
        }

        if (editId) {
            const user =
                list.find(
                    u =>
                        u.id ===
                        editId
                );

            if (!user) {
                return;
            }

            if (
                user.role === "Admin" &&
                role !== "Admin"
            ) {
                const adminCount =
                    list.filter(
                        u =>
                            u.role ===
                            "Admin"
                    ).length;

                if (
                    adminCount <= 1
                ) {
                    message(
                        "userMessage",
                        "You cannot remove the last Admin.",
                        "error"
                    );
                    return;
                }
            }

            user.name =
                name;

            user.accountId =
                accountId;

            user.role =
                role;

            if (password) {
                if (
                    password.length <
                    4
                ) {
                    message(
                        "userMessage",
                        "Password must be at least 4 characters.",
                        "error"
                    );
                    return;
                }

                user.password =
                    password;
            }

            /*
                Update current session.
            */

            if (
                currentUser()?.id ===
                user.id
            ) {
                save(
                    SESSION,
                    user
                );
            }

            message(
                "userMessage",
                "User updated successfully.",
                "success"
            );
        }

        else {
            if (
                password.length <
                4
            ) {
                message(
                    "userMessage",
                    "Password must be at least 4 characters.",
                    "error"
                );
                return;
            }

            list.push({
                id:
                    createId(
                        "user"
                    ),

                name:
                    name,

                accountId:
                    accountId,

                role:
                    role,

                password:
                    password,

                lastLogin:
                    null,

                registeredAt:
                    new Date()
                        .toLocaleString()
            });

            message(
                "userMessage",
                `${role} "${name}" created successfully.`,
                "success"
            );
        }

        save(
            USERS,
            list
        );

        resetUserForm();

        renderAll();

        showPage(
            "users"
        );
    };
}
function renderUsers() {
    if (!$("usersTable")) {
        return;
    }

    /*
        Only Admin can see users.
    */

    if (!isAdmin()) {
        $("usersTable").innerHTML = `
            <tr>
                <td colspan="6"
                    class="empty">
                    Admin only.
                </td>
            </tr>
        `;

        return;
    }

    const list =
        users();

    const session =
        currentUser();

    $("usersTable").innerHTML =
        list.length
            ? list
                  .map(
                      user => `
                <tr>

                    <td>
                        ${esc(
                            user.name
                        )}
                    </td>

                    <td>
                        ${esc(
                            user.accountId
                        )}
                    </td>

                    <td>
                        <span class="role-badge">
                            ${esc(
                                user.role
                            )}
                        </span>
                    </td>

                    <td>
                        ${
                            user.lastLogin
                                ? esc(
                                      user.lastLogin
                                  )
                                : "Never logged in"
                        }
                    </td>

                    <td>
                        ${
                            user.registeredAt
                                ? esc(
                                      user.registeredAt
                                  )
                                : "-"
                        }
                    </td>

                    <td>

                        <div class="actions">

                            <button
                                class="btn btn-warning"
                                onclick="editUser('${user.id}')">
                                Update
                            </button>

                            ${
                                session?.id ===
                                user.id
                                    ? `
                                <button
                                    class="btn btn-secondary"
                                    disabled>
                                    Current User
                                </button>
                                `
                                    : `
                                <button
                                    class="btn btn-danger"
                                    onclick="deleteUser('${user.id}')">
                                    Remove
                                </button>
                                `
                            }

                        </div>

                    </td>

                </tr>
            `
                  )
                  .join("")
            : `
                <tr>
                    <td colspan="6"
                        class="empty">
                        No users registered.
                    </td>
                </tr>
            `;
}
function editUser(userId) {
    if (!isAdmin()) {
        alert(
            "Only Admins can update users."
        );
        return;
    }

    const user =
        users().find(
            u =>
                u.id ===
                userId
        );

    if (!user) {
        return;
    }

    if ($("editUserId")) {
        $("editUserId").value =
            user.id;
    }

    if ($("userName")) {
        $("userName").value =
            user.name;
    }

    if ($("userMembership")) {
        $("userMembership").value =
            user.accountId;
    }

    if ($("userRole")) {
        $("userRole").value =
            user.role;
    }

    if ($("userPassword")) {
        $("userPassword").value =
            "";
    }

    if ($("userFormTitle")) {
        $("userFormTitle").textContent =
            "Update User";
    }

    $("cancelUserEdit")?.classList.remove(
        "hidden"
    );

    showPage(
        "users"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function deleteUser(userId) {
    if (!isAdmin()) {
        alert(
            "Only Admins can remove users."
        );
        return;
    }

    const list =
        users();

    const session =
        currentUser();

    const user =
        list.find(
            u =>
                u.id ===
                userId
        );

    if (!user) {
        return;
    }

    /*
        Admin cannot delete themselves.
    */

    if (
        session?.id ===
        userId
    ) {
        alert(
            "You cannot remove your current account."
        );
        return;
    }

    /*
        Protect last Admin.
    */

    const adminCount =
        list.filter(
            u =>
                u.role ===
                "Admin"
        ).length;

    if (
        user.role ===
            "Admin" &&
        adminCount <= 1
    ) {
        alert(
            "You cannot remove the last Admin."
        );
        return;
    }

    if (
        !confirm(
            `Remove ${user.role} "${user.name}"?`
        )
    ) {
        return;
    }

    save(
        USERS,
        list.filter(
            u =>
                u.id !==
                userId
        )
    );

    message(
        "userMessage",
        `${user.role} "${user.name}" removed successfully.`,
        "success"
    );

    renderAll();

    showPage(
        "users"
    );
}

function resetUserForm() {
    $("userForm")?.reset();

    if ($("editUserId")) {
        $("editUserId").value =
            "";
    }

    if ($("userFormTitle")) {
        $("userFormTitle").textContent =
            "Add New User";
    }

    $("cancelUserEdit")?.classList.add(
        "hidden"
    );
}

if ($("cancelUserEdit")) {
    $("cancelUserEdit").onclick =
        resetUserForm;
}

function renderAll() {
    renderDashboard();
    renderBooks();
    renderTransactionBooks();
    renderTransactions();
    renderUsers();
    applyRolePermissions();

    /*
        Update logged-in information.
    */

    const user =
        currentUser();

    if (
        user &&
        $("loggedUser")
    ) {
        $("loggedUser").textContent =
            `${user.name} | ${user.role} | ${user.accountId}`;
    }
}

const savedSession =
    currentUser();

if (savedSession) {
    const user =
        users().find(
            u =>
                u.id ===
                savedSession.id
        );

    if (user) {
        /*
            Refresh session from database.
        */

        save(
            SESSION,
            user
        );

        openApp(user);
    } else {
        localStorage.removeItem(
            SESSION
        );
    }
}

