const params = new URLSearchParams(window.location.search)
const categoryId = params.get("catId")
if (!categoryId) {
    alert("Error");
    window.location.href = "index.html"; 
}

const btnSave = document.getElementById("btn-save")
const btnCancel = document.getElementById("btn-cancel")
const inputUrl = document.getElementById("url")
const inputUser = document.getElementById("user")
const inputPassword = document.getElementById("password")
const description = document.getElementById("description")

if (btnCancel){
btnCancel.addEventListener("click", () => {
    window.location.href = "index.html"
})
}


btnSave.addEventListener("click", () => {
    const urlValue= inputUrl.value.trim()
    const userValue= inputUser.value.trim()
    const passwordValue= inputPassword.value.trim()
    const descriptionValue = description.value.trim();

    if(urlValue === "" || userValue === "" || passwordValue === ""){
        alert("There are some field empty")
        return
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
        window.location.href = "index.html"
    })
    .catch(error => {
            console.error("Error:", error);
            alert("Failed when you save it");
        });

})