// ==UserScript==
// @name         Raio de Ataque
// @version      1.0
// @match        https://*.tribalwars.com.br/*screen=map*
// @grant        none
// ==/UserScript==

(function(){
"use strict";

if(typeof TWMap === "undefined" || !TWMap.villages) return;

/* ================= CONFIG ================= */

const CONFIG = {
    minDelay: 800,
    maxDelay: 1600,
    maxCommands: 50
};

const STORAGE_CONFIG = "TW_ATTACK_CONFIG";

/* ================= VARIÁVEIS ================= */

const sourceX = game_data.village.x;
const sourceY = game_data.village.y;

let villages = TWMap.villages;
let targets = [];
let attackedCount = 0;
let running = false;
let queue = [];

/* ================= CONFIG SALVA ================= */

function loadConfig(){
    let cfg = JSON.parse(localStorage.getItem(STORAGE_CONFIG));
    return cfg || { min: 0, max: 20 };
}

function saveConfig(min, max){
    localStorage.setItem(STORAGE_CONFIG, JSON.stringify({ min, max }));
}

/* ================= FUNÇÕES ================= */

function distance(x1,y1,x2,y2){
    return Math.hypot(x1-x2,y1-y2);
}

function randomDelay(){
    return Math.floor(Math.random() * (CONFIG.maxDelay - CONFIG.minDelay) + CONFIG.minDelay);
}

function scanTargets(minRadius, maxRadius){

    targets = [];
    attackedCount = 0;

    for(let k in villages){

        let v = villages[k];
        let coords = TWMap.CoordByXY(k);

        if(v.owner === "0"){

            let d = distance(sourceX, sourceY, coords[0], coords[1]);

            if(d >= minRadius && d <= maxRadius){
                targets.push({ id: v.id, dist: d });
            }
        }
    }

    targets.sort((a,b)=>a.dist-b.dist);
    targets = targets.slice(0, CONFIG.maxCommands);

    updateStatus();
}

/* ================= ATAQUE ================= */

function sendAttack(village){

    let url = TWMap.urls.ctx["mp_farm_a"]
        .replace(/__village__/, village.id)
        .replace(/__source__/, game_data.village.id);

    TribalWars.get(url,null,function(){
        TWMap.context.ajaxDone(null,url);
        attackedCount++;
        updateStatus();
    });
}

function processQueue(){

    if(!running || queue.length === 0){
        running = false;
        $("#tw_attack_toggle").text("⚔️");
        return;
    }

    let village = queue.shift();
    sendAttack(village);

    setTimeout(processQueue, randomDelay());
}

function startAttacks(){

    let min = parseFloat($("#tw_min").val()) || 0;
    let max = parseFloat($("#tw_max").val()) || 20;

    saveConfig(min, max);

    if(targets.length === 0){
        scanTargets(min, max);
    }

    running = true;
    $("#tw_attack_toggle").text("🛑");

    queue = [...targets];
    processQueue();
}

function stopAttacks(){
    running = false;
    $("#tw_attack_toggle").text("⚔️");
    queue = [];
}

/* ================= UI (DIALOG) ================= */

function openDialog(){

    const cfg = loadConfig();

    let html = `
    <div style="text-align:center">
        <h3>Raio de Ataque PRO</h3>

        Min/Max:<br>
        <input id="tw_min" type="number" value="${cfg.min}" style="width:50px">
        <input id="tw_max" type="number" value="${cfg.max}" style="width:50px"><br><br>

        <div id="tw_found">Aldeias encontradas: 0</div>
        <div id="tw_attacked">Aldeias atacadas: 0</div><br>

        <button id="tw_scan">🔍 Escanear</button>
        <button id="tw_attack_toggle">⚔️</button>
    </div>
    `;

    Dialog.show("tw_attack", html);

    /* EVENTOS */

    $("#tw_scan").click(()=>{
        let min = parseFloat($("#tw_min").val()) || 0;
        let max = parseFloat($("#tw_max").val()) || 20;

        saveConfig(min, max);
        scanTargets(min, max);
    });

    $("#tw_attack_toggle").click(()=>{
        running ? stopAttacks() : startAttacks();
    });
}

/* ================= STATUS ================= */

function updateStatus(){
    $("#tw_found").text(`Aldeias encontradas: ${targets.length}`);
    $("#tw_attacked").text(`Aldeias atacadas: ${attackedCount}`);
}

/* ================= INIT ================= */

// botão pequeno no mapa pra abrir
let btn = document.createElement("button");
btn.innerText = "⚔️ Raio";
btn.style.position = "fixed";
btn.style.top = "100px";
btn.style.right = "20px";
btn.style.zIndex = 9999;
btn.style.padding = "6px";
btn.style.cursor = "pointer";

btn.onclick = openDialog;

document.body.appendChild(btn);

})();
