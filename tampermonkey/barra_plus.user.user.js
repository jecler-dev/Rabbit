// ==UserScript==
// @name         RabbitScrips - BarraPlus final

// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quickbar
// @match        *://*.tribalwars.com.br/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
'use strict';

/* ================= CONFIG ================= */

const STORAGE_KEY = 'nav_shortcuts';
const ASSET_BASE = "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/";
let gameData = null;

/* ================= START ================= */

waitGame();

function waitGame() {
    if (typeof game_data === "undefined" || !document.body) {
        return setTimeout(waitGame, 300);
    }
    gameData = game_data;
    init();
}

function init() {
    if (document.getElementById("quickbar_original")) return;
    addStyles();
    injectNavigationBar();
}

/* ================= FUNÇÃO DE CLICK ================= */

function handleButtonClick(buttonElement, url) {
    if (!url) return;

    if (url.startsWith("javascript:") || url.endsWith(".js")) {
        if (url.startsWith("javascript:")) {
            try {
                eval(url.slice(11));
                const originalText = buttonElement.querySelector('span').innerText;
                const originalBg = buttonElement.style.background;

                buttonElement.querySelector('span').innerText = "✅ Executado";
                buttonElement.style.background = "#2e9b45";

                setTimeout(() => {
                    buttonElement.querySelector('span').innerText = originalText;
                    buttonElement.style.background = originalBg;
                }, 2000);
            } catch (err) {
                buttonElement.querySelector('span').innerText = "❌ Erro";
                buttonElement.style.background = "#b32f2f";
                console.error(err);

                setTimeout(() => {
                    buttonElement.querySelector('span').innerText = originalText;
                    buttonElement.style.background = originalBg;
                }, 2000);
            }
        } else {
            const originalText = buttonElement.querySelector('span').innerText;
            const originalBg = buttonElement.style.background;

            buttonElement.querySelector('span').innerText = "Carregando...";

            const script = document.createElement("script");
            script.src = url;
            script.onload = () => {
                buttonElement.querySelector('span').innerText = "✅ Ativo";
                buttonElement.style.background = "#2e9b45";

                setTimeout(() => {
                    buttonElement.querySelector('span').innerText = originalText;
                    buttonElement.style.background = originalBg;
                }, 2000);
            };
            script.onerror = () => {
                buttonElement.querySelector('span').innerText = "❌ Erro";
                buttonElement.style.background = "#b32f2f";

                setTimeout(() => {
                    buttonElement.querySelector('span').innerText = originalText;
                    buttonElement.style.background = originalBg;
                }, 2000);
            };
            document.head.appendChild(script);
        }
    } else if (url.startsWith("http://") || url.startsWith("https://")) {
        window.location.href = url;
    } else {
        alert("Link inválido!");
    }
}

/* ================= FUNÇÃO PARA FORMATAR URL DO ÍCONE ================= */

function getIconUrl(iconPath) {
    if (!iconPath) return '';

    // Se já é uma URL completa (http:// ou https://)
    if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
        return iconPath;
    }

    // Se é um caminho relativo que começa com /graphic/
    if (iconPath.startsWith('/graphic/')) {
        return iconPath; // O navegador vai resolver automaticamente
    }

    // Se é um caminho do tipo "buildings/mid/main3.png"
    if (!iconPath.startsWith('http') && !iconPath.startsWith('/')) {
        return ASSET_BASE + iconPath;
    }

    return iconPath;
}

/* ================= QUICKBAR ================= */

