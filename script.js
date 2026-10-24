const $ = s => document.querySelector(s);
const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
const status = m => $("#status").textContent = m || "";
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

/* ---------- Impact counter (saved in the browser) ---------- */
let cur = -1, last = null, tot = {n:0, s:0, k:0};
try { const r = JSON.parse(localStorage.getItem("fif") || "null"); if (r && typeof r.n === "number") tot = r; } catch (e) {}
function paint(){ $("#tN").textContent = tot.n; $("#tS").textContent = fmt(tot.s); $("#tK").textContent = tot.k.toFixed(1) + " kg"; }
function saveTot(){ try { localStorage.setItem("fif", JSON.stringify(tot)); } catch (e) {} }

/* ---------- Mobile menu ---------- */
const nav = $("#nav"), menu = $("#menu");
menu.onclick = () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
  menu.textContent = open ? "✕" : "☰";
};
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open"); menu.textContent = "☰"; menu.setAttribute("aria-expanded", "false");
}));
const focusSearch = e => {
  if (e) e.preventDefault();
  $("#home").scrollIntoView({behavior:"smooth"});
  setTimeout(() => $("#q").focus({preventScroll:true}), 450);
};
$("#start").onclick = focusSearch;
$("#cta").onclick = focusSearch;

/* ---------- Active nav link + scroll reveal ---------- */
const links = [...nav.querySelectorAll("a")];
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add("in");
    if (["home","explore","solutions","about"].includes(e.target.id))
      links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
  }
}), {threshold:.25});
document.querySelectorAll(".reveal,#home").forEach(el => io.observe(el));

/* ---------- Item cards ---------- */
$("#cats").innerHTML = ITEMS.map((it, i) =>
  '<button class="cat" data-i="' + i + '"><span class="ci">' + it.i + '</span><b>' + it.n + '</b><small>' +
  it.d.slice(0, 2).map(d => d.n).join(", ") + '</small><span class="ar">↗</span></button>').join("");
$("#cats").addEventListener("click", e => {
  const c = e.target.closest(".cat");
  if (c) selectItem(+c.dataset.i);
});

/* ---------- Step 2: choose the damage ---------- */
function selectItem(i) {
  cur = i;
  const it = ITEMS[i], box = $("#dmg");
  document.querySelectorAll(".cat").forEach(c => c.classList.toggle("sel", +c.dataset.i === i));
  $("#results").hidden = true;
  box.hidden = false;
  box.innerHTML = '<h3>What’s wrong with your <mark></mark>?</h3><div class="chips"></div>';
  box.querySelector("mark").textContent = it.n.toLowerCase();
  const ch = box.querySelector(".chips");
  it.d.forEach((d, j) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = d.n; b.setAttribute("aria-pressed", "false");
    b.onclick = () => {
      [...ch.children].forEach(x => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      result(j);
    };
    ch.appendChild(b);
  });
  $("#explore").scrollIntoView();
  box.scrollIntoView({behavior:"smooth", block:"center"});
}

