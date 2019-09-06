inject();

function inject() {

    var loadedTheme = document.getElementById("githubdarktheme")
    if (loadedTheme !== null && loadedTheme !== undefined) {

        loadedTheme.remove();
    }

    chrome.storage.local.get('storageFile', (result) => {
        const storageFile = result.storageFile;

        var script = document.createElement('style');
        script.type = 'text/css'
        script.id = 'githubdarktheme'
        script.textContent = storageFile.theme;

        (document.body || document.documentElement).appendChild(script);
    });
}

document.addEventListener('injectTheme', function (e) {
    inject();
});


document.addEventListener('removeTheme', function (e) {
    var script = document.getElementById("githubdarktheme")
    script.remove();
})
