const params = new URLSearchParams(window.location.search)
const siteId = params.get("siteId")
const categoryId = params.get("catId")
if (!categoryId) {
    Swal.fire({
        title: "Error",
        text: "Category ID is missing",
        icon: "error",
        draggable: true
    }).then(() => {
        window.location.href = "index.html";
    })
}

const btnSave = document.getElementById("btn-save")
const btnCancel = document.getElementById("btn-cancel")
const inputUrl = document.getElementById("url")
const inputUser = document.getElementById("user")
const inputPassword = document.getElementById("password")
const description = document.getElementById("description")
const btnAleatory = document.getElementById("btn-aleatory")



if (btnCancel) {
    btnCancel.addEventListener("click", () => {
        window.location.href = "index.html"
    })
}


btnSave.addEventListener("click", () => {
    const urlValue = inputUrl.value.trim()
    const userValue = inputUser.value.trim()
    const passwordValue = inputPassword.value.trim()
    const descriptionValue = description.value.trim();

    if (urlValue === "" || userValue === "" || passwordValue === "") {
        Swal.fire({
            title: "Warning",
            text: "There are some empty fields",
            icon: "warning",
            draggable: true
        }); return
    }

    const dataToSend = {
        name: urlValue,
        url: urlValue,
        user: userValue,
        password: passwordValue,
        description: descriptionValue,
    }

    fetch(`http://localhost:3000/categories/${categoryId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("Error")
            }
        })

        .then(() => {
            Swal.fire({
                title: "Saved!",
                text: "Site added successfully",
                icon: "success",
                draggable: true
            }).then((result) => {
                window.location.href = "index.html"
            });
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to save the site",
                icon: "error",
                draggable: true
            });
        });
})

function generateAleatoryPassword(length = 8) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

if (btnAleatory) {
    btnAleatory.addEventListener("click", () => {
        const newPassword = generateAleatoryPassword(8)
        inputPassword.value = newPassword
    })
}

function emptyFields(input) {
    if (input.value.trim() === "") {
        input.classList.add("is-invalid")
        input.classList.remove("is-valid")
    } else {
        input.classList.remove("is-invalid")
        input.classList.add("is-valid")
    }
}


inputUrl.addEventListener("blur", () => emptyFields(inputUrl));
inputUser.addEventListener("blur", () => emptyFields(inputUser));
inputPassword.addEventListener("blur", () => emptyFields(inputPassword));
