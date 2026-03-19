// ==UserScript==
// @name         🐰RabbitScripts Loader
// @namespace    https://github.com/SEU-USUARIO
// @version      1.0
// @description  Loader oficial do pack RabbitScripts
// @author       RabbitScripts
// @match        https://*.tribalwars.com.br/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/SEU-USUARIO/Rabbit/main/loader.user.js
// @downloadURL  https://raw.githubusercontent.com/SEU-USUARIO/Rabbit/main/loader.user.js
// ==/UserScript==

(function () {
    "use strict";

    const BASE =
        "https://raw.githubusercontent.com/SEU-USUARIO/Rabbit/main/scripts/";

    const scripts = [
        "radar.user.js",
        "quickbar.user.js",
        "sniper.user.js"
    ];

    function loadScript(src) {
        const s = document.createElement("script");
        s.src = src + "?v=" + Date.now(); // força atualização
        s.async = false;
        document.head.appendChild(s);
    }

    scripts.forEach(file => loadScript(BASE + file));
})();
