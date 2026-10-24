const $ = s => document.querySelector(s);
const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
const maps = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);

/* ---------- Data: 8 items, each with damages ---------- */
/* rp = approx new price (₹), kg = waste avoided, c = repair cost range (₹) */
const ITEMS = [
{n:"Smartphone",i:"📱",rp:15000,kg:0.2,k:["phone","mobile","smartphone","iphone","android","headphone"],
 ru:"Use it as a backup phone, music player or home camera.",dn:"Donate working phones to schools or NGOs after wiping your data.",rc:"Hand it to an authorised e-waste center. Never use household bins.",
 d:[{n:"Cracked screen",c:[2000,4000],l:"Medium",t:"1–2 hours",s:["Back up your data first","Visit a trusted shop for a screen replacement","Ask for a warranty on the new screen"]},
    {n:"Battery drains fast",c:[800,1800],l:"Medium",t:"30 minutes",s:["Check battery health in settings","Replace the battery at a service center","Avoid cheap unbranded batteries"]},
    {n:"Won’t turn on",c:[500,3000],l:"Needs a professional",t:"1–3 days",s:["Try another charger and cable","Charge for 30 minutes, then hold the power button","If still dead, get it checked at a repair shop"]}]},
{n:"Laptop",i:"💻",rp:40000,kg:2.5,k:["laptop","computer","macbook","notebook"],
 ru:"Turn it into a media server or a study machine for kids.",dn:"Donate it to a school or learning center after wiping your data.",rc:"Give it to an authorised e-waste center.",
 d:[{n:"Slow performance",c:[0,3000],l:"Easy",t:"1–2 hours",s:["Remove unused programs and startup apps","Upgrade to an SSD or add more RAM","Clean dust from the fans and vents"]},
    {n:"Broken screen",c:[4000,9000],l:"Medium",t:"1–2 days",s:["Find your exact model number","Get a quote from a laptop service center","Compare it with the price of a used laptop"]}]},
{n:"Chair & Furniture",i:"🪑",rp:3000,kg:6,k:["chair","stool","table","desk","furniture","sofa","bench"],
 ru:"Turn it into a plant stand or a garden seat.",dn:"Offer it to neighbours, hostels or local groups.",rc:"Send broken wood to a carpenter or scrap dealer.",
 d:[{n:"Broken leg",c:[150,400],l:"Easy",t:"1–2 hours",s:["Clean old glue from the joint","Apply wood glue and clamp for 24 hours","Add a small screw or brace for strength"]},
    {n:"Wobbly",c:[0,100],l:"Easy",t:"20 minutes",s:["Tighten all screws and bolts","Fill loose holes with glue and toothpicks","Add felt pads under the legs"]}]},
{n:"T-Shirt & Clothes",i:"👕",rp:500,kg:0.25,k:["shirt","tshirt","t-shirt","cloth","jeans","dress","kurta","saree","jacket","pant"],
 ru:"Make a tote bag, cleaning cloths or a pet blanket.",dn:"Donate wearable clothes to NGOs and clothing drives.",rc:"Give worn-out fabric to textile recycling.",
 d:[{n:"Hole or tear",c:[0,50],l:"Easy",t:"20 minutes",s:["Turn the shirt inside out","Stitch the hole or iron on a patch","Use thread that matches the color"]},
    {n:"Faded or stained",c:[0,50],l:"Easy",t:"1 hour",s:["Soak in warm water with detergent","Try lemon and salt on light stains","Dry in the shade to protect the color"]}]},
{n:"Bag",i:"🎒",rp:1200,kg:0.6,k:["bag","backpack","purse","wallet"],
 ru:"Use it for storage, gardening or as a pencil pouch.",dn:"Donate usable bags to NGOs.",rc:"Give worn-out bags to textile recycling.",
 d:[{n:"Broken zip",c:[50,150],l:"Easy",t:"30 minutes",s:["Rub a pencil or soap on the zip teeth","Replace the zip slider if it is loose","Ask a tailor to change the whole zip"]},
    {n:"Torn strap",c:[50,200],l:"Easy",t:"1 hour",s:["Unpick the damaged stitches","Re-stitch with strong thread in a box pattern","Add a patch for extra strength"]}]},
{n:"Shoes",i:"👟",rp:2000,kg:0.8,k:["shoe","sandal","slipper","boot","sneaker"],
 ru:"Old shoes make quirky planters or garden decor.",dn:"Donate clean, usable shoes to NGOs.",rc:"Give worn-out shoes to rubber or textile recycling.",
 d:[{n:"Worn sole",c:[150,400],l:"Easy",t:"1 day",s:["Take them to a local cobbler","Ask for a new sole or heel patch","Use shoe polish to restore the look"]},
    {n:"Torn stitching",c:[50,150],l:"Easy",t:"30 minutes",s:["Clean the area around the tear","Re-stitch with strong thread or ask a cobbler","Seal the seam with shoe glue"]}]},
{n:"Table Fan",i:"🌀",rp:2500,kg:3,k:["fan"],
 ru:"Reuse the motor and parts for DIY projects.",dn:"Give a working fan to a neighbour or a shelter.",rc:"Hand it to an authorised e-waste center.",
 d:[{n:"Not spinning",c:[200,600],l:"Medium",t:"1 hour",s:["Switch off power and check the plug and switch","Oil the motor bearings with a few drops","If still stuck, ask an electrician to check the capacitor"]},
    {n:"Making noise",c:[0,300],l:"Easy",t:"45 minutes",s:["Switch off and unplug the fan first","Clean dust from the blades and the motor","Tighten the screws and oil the bearings"]}]},
{n:"Mixer Grinder",i:"🍹",rp:3500,kg:2,k:["mixer","grinder","blender"],
 ru:"Use the jar as a kitchen storage container.",dn:"Donate a working mixer to a community kitchen.",rc:"Hand it to an authorised e-waste center.",
 d:[{n:"Jar leaking",c:[100,400],l:"Easy",t:"30 minutes",s:["Check the rubber gasket under the jar","Replace it with a matching gasket","Tighten the jar base properly"]},
    {n:"Motor not running",c:[400,1200],l:"Medium",t:"1–2 days",s:["Unplug it and check the power cord","Ask a technician to check the carbon brushes","Replace worn parts instead of the whole mixer"]}]}
];

