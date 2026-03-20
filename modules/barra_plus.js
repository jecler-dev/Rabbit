/* ================================
   🐰 Rabbit Module — Barra Plus
   Arquivo: modulos/barra_plus.js
================================ */

RabbitEngine.register("Barra Plus", () => {

    console.log("🐰 Barra Plus iniciada");

    let interval = null;
    let container = null;

    /* ============================
       CRIA BARRA
    ============================ */

    function createBar() {

        if (document.getElementById("rabbit-barra-plus"))
            return;

        container = document.createElement("div");
        container.id = "rabbit-barra-plus";

        container.style = `
            position:fixed;
            top:0;
            left:0;
            right:0;
            height:34px;
            background:#3a2f1b;
            border-bottom:1px solid #000;
            z-index:99999;
            display:flex;
            align-items:center;
            padding:0 8px;
            gap:8px;
            font-size:12px;
            color:#fff;
        `;

        container.innerHTML = `
            <b>🐰 Barra Plus</b>

            <button id="rb-overview">Visão Geral</button>
            <button id="rb-barracks">Quartel</button>
            <button id="rb-stable">Estábulo</button>
            <button id="rb-smith">Ferreiro</button>
        `;

        document.body.appendChild(container);

        /* BOTÕES */

        document
            .getElementById("rb-overview")
            .onclick = () => location.href = "?screen=overview";

        document
            .getElementById("rb-barracks")
            .onclick = () => location.href = "?screen=barracks";

        document
            .getElementById("rb-stable")
            .onclick = () => location.href = "?screen=stable";

        document
            .getElementById("rb-smith")
            .onclick = () => location.href = "?screen=smith";
    }

    /* ============================
       LOOP (caso precise atualizar)
    ============================ */

    function startLoop() {
        interval = setInterval(() => {
            createBar();
        }, 2000);
    }

    /* ============================
       START
    ============================ */

    createBar();
    startLoop();

    /* ============================
       STOP (OBRIGATÓRIO NO RABBIT)
    ============================ */

    return {
        stop() {

            console.log("🐰 Barra Plus parada");

            if (interval)
                clearInterval(interval);

            const bar = document.getElementById("rabbit-barra-plus");
            if (bar)
                bar.remove();
        }
    };

});
