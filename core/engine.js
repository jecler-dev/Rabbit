const RabbitEngine = (function(){

const activeModules = {};

/* ================= START ================= */

function start(name, fn){

if(activeModules[name]){
console.log("⚠️ Já rodando:", name);
return;
}

const control = {
intervals: [],
timeouts: [],
running: true
};

// helpers
const api = {
setInterval(fn, time){
const id = setInterval(fn, time);
control.intervals.push(id);
},
setTimeout(fn, time){
const id = setTimeout(fn, time);
control.timeouts.push(id);
}
};

fn(api);

activeModules[name] = control;

console.log("✅ Iniciado:", name);

}

/* ================= STOP ================= */

function stop(name){

const mod = activeModules[name];
if(!mod) return;

mod.intervals.forEach(clearInterval);
mod.timeouts.forEach(clearTimeout);

delete activeModules[name];

console.log("🛑 Parado:", name);

}

/* ================= TOGGLE ================= */

function toggle(name, status, fn){

if(status){
start(name, fn);
}else{
stop(name);
}

}

return {
start,
stop,
toggle
};

})();