function injectNavigationBar() {

    function insertBar() {

        if (document.getElementById("quickbar_original")) return;

        const villageId = gameData.village.id;

        const customShortcuts =
            JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        const defaultItems = [
            { name:"Principal", img:"buildings/mid/main3.png", href:`/game.php?village=${villageId}&screen=main` },
            { name:"Quartel", img:"buildings/mid/barracks.png", href:`/game.php?village=${villageId}&screen=train` },
            { name:"Praça", img:"buildings/mid/place1.png", href:`/game.php?village=${villageId}&screen=place` },
            { name:"Mercado", img:"buildings/mid/market1.png", href:`/game.php?village=${villageId}&screen=market` }
        ];

        const finalItems =
            customShortcuts.length ? customShortcuts : defaultItems;

        const quickbarHTML = `
<table id="quickbar_original" align="center" width="100%" cellspacing="0">
<tbody><tr><td>

<table style="border-collapse:collapse;" width="100%">
<tbody>

<tr class="topborder">
<td class="left"></td>
<td class="main"></td>
<td class="right"></td>
</tr>

<tr>
<td class="left"></td>

<td class="main" style="padding:4px 10px;">
<div style="display:flex;justify-content:space-between;align-items:center;">

<div style="display:flex;gap:15px;flex-wrap:wrap;margin:0 auto;">
${finalItems.map((item, index)=> {
    const iconUrl = getIconUrl(item.img);
    return `
<a href="#"
   class="quickbar-item"
   data-index="${index}"
   data-link="${item.link || item.href || ''}"
   style="display:flex;align-items:center;gap:4px;
   color:#301000;text-decoration:none;font-size:11px;padding:2px 6px;">

${iconUrl ? `<img src="${iconUrl}" width="16" height="16" onerror="this.style.display='none'">` : ''}
<span>${item.name || 'Item'}</span>
</a>`;
}).join("")}
</div>

<div>
<img src="/graphic/plus.png" id="nav_edit_icon"
style="width:16px;height:16px;cursor:pointer;opacity:.7">
</div>

</div>
</td>

<td class="right"></td>
</tr>

<tr class="bottomborder">
<td class="left"></td>
<td class="main"></td>
<td class="right"></td>
</tr>

<tr>
<td class="shadow" colspan="3"></td>
</tr>

</tbody>
</table>

</td></tr></tbody>
</table>
`;

        const target =
            document.querySelector('.newStyleOnly') ||
            document.getElementById('menu_row2') ||
            document.querySelector('#header_info');

        if (!target) return;

        target.insertAdjacentHTML('afterend', quickbarHTML);

        document.querySelectorAll('.quickbar-item').forEach((item, index) => {
            item.onclick = (e) => {
                e.preventDefault();
                const link = item.dataset.link;
                if (link) {
                    handleButtonClick(item, link);
                }
            };
        });

        document.getElementById('nav_edit_icon').onclick = openPlusPanel;

        observer.disconnect();
    }

    const observer = new MutationObserver(insertBar);
    observer.observe(document.body,{childList:true,subtree:true});
    insertBar();
}

/* ================= FUNÇÕES AUXILIARES ================= */

function downloadConfig(buttonsData) {
    const blob = new Blob([JSON.stringify(buttonsData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tw_quickbar_config.json";
    a.click();
    URL.revokeObjectURL(url);
}

function uploadConfigAddOrUpdate(buttonsData, saveCallback, refreshCallback) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const data = JSON.parse(evt.target.result);
                if (Array.isArray(data)) {
                    data.forEach(importedBtn => {
                        const existing = buttonsData.find(b => b.name === importedBtn.name);
                        if (existing) {
                            existing.link = importedBtn.link;
                            existing.href = importedBtn.href || importedBtn.link;
                            existing.img = importedBtn.img || '';
                        } else {
                            buttonsData.push({
                                name: importedBtn.name,
                                link: importedBtn.link,
                                href: importedBtn.href || importedBtn.link,
                                img: importedBtn.img || ''
                            });
                        }
                    });
                    saveCallback();
                    if (refreshCallback) refreshCallback();
                    alert("Configuração importada com sucesso! A página será atualizada.");
                    location.reload();
                } else {
                    alert("Arquivo inválido!");
                }
            } catch (err) {
                alert("Erro ao ler o arquivo: " + err);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

/* ================= FUNÇÃO PARA EDITAR ATALHO ================= */

function editShortcut(buttonData, index, saveCallback, refreshCallback) {
    const content = `
        <div style="padding:15px; min-width:350px;">
            <h3 style="margin:0 0 15px 0; color:#301000; text-align:center;">Editar Atalho</h3>

            <table style="width:100%; border-collapse:collapse;">
                <tr>
                    <td style="padding:5px; font-weight:bold; width:80px;">Nome:</td>
                    <td style="padding:5px;">
                        <input type="text" id="edit_name" value="${buttonData.name || ''}" style="width:100%; border:1px solid #b0a080; background:white; padding:5px; border-radius:3px;">
                    </td>
                </tr>
                <tr>
                    <td style="padding:5px; font-weight:bold;">URL:</td>
                    <td style="padding:5px;">
                        <input type="text" id="edit_link" value="${buttonData.link || buttonData.href || ''}" style="width:100%; border:1px solid #b0a080; background:white; padding:5px; border-radius:3px;" placeholder="/game.php?... ou javascript:...">
                    </td>
                </tr>
                <tr>
                    <td style="padding:5px; font-weight:bold;">Ícone:</td>
                    <td style="padding:5px;">
                        <input type="text" id="edit_img" value="${buttonData.img || ''}" style="width:100%; border:1px solid #b0a080; background:white; padding:5px; border-radius:3px;" placeholder="/graphic/buildings/... ou URL completa">
                    </td>
                </tr>
                <tr>
                    <td style="padding:15px 5px 5px 5px;" colspan="2" align="center">
                        <input type="button" class="btn evt-cancel-btn btn-confirm-yes" id="save_edit" value="Salvar" style="padding:6px 20px; margin-right:10px;">
                        <input type="button" class="btn evt-cancel-btn btn-confirm-yes" id="cancel_edit" value="Cancelar" style="padding:6px 20px;">
                    </td>
                </tr>
            </table>
        </div>
    `;

    Dialog.show('Editar Atalho', content);

    setTimeout(function() {
        document.getElementById('save_edit').onclick = function() {
            const newName = document.getElementById('edit_name').value;
            const newLink = document.getElementById('edit_link').value;
            const newImg = document.getElementById('edit_img').value;

            buttonData.name = newName;
            buttonData.link = newLink;
            buttonData.href = newLink.startsWith('javascript:') ? '#' : newLink;
            buttonData.img = newImg;

            saveCallback();
            Dialog.close();
            if (refreshCallback) refreshCallback();
        };

        document.getElementById('cancel_edit').onclick = function() {
            Dialog.close();
        };
    }, 100);
}

/* ================= FUNÇÃO DE DRAG AND DROP ================= */

function makeDraggable(item, index, buttonsData, saveCallback, refreshCallback) {
    item.setAttribute('draggable', 'true');

    item.addEventListener('dragstart', (e) => {
        item.classList.add('dragging');
        e.dataTransfer.setData('text/plain', index);
    });

    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
    });

    item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    item.addEventListener('drop', (e) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const targetIndex = index;

        if (sourceIndex !== targetIndex) {
            const [movedItem] = buttonsData.splice(sourceIndex, 1);
            buttonsData.splice(targetIndex, 0, movedItem);
            saveCallback();
            refreshCallback();
        }
    });
}

