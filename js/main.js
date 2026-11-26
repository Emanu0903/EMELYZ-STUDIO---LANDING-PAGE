
/* ===== CONFIGURACIÓN: editar solo esta sección ===== */

const WHATSAPP = "50360700168"; // Código de país + número, sin + ni espacios

const DEFAULT_MSG = "Hola, quiero agendar una cita en EMILYZ STUDIO.";

const SERVICES = [
    {
        category: "Pestañas",
        groups: [
            {
                name: null,
                items: [["Lifting de pestañas", 15]]
            },
            {
                name: "Extensiones de pestañas",
                items: [
                    ["Clásicas / naturales", 20],
                    ["Efecto rímel", 22],
                    ["Híbridas", 25],
                    ["Medio volumen", 28],
                    ["Full volumen", 30],
                    ["Efecto wispy", 30]
                ]
            }
        ]
    },
    {
        category: "Cejas",
        groups: [
            {
                name: null,
                items: [
                    ["Tinte de cejas", 10],
                    ["Laminado de cejas", 10],
                    ["Depilación con hilo y cera", 5],
                    ["Depilación con navaja", 3]
                ]
            }
        ]
    }
];

// 0 = domingo ... 6 = sábado
// [apertura, cierre] en horas (24h). null = cerrado

const HOURS = {
    1: [9, 18],
    2: [9, 18],
    3: [9, 18],
    4: [9, 18],
    5: [9, 18],
    6: [9, 16],
    0: null
};

/* ================================================= */

// Nombres de los días de la semana
const DAYS = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
];

// Crear enlace de WhatsApp
const wa = (t) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t || DEFAULT_MSG)}`;

// Formatear horas
const fmt = (h) => {
    const s = h >= 12 ? "p. m." : "a. m.";
    return `${h % 12 || 12}:00 ${s}`;
};

function getLocalTime(tz) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    hourCycle: "h23"
  }).formatToParts(new Date());
  const get = type => parts.find(p => p.type === type).value;
  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    day: dayMap[get("weekday")],
    hour: Number(get("hour")) + Number(get("minute")) / 60,
    year: Number(get("year"))
  };
}

function getNextOpening(currentDay, currentHour) {
  const todayHours = HOURS[currentDay];
  if (todayHours && currentHour < todayHours[0]) {
    return `abre hoy a las ${fmt(todayHours[0])}`;
  }
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = (currentDay + offset) % 7;
    if (HOURS[nextDay]) {
      const label = offset === 1 ? "mañana" : `el ${DAYS[nextDay].toLowerCase()}`;
      return `abre ${label} a las ${fmt(HOURS[nextDay][0])}`;
    }
  }
  return "";
}

// Enlaces de WhatsApp
document.querySelectorAll("[data-wa]").forEach(a => {
    a.href = wa(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
});

// Mostrar servicios disponibles
const servicesList = document.getElementById("servicesList");

if (servicesList) {
    servicesList.innerHTML = SERVICES.map(({ category, groups }, i) => `
        <div class="service-category" aria-labelledby="category-${i}">

            <h3 class="category-title" id="category-${i}">
                ${category}
            </h3>

            ${groups.map(({ name, items }) => `
                ${name ? `<h4 class="service-group">${name}</h4>` : ""}

                <ul class="services">
                    ${items.map(([service, price]) => {

                        const fullName = name
                            ? `${name}: ${service}`
                            : `${category}: ${service}`;

                        return `
                            <li>
                                <div>
                                    <h4>${service}</h4>
                                    <p class="service-price">$${price}</p>
                                </div>

                                <a
                                    class="btn"
                                    target="_blank"
                                    rel="noopener"
                                    aria-label="Consultar ${fullName} por $${price}"
                                    href="${wa(`Hola, quiero consultar disponibilidad para ${fullName} ($${price}).`)}">
                                    Consultar
                                </a>
                            </li>
                        `;
                    }).join("")}
                </ul>
            `).join("")}

        </div>
    `).join("");
}

// Mostrar horarios de atención
const now = new Date();
const today = now.getDay();

const order = [1, 2, 3, 4, 5, 6, 0];

const hoursElement = document.getElementById("hours");

if (hoursElement) {
    hoursElement.innerHTML = order.map(d => {

        const h = HOURS[d];

        return `
            <tr class="${d === today ? "today" : ""}">
                <td>${DAYS[d]}</td>
                <td>
                    ${h
                        ? `${fmt(h[0])} – ${fmt(h[1])}`
                        : "Cerrado"
                    }
                </td>
            </tr>
        `;

    }).join("");
}

// Estado del establecimiento: abierto o cerrado
const st = document.getElementById("status");
const t = HOURS[today];

const hr = now.getHours() + now.getMinutes() / 60;

if (st) {

    if (t && hr >= t[0] && hr < t[1]) {

        st.textContent = `Abierto ahora · cierra a las ${fmt(t[1])}`;
        st.classList.add("open");

    } else {

        st.textContent = "Cerrado ahora";
        st.classList.remove("open");

    }
}

// Menú de navegación móvil
const menu = document.getElementById("menu");
const nav = document.getElementById("nav");

if (menu && nav) {

    menu.addEventListener("click", () => {

        const o = nav.classList.toggle("open");

        menu.setAttribute("aria-expanded", o);

        menu.setAttribute(
            "aria-label",
            o ? "Cerrar menú de navegación" : "Abrir menú de navegación"
        );

    });

    nav.addEventListener("click", e => {

        if (e.target.tagName === "A") {

            nav.classList.remove("open");

            menu.setAttribute("aria-expanded", false);
            menu.setAttribute("aria-label", "Abrir menú de navegación");

        }

    });

}

// Actualizar automáticamente el año del footer
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = now.getFullYear();
}
