// ==UserScript==
// @name         🐰RabbitScripts🐰 - Radar de Ataque (Painel Lateral)
// @namespace    https://github.com/SEU-USUARIO
// @version      1.0
// @description  Busca aldeias por raio/distância e envia ataques automaticamente via painel lateral
// @author       RabbitScripts
// @match        https://*.tribalwars.com.br/*screen=map*
// @grant        none
// @run-at       document-end
// @downloadURL  https://github.com/jecler-dev/Rabbit/raw/refs/heads/main/tampermonkey/radar_de_ataque.user.js
// @updateURL    https://github.com/jecler-dev/Rabbit/raw/refs/heads/main/tampermonkey/radar_de_ataque.user.js
// ==/UserScript==

(function () {
"use strict";

/* ================= CONFIG ================= */

const CONFIG = {
    minDelay: 900,
    maxDelay: 1700,
    batchSize: 50,
    batchPause: 8000
};

const STORAGE_CONFIG="TW_ATTACK_CONFIG";

/* ================= WAIT MAP ================= */

function wait(cb){
    let i=setInterval(()=>{
        if(window.TWMap && window.$ && window.game_data){
            clearInterval(i);
            cb();
        }
    },500);
}

wait(init);

/* ================= INIT ================= */

function init(){

let targets=[];
let attackedCount=0;
let running=false;
let queue=[];
let batchCounter=0;

/* ================= STORAGE ================= */

function loadConfig(){
    return JSON.parse(localStorage.getItem(STORAGE_CONFIG))
        || {min:0,max:20};
}

function saveConfig(min,max){
    localStorage.setItem(STORAGE_CONFIG,
        JSON.stringify({min,max}));
}

/* ================= UTILS ================= */

function distance(x1,y1,x2,y2){
    return Math.hypot(x1-x2,y1-y2);
}

function randomDelay(){
    return Math.floor(
        Math.random()*
        (CONFIG.maxDelay-CONFIG.minDelay)
        + CONFIG.minDelay
    );
}

/* ================= SCAN ================= */

function scanTargets(minRadius,maxRadius){

    targets=[];
    attackedCount=0;

    const sx=game_data.village.x;
    const sy=game_data.village.y;

    for(let k in TWMap.villages){

        let v=TWMap.villages[k];
        let coords=TWMap.CoordByXY(k);

        if(v.owner==="0"){

            let d=distance(sx,sy,coords[0],coords[1]);

            if(d>=minRadius && d<=maxRadius){
                targets.push({id:v.id,dist:d});
            }
        }
    }

    targets.sort((a,b)=>a.dist-b.dist);

    updateStatus();
}

/* ================= ATAQUE ================= */

function sendAttack(village){

    let url=TWMap.urls.ctx["mp_farm_a"]
        .replace("__village__",village.id)
        .replace("__source__",game_data.village.id);

    TribalWars.get(url,null,function(){
        TWMap.context.ajaxDone(null,url);
        attackedCount++;
        updateStatus();
    });
}

/* ================= FILA ================= */

function processQueue(){

    if(!running || queue.length===0){
        finish();
        return;
    }

    if(batchCounter>=CONFIG.batchSize){

        batchCounter=0;
        setStatus("⏳ Pausa entre lotes...");

        setTimeout(processQueue,CONFIG.batchPause);
        return;
    }

    let village=queue.shift();

    sendAttack(village);
    batchCounter++;

    setTimeout(processQueue,randomDelay());
}

function finish(){
    running=false;
    $("#tw_attack_toggle").text("⚔️");
    setStatus("✅ Finalizado");
}

/* ================= CONTROLE ================= */

function startAttacks(){

    let min=parseFloat($("#tw_min").val())||0;
    let max=parseFloat($("#tw_max").val())||20;

    saveConfig(min,max);

    if(targets.length===0)
        scanTargets(min,max);

    queue=[...targets];
    running=true;
    batchCounter=0;

    $("#tw_attack_toggle").text("🛑");
    setStatus("🚀 Atacando...");

    processQueue();
}

function stopAttacks(){
    running=false;
    queue=[];
    $("#tw_attack_toggle").text("⚔️");
    setStatus("⛔ Parado");
}

/* ================= UI ================= */

function createPanel(){

if($("#tw_sidepanel").length) return;

const cfg=loadConfig();

$("body").append(`
<div id="tw_sidepanel">
    <div id="tw_header">⚔️ Raio ULTRA</div>

    Min/Max:<br>
    <input id="tw_min" type="number" value="${cfg.min}">
    <input id="tw_max" type="number" value="${cfg.max}">

    <br><br>

    <div id="tw_found">Aldeias encontradas: 0</div>
    <div id="tw_attacked">Aldeias atacadas: 0</div>
    <div id="tw_status">Idle</div>

    <br>

    <button id="tw_scan">🔍 Escanear</button>
    <button id="tw_attack_toggle">⚔️</button>
</div>
`);

$("<style>").text(`
#tw_sidepanel{
position:fixed;
top:80px;
right:0;
width:220px;
background:#f4e4bc;
border-left:3px solid #6b4f2a;
padding:10px;
z-index:9999;
font-size:12px;
box-shadow:-3px 0 8px rgba(0,0,0,0.3);
}

#tw_header{
font-weight:bold;
margin-bottom:8px;
text-align:center;
}

#tw_sidepanel input{
width:60px;
margin:2px;
}

#tw_sidepanel button{
width:100%;
margin-top:4px;
cursor:pointer;
}
`).appendTo("head");

/* eventos */

$("#tw_scan").click(()=>{
    scanTargets(
        parseFloat($("#tw_min").val())||0,
        parseFloat($("#tw_max").val())||20
    );
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

function setStatus(t){
    $("#tw_status").text(t);
}

/* ================= BOTÃO ================= */

let btn=document.createElement("button");

btn.innerText="⚔️ Raio";
btn.style.position="fixed";
btn.style.top="120px";
btn.style.right="20px";
btn.style.zIndex=9999;
btn.style.padding="6px 10px";
btn.style.background="#6b4f2a";
btn.style.color="#fff";
btn.style.border="1px solid #3a2a12";
btn.style.cursor="pointer";

btn.onclick=createPanel;

document.body.appendChild(btn);

}

})();
