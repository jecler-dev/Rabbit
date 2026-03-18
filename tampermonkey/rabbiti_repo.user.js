// ==UserScript==
// @name         RabbitScript - Repo
// @namespace    https://github.com/seu-user
// @version      1.0
// @description  Scripts organizados via @require
// @author       Rabbit
// @match        *://*/*

// arquivos do projeto
// @require https://raw.githubusercontent.com/seu-user/meu-projeto/main/src/utils.js
// @require https://raw.githubusercontent.com/seu-user/meu-projeto/main/src/file1.js
// @require https://raw.githubusercontent.com/seu-user/meu-projeto/main/src/file2.js
// @require https://raw.githubusercontent.com/seu-user/meu-projeto/main/src/file3.js

// atualização automática
// @updateURL    https://raw.githubusercontent.com/seu-user/meu-projeto/main/main.user.js
// @downloadURL  https://raw.githubusercontent.com/seu-user/meu-projeto/main/main.user.js

// ==/UserScript==

(function() {
    'use strict';

    console.log("Repositorio Carregado");
})();
```
// ==UserScript==
// @name         Repositorio RabbitScripts
// @match        *://*/*
// @require https://raw.githubusercontent.com/user/repo/main/pasta/file1.js
// @require https://raw.githubusercontent.com/user/repo/main/pasta/file2.js
// @require https://raw.githubusercontent.com/user/repo/main/pasta/file3.js
// ... até o 10
// ==/UserScript==