/* ================= CANVAS PROTOCOL ================= */
const S = { item: -1, dmg: -1, counted: {}, held: null };
let tot = { n: 0, s: 0, k: 0 };
try { const r = JSON.parse(localStorage.getItem("fif") || "null"); if (r && typeof r.n === "number") tot = r; } catch (e) {}
function paint(){ $("#tN").textContent = tot.n; $("#tS").textContent = fmt(tot.s); $("#tK").textContent = tot.k.toFixed(1) + " kg"; }
function saveTot(){ try { localStorage.setItem("fif", JSON.stringify(tot)); } catch (e) {} }

function say(m){
  const t = $("#toast");
  t.textContent = m; t.classList.add("show");
  clearTimeout(say.t); say.t = setTimeout(() => t.classList.remove("show"), 3800);
}

/* ---------- Mobile menu (navigation only) ---------- */
const nav = $("#nav"), menu = $("#menu");
menu.onclick = () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
  menu.textContent = open ? "✕" : "☰";
};
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open"); menu.textContent = "☰"; menu.setAttribute("aria-expanded", "false");
}));

/* ---------- Active nav link + scroll reveal ---------- */
const links = [...nav.querySelectorAll("a")];
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add("in");
    if (["home", "explore", "solutions", "about"].includes(e.target.id))
      links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
  }
}), { threshold: .05 });
document.querySelectorAll(".reveal,#home").forEach(el => io.observe(el));

/* ---------- Render: tray (cards you can drag) ---------- */
function renderTray(){
  const q = $("#q").value.trim().toLowerCase();
  const T = $("#tray");
  if (S.item < 0) {
    $("#trayT").textContent = "ITEM CARDS";
    let h = '<div class="dcard sp" data-drag="voice" tabindex="0"><span>🎙️</span><b>Say it</b><small>Voice card</small></div>' +
            '<div class="dcard sp" data-drag="photo" tabindex="0"><span>📷</span><b>Show it</b><small>Photo card</small></div>';
    const list = ITEMS.map((it, i) => [it, i]).filter(([it]) =>
      !q || it.n.toLowerCase().includes(q) || it.k.some(w => w.includes(q) || q.includes(w)));
    h += list.map(([it, i]) =>
      '<div class="dcard" data-drag="item" data-id="' + i + '" tabindex="0"><span>' + it.i + '</span><b>' + it.n +
      '</b><small>' + it.d.length + ' damage types</small></div>').join("");
    if (!list.length) h += '<p class="none">No item matches. Try another word.</p>';
    T.innerHTML = h;
  } else {
    const it = ITEMS[S.item];
    $("#trayT").textContent = "DAMAGE CARDS: " + it.n.toUpperCase();
    T.innerHTML = it.d.map((d, j) =>
      '<div class="dcard" data-drag="dmg" data-id="' + j + '" tabindex="0"><span>⚠️</span><b>' + d.n +
      '</b><small>' + d.l + '</small></div>').join("");
  }
}
$("#q").addEventListener("input", () => { if (S.item < 0) renderTray(); });

