
const btnSave = document.getElementById("btn-save-category")
const inputCat = document.getElementById("cat-name")
const searchInput = document.getElementById("search-input")
const inputIconCat = document.getElementById("cat-icon")
let allCategories = []
let currentSites = []
let activeCategoryId = null


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
    const iconCategory = inputIconCat.value

    console.log("1. Nombre escrito:", nameCategory);
    console.log("2. Icono escrito:", iconCategory);
    console.log("3. Input del icono (elemento):", inputIconCat);

    if (nameCategory === "") {
        Swal.fire({
            title: "Oops!",
            text: "The name couldn't be empty",
            icon: "error",
            draggable: true
        });
        return
    }

    let finalName = nameCategory
    if (iconCategory) {
        finalName = `${iconCategory} ${nameCategory}`
    }

    const dataToSend = { name: finalName }
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
            inputIconCat.value = ""
            listCategories()
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to save the category",
                icon: "error",
                draggable: true
            });
        });

})

function deleteCategory(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this! The sites associated will be deleted too.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:3000/categories/${id}`, {
                method: "DELETE"
            })
                .then(response => {
                    if (response.ok) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your category has been deleted.",
                            icon: "success"
                        });
                        listCategories()
                    } else {
                        throw new Error("Error to delete")
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    Swal.fire("Error", "Couldn't delete the category", "error");
                });
        }
    });
}


function listSites(categoryId) {
    activeCategoryId = categoryId

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
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this site!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:3000/sites/${siteId}`, {
                method: "DELETE"
            })
                .then(response => {
                    if (response.ok) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "The site has been deleted.",
                            icon: "success"
                        });
                        listSites(categoryId)
                    } else {
                        throw new Error("Error to delete")
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    Swal.fire("Error", "Couldn't delete the site", "error");
                });
        }
    });
}

function renderCategories(list) {
    const container = document.getElementById("category-list")
    container.innerHTML = ""
    list.forEach(category => {
        const li = document.createElement("li")
        li.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        li.dataset.id = category.id
        const iconDisplay = category.icon ? category.icon : "📁"
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
            deleteSite(site.id, activeCategoryId)
        })

        const btnOpen = row.querySelector(".btn-open")
        btnOpen.addEventListener("click", () => {
            window.open(site.url, '_blank')
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


