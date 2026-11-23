const CFG={wa:"94XXXXXXXXX",rate:300};
const IMG=["images/ama-01.jpg", "images/ama-02.jpg", "images/ama-03.jpg", "images/ama-04.jpg", "images/ama-05.jpg", "images/ama-06.jpg", "images/ama-07.jpg", "images/ama-08.jpg", "images/ama-09.jpg", "images/ama-10.jpg", "images/ama-11.jpg", "images/ama-12.jpg"];
const ROOMS=[
{id:"ac",name:"Air-conditioned double room",usd:50,imgs:[3,4,7],t:"Double bed, air conditioning, wooden furniture and a window onto the garden."},
{id:"twin",name:"Twin room",usd:32,imgs:[2,1,11],t:"Two beds with fresh linen and towels. Good for friends or family."},
{id:"floor",name:"Entire upper floor",usd:64,imgs:[5,8,4],t:"Two bedrooms, living room, kitchen and a balcony over the mango trees. Up to 6 guests."}];
const lkr=u=>"LKR "+(Math.round(u*CFG.rate/500)*500).toLocaleString("en-US");
const $=id=>document.getElementById(id);
document.querySelectorAll("img[data-i]").forEach(i=>i.src=IMG[i.dataset.i]);
$("rl").innerHTML=ROOMS.map(r=>`<div class="room"><img id="m-${r.id}" src="${IMG[r.imgs[0]]}" alt="${r.name}"><div class="th">${r.imgs.map(i=>`<img src="${IMG[i]}" alt="" data-t="m-${r.id}" data-s="${i}">`).join("")}</div><div class="rb"><h3>${r.name}</h3><p>${r.t}</p><div class="pr">$${r.usd} / night<small>about ${lkr(r.usd)} / night</small></div></div></div>`).join("");
$("r").innerHTML=ROOMS.map(r=>`<option value="${r.name}">${r.name}</option>`).join("");
$("rl").onclick=e=>{const t=e.target.dataset.t;if(t)$(t).src=IMG[e.target.dataset.s]};
$("gl").innerHTML=IMG.map((s,i)=>`<img src="${s}" alt="Ama HomeStay photo ${i+1}" loading="lazy">`).join("");
$("gl").onclick=e=>{if(e.target.tagName=="IMG"){$("lb").firstChild.src=e.target.src;$("lb").classList.add("on")}};
$("lb").onclick=()=>$("lb").classList.remove("on");
const wa=m=>"https://wa.me/"+CFG.wa+"?text="+encodeURIComponent(m);
const today=new Date().toISOString().slice(0,10);$("a").min=$("b").min=today;
$("bf").onsubmit=e=>{e.preventDefault();window.open(wa(`Hello, I would like to book at Ama HomeStay.\nName: ${$("n").value}\nRoom: ${$("r").value}\nCheck-in: ${$("a").value}\nCheck-out: ${$("b").value}\nGuests: ${$("g").value}`),"_blank")};

