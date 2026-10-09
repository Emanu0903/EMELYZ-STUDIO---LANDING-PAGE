/* ===== CONFIGURACIÓN: editar solo esta sección ===== */
const WHATSAPP = "50360700168"; // código de país + número, sin + ni espacios
const DEFAULT_MSG = "Hola, quiero agendar una cita en EMELYZ STUDIO.";
const SERVICES = [
  ["Corte y peinado","Corte a tu estilo, secado y peinado."],
  ["Color y mechas","Tintes, balayage y retoques de raíz."],
  ["Tratamientos capilares","Hidratación, keratina y reparación."],
  ["Manicure y pedicure","Esmalte tradicional, semipermanente y acrílico."],
  ["Maquillaje","Para eventos, graduaciones y sesiones."],
  ["Cejas y pestañas","Diseño, depilación y laminado."]
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
document.getElementById("servicesList").innerHTML = SERVICES.map(([n,d])=>
  `<li><div><h3>${n}</h3><p>${d}</p></div>
   <a class="btn" target="_blank" rel="noopener" href="${wa(`Hola, quiero consultar disponibilidad para: ${n}.`)}">Consultar</a></li>`).join("");

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
