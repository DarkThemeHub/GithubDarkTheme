const matchResult = window.location.href.match("^https?:\/\/(.*.)?(githubusercontent|github).(?!io).*");

if (matchResult.length !== null || matchResult.length > 0) {

    document.addEventListener("injectTheme", function (e) {
        inject();
    });

    document.addEventListener("removeTheme", function (e) {
        remove()
    });

    inject();
};

function inject() {
    var loadedTheme = document.getElementById("githubdarktheme");
    if (loadedTheme !== null && loadedTheme !== undefined) {
        loadedTheme.remove();
    }

    chrome.storage.local.get("GithubDarkThemeStorageV1", result => {
        const storageFile = result.GithubDarkThemeStorageV1;
        if (!storageFile.disabled) {
            var script = document.createElement("style");
            script.type = "text/css";
            script.id = "githubdarktheme";
            script.textContent = storageFile.theme;

            document.documentElement.appendChild(script);
        }
    });
};

function remove() {
    var script = document.getElementById("githubdarktheme");
    if (script !== null) {
        script.remove();
    };
};