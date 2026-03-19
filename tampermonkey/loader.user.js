// ==UserScript==
// @name         🐰RabbitScripts Loader
// @namespace    https://github.com/jecler-dev
// @version      1.1
// @description  Loader oficial do pack RabbitScripts
// @author       RabbitScripts
// @match        https://*.tribalwars.com.br/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/jecler-dev/Rabbit/main/tampermonkey/loader.user.js
// @downloadURL  https://raw.githubusercontent.com/jecler-dev/Rabbit/main/tampermonkey/loader.user.js
// ==/UserScript==

(function () {
    "use strict";

    const BASE =
        "https://raw.githubusercontent.com/jecler-dev/Rabbit/main/tampermonkey/";

    const scripts = [
    "loader_status.user.js", // 👈 coloque PRIMEIRO
    "autofarm_v2.user.js",
    "barra_plus.user.js",
    "painel_lateral.user.js",
    "radar_de_ataque.user.js"
];

    function loadScript(file) {
        const s = document.createElement("script");
        s.src = BASE + file + "?v=" + Date.now();
        s.async = false;
        document.documentElement.appendChild(s);
    }

    scripts.forEach(loadScript);
})();
