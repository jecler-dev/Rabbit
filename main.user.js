// ==UserScript==
// @name         🐰 Rabbit Pack PRO
// @namespace    rabbit.pack.pro
// @version      1.0
// @match        *://*.tribalwars.com.br/*
// @grant        none

// CORE
// @require https://SEU_GITHUB/core/rabbit_utils.js
// @require https://SEU_GITHUB/core/rabbit_storage.js
// @require https://SEU_GITHUB/core/rabbit_settings.js

// INTERFACE
// @require https://SEU_GITHUB/interface/topbar.js
// @require https://SEU_GITHUB/interface/theme.js

// WIDGETS
// @require https://SEU_GITHUB/widgets/villageList.js
// @require https://SEU_GITHUB/widgets/notepad.js

// MODULES
// @require https://SEU_GITHUB/modules/auto_build.js
// @require https://SEU_GITHUB/modules/scavenging.js

// ==/UserScript==

(function(){

'use strict';

function startRabbit(){

RabbitTopBar();
RabbitWidgets.init();

autoBuild();
autoScavenge();

}

setTimeout(startRabbit,2000);

})();
