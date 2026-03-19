// ==UserScript==
// @name         🐰RabbitScrips🐰 - Painel Lateral 2.0
// @namespace    Rabbit
// @version      1.0
// @icon         https://i.imgur.com/7WgHTT8.gif
// @description  Botões flutuantes TW com export/import e painel centralizado, salva no localStorage e recarrega página ao fechar
// @match        https://*.tribalwars.com.br/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = "floatingButtonsScripts";
    const DEFAULT_BUTTONS = [
        { name: "Balanceador", link: "https://shinko-to-kuma.com/scripts/WHBalancerShinkoToKuma.js" }
    ];

    let buttonsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [...DEFAULT_BUTTONS];

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(buttonsData));
    }

    function downloadConfig() {
        const blob = new Blob([JSON.stringify(buttonsData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tw_buttons_config.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    function uploadConfigAddOrUpdate() {
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
                            } else {
                                buttonsData.push(importedBtn);
                            }
                        });
                        saveData();
                        createFloatingButtons();
                        if (typeof refreshList === "function") refreshList();
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

    function handleButtonClick(button, url) {
        if (!url) return;

        if (url.startsWith("javascript:") || url.endsWith(".js")) {
            if (url.startsWith("javascript:")) {
                try {
                    eval(url.slice(11));
                    button.innerText = "✅ Executado";
                    button.style.background = "#2e9b45";
                } catch (err) {
                    button.innerText = "❌ Erro";
                    button.style.background = "#b32f2f";
                    console.error(err);
                }
            } else {
                button.innerText = "Carregando...";
                const script = document.createElement("script");
                script.src = url;
                script.onload = () => {
                    button.innerText = "✅ Ativo";
                    button.style.background = "#2e9b45";
                };
                script.onerror = () => {
                    button.innerText = "❌ Erro";
                    button.style.background = "#b32f2f";
                };
                document.head.appendChild(script);
            }
        } else if (url.startsWith("http://") || url.startsWith("https://")) {
            window.location.href = url;
        } else {
            alert("Link inválido!");
        }
    }

    const btnsContainer = [];
    const BUTTON_HEIGHT = 32;
    const BUTTON_WIDTH = 120;
    const BUTTON_MARGIN = 3;

    function createFloatingButtons() {
        btnsContainer.forEach(b => b.remove());
        btnsContainer.length = 0;

        buttonsData.forEach((bData, index) => {
            const btn = document.createElement("button");
            btn.innerText = bData.name;

            btn.style.position = "fixed";
            btn.style.right = "15px";
            btn.style.top = `${40 + index * (BUTTON_HEIGHT + BUTTON_MARGIN)}px`;
            btn.style.width = `${BUTTON_WIDTH}px`;
            btn.style.height = `${BUTTON_HEIGHT}px`;
            btn.style.background = "#E0D8B0";
            btn.style.color = "#000";
            btn.style.border = "2px solid #000";
            btn.style.borderRadius = "6px";
            btn.style.fontFamily = "Verdana, Arial, sans-serif";
            btn.style.fontSize = "12px";
            btn.style.fontWeight = "bold";
            btn.style.cursor = "pointer";
            btn.style.textAlign = "center";
            btn.style.lineHeight = `${BUTTON_HEIGHT - 4}px`;
            btn.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.4)";
            btn.style.zIndex = "99999";

            btn.onclick = () => handleButtonClick(btn, bData.link);

            document.body.appendChild(btn);
            btnsContainer.push(btn);
        });
    }

    createFloatingButtons();

    // Botão de abrir painel de configuração
    const configBtn = document.createElement("button");
    configBtn.innerText = "⚙ Config";
    configBtn.style.position = "fixed";
    configBtn.style.right = "15px";
    configBtn.style.top = `${40 + buttonsData.length * (BUTTON_HEIGHT + BUTTON_MARGIN)}px`;
    configBtn.style.width = `${BUTTON_WIDTH}px`;
    configBtn.style.height = `${BUTTON_HEIGHT}px`;
    configBtn.style.background = "#C8B070";
    configBtn.style.color = "#000";
    configBtn.style.border = "2px solid #000";
    configBtn.style.borderRadius = "6px";
    configBtn.style.fontFamily = "Verdana, Arial, sans-serif";
    configBtn.style.fontSize = "12px";
    configBtn.style.fontWeight = "bold";
    configBtn.style.cursor = "pointer";
    configBtn.style.textAlign = "center";
    configBtn.style.lineHeight = `${BUTTON_HEIGHT - 4}px`;
    configBtn.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.4)";
    configBtn.style.zIndex = "99999";
    document.body.appendChild(configBtn);

    configBtn.onclick = () => {
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0,0,0,0.6)";
        overlay.style.zIndex = "999999";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        const panel = document.createElement("div");
        panel.style.position = "relative";
        panel.style.background = "#F5F0D6";
        panel.style.border = "2px solid #000";
        panel.style.padding = "10px";
        panel.style.borderRadius = "6px";
        panel.style.width = "420px";
        panel.style.maxHeight = "80%";
        panel.style.overflowY = "auto";
        panel.style.fontFamily = "Verdana, Arial, sans-serif";
        panel.style.boxShadow = "4px 4px 8px rgba(0,0,0,0.6)";
        overlay.appendChild(panel);

        // Cabeçalho
        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.style.marginBottom = "8px";
        panel.appendChild(header);

        const title = document.createElement("div");
        title.innerText = "Configurações";
        title.style.fontWeight = "bold";
        title.style.fontSize = "14px";
        title.style.background = "#B0A080";
        title.style.color = "#000";
        title.style.padding = "4px";
        title.style.borderRadius = "4px";
        title.style.flex = "1";
        title.style.textAlign = "center";
        header.appendChild(title);

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "✖";
        closeBtn.style.width = "24px";
        closeBtn.style.height = "24px";
        closeBtn.style.background = "#B07070";
        closeBtn.style.color = "#fff";
        closeBtn.style.border = "1px solid #000";
        closeBtn.style.borderRadius = "4px";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = () => location.reload();
        header.appendChild(closeBtn);

        const list = document.createElement("div");
        panel.appendChild(list);

        function refreshList() {
            list.innerHTML = "";
            buttonsData.forEach((b, i) => {
                const item = document.createElement("div");
                item.style.marginBottom = "5px";
                item.style.display = "flex";
                item.style.alignItems = "center";

                const nameInput = document.createElement("input");
                nameInput.type = "text";
                nameInput.value = b.name;
                nameInput.placeholder = "Nome";
                nameInput.style.flex = "2";
                nameInput.style.marginRight = "3px";
                nameInput.style.fontSize = "12px";
                nameInput.style.borderRadius = "4px";

                const linkInput = document.createElement("input");
                linkInput.type = "text";
                linkInput.value = b.link;
                linkInput.placeholder = "Link ou javascript:";
                linkInput.style.flex = "3";
                linkInput.style.fontSize = "12px";
                linkInput.style.borderRadius = "4px";

                if (b.link.startsWith("javascript:") || b.link.endsWith(".js")) {
                    linkInput.style.color = "green";
                } else if (b.link.startsWith("http://") || b.link.startsWith("https://")) {
                    linkInput.style.color = "blue";
                } else {
                    linkInput.style.color = "black";
                }

                const upBtn = document.createElement("button");
                upBtn.innerText = "↑";
                upBtn.style.fontSize = "12px";
                upBtn.style.marginLeft = "2px";
                upBtn.style.borderRadius = "4px";
                upBtn.onclick = () => {
                    if (i > 0) {
                        [buttonsData[i - 1], buttonsData[i]] = [buttonsData[i], buttonsData[i - 1]];
                        saveData();
                        refreshList();
                        createFloatingButtons();
                    }
                };

                const downBtn = document.createElement("button");
                downBtn.innerText = "↓";
                downBtn.style.fontSize = "12px";
                downBtn.style.marginLeft = "2px";
                downBtn.style.borderRadius = "4px";
                downBtn.onclick = () => {
                    if (i < buttonsData.length - 1) {
                        [buttonsData[i], buttonsData[i + 1]] = [buttonsData[i + 1], buttonsData[i]];
                        saveData();
                        refreshList();
                        createFloatingButtons();
                    }
                };

                const deleteBtn = document.createElement("button");
                deleteBtn.innerText = "🗑";
                deleteBtn.style.marginLeft = "2px";
                deleteBtn.style.fontSize = "12px";
                deleteBtn.style.borderRadius = "4px";
                deleteBtn.onclick = () => {
                    buttonsData.splice(i, 1);
                    saveData();
                    refreshList();
                    createFloatingButtons();
                };

                nameInput.oninput = () => {
                    buttonsData[i].name = nameInput.value;
                    saveData();
                    createFloatingButtons();
                };
                linkInput.oninput = () => {
                    buttonsData[i].link = linkInput.value;
                    if (buttonsData[i].link.startsWith("javascript:") || buttonsData[i].link.endsWith(".js")) {
                        linkInput.style.color = "green";
                    } else if (buttonsData[i].link.startsWith("http://") || buttonsData[i].link.startsWith("https://")) {
                        linkInput.style.color = "blue";
                    } else {
                        linkInput.style.color = "black";
                    }
                    saveData();
                };

                item.appendChild(nameInput);
                item.appendChild(linkInput);
                item.appendChild(upBtn);
                item.appendChild(downBtn);
                item.appendChild(deleteBtn);

                list.appendChild(item);
            });
        }

        refreshList();

        // ----- Botões de ação -----
        const actionContainer = document.createElement("div");
        actionContainer.style.display = "flex";
        actionContainer.style.marginTop = "6px";
        actionContainer.style.gap = "3px";

        function createActionButton(text, onClick) {
            const b = document.createElement("button");
            b.innerText = text;
            b.style.flex = "1";
            b.style.padding = "6px";
            b.style.fontSize = "12px";
            b.style.borderRadius = "6px";
            b.style.cursor = "pointer";
            b.onclick = onClick;
            return b;
        }

        const addBtn = createActionButton("+ Adicionar", () => {
            buttonsData.push({ name: "Novo Botão", link: "" });
            saveData();
            refreshList();
            createFloatingButtons();
        });

        const saveBtn = createActionButton("💾 Salvar", () => {
            saveData();
            document.body.removeChild(overlay); // fecha painel
        });

        const exportImportBtn = createActionButton("♻ Export/Import", () => {
            const smallWindow = document.createElement("div");
            smallWindow.style.position = "absolute";
            smallWindow.style.top = "50%";
            smallWindow.style.left = "50%";
            smallWindow.style.transform = "translate(-50%, -50%)";
            smallWindow.style.background = "#F5F0D6";
            smallWindow.style.border = "2px solid #000";
            smallWindow.style.padding = "10px";
            smallWindow.style.borderRadius = "6px";
            smallWindow.style.width = "200px";
            smallWindow.style.textAlign = "center";
            smallWindow.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.5)";
            overlay.appendChild(smallWindow);

            const msg = document.createElement("div");
            msg.innerText = "Escolha a ação:";
            msg.style.marginBottom = "10px";
            smallWindow.appendChild(msg);

            const exportBtn = document.createElement("button");
            exportBtn.innerText = "Exportar";
            exportBtn.style.margin = "3px";
            exportBtn.onclick = () => {
                downloadConfig();
                overlay.removeChild(smallWindow);
            };
            smallWindow.appendChild(exportBtn);

            const importBtn = document.createElement("button");
            importBtn.innerText = "Importar";
            importBtn.style.margin = "3px";
            importBtn.onclick = () => {
                uploadConfigAddOrUpdate();
                overlay.removeChild(smallWindow);
            };
            smallWindow.appendChild(importBtn);

            const cancelBtn = document.createElement("button");
            cancelBtn.innerText = "Cancelar";
            cancelBtn.style.margin = "3px";
            cancelBtn.onclick = () => overlay.removeChild(smallWindow);
            smallWindow.appendChild(cancelBtn);
        });

        actionContainer.appendChild(addBtn);
        actionContainer.appendChild(saveBtn);
        actionContainer.appendChild(exportImportBtn);

        panel.appendChild(actionContainer);

        document.body.appendChild(overlay);
    };
})();
