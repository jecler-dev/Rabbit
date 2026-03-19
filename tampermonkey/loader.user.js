// ==UserScript==
// @name         🐰RabbitScripts Loader
// @namespace    https://github.com/jecler-dev
// @version      2.0
// @description  Loader oficial do pack RabbitScripts
// @match        https://*.tribalwars.com.br/*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/jecler-dev/Rabbit/main/tampermonkey/loader.user.js
// @downloadURL  https://raw.githubusercontent.com/jecler-dev/Rabbit/main/tampermonkey/loader.user.js
// ==/UserScript==

(function () {
"use strict";

const BASE =
"https://raw.githubusercontent.com/jecler-dev/Rabbit/main/tampermonkey/";

const scripts = [
    { name: "Auto Farm", file: "autofarm_v2.user.js" },
    { name: "Barra Plus", file: "barra_plus.user.js" },
    { name: "Painel Lateral", file: "painel_lateral.user.js" },
    { name: "Radar de Ataque", file: "radar_de_ataque.user.js" }
];

const STORAGE = "rabbit_enabled_scripts";

/* =============================
   BOTÃO LOADER
============================= */

const btn = document.createElement("div");
btn.innerHTML = "🐰";
btn.style = `
position:fixed;
right:10px;
top:200px;
width:40px;
height:40px;
background:#3a2a1a;
color:white;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
z-index:999999;
border:2px solid #7a4f2a;
border-radius:6px;
font-size:20px;
`;

document.body.appendChild(btn);

/* =============================
   PAINEL
============================= */

const panel = document.createElement("div");

panel.style = `
position:fixed;
right:60px;
top:180px;
background:#2b1d12;
color:#fff;
padding:10px;
z-index:999999;
border:2px solid #7a4f2a;
border-radius:6px;
display:none;
font-family:Verdana;
min-width:200px;
`;

panel.innerHTML = `<b>🐰 RabbitScripts</b><hr>`;
document.body.appendChild(panel);

btn.onclick = () => {
    panel.style.display =
        panel.style.display === "none" ? "block" : "none";
};

/* =============================
   CHECKBOX SCRIPTS
============================= */

let enabled =
JSON.parse(localStorage.getItem(STORAGE) || "[]");

scripts.forEach(script => {

    const line = document.createElement("div");

    const checked = enabled.includes(script.file)
        ? "checked"
        : "";

    line.innerHTML = `
        <label>
            <input type="checkbox" data-file="${script.file}" ${checked}>
            ${script.name}
        </label>
    `;

    panel.appendChild(line);
});

/* =============================
   SALVAR SELEÇÃO
============================= */

panel.addEventListener("change", () => {

    const selected = [
        ...panel.querySelectorAll("input:checked")
    ].map(i => i.dataset.file);

    localStorage.setItem(STORAGE, JSON.stringify(selected));

    location.reload();
});

/* =============================
   CARREGAR SCRIPTS
============================= */

function loadScript(file) {
    const s = document.createElement("script");
    s.src = BASE + file + "?v=" + Date.now();
    s.async = false;
    document.documentElement.appendChild(s);
}

enabled.forEach(loadScript);

})();
