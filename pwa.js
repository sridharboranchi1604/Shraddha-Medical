(()=> {
const b=document.getElementById("installAppBanner"), ib=document.getElementById("installAppButton"), cb=document.getElementById("closeInstallBanner"), t=document.getElementById("installAppText");
let deferredPrompt=null;
const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
const standalone=window.matchMedia("(display-mode:standalone)").matches||navigator.standalone===true;
const safari=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
function show(msg,label){if(!b||standalone)return;if(t)t.textContent=msg;if(ib)ib.textContent=label;b.hidden=false;}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;show("Install the shop on your phone for quick access.","Install");});
if(ios&&safari&&!standalone)setTimeout(()=>show('In Safari, tap Share → "Add to Home Screen".',"How"),1800);
ib?.addEventListener("click",async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;b.hidden=true;return;}if(ios)alert('On iPhone: tap Share in Safari, then choose "Add to Home Screen".');});
cb?.addEventListener("click",()=>b.hidden=true);
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(e=>console.warn("SW:",e)));
})();