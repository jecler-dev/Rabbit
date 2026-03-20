```javascript
// ==UserScript==
// @name         🐰 Rabbit Pack PRO
// @namespace    jotadev.rabbit.pack.pro
// @version      5.0
// @match        *://*.tribalwars.com.br/*
// @grant        none

// CORE
// @require https://cdn.jsdelivr.net/gh/SEU_USER/SEU_REPO/core/engine.js

// INTERFACE
// @require https://cdn.jsdelivr.net/gh/SEU_USER/SEU_REPO/interface/menu.js
// @require https://cdn.jsdelivr.net/gh/SEU_USER/SEU_REPO/interface/theme.js

// ==/UserScript==

(function () {
'use strict';

/* ==================================================
   STORAGE
================================================== */

const STORAGE_KEY = "rabbit_pack_pro";

function getStates(){
return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
}

function saveState(name,status){
const s=getStates();
s[name]=status;
localStorage.setItem(STORAGE_KEY,JSON.stringify(s));
}

/* ==================================================
   TOGGLE GLOBAL (ENGINE)
================================================== */

window.RabbitToggle = function(nome,status){

saveState(nome,status);

RabbitEngine.toggle(nome,status,(api)=>{
executarScript(nome,api);
});

};

/* ==================================================
   EXECUTOR DE MÓDULOS
================================================== */

function executarScript(nome, api){

const screen = new URLSearchParams(location.search).get("screen");

/* ================= AUTOMAÇÃO ================= */

if(nome==="Auto clicar botões"){

api.setInterval(()=>{
document.querySelectorAll(".btn-confirm-yes")
.forEach(b=>b.click());
},4000);

}

if(nome==="Auto completar construção grátis"){

if(screen!=="main") return;

api.setInterval(()=>{
document.querySelectorAll(".btn-instant-free")
.forEach(b=>b.click());
```
