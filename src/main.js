// main.js
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile("./src/pages/index.html");

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (mainWindow === null) createWindow();
});

// Робота з файлами через Node.js
ipcMain.handle("dialog:openFile", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Text Files", extensions: ["txt"] }],
    });

    if (canceled) return;
    const filePath = filePaths[0];
    return fs.promises.readFile(filePath, "utf-8");
});

ipcMain.handle("dialog:saveFile", async (event, data) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        title: "Save File",
        defaultPath: path.join(__dirname, "untitled.txt"),
        filters: [{ name: "Text Files", extensions: ["txt"] }],
    });

    if (canceled) return;
    await fs.promises.writeFile(filePath, data);
    return filePath;
});
