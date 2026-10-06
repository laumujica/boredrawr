(function(){
var $=function(id){return document.getElementById(id)};
var prompts = null;
var modes = {};
var spanish=document.documentElement.lang==="es";
var labels=spanish?{Draw:"Dibujar",Write:"Escribir",Doodle:"Garabatos",Free:"Libre"}:null;
var copy=spanish?{go:"Dame una idea",retry:"Volver a cargar las ideas",count:"Ejercicios completados en este dispositivo: ",timeUp:"Se terminó el tiempo.",done:"¡Listo!"}:{go:"Give me a prompt",retry:"Retry loading prompts",count:"Prompts completed on this device: ",timeUp:"Time's up.",done:"Nice. Done."};
var times=[[15,"0:15"],[30,"0:30"],[45,"0:45"],[60,"1:00"],[180,"3:00"]];
var mode="Doodle",secs=45,total=45,endAt=0,tick=null,current="";

function pick(a){return a[Math.floor(Math.random()*a.length)]}
function fmt(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function show(id){["setup","run","end"].forEach(function(x){$(x).hidden=(x!==id)});schedulePromptFit()}
// Keep the frame stable; fit the full prompt into the available card space.
var fitFrame = null;
function schedulePromptFit(){
  if(fitFrame !== null)cancelAnimationFrame(fitFrame);
  fitFrame=requestAnimationFrame(function(){fitFrame=null;fitPrompts()});
}
function fitPrompts(){
  ["ptext","pdone"].forEach(function(id){
    var text=$(id),card=text.parentElement;
    if(!text.getClientRects().length)return;
    text.style.fontSize="";
    var style=getComputedStyle(card),label=card.querySelector("small");
    var labelStyle=getComputedStyle(label);
    var available=card.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)
      -label.offsetHeight-parseFloat(labelStyle.marginTop)-parseFloat(labelStyle.marginBottom);
    var base=parseFloat(getComputedStyle(text).fontSize);
    if(text.scrollHeight<=available && text.scrollWidth<=text.clientWidth)return;
    var low=Math.min(base,16),high=base;
    text.style.fontSize=low+"px";
    // Preserve a readable minimum; the panel can scroll on very small screens.
    if(text.scrollHeight>available || text.scrollWidth>text.clientWidth)return;
    for(var i=0;i<10;i++){
      var size=(low+high)/2;text.style.fontSize=size+"px";
      if(text.scrollHeight<=available && text.scrollWidth<=text.clientWidth)low=size;else high=size;
    }
    text.style.fontSize=low+"px";
  });
}
function chips(box,items,isSel,onPick){
  box.innerHTML="";
  items.forEach(function(it){
    var b=document.createElement("button");b.className="chip";b.type="button";b.textContent=it.label;
    b.setAttribute("aria-pressed",isSel(it.value));
    b.onclick=function(){onPick(it.value);[].forEach.call(box.children,function(c,i){c.setAttribute("aria-pressed",isSel(items[i].value))})};
    box.appendChild(b);
  });
}
// Prompt content lives in JSON; the timer and UI stay in this file.
async function loadPrompts() {
  var button = $("go");
  button.disabled = true;
  try {
    var response = await fetch(spanish?"/data/prompts.es.json":"/data/prompts.json");
    if (!response.ok) throw new Error("Could not load prompts");
    var data = await response.json();
    if (!Array.isArray(data.adjectives) || !data.adjectives.length ||
        !Array.isArray(data.nouns) || !data.nouns.length ||
        !data.modes || typeof data.modes.Draw !== "string" ||
        !data.adjectives.every(function(x){return spanish?x && typeof x.m==="string" && typeof x.f==="string":typeof x === "string"}) ||
        !data.nouns.every(function(x){return spanish?x && typeof x.word==="string" && (x.gender==="m" || x.gender==="f"):typeof x === "string"}) ||
        !Object.values(data.modes).every(function(x){return typeof x === "string"})) {
      throw new Error("Invalid prompt data");
    }
    prompts = data;
    modes = data.modes;
    chips($("modes"),["Doodle","Draw","Write","Free"].map(function(k){return{label:labels?labels[k]:k,value:k}}),function(v){return v===mode},function(v){mode=v});
    button.textContent = copy.go;
    $("promptError").hidden = true;
  } catch (error) {
    button.textContent = copy.retry;
    $("promptError").hidden = false;
  } finally {
    button.disabled = false;
  }
}
chips($("times"),times.map(function(t){return{label:t[1],value:t[0]}}),function(v){return v===secs},function(v){secs=v});

function getCount(){try{return parseInt(localStorage.getItem("brwr_done")||"0",10)||0}catch(e){return 0}}
function addCount(){try{localStorage.setItem("brwr_done",String(getCount()+1))}catch(e){}}
function renderCount(){var n=getCount();["count","count2"].forEach(function(id){var el=$(id);el.hidden=!n;el.querySelector("span").textContent=copy.count+n})}
function resetCount(){try{localStorage.setItem("brwr_done","0")}catch(e){}renderCount()}
[].forEach.call(document.querySelectorAll(".reset"),function(b){b.onclick=resetCount});

function newPrompt(){
  var adjective=pick(prompts.adjectives),noun=pick(prompts.nouns);
  var article=spanish?(noun.gender==="f"?"una":"un"):"";
  current=modes[mode].replace(/\{adjective\}/g,spanish?adjective[noun.gender]:adjective)
    .replace(/\{noun\}/g,spanish?noun.word:noun).replace(/\{article\}/g,article);
  $("ptext").textContent=current;
}
function start(){
  total=secs;endAt=Date.now()+secs*1000;newPrompt();show("run");
  clearInterval(tick);tick=setInterval(update,200);update();
}
function update(){
  var left=(endAt-Date.now())/1000;
  $("clock").textContent=fmt(left);
  $("fill").style.width=Math.max(0,left/total*100)+"%";
  if(left<=0)finish(true);
}
function finish(timeUp){
  clearInterval(tick);
  $("endmsg").textContent=timeUp?copy.timeUp:copy.done;
  $("pdone").textContent=current;addCount();renderCount();show("end");
}
$("go").onclick=function(){if(prompts)start();else loadPrompts()};$("again").onclick=start;
$("finish").onclick=function(){finish(false)};
$("back").onclick=function(){show("setup")};
// Native dialogs support Escape and restore focus to the opening button.
[["how", "openHow", "closeHow"], ["faqDialog", "openFaq", "closeFaq"]].forEach(function(ids){
  var dialog = $(ids[0]);
  $(ids[1]).onclick = function(){dialog.showModal()};
  $(ids[2]).onclick = function(){dialog.close()};
  dialog.addEventListener("click", function(event){if(event.target === dialog)dialog.close()});
});
// Copy only the email address; keep the mailto link available independently.
var copyEmail=$("copyEmail");
if(copyEmail)copyEmail.onclick=async function(){
  copyEmail.disabled=true;
  var status=$("copyEmailStatus");
  status.textContent="";
  try{
    await navigator.clipboard.writeText($("contactEmail").textContent.trim());
    status.textContent=spanish?"Correo copiado.":"Email copied.";
  }catch(error){
    status.textContent=spanish?"No se pudo copiar. Selecciona el correo y cópialo manualmente.":"Could not copy. Select the email address and copy it manually.";
  }finally{copyEmail.disabled=false;}
};
renderCount();show("setup");
if(typeof ResizeObserver!=="undefined")new ResizeObserver(schedulePromptFit).observe(document.querySelector(".panel"));
window.addEventListener("resize",schedulePromptFit);
if(document.fonts)document.fonts.ready.then(schedulePromptFit);
loadPrompts();
})();