/* ---------- Render: Analyze zone slots ---------- */
function renderSlots(){
  const it = S.item >= 0 ? ITEMS[S.item] : null;
  const d = it && S.dmg >= 0 ? it.d[S.dmg] : null;
  const a = $("#sItem"), b = $("#sDmg");
  a.innerHTML = it ? '<span>' + it.i + '</span><b>' + it.n + '</b>' : "Drop an item card here";
  b.innerHTML = d ? '<span>⚠️</span><b>' + d.n + '</b>' : (it ? "Now drop a damage card" : "Damage goes here");
  a.classList.toggle("full", !!it);
  b.classList.toggle("full", !!d);
}

/* ---------- Render: results (solution cards you can drag) ---------- */
const sc = (id, ic, t, txt) =>
  '<article class="rc sc" data-drag="sol" data-id="' + id + '" tabindex="0"><h4><span>' + ic + '</span>' + t + '</h4><p>' + txt + '</p></article>';
function renderResult(){
  const box = $("#results");
  S.counted = {};
  if (S.item < 0 || S.dmg < 0) { box.innerHTML = ""; return; }
  const it = ITEMS[S.item], d = it.d[S.dmg];
  const mid = (d.c[0] + d.c[1]) / 2, saved = Math.max(0, it.rp - mid);
  const w = Math.max(16, Math.round(mid / it.rp * 100));
  const cost = d.c[1] === 0 ? "Free" : fmt(d.c[0]) + "–" + fmt(d.c[1]);
  box.innerHTML =
    '<div class="rhead"><h3>' + it.n + ': <mark>' + d.n + '</mark></h3><p>Drag a solution card into an action zone →</p></div>' +
    '<div class="rgrid">' +
      '<article class="rc sc" data-drag="sol" data-id="repair" tabindex="0"><h4><span>🔧</span>Repair <em>BEST FIRST</em></h4>' +
        '<div class="meta"><span>' + cost + '</span><span>' + d.l + '</span><span>' + d.t + '</span></div>' +
        '<ol>' + d.s.map(x => "<li>" + x + "</li>").join("") + '</ol></article>' +
      sc("reuse", "♻️", "Reuse", it.ru) + sc("donate", "💚", "Donate", it.dn) + sc("recycle", "🌍", "Recycle <em>LAST STEP</em>", it.rc) +
    '</div>' +
    '<div class="cmp"><h3>Repair vs replace</h3>' +
      '<p>Repair (about ' + fmt(mid) + ')</p><div class="bar b1" style="width:' + w + '%">' + fmt(mid) + '</div>' +
      '<p>Buy new (about ' + fmt(it.rp) + ')</p><div class="bar b2" style="width:100%">' + fmt(it.rp) + '</div>' +
      '<p class="sv">You could save about <b>' + fmt(saved) + '</b> and avoid about <b>' + it.kg + ' kg</b> of waste.</p>' +
      '<p>Costs are rough estimates and vary by city and shop.</p></div>';
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function reset(){
  S.item = -1; S.dmg = -1; S.counted = {};
  $("#q").value = ""; $("#pv").innerHTML = ""; $("#photo").value = "";
  renderTray(); renderSlots(); renderResult();
}

/* ---------- Voice card ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function listen(){
  if (!SR) return say("Voice isn’t supported in this browser. Use the search box or drag an item card.");
  const r = new SR();
  r.lang = "en-IN"; r.interimResults = false;
  r.onstart = () => say("Listening… say an item name.");
  r.onresult = e => {
    const s = e.results[0][0].transcript.toLowerCase();
    const i = ITEMS.findIndex(it => it.k.some(w => s.includes(w)));
    i >= 0 ? drop("analyze", { type: "item", id: i }) : say("I heard “" + s + "” but found no matching item card.");
  };
  r.onerror = e => say(e.error === "not-allowed" ? "Microphone access was blocked." : "Couldn’t hear that. Please try again.");
  try { r.start(); } catch (err) { say("Voice couldn’t start. Please try again."); }
}

/* ---------- Photo card (preview only) ---------- */
$("#photo").onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  const img = document.createElement("img");
  img.src = URL.createObjectURL(f); img.alt = "Your photo";
  $("#pv").innerHTML = ""; $("#pv").appendChild(img);
  say("Photo added as a preview. Photo recognition is coming soon, so drag the matching item card.");
};