/* Chat assistant: Claude when available, built-in answers otherwise */
const SYS=`You are the booking assistant for Ama HomeStay Guest Colombo, a guest house at 382 Kalapaluwawa, Rajagiriya, Colombo, Sri Lanka. Reply in the language the guest writes: Sinhala (script or Latin letters) or English. Be short, warm and accurate.
FACTS: ${ROOMS.map(r=>`${r.name} $${r.usd}/night (about ${lkr(r.usd)}), ${r.t}`).join(" | ")}. Prices are "from" rates for 2 guests; the host confirms final price. Free WiFi, parking, bicycles; AC rooms; balcony; garden; open-air bath; kitchen guests can cook in. No meals are served; shops are nearby. Check-in 12:00-22:00, check-out 05:00-11:00. Short or long stays welcome. Host Kumar Karunanayaka speaks English. About 9 km from Bambalapitiya station, 10 km from Khan Clock Tower, 16 km from Ratmalana airport.
RULES: Never invent facts, discounts or availability. If unsure, say the host will confirm on WhatsApp. You cannot confirm bookings. To book, collect room, check-in date, check-out date, number of guests and name (one question at a time). When you have all five, end your reply with one final line exactly: BOOK|room|check-in|check-out|guests|name`;
const hist=[];
function add(c,t,x){const d=document.createElement("div");d.className="m "+c;d.textContent=t;if(x){const a=document.createElement("a");a.className="btn";a.style.marginTop="8px";a.style.display="block";a.textContent="Send booking on WhatsApp";a.href=x;a.target="_blank";d.appendChild(a)}$("ms").appendChild(d);$("ms").scrollTop=1e9}
function local(t){const s=/[\u0D80-\u0DFF]|mila|kamara|kama|kema|koheda|thiyenawa/i.test(t),l=t.toLowerCase(),
P=ROOMS.map(r=>`${r.name}: $${r.usd} (${lkr(r.usd)})`).join("\n");
if(/price|cost|rate|how much|මිල|mila|ගාන|gana/.test(l))return s?"රාත්‍රියකට දළ මිල:\n"+P+"\nනිශ්චිත මිල host තහවුරු කරයි.":"Approx. price per night:\n"+P+"\nThe host confirms the final price.";
if(/food|meal|breakfast|eat|කෑම|kama|kema|කෑම/.test(l))return s?"මෙහි කෑම විකුණන්නේ නැහැ. Kitchen එකේ ඔයාටම උයාගන්න පුළුවන්, ළඟ කඩවලිනුත් ගන්න පුළුවන්.":"We don’t serve meals. You can cook in the kitchen or buy food from nearby shops.";
if(/room|bed|කාමර|kamara/.test(l))return s?"කාමර වර්ග 3ක්: AC double, twin, සහ මුළු උඩ තට්ටුව (කාමර 2, kitchen, living room).":"We have an AC double room, a twin room, and the entire upper floor (2 bedrooms, kitchen, living room).";
if(/where|location|address|map|කොහෙද|koheda|ලිපිනය/.test(l))return s?"382, Kalapaluwawa, Rajagiriya, Colombo.":"382, Kalapaluwawa, Rajagiriya, Colombo, about 9 km from Bambalapitiya station.";
if(/wifi|park|bike|bicycle|ac|amenit/.test(l))return s?"නොමිලේ WiFi, parking, බයිසිකල්, AC කාමර, balcony සහ garden තියෙනවා.":"Free WiFi, parking and bicycles, air-conditioned rooms, balcony and garden.";
return s?"මිල, කාමර, කෑම හෝ ලිපිනය ගැන අහන්න. බුක් කරන්න ඕන නම් පහළ form එක පුරවන්න.":"Ask me about prices, rooms, food or location. To book, use the form on this page and it opens WhatsApp.";}
async function reply(t){hist.push({role:"user",content:t});let o;
try{const s=await window.claude?.use("sample");if(!s)throw 0;const r=await s(SYS+"\n\nConversation so far:\n"+hist.map(m=>(m.role=="user"?"Guest: ":"Assistant: ")+m.content).join("\n")+"\nAssistant:",{cache:false,modelTier:"quick"});o=r.text}catch(e){o=local(t)}
let x=null;const m=o.match(/BOOK\|([^|\n]*)\|([^|\n]*)\|([^|\n]*)\|([^|\n]*)\|([^\n]*)/);
if(m){o=o.replace(m[0],"").trim();x=wa(`Hello, I would like to book at Ama HomeStay.\nName: ${m[5].trim()}\nRoom: ${m[1].trim()}\nCheck-in: ${m[2].trim()}\nCheck-out: ${m[3].trim()}\nGuests: ${m[4].trim()}`)}
hist.push({role:"assistant",content:o});add("a",o,x)}
$("cb").onclick=()=>{$("cp").classList.toggle("on");if(!$("ms").children.length)add("a","Hi! I’m the Ama HomeStay assistant. Ask me about rooms, prices, food or booking, in English or Sinhala.\nආයුබෝවන්! කාමර, මිල, කෑම හෝ බුකින් ගැන සිංහලෙන් හෝ English වලින් අහන්න.")};
$("cf").onsubmit=e=>{e.preventDefault();const t=$("ci").value.trim();if(!t)return;$("ci").value="";add("u",t);reply(t)};
