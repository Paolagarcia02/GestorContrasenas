
const btnSave = document.getElementById("btn-save-category")
const inputCat = document.getElementById("cat-name")
const searchInput = document.getElementById("search-input")
let allCategories = []
let currentSites = []


function listCategories() {

    fetch("http://localhost:3000/categories")
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("Server Error")
            }
        })
        .then(data => {
            allCategories = data
            renderCategories(allCategories)
        })

        .catch(error => {
            console.error("Something was wrong:", error)
        })
}
listCategories()

btnSave.addEventListener("click", function () {
    const nameCategory = inputCat.value
    if (nameCategory === "") {
        alert("The name couldn't be empty")
        return
    }
    const dataToSend = { name: nameCategory }
    fetch("http://localhost:3000/categories", {
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
        .then(data => {
            console.log("Category created:", data)
            inputCat.value = ""
            listCategories()
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed when you save it");
        });

})

function deleteCategory(id) {
    const Confirm = confirm("Are you sure that you want to delete this category? The sites asociated will be delete too")
    if (!Confirm) {
        return
    }
    fetch(`http://localhost:3000/categories/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                alert("Category deleted")
                listCategories()
            } else {
                throw new Error("Error to delete")
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Couldn't be deleted the category");
        });
}


function listSites(categoryId) {
    fetch(`http://localhost:3000/categories/${categoryId}`)

        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("Server Error")
            }
        })

        .then(data => {
            currentSites = data.sites
            renderSites(currentSites)
        })

        .catch(error => {
            console.error("Something was wrong:", error)
        })
}

function deleteSite(siteId, categoryId) {
    const Confirm = confirm("Are you sure that you want to delete this site?")
    if (!Confirm) {
        return
    }
    fetch(`http://localhost:3000/sites/${siteId}`, {
        method: "DELETE"
    })

        .then(response => {
            if (response.ok) {
                listSites(categoryId)
            } else {
                throw new Error("Error to delete")
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Couldn't be deleted the site");
        });
}

function renderCategories(list) {
    const container = document.getElementById("category-list")
    container.innerHTML = ""
    list.forEach(category => {
        const li = document.createElement("li")
        li.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        li.dataset.id = category.id
        const span = document.createElement('span')
        span.textContent = category.name
        const btnDelete = document.createElement('button')
        btnDelete.className = "btn btn-sm btn-delete"
        btnDelete.textContent = "❌"

        btnDelete.addEventListener("click", (event) => {
            event.stopPropagation()
            deleteCategory(category.id)
        })

        li.addEventListener("click", () => {
            document.querySelectorAll(".list-group-item").forEach(i => i.classList.remove("active"))
            li.classList.add("active")
            listSites(category.id)

            const btnAdd = document.getElementById("btn-add-site")
            btnAdd.href = `detail.html?catId=${category.id}`
        })

        li.appendChild(span)
        li.appendChild(btnDelete)

        container.appendChild(li)
    })


}

function renderSites(list) {
    const table = document.getElementById("site-list")
    table.innerHTML = ""
    list.forEach(site => {
        const row = document.createElement("tr")
        row.innerHTML = `
                    <td>${site.name}</td>
                    <td>${site.user}</td>
                    <td>${site.createdAt}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-open">📂</button>
                        <button class="btn btn-sm btn-outline-danger btn-delete">❌</button>
                        <button class="btn btn-sm btn-outline-warning btn-edit">✏️</button>
                    </td>
                    `;


        const btnDelete = row.querySelector(".btn-delete")
        btnDelete.addEventListener("click", () => {
            deleteSite(site.id, categoryId)
        })

        table.appendChild(row)
    })
}

function filterAll() {
    const searchText = searchInput.value.toLowerCase()
    const filteredCategories = allCategories.filter(category =>
        category.name.toLowerCase().includes(searchText)
    )
    renderCategories(filteredCategories)

    const filteredSites = currentSites.filter(site =>
        site.name.toLowerCase().includes(searchText) ||
        site.user.toLowerCase().includes(searchText)
    )
    renderSites(filteredSites)
}
searchInput.addEventListener("input", filterAll)


