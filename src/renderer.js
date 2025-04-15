// renderer.js
const { ipcRenderer } = require("electron");

function navigate(page) {
    document.getElementById("home").style.display = "none";
    document.getElementById("file").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById(page).style.display = "block";
}

async function openFile() {
    const fileContent = await ipcRenderer.invoke("dialog:openFile");
    if (fileContent) {
        document.getElementById("fileContent").value = fileContent;
        navigate("file"); // Показуємо текстове поле після відкриття файлу
    }
}

async function saveFile() {
    const fileContent = document.getElementById("fileContent").value;
    const filePath = await ipcRenderer.invoke("dialog:saveFile", fileContent);
    if (filePath) {
        alert("Файл збережено за адресою " + filePath);
    }
}