/* ================= PAINEL DO BOTÃO + ================= */

function openPlusPanel() {
    let buttonsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(buttonsData));
    }

    function refreshPanel() {
        Dialog.close();
        openPlusPanel();
    }

    var content = `<div style="max-width:600px;">
        <h2 class="popup_box_header" style="margin:0; padding:8px 0;">
            <center><u>
                <font color="darkgreen">Configurações</font>
            </u></center>
        </h2>
        <hr style="margin:5px 0;">
        <p style="margin:5px 0;">
            <center>
                <font color="maroon"><b>Gerencie os atalhos da BarraPlus</b></font>
            </center>
        </p>
        <div style="max-height:400px; overflow-y:auto; margin:10px 0; padding:0 5px;">`;

    content += `<div style="display:flex; flex-direction:column; gap:6px;" id="draggable-list">`;

    if (buttonsData.length === 0) {
        content += `<div style="text-align:center; padding:30px; color:#666; font-style:italic;">
            Nenhum atalho configurado. Clique em "Adicionar" para começar.
        </div>`;
    } else {
        buttonsData.forEach(function(b, i) {
            content += `
                <div class="draggable-item" data-index="${i}" style="background:#f0e8d0; border:1px solid #c0b090; border-radius:4px; padding:10px; display:flex; align-items:center; justify-content:space-between; cursor:grab;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="color:#666; font-size:18px; user-select:none;">⋮⋮</span>
                        <span style="font-weight:bold; font-size:14px; color:#301000;">${b.name || 'Sem nome'}</span>
                    </div>
                    <div style="display:flex; gap:5px;">
                        <button class="btn-remove" data-index="${i}" style="background:#b34a4a; color:white; border:none; padding:4px 8px; cursor:pointer; border-radius:3px; font-size:12px;" title="Remover">🗑</button>
                        <button class="edit-icon" data-index="${i}" style="background:#4a6a9a; color:white; border:none; padding:4px 8px; cursor:pointer; border-radius:3px; font-size:12px;" title="Editar">✏️</button>
                    </div>
                </div>`;
        });
    }

    content += `</div></div>`;

    content += `
        <div style="background:#e0d4b0; border-top:1px solid #c0b090; padding:10px; margin-top:10px;">
            <table width="100%" style="border-collapse:collapse;">
                <tr>
                    <td width="33%" style="padding:3px;"><input type="button" class="btn evt-cancel-btn btn-confirm-yes" id="add_new" value="Adicionar" style="width:100%; padding:6px; font-size:12px;"></td>
                    <td width="34%" style="padding:3px;"><input type="button" class="btn evt-cancel-btn btn-confirm-yes" id="save_close" value="Salvar" style="width:100%; padding:6px; font-size:12px;"></td>
                    <td width="33%" style="padding:3px;"><input type="button" class="btn evt-cancel-btn btn-confirm-yes" id="export_import" value="Export/Import" style="width:100%; padding:6px; font-size:12px;"></td>
                </tr>
            </table>
        </div>
        <div style="margin-top:8px; text-align:center;">
            <span style="font-size:11px; color:#666;">BarraPlus v1.0 - RabbitScripts</span>
        </div>
    </div>`;

    Dialog.show('Configurações', content);

    setTimeout(function() {
        // Aplica drag and drop
        document.querySelectorAll('.draggable-item').forEach((item, index) => {
            makeDraggable(item, index, buttonsData, save, refreshPanel);
        });

        // Botões de edição
        document.querySelectorAll('.edit-icon').forEach(function(btn) {
            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(e.currentTarget.dataset.index);
                editShortcut(buttonsData[index], index, save, refreshPanel);
            };
        });

        // Botões remover
        document.querySelectorAll('.btn-remove').forEach(function(btn) {
            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const index = e.target.dataset.index;
                buttonsData.splice(index, 1);
                save();
                refreshPanel();
            };
        });

        document.getElementById('add_new').onclick = function(e) {
            e.preventDefault();
            const newButton = {
                name: "Novo Atalho",
                link: "/game.php?village=" + gameData.village.id + "&screen=overview",
                href: "/game.php?village=" + gameData.village.id + "&screen=overview",
                img: ""
            };
            buttonsData.push(newButton);
            save();
            refreshPanel();

            setTimeout(function() {
                editShortcut(newButton, buttonsData.length - 1, save, refreshPanel);
            }, 200);
        };

        document.getElementById('save_close').onclick = function(e) {
            e.preventDefault();
            Dialog.close();
            location.reload();
        };

        document.getElementById('export_import').onclick = function(e) {
            e.preventDefault();

            const smallContent = `
                <div style="text-align:center; padding:15px;">
                    <h3 style="margin:0 0 15px 0; color:#301000;">Exportar / Importar</h3>
                    <p style="margin:0 0 15px 0; font-size:12px;">Escolha a ação:</p>
                    <table style="margin:0 auto; border-collapse:collapse;">
                        <tr>
                            <td style="padding:5px;"><input type="button" class="btn evt-cancel-btn btn-confirm-yes" id="export_btn" value="Exportar" style="padding:6px 15px;"></td>
                            <td style="padding:5px;"><input type="button" class="btn evt-cancel-btn btn-confirm-yes" id="import_btn" value="Importar" style="padding:6px 15px;"></td>
                            <td style="padding:5px;"><input type="button" class="btn evt-cancel-btn btn-confirm-yes" id="cancel_export" value="Cancelar" style="padding:6px 15px;"></td>
                        </tr>
                    </table>
                </div>
            `;

            Dialog.show('Export/Import', smallContent);

            setTimeout(function() {
                document.getElementById('export_btn').onclick = function() {
                    downloadConfig(buttonsData);
                    Dialog.close();
                };

                document.getElementById('import_btn').onclick = function() {
                    uploadConfigAddOrUpdate(buttonsData, save, function() {
                        Dialog.close();
                        openPlusPanel();
                    });
                };

                document.getElementById('cancel_export').onclick = function() {
                    Dialog.close();
                };
            }, 100);
        };
    }, 100);
}

