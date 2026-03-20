/* ==========================================
   🐰 Rabbit Engine PRO
   Sistema modular do Pack Rabbit
========================================== */

const RabbitEngine = {

modules:{},
running:{},
started:false,

/* ==========================================
   REGISTER
========================================== */

register(name, fn){

    if(this.modules[name]){
        console.warn("🐰 Módulo já registrado:", name);
        return;
    }

    this.modules[name] = fn;
},

/* ==========================================
   SAVE STATE
========================================== */

saveState(){

    const states = {};

    Object.keys(this.running).forEach(name=>{
        states[name] = true;
    });

    localStorage.setItem(
        "rabbit_pack_pro",
        JSON.stringify(states)
    );
},

/* ==========================================
   START
========================================== */

start(name){

    if(this.running[name]) return;

    const fn = this.modules[name];

    if(!fn){
        console.warn("🐰 Módulo não encontrado:", name);
        return;
    }

    console.log("🐰 Start:", name);

    try{

        const instance = fn();

        this.running[name] = instance || true;

        this.saveState();

    }catch(e){
        console.error("🐰 Erro ao iniciar:", name, e);
    }
},

/* ==========================================
   STOP
========================================== */

stop(name){

    if(!this.running[name]) return;

    console.log("🐰 Stop:", name);

    const inst = this.running[name];

    try{
        if(inst && typeof inst.stop === "function"){
            inst.stop();
        }
    }catch(e){
        console.error("🐰 Erro ao parar:", name, e);
    }

    delete this.running[name];

    this.saveState();
},

/* ==========================================
   TOGGLE
========================================== */

toggle(name){

    if(this.running[name])
        this.stop(name);
    else
        this.start(name);
},

/* ==========================================
   AUTO RECONNECT (⭐ PROFISSIONAL)
   Reativa módulos após mudanças internas
========================================== */

reconnect(){

    Object.keys(this.running).forEach(name=>{

        const inst = this.running[name];

        // módulos simples não precisam reconnect
        if(inst === true) return;

        if(inst && typeof inst.reconnect === "function"){
            try{
                inst.reconnect();
            }catch(e){
                console.warn("🐰 reconnect falhou:", name);
            }
        }

    });
},

/* ==========================================
   OBSERVA MUDANÇA DE PÁGINA TW
========================================== */

observeNavigation(){

    let lastUrl = location.href;

    setInterval(()=>{

        if(location.href !== lastUrl){

            lastUrl = location.href;

            console.log("🐰 Navegação detectada");

            this.reconnect();
        }

    }, 800);
},

/* ==========================================
   INIT
========================================== */

init(){

    if(this.started) return;
    this.started = true;

    console.log("🐰 Rabbit Engine iniciado");

    const states = JSON.parse(
        localStorage.getItem("rabbit_pack_pro") || "{}"
    );

    Object.entries(states).forEach(([name,active])=>{
        if(active) this.start(name);
    });

    this.observeNavigation();
}

};

/* ==========================================
   AUTO INIT
========================================== */

window.addEventListener("load", () => {
    setTimeout(()=>RabbitEngine.init(), 500);
});
