(function(){
var $=function(id){return document.getElementById(id)};
var prompts = null;
var modes = {};
var times=[[15,"0:15"],[30,"0:30"],[45,"0:45"],[60,"1:00"],[180,"3:00"]];
var mode="Draw",secs=45,total=45,endAt=0,tick=null,current="";

function pick(a){return a[Math.floor(Math.random()*a.length)]}
function fmt(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function show(id){["setup","run","end"].forEach(function(x){$(x).hidden=(x!==id)})}
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
    var response = await fetch("data/prompts.json");
    if (!response.ok) throw new Error("Could not load prompts");
    var data = await response.json();
    if (!Array.isArray(data.adjectives) || !data.adjectives.length ||
        !Array.isArray(data.nouns) || !data.nouns.length ||
        !data.modes || typeof data.modes.Draw !== "string" ||
        !data.adjectives.every(function(x){return typeof x === "string"}) ||
        !data.nouns.every(function(x){return typeof x === "string"}) ||
        !Object.values(data.modes).every(function(x){return typeof x === "string"})) {
      throw new Error("Invalid prompt data");
    }
    prompts = data;
    modes = data.modes;
    chips($("modes"),Object.keys(modes).map(function(k){return{label:k,value:k}}),function(v){return v===mode},function(v){mode=v});
    button.textContent = "Give me a prompt";
    $("promptError").hidden = true;
  } catch (error) {
    button.textContent = "Retry loading prompts";
    $("promptError").hidden = false;
  } finally {
    button.disabled = false;
  }
}
chips($("times"),times.map(function(t){return{label:t[1],value:t[0]}}),function(v){return v===secs},function(v){secs=v});

function getCount(){try{return parseInt(localStorage.getItem("brwr_done")||"0",10)||0}catch(e){return 0}}
function addCount(){try{localStorage.setItem("brwr_done",String(getCount()+1))}catch(e){}}
function renderCount(){var n=getCount();["count","count2"].forEach(function(id){var el=$(id);el.hidden=!n;el.querySelector("span").textContent="Prompts completed on this device: "+n})}
function resetCount(){try{localStorage.setItem("brwr_done","0")}catch(e){}renderCount()}
[].forEach.call(document.querySelectorAll(".reset"),function(b){b.onclick=resetCount});

function newPrompt(){current=modes[mode].replace(/\{adjective\}/g,pick(prompts.adjectives)).replace(/\{noun\}/g,pick(prompts.nouns));$("ptext").textContent=current}
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
  $("endmsg").textContent=timeUp?"Time's up.":"Nice. Done.";
  $("pdone").textContent=current;addCount();renderCount();show("end");
}
$("go").onclick=function(){if(prompts)start();else loadPrompts()};$("again").onclick=start;
$("finish").onclick=function(){finish(false)};
$("back").onclick=function(){show("setup")};
var dlg=$("how");
$("openHow").onclick=function(){dlg.showModal()};
$("closeHow").onclick=function(){dlg.close()};
dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close()});
renderCount();show("setup");
loadPrompts();
})();

