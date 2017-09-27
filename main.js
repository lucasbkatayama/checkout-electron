const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 900,
        width: 1400
    })

    // load the local HTML file
    let url = require('url').format({
        protocol: 'file',
        slashes: true,
        pathname: require('path').join(__dirname, 'index.html')
    })

    mainWindow.loadURL(url)
})
