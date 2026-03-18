// ==UserScript==
// @name         RabbitScrips - Raio de Ataque
// @version      1.0
// @match        https://*.tribalwars.com.br/*screen=map*
// ==/UserScript==

(function(){
"use strict";

if(typeof TWMap === "undefined" || !TWMap.villages) return;

const sourceX = game_data.village.x;
const sourceY = game_data.village.y;

let minRadius = 0;
let maxRadius = 20;
const tempoBase = 300;

let villages = TWMap.villages;
let targets = [];
let attackedCount = 0;
let running = false;
let timeoutHandles = [];

const STORAGE_KEY = "TW_ATTACK_PANEL_POS";

/* ================= FUNÇÕES ================= */

function distance(x1,y1,x2,y2){
    return Math.hypot(x1-x2,y1-y2);
}

function scanTargets(){

    minRadius = parseFloat(minInput.value) || 0;
    maxRadius = parseFloat(maxInput.value) || 20;

    targets = [];
    attackedCount = 0;

    for(let k in villages){

        let v = villages[k];
        let coords = TWMap.CoordByXY(k);

        if(v.owner === "0"){

            let d = distance(
                sourceX,sourceY,
                coords[0],coords[1]
            );

            if(d >= minRadius && d <= maxRadius){
                targets.push({
                    id:v.id,
                    x:coords[0],
                    y:coords[1],
                    dist:d
                });
            }
        }
    }

    targets.sort((a,b)=>a.dist-b.dist);

    updateStatus();
}

function updateStatus(){

    foundDiv.textContent =
        `Aldeias encontradas: ${targets.length}`;

    attackedDiv.textContent =
        `Aldeias atacadas: ${attackedCount} / ${targets.length}`;
}

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

/* ================= ATAQUES ================= */

function toggleAttacks(){
    running ? stopAttacks() : startAttacks();
}

function startAttacks(){

    running=true;
    toggleBtn.textContent="🛑";

    timeoutHandles.forEach(clearTimeout);
    timeoutHandles=[];

    if(targets.length===0) scanTargets();

    targets.forEach((village,index)=>{

        let delay =
            tempoBase*index +
            Math.random()*400;

        let handle=setTimeout(()=>{
            if(running) sendAttack(village);
        },delay);

        timeoutHandles.push(handle);
    });
}

function stopAttacks(){

    running=false;
    toggleBtn.textContent="⚔️";

    timeoutHandles.forEach(clearTimeout);
    timeoutHandles=[];
}

/* ================= PAINEL ================= */

let panel=document.createElement("div");
panel.style.position="fixed";
panel.style.top="120px";
panel.style.right="20px";
panel.style.width="180px";
panel.style.background="#cbb07a";
panel.style.border="2px solid #8a7039";
panel.style.borderRadius="6px";
panel.style.padding="10px";
panel.style.fontFamily="Arial";
panel.style.textAlign="center";
panel.style.zIndex=9999;
panel.style.cursor="move";

document.body.appendChild(panel);

/* ===== RESTAURAR POSIÇÃO SALVA ===== */

const savedPos = localStorage.getItem(STORAGE_KEY);
if(savedPos){
    const pos = JSON.parse(savedPos);
    panel.style.left = pos.left;
    panel.style.top = pos.top;
    panel.style.right = "auto";
}

/* BOTÃO FECHAR */

let closeBtn=document.createElement("div");
closeBtn.textContent="✖";
closeBtn.style.position="absolute";
closeBtn.style.top="2px";
closeBtn.style.right="6px";
closeBtn.style.fontSize="12px";
closeBtn.style.cursor="pointer";
closeBtn.style.fontWeight="bold";

closeBtn.onclick=()=>panel.remove();

panel.appendChild(closeBtn);

/* TÍTULO */

let title=document.createElement("div");
title.textContent="Raio de Ataque";
title.style.fontWeight="bold";
title.style.marginBottom="8px";
panel.appendChild(title);

/* INPUTS (ALTERADO VISUAL) */

let radiusBox=document.createElement("div");
radiusBox.style.marginBottom="10px";

radiusBox.innerHTML=`
Min./Max.:
<input id="minR" type="number" value="${minRadius}" style="width:40px">
<input id="maxR" type="number" value="${maxRadius}" style="width:40px">
`;

panel.appendChild(radiusBox);

let minInput=document.getElementById("minR");
let maxInput=document.getElementById("maxR");

/* STATUS */

let foundDiv=document.createElement("div");
let attackedDiv=document.createElement("div");

panel.appendChild(foundDiv);
panel.appendChild(attackedDiv);

/* BOTÕES */

let btnContainer=document.createElement("div");
btnContainer.style.marginTop="10px";
btnContainer.style.display="flex";
btnContainer.style.justifyContent="center";
btnContainer.style.gap="8px";
panel.appendChild(btnContainer);

function makeBtn(text,title,action){
    let b=document.createElement("button");
    b.textContent=text;
    b.title=title;
    b.style.width="50px";
    b.style.height="32px";
    b.style.borderRadius="5px";
    b.style.border="1px solid #8a7039";
    b.style.background="#e3d4a6";
    b.style.cursor="pointer";
    b.onclick=action;
    btnContainer.appendChild(b);
    return b;
}

makeBtn("🔍","Escanear aldeias",scanTargets);
let toggleBtn=makeBtn("⚔️","Iniciar/Parar ataques",toggleAttacks);

/* ================= ARRASTAR + SALVAR ================= */

let dragging=false;
let offsetX,offsetY;

panel.addEventListener("mousedown",(e)=>{
    dragging=true;
    offsetX=e.clientX-panel.offsetLeft;
    offsetY=e.clientY-panel.offsetTop;
});

document.addEventListener("mousemove",(e)=>{
    if(!dragging) return;

    panel.style.left=(e.clientX-offsetX)+"px";
    panel.style.top=(e.clientY-offsetY)+"px";
    panel.style.right="auto";
});

document.addEventListener("mouseup",()=>{
    if(!dragging) return;
    dragging=false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        left: panel.style.left,
        top: panel.style.top
    }));
});

/* INIT */

scanTargets();

})();
