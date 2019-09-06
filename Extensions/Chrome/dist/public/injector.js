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

    //var data = () => { await getStyle(version) };


}

document.addEventListener('injectTheme', function (e) {
    inject();
});

document.addEventListener('injectCSS', function (e) {
    var data = e.detail;
    console.log('received', data);

    chrome.storage.local.get('storageFile', (result) => {
        const storageFile = result.storageFile;
        console.log(storageFile);
        data = fetch(`https://raw.githubusercontent.com/acoop133/GithubDarkTheme/${storageFile.version}/Theme.css`).then(response => response.text()).then(css => css)

    });


    var script = document.createElement('style');
    script.type = 'text/css'
    script.id = 'githubdarktheme'
    script.textContent = data;

    (document.head || document.documentElement).appendChild(script);

});


document.addEventListener('removeCSS', function (e) {
    var script = document.getElementById("githubdarktheme")
    script.remove();
})