/* ---------- Step 3: result for that exact damage ---------- */
const card = (ic, t, txt) => '<article class="rc"><h4><span>' + ic + '</span>' + t + '</h4><p>' + txt + '</p></article>';
function result(j) {
  const it = ITEMS[cur], d = it.d[j];
  const mid = (d.c[0] + d.c[1]) / 2, saved = Math.max(0, it.rp - mid);
  const w = Math.max(16, Math.round(mid / it.rp * 100));
  const cost = d.c[1] === 0 ? "Free" : fmt(d.c[0]) + "–" + fmt(d.c[1]);
  last = {s:saved, k:it.kg};
  const box = $("#results");
  box.hidden = false;
  box.innerHTML =
    '<div class="rhead"><h3>' + it.n + ': <mark>' + d.n + '</mark></h3><p>Don’t throw it yet. Try these in order: repair, reuse, donate, then recycle.</p></div>' +
    '<div class="rgrid">' +
      '<article class="rc"><h4><span>🔧</span>Repair <em>BEST FIRST</em></h4>' +
        '<div class="meta"><span>' + cost + '</span><span>' + d.l + '</span><span>' + d.t + '</span></div>' +
        '<ol>' + d.s.map(x => "<li>" + x + "</li>").join("") + '</ol></article>' +
      card("♻️", "Reuse", it.ru) + card("💚", "Donate", it.dn) + card("🌍", "Recycle <em>LAST STEP</em>", it.rc) +
    '</div>' +
    '<div class="cmp"><h3>Repair vs replace</h3>' +
      '<p>Repair (about ' + fmt(mid) + ')</p><div class="bar b1" style="width:' + w + '%">' + fmt(mid) + '</div>' +
      '<p>Buy new (about ' + fmt(it.rp) + ')</p><div class="bar b2" style="width:100%">' + fmt(it.rp) + '</div>' +
      '<p class="sv">You could save about <b>' + fmt(saved) + '</b> and avoid about <b>' + it.kg + ' kg</b> of waste.</p>' +
      '<p>Costs are rough estimates and vary by city and shop.</p></div>' +
    '<div class="acts"><button type="button" class="btn" id="cnt">I’ll fix or reuse this</button>' +
      '<a class="btn2" target="_blank" rel="noopener" href="' + maps("repair shop near me") + '">📍 Find repair shops</a>' +
      '<a class="btn2" target="_blank" rel="noopener" href="' + maps("e-waste recycling center near me") + '">♻️ Find e-waste centers</a></div>';
  $("#cnt").onclick = e => {
    if (!last) return;
    tot.n++; tot.s += last.s; tot.k += last.k; last = null;
    paint(); saveTot();
    e.target.textContent = "Added to your impact ✓";
    e.target.disabled = true;
  };
  box.scrollIntoView({behavior:"smooth", block:"start"});
}

/* ---------- Search ---------- */
function noMatch(q) {
  const box = $("#dmg");
  $("#results").hidden = true;
  box.hidden = false;
  box.innerHTML = '<h3>No exact match for <mark></mark></h3><p style="color:var(--mut);margin-bottom:12px">Choose the closest item:</p><div class="chips">' +
    ITEMS.map((it, i) => '<button type="button" data-i="' + i + '">' + it.i + " " + it.n + "</button>").join("") + "</div>";
  box.querySelector("mark").textContent = q;
  box.querySelectorAll(".chips button").forEach(b => b.onclick = () => selectItem(+b.dataset.i));
  $("#explore").scrollIntoView();
  box.scrollIntoView({behavior:"smooth", block:"center"});
}
function run() {
  const q = $("#q").value.trim();
  if (!q) { status("Please type or say an item name first."); $("#q").focus(); return; }
  status("");
  const s = q.toLowerCase();
  const i = ITEMS.findIndex(it => it.k.some(w => s.includes(w)));
  i >= 0 ? selectItem(i) : noMatch(q);
}
$("#form").onsubmit = e => { e.preventDefault(); run(); };

/* ---------- Voice search ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
$("#voice").onclick = () => {
  if (!SR) { status("Voice search isn’t supported in this browser. Please type instead."); return; }
  const r = new SR(), b = $("#voice");
  r.lang = "en-IN"; r.interimResults = false;
  r.onstart = () => { b.classList.add("on"); status("Listening… say an item name."); };
  r.onresult = e => { $("#q").value = e.results[0][0].transcript.replace(/[.]$/, ""); status(""); run(); };
  r.onerror = e => status(e.error === "not-allowed"
    ? "Microphone access was blocked. Please allow it and try again."
    : "Couldn’t hear that. Please try again.");
  r.onend = () => b.classList.remove("on");
  try { r.start(); } catch (err) { status("Voice search couldn’t start. Please try again."); }
};

/* ---------- Photo upload (preview only) ---------- */
$("#cam").onclick = () => $("#photo").click();
$("#photo").onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  $("#pimg").src = URL.createObjectURL(f);
  $("#pname").textContent = f.name;
  $("#prev").classList.add("show");
  status("Photo added. Automatic photo recognition is coming soon, so please also type the item name.");
};
$("#rm").onclick = () => {
  $("#photo").value = ""; $("#pimg").src = "";
  $("#prev").classList.remove("show"); status("");
};

paint();