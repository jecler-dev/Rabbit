RabbitEngine.register("Auto completar construção grátis", function(){

if(location.search.indexOf("screen=main")===-1) return;

const interval = setInterval(()=>{

document.querySelectorAll(".btn-instant-free")
.forEach(b=>b.click());

},3000);

return {
stop(){
clearInterval(interval);
}
};

});
