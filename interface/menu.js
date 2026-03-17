const RabbitMenu = (function(){

/* ==================================================
   CONFIG
================================================== */

const STORAGE_KEY="rabbit_pack_pro";

/* ==================================================
   STORAGE
================================================== */

function getStates(){
return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
}

function saveState(name,status){
const s=getStates();
s[name]=status;
localStorage.setItem(STORAGE_KEY,JSON.stringify(s));
}

/* ==================================================
   WAIT QUESTLOG
================================================== */

function waitQuestlog(cb){

const el=document.querySelector("#questlog_new");
if(el) return cb(el);

const obs=new MutationObserver(()=>{
const el=document.querySelector("#questlog_new");
if(el){
obs.disconnect();
cb(el);
}
});

obs.observe(document.body,{childList:true,subtree:true});
}

/* ==================================================
   BOTÃO 🐰
================================================== */

function criarBotao(q){

if(document.querySelector(".rabbitPackBtn")) return;

const btn=document.createElement("div");
btn.className="quest opened rabbitPackBtn";

btn.innerHTML=`
<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:20px">
🐰
</div>
<div class="quest_progress"></div>
`;

btn.onclick=abrirJanela;

q.appendChild(btn);
}

/* ==================================================
   MENUS
================================================== */

const menus={
"Automação":[
"Agendador de comandos",
"Rotacionador de aldeias",
"Auto completar construção grátis",
"Auto clicar botões",
"Detector de captcha"
],
"Ataque / Defesa":[
"Assistente de saque",
"Farm mapa",
"Envio de ataques em massa",
"Sniper de defesa",
"Detector de ataques"
],
"Tropas / Construção":[
"Recrutador automático",
"Upador de edifícios",
"Upar paladino",
"Gerenciador de filas",
"Treinamento inteligente"
],
"Recursos / Coleta":[
"Balanceador de recursos",
"Cunhar moedas",
"Troca premium",
"Coleta individual",
"Coleta em massa"
],
"Interface / Utilidades":[
"Etiquetador de comandos",
"Quickbar personalizada",
"Scanner de bárbaras",
"Lista de coordenadas",
"Painel de estatísticas"
]
};

const menuIcons={
"Automação":"⚙️",
"Ataque / Defesa":"⚔️",
"Tropas / Construção":"🏰",
"Recursos / Coleta":"💰",
"Interface / Utilidades":"🧰"
};

/* ================================================== */

function abrirJanela(){

const primeiro=Object.keys(menus)[0];

Dialog.show("rabbit_pack",`

<div style="width:820px;height:420px;display:flex;flex-direction:column">

<h2 style="text-align:center;margin:6px 0;">
🐰 Rabbit Pack PRO 🐰
</h2>

<hr style="margin:4px 0 10px 0;">

<div style="display:flex;flex:1">

<div id="menu_lateral" class="rabbitSidebar"></div>

<div id="menu_conteudo"
style="flex:1;padding:15px;overflow:auto;"></div>

</div>
</div>
`);

criarMenus();
abrirConteudo(primeiro);
}

/* ================================================== */

function criarMenus(){

const box=document.querySelector("#menu_lateral");
box.innerHTML="";

Object.keys(menus).forEach(nome=>{

const item=document.createElement("div");
item.className="rabbitMenuItem";
item.dataset.menu=nome;

item.innerHTML=`
<div class="rabbitMenuIcon">${menuIcons[nome]}</div>
<div>${nome}</div>
`;

item.onclick=()=>abrirConteudo(nome);

box.appendChild(item);

});
}

/* ================================================== */

function abrirConteudo(nome){

document.querySelectorAll(".rabbitMenuItem")
.forEach(el=>el.classList.remove("active"));

document.querySelector(`[data-menu="${nome}"]`)
.classList.add("active");

const area=document.querySelector("#menu_conteudo");
const lista=menus[nome];
const states=getStates();

let html=`<div class="rabbitGrid">`;

lista.forEach(script=>{

html+=`
<div class="rabbitCard">

<div class="rabbitCardTop">

<div>
<div class="rabbitTitle">${script}</div>
<div class="rabbitSub">Rabbit Module</div>
</div>

<label class="twSwitch">
<input type="checkbox"
${states[script]?"checked":""}
onchange="toggleScript('${script}',this.checked)">
<span class="twSlider"></span>
</label>

</div>
</div>
`;

});

html+="</div>";

area.innerHTML=html;
}

/* ==================================================
   EXECUTOR (VAI SER MOVIDO DEPOIS)
================================================== */

function executarScript(nome){

const screen=new URLSearchParams(location.search).get("screen");

if(nome==="Auto completar construção grátis"){
if(screen!=="main") return;
setInterval(()=>{
document.querySelectorAll(".btn-instant-free")
.forEach(b=>b.click());
},3000);
}

if(nome==="Auto clicar botões"){
setInterval(()=>{
document.querySelectorAll(".btn-confirm-yes")
.forEach(b=>b.click());
},4000);
}

if(nome==="Recrutador automático"){
if(screen!=="train") return;
setInterval(()=>{
document.querySelector(".btn-recruit")?.click();
},5000);
}

}

/* ================================================== */

window.toggleScript=function(nome,status){
saveState(nome,status);
if(status) executarScript(nome);
};

function iniciarScriptsAtivos(){
const states=getStates();
Object.entries(states).forEach(([n,a])=>{
if(a) executarScript(n);
});
}

/* ================================================== */

function init(){
waitQuestlog(criarBotao);
setTimeout(iniciarScriptsAtivos,2000);
}

return { init };

})();
