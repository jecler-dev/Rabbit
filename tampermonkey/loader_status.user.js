// ==UserScript==
// @name         🐰RabbitScripts - Loader Status
// @namespace    https://github.com/jecler-dev
// @version      1.0
// @description  Indicador visual que o Loader foi carregado
// @match        https://*.tribalwars.com.br/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // evita duplicar
    if (document.getElementById("rabbit_loader_status")) return;

    const panel = document.createElement("div");
    panel.id = "rabbit_loader_status";

    panel.innerHTML = `
        <div style="
            font-family: Verdana;
            font-size:12px;
            color:white;
            text-align:center;
        ">
            🐰 RabbitScripts<br>
            <b>Loader carregado ✅</b>
        </div>
    `;

    panel.style.cssText = `
        position:fixed;
        right:10px;
        top:120px;
        z-index:999999;
        background:linear-gradient(180deg,#2e9b45,#1f6f31);
        border:2px solid #0f3f1a;
        border-radius:8px;
        padding:10px 14px;
        box-shadow:0 0 10px rgba(0,0,0,.4);
        cursor:move;
        user-select:none;
    `;

    document.body.appendChild(panel);

    /* ===== DRAG ===== */

    let dragging = false;
    let offsetX, offsetY;

    panel.addEventListener("mousedown", e => {
        dragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
    });

    document.addEventListener("mousemove", e => {
        if (!dragging) return;
        panel.style.left = (e.clientX - offsetX) + "px";
        panel.style.top = (e.clientY - offsetY) + "px";
        panel.style.right = "auto";
    });

    document.addEventListener("mouseup", () => dragging = false);

})();