/* ---------- What happens when a card lands in a zone ---------- */
function drop(zone, p){
  if (zone === "clear") { reset(); return say("Canvas cleared. Start with a new item card."); }

  if (zone === "analyze") {
    if (p.type === "item") { S.item = +p.id; S.dmg = -1; renderTray(); renderSlots(); renderResult(); return say("Great. Now drop a damage card."); }
    if (p.type === "dmg") {
      if (S.item < 0) return say("Drop an item card first.");
      S.dmg = +p.id; renderSlots(); renderResult();
      return say("Analysis ready. Drag a solution card into an action zone.");
    }
    if (p.type === "voice") return listen();
    if (p.type === "photo") return $("#photo").click();
    return say("Solution cards go to the action zones.");
  }

  if (p.type !== "sol") return say("Only solution cards work there. Start in the Analyze zone.");
  if (S.item < 0 || S.dmg < 0) return;
  const it = ITEMS[S.item], d = it.d[S.dmg];

  if (zone === "impact") {
    if (S.counted[p.id]) return say("You already counted this solution.");
    const first = !Object.keys(S.counted).length;
    S.counted[p.id] = 1;
    const addS = p.id === "repair" ? Math.max(0, it.rp - (d.c[0] + d.c[1]) / 2) : 0;
    if (first) tot.n++;
    tot.s += addS; tot.k += it.kg;
    paint(); saveTot();
    const z = document.querySelector('[data-zone="impact"]');
    z.classList.add("hit"); setTimeout(() => z.classList.remove("hit"), 650);
    return say(addS ? "Impact added: " + fmt(addS) + " saved and " + it.kg + " kg waste avoided." : "Impact added: " + it.kg + " kg waste avoided.");
  }

  if (zone === "shops") {
    const q = { repair: "repair shop near me", reuse: "upcycling craft store near me", donate: "donation center near me", recycle: "e-waste recycling center near me" }[p.id];
    window.open(maps(q), "_blank", "noopener");
    say("Opening Google Maps…");
  }
}

/* ---------- Drag engine (mouse + touch via pointer events) ---------- */
let drag = null;
const zoneAt = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.closest("[data-zone]"); };
const clearOver = () => document.querySelectorAll(".over").forEach(z => z.classList.remove("over"));

document.addEventListener("mousedown", e => { if (e.target.closest("[data-drag]")) e.preventDefault(); });

document.addEventListener("pointerdown", e => {
  const c = e.target.closest("[data-drag]");
  if (!c || e.button > 0) return;
  e.preventDefault();
  const r = c.getBoundingClientRect();
  const g = c.cloneNode(true);
  g.classList.add("ghost"); g.removeAttribute("tabindex");
  g.style.width = r.width + "px"; g.style.left = r.left + "px"; g.style.top = r.top + "px";
  document.body.appendChild(g);
  c.classList.add("lift");
  document.body.classList.add("dragging");
  drag = { c, g, dx: e.clientX - r.left, dy: e.clientY - r.top, p: { type: c.dataset.drag, id: c.dataset.id } };
});

document.addEventListener("pointermove", e => {
  if (!drag) return;
  drag.g.style.left = (e.clientX - drag.dx) + "px";
  drag.g.style.top = (e.clientY - drag.dy) + "px";
  clearOver();
  const z = zoneAt(e.clientX, e.clientY);
  if (z) z.classList.add("over");
  if (e.clientY < 90) scrollBy(0, -16); else if (e.clientY > innerHeight - 90) scrollBy(0, 16);
});

function endDrag(e){
  if (!drag) return;
  const { c, g, p } = drag;
  const z = e.type === "pointerup" ? zoneAt(e.clientX, e.clientY) : null;
  drag = null;
  g.remove(); c.classList.remove("lift"); clearOver();
  document.body.classList.remove("dragging");
  if (z) drop(z.dataset.zone, p);
}
document.addEventListener("pointerup", endDrag);
document.addEventListener("pointercancel", endDrag);

/* ---------- Keyboard alternative: Enter to pick up, Enter on a zone to drop ---------- */
document.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const c = e.target.closest("[data-drag]");
  if (c) {
    S.held = { type: c.dataset.drag, id: c.dataset.id };
    document.querySelectorAll(".held").forEach(x => x.classList.remove("held"));
    c.classList.add("held");
    e.preventDefault();
    return say("Card picked up. Press Tab to reach a zone, then Enter to drop it.");
  }
  const z = e.target.closest("[data-zone]");
  if (z && S.held) {
    const h = S.held; S.held = null;
    document.querySelectorAll(".held").forEach(x => x.classList.remove("held"));
    e.preventDefault();
    drop(z.dataset.zone, h);
  }
});

paint(); renderTray(); renderSlots();