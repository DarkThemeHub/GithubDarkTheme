document.addEventListener('injectCSS', function (e) {
    var data = e.detail;
    console.log('received', data);

    var script = document.createElement('style');
    script.type = 'text/css'
    script.id = 'acoopdarktheme'
    script.textContent = data;
    (document.head || document.documentElement).appendChild(script);

});


document.addEventListener('removeCSS', function (e) {
    var script = document.getElementById("acoopdarktheme")
    script.remove();
})