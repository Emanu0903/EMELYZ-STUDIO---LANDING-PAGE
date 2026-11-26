// Aplica la hoja de Google Fonts sin bloquear el renderizado inicial
// (ya fue precargada con <link rel="preload" as="style"> en el HTML).
(() => {
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=Figtree:wght@400;600&display=swap";
  document.head.appendChild(l);
})();

/* ===== CONFIGURACIÓN: editar solo esta sección ===== */
const WHATSAPP = "50360700168"; // código de país + número, sin + ni espacios
const DEFAULT_MSG = "Hola, quiero agendar una cita en EMILYZ STUDIO.";
const SERVICES = [
  { category: "Pestañas", groups: [
    { name: null, items: [["Lifting de pestañas", 15]] },
    { name: "Extensiones de pestañas", items: [
      ["Clásicas / naturales", 20], ["Efecto rímel", 22], ["Híbridas", 25],
      ["Medio volumen", 28], ["Full volumen", 30], ["Efecto wispy", 30]
    ] }
  ] },
  { category: "Cejas", groups: [
    { name: null, items: [
      ["Tinte de cejas", 10], ["Laminado de cejas", 10],
      ["Depilación con hilo y cera", 5], ["Depilación con navaja", 3]
    ] }
  ] }
];
// 0 = domingo ... 6 = sábado. [apertura, cierre] en horas (24h). null = cerrado
const HOURS = {1:[9,18],2:[9,18],3:[9,18],4:[9,18],5:[9,18],6:[9,16],0:null};
/* ================================================= */

const DAYS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const wa = t => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t||DEFAULT_MSG)}`;
const fmt = h => { const s = h>=12 ? "p. m." : "a. m."; return `${h%12||12}:00 ${s}`; };

// Enlaces de WhatsApp
document.querySelectorAll("[data-wa]").forEach(a=>{
  a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener";
});

// Servicios (cada botón abre WhatsApp con el servicio ya escrito)
document.getElementById("servicesList").innerHTML = SERVICES.map(({category, groups}, i) =>
  `<div class="service-category" aria-labelledby="category-${i}">
    <h3 class="category-title" id="category-${i}">${category}</h3>
    ${groups.map(({name, items}) => `${name ? `<h4 class="service-group">${name}</h4>` : ""}
      <ul class="services">${items.map(([service, price]) => {
        const fullName = name ? `${name}: ${service}` : `${category}: ${service}`;
        return `<li><div><h4>${service}</h4><p class="service-price">$${price}</p></div>
          <a class="btn" target="_blank" rel="noopener" aria-label="Consultar ${fullName} por $${price}" href="${wa(`Hola, quiero consultar disponibilidad para ${fullName} ($${price}).`)}">Consultar</a></li>`;
      }).join("")}</ul>`).join("")}
  </div>`).join("");

// Horarios y estado "abierto ahora"
const now = new Date(), today = now.getDay();
const order = [1,2,3,4,5,6,0];
document.getElementById("hours").innerHTML = order.map(d=>{
  const h = HOURS[d];
  return `<tr class="${d===today?"today":""}"><td>${DAYS[d]}</td><td>${h?`${fmt(h[0])} – ${fmt(h[1])}`:"Cerrado"}</td></tr>`;
}).join("");
const st = document.getElementById("status"), t = HOURS[today], hr = now.getHours()+now.getMinutes()/60;
if (t && hr>=t[0] && hr<t[1]) { st.textContent = `Abierto ahora · cierra a las ${fmt(t[1])}`; st.classList.add("open"); }
else st.textContent = "Cerrado ahora";

// Menú móvil
const menu = document.getElementById("menu"), nav = document.getElementById("nav");
menu.addEventListener("click",()=>{ const o = nav.classList.toggle("open"); menu.setAttribute("aria-expanded",o); });
nav.addEventListener("click",e=>{ if(e.target.tagName==="A"){ nav.classList.remove("open"); menu.setAttribute("aria-expanded",false);} });

document.getElementById("year").textContent = now.getFullYear();

// Mapa: se carga solo cuando se acerca al viewport, para no bloquear el render inicial
const map = document.querySelector("iframe.map");
if (map && map.dataset.src) {
  const loadMap = () => { if (!map.getAttribute("src")) map.src = map.dataset.src; };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => {
      if (es.some(e => e.isIntersecting)) { loadMap(); io.disconnect(); }
    }, { rootMargin: "400px" });
    io.observe(map);
  } else {
    loadMap();
  }
}
