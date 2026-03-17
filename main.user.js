// ==UserScript==
// @name         🐰 Rabbit Pack PRO
// @namespace    rabbit.pack.pro
// @version      1.0
// @match        *://*.tribalwars.com.br/*
// @grant        none

/* ==================================================
   CORE
================================================== */

// @require https://github.com/jecler-dev/Rabbit/raw/refs/heads/main/core/engine.js


/* ==================================================
   INTERFACE
================================================== */

// @require https://github.com/jecler-dev/Rabbit/raw/refs/heads/main/interface/theme.js
// @require https://github.com/jecler-dev/Rabbit/raw/refs/heads/main/interface/menu.js


/* ==================================================
   MODULES
================================================== */

// @require https://github.com/jecler-dev/Rabbit/raw/refs/heads/main/modules/auto_build.js


// ==/UserScript==

(function(){

'use strict';

/* ==================================================
   START
================================================== */

function startRabbit(){

console.log("🐰 Rabbit Pack iniciado");

RabbitMenu.init();

}

/* ==================================================
   INIT DELAY (evita bugs do TW)
================================================== */

setTimeout(startRabbit,2000);

})();