/* ================= STYLE ================= */

function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
        #quickbar_original {
            background: #eedbaa;
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
            border: 1px solid #301000;
        }

        .quickbar-item {
            transition: background-color 0.2s;
            border: 1px solid transparent;
            cursor: pointer;
        }

        .quickbar-item:hover {
            background: #dbb88c;
            border-radius: 3px;
            border-color: #301000;
        }

        .draggable-item {
            transition: all 0.2s;
            user-select: none;
        }

        .draggable-item.dragging {
            opacity: 0.5;
            transform: scale(1.02);
            box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
        }

        .draggable-item:hover {
            background: #e8d8c0 !important;
        }

        #quickbar_original .topborder .left { background: url(/graphic/top-left.png) no-repeat; width: 9px; height: 9px; }
        #quickbar_original .topborder .main { background: url(/graphic/top.png) repeat-x; height: 9px; }
        #quickbar_original .topborder .right { background: url(/graphic/top-right.png) no-repeat; width: 9px; height: 9px; }
        #quickbar_original .bottomborder .left { background: url(/graphic/bottom-left.png) no-repeat; width: 9px; height: 9px; }
        #quickbar_original .bottomborder .main { background: url(/graphic/bottom.png) repeat-x; height: 9px; }
        #quickbar_original .bottomborder .right { background: url(/graphic/bottom-right.png) no-repeat; width: 9px; height: 9px; }
        #quickbar_original .left { background: url(/graphic/left.png) repeat-y; width: 9px; }
        #quickbar_original .right { background: url(/graphic/right.png) repeat-y; width: 9px; }
        #quickbar_original .shadow { background: url(/graphic/shadow.png); height: 9px; }
    `;
    document.head.appendChild(style);
}

})();
