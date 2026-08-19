import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { collection, onSnapshot, doc, updateDoc, setDoc }
from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const $=s=>document.querySelector(s);
let orders=[];

$("#loginForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const btn=$("#loginBtn"),err=$("#loginError");
 err.textContent="";btn.disabled=true;btn.textContent="Signing in...";
 try{await signInWithEmailAndPassword(auth,$("#loginEmail").value.trim(),$("#loginPassword").value)}
 catch(x){console.error(x);err.textContent="Invalid email/password, or this account is not an admin.";btn.disabled=false;btn.textContent="Sign In"}
});

onAuthStateChanged(auth,user=>{
 if(user){$("#loginView").classList.add("hidden");$("#dashboardView").classList.remove("hidden");$("#ownerEmail").textContent=user.email||"Owner";listenOrders()}
 else{$("#dashboardView").classList.add("hidden");$("#loginView").classList.remove("hidden")}
});

$("#logoutBtn").onclick=()=>signOut(auth);
$("#orderSearch").oninput=render;
$("#statusFilter").onchange=render;
$("#refreshBtn").onclick=render;
$("#closeModal").onclick=()=>$("#orderModal").classList.remove("show");
$("#orderModal").onclick=e=>{if(e.target.id==="orderModal")$("#orderModal").classList.remove("show")};

function listenOrders(){
 onSnapshot(collection(db,"orders"),snap=>{
  orders=snap.docs.map(d=>({firestoreId:d.id,...d.data()}));
  orders.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
  render();
 },err=>{
  console.error(err);
  $("#ordersContainer").innerHTML='<div class="empty">Unable to load orders. Check Firestore rules/admin setup.</div>';
 });
}

function filtered(){
 const q=$("#orderSearch").value.trim().toLowerCase(),s=$("#statusFilter").value;
 return orders.filter(o=>{
  const c=o.customer||{},text=`${o.orderId||""} ${c.name||""} ${c.phone||""} ${c.address||""}`.toLowerCase();
  return text.includes(q)&&(s==="All"||o.status===s);
 });
}

function render(){
 const newN=orders.filter(o=>o.status==="New").length;
 const active=orders.filter(o=>["Confirmed","Preparing","Out for Delivery"].includes(o.status)).length;
 const delivered=orders.filter(o=>o.status==="Delivered").length;
 const sales=orders.reduce((n,o)=>n+(Number(o.total)||0),0);
 $("#totalOrders").textContent=orders.length;$("#newOrders").textContent=newN;$("#activeOrders").textContent=active;$("#deliveredOrders").textContent=delivered;$("#totalSales").textContent=money(sales);
 const list=filtered(),box=$("#ordersContainer");
 if(!list.length){box.innerHTML='<div class="empty">No orders found.</div>';return}
 box.innerHTML=list.map(o=>{
  const c=o.customer||{},items=(o.items||[]).reduce((n,i)=>n+(Number(i.quantity)||0),0);
  return `<div class="order">
   <div><div class="order-id">${esc(o.orderId||"Order")}</div><div class="muted">${date(o.createdAt)}</div></div>
   <div class="customer"><b>${esc(c.name||"Customer")}</b><span class="muted">${esc(c.phone||"")}</span></div>
   <div class="muted">${items} item${items===1?"":"s"}<br>Cash on Delivery</div>
   <div class="total">${money(o.total)}</div>
   <div><select class="status" data-id="${o.firestoreId}">${["New","Confirmed","Preparing","Out for Delivery","Delivered","Cancelled"].map(s=>`<option ${o.status===s?"selected":""}>${s}</option>`).join("")}</select><button class="view" data-view="${o.firestoreId}">View</button></div>
  </div>`
 }).join("");
 box.querySelectorAll(".status").forEach(s=>s.onchange=async()=>{try{await updateDoc(doc(db,"orders",s.dataset.id),{status:s.value,updatedAt:new Date()});
const changed=orders.find(x=>x.firestoreId===s.dataset.id);
if(changed?.trackingId){ await setDoc(doc(db,"tracking",changed.trackingId),{status:s.value,orderId:changed.orderId,trackingId:changed.trackingId,updatedAt:new Date()},{merge:true}); }}catch(e){console.error(e);alert("Unable to update status.")}});
 box.querySelectorAll(".view").forEach(b=>b.onclick=()=>show(orders.find(o=>o.firestoreId===b.dataset.view)));
}

function show(o){
 const c=o.customer||{},items=o.items||[];
 $("#modalOrderId").textContent=o.orderId||"Order";
 $("#modalBody").innerHTML=`<div class="details">
 <div class="detail-grid">
  <div class="detail"><small>CUSTOMER</small><b>${esc(c.name||"-")}</b></div>
  <div class="detail"><small>PHONE</small><b>${esc(c.phone||"-")}</b></div>
  <div class="detail"><small>STATUS</small><b>${esc(o.status||"New")}</b></div>
  <div class="detail"><small>PAYMENT</small><b>${esc(o.paymentMethod||"Cash on Delivery")}</b></div>
  <div class="detail" style="grid-column:1/-1"><small>DELIVERY ADDRESS</small><b>${esc(c.address||"-")}</b></div>
 </div>
 <table class="items"><thead><tr><th>MEDICINE</th><th>QTY</th><th>PRICE</th><th>SUBTOTAL</th></tr></thead><tbody>${items.map(i=>`<tr><td>${esc(i.name||"")}<br><small>${esc(i.salt||"")}</small></td><td>${i.quantity||0}</td><td>${money(i.price)}</td><td>${money((Number(i.price)||0)*(Number(i.quantity)||0))}</td></tr>`).join("")}</tbody></table>
 <div class="grand"><span>Total</span><b>${money(o.total)}</b></div>
 <div class="actions"><a class="call" href="tel:${esc(c.phone||"")}">📞 Call Customer</a><a class="wa" target="_blank" href="https://wa.me/${phone(c.phone)}?text=${encodeURIComponent(`Hello ${c.name||"Customer"}, this is Shraddha Medical Shop regarding your order ${o.orderId||""}.`)}">💬 WhatsApp</a></div>
 </div>`;
 $("#orderModal").classList.add("show");
}

function money(n){return "₹"+Number(n||0).toLocaleString("en-IN")}
function date(t){if(!t)return"Just now";try{return(t.toDate?t.toDate():new Date(t)).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}catch{return"Unknown time"}}
function phone(p){const d=String(p||"").replace(/\D/g,"");return d.length===10?"91"+d:d}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}