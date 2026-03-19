// ==UserScript==
// @name         🐰RabbitScripts Loader
// @namespace    https://github.com/SEU-USUARIO
// @version      1.0
// @description  Loader oficial do pack RabbitScripts
// @author       RabbitScripts
// @match        https://*.tribalwars.com.br/*
// @grant        none
// @run-at       document-start
// @updateURL    https://github.com/jecler-dev/Rabbit/edit/main/tampermonkey/loader.user.js
// @downloadURL  https://github.com/jecler-dev/Rabbit/edit/main/tampermonkey/loader.user.js
// ==/UserScript==

(function () {
    "use strict";

    const BASE =
        "https://github.com/jecler-dev/Rabbit/edit/main/tampermonkey/loader.user.js";

    const scripts = [
        "autofarm_v2.user.js",
        "barra_plus.user.js",
        "painel_lateral.user.js",
        "radar_de_ataque.user.js"
    ];

    function loadScript(src) {
        const s = document.createElement("script");
        s.src = src + "?v=" + Date.now(); // força atualização
        s.async = false;
        document.head.appendChild(s);
    }

    scripts.forEach(file => loadScript(BASE + file));
})();
