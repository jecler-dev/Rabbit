if(nome==="Teste ON/OFF"){

let count = 0;

api.setInterval(()=>{

count++;

console.log("🐰 Teste rodando:", count);

// indicador visual na tela
let el = document.getElementById("rabbit_test_box");

if(!el){
el = document.createElement("div");
el.id = "rabbit_test_box";
el.style.position = "fixed";
el.style.bottom = "10px";
el.style.right = "10px";
el.style.background = "green";
el.style.color = "white";
el.style.padding = "8px";
el.style.zIndex = 9999;
document.body.appendChild(el);
}

el.innerText = "Rodando: " + count;

},1000);

}
