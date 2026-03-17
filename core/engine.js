const RabbitEngine = {

modules:{},
running:{},

/* ========================= */

register(name, fn){
this.modules[name] = fn;
},

/* ========================= */

start(name){

if(this.running[name]) return;

const fn = this.modules[name];
if(!fn) return;

console.log("🐰 Start:", name);

const instance = fn();

this.running[name] = instance || true;

},

/* ========================= */

stop(name){

if(!this.running[name]) return;

console.log("🐰 Stop:", name);

const inst = this.running[name];

if(inst && inst.stop){
inst.stop();
}

delete this.running[name];

},

/* ========================= */

toggle(name, status){

if(status) this.start(name);
else this.stop(name);

},

/* ========================= */

init(){

const states = JSON.parse(localStorage.getItem("rabbit_pack_pro")||"{}");

Object.entries(states).forEach(([name,active])=>{
if(active) this.start(name);
});

}

};
