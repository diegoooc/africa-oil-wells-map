/**
 * Mapa interactivo de pozos de perforación en África.
 * Réplica funcional y visual del mapa de Asia: mismo sistema de diseño,
 * mismos comportamientos (clústeres, panel de detalle, filtros, búsqueda).
 */

const AFRICA_CENTER = [2, 20];
const AFRICA_ZOOM = 3;
const WELL_ZOOM = 11;
const FLY_OPTIONS = { duration: 1.4, easeLinearity: 0.22 };

const STATUS_COLORS = {
  "Activo": "#2D7DA8",
  "En perforación": "#F59E0B",
  "Inactivo": "#9CA3AF",
};

const ICONS = {
  "Terrestre": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>`,
  "Costa afuera": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
};

const ICONS_SM = {
  "Terrestre": `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>`,
  "Costa afuera": `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
};

const DEPTH_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>`;
const SEARCH_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;
const PIN_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const BACK_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`;
const BUILDING_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
const CALENDAR_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`;
const DOWN_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>`;
const GAUGE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`;

// ---------- Imágenes por tipo (fotos genéricas libres, coherentes con el tipo de instalación) ----------
const OFFSHORE_IMAGES = [
  "https://commons.wikimedia.org/wiki/Special:FilePath/Oil_platform_P-51_(Brazil).jpg?width=900",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Troll_A_Platform.jpg?width=900",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Oil_platform_in_the_North_SeaPros.jpg?width=900",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Gullfaks_A.jpg?width=900",
];
const ONSHORE_IMAGES = [
  "https://commons.wikimedia.org/wiki/Special:FilePath/Oil_well.jpg?width=900",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Oil_drilling_rig.jpg?width=900",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Nodding_donkey.jpg?width=900",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&h=600&fit=crop",
];
function hashId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash;
}
function getWellImage(well) {
  const pool = well.tipo === "Costa afuera" ? OFFSHORE_IMAGES : ONSHORE_IMAGES;
  return pool[hashId(well.id) % pool.length];
}
function getWellPlaceholder(well) {
  const offshore = well.tipo === "Costa afuera";
  const sky = offshore ? "#B8D6CF" : "#EBE3CA";
  const ground = offshore ? "#71847F" : "#2D7DA8";
  const scene = offshore
    ? `<path d="M0 150 Q100 140 200 150 T400 150 V200 H0 Z" fill="#71847F" opacity="0.45"/><rect x="170" y="70" width="60" height="80" fill="#2D2D2D" opacity="0.85"/><path d="M180 70 L200 30 L220 70 Z" fill="#2D2D2D" opacity="0.85"/><line x1="200" y1="30" x2="200" y2="150" stroke="#2D2D2D" stroke-width="3"/>`
    : `<rect x="0" y="150" width="400" height="50" fill="#16425B" opacity="0.35"/><path d="M175 150 L200 40 L225 150 Z" fill="none" stroke="#2D2D2D" stroke-width="4"/><line x1="188" y1="95" x2="212" y2="95" stroke="#2D2D2D" stroke-width="3"/><line x1="183" y1="120" x2="217" y2="120" stroke="#2D2D2D" stroke-width="3"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="${ground}" stop-opacity="0.25"/></linearGradient></defs><rect width="400" height="200" fill="url(#g)"/>${scene}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ---------- Estado ----------
let wells = [];
let selectedWell = null;
let searchTerm = "";
let filterType = "Todos";
let filterStatus = "Todos";

let map, clusterGroup;
const markersById = new Map();

// ---------- Marca ----------
function brandHTML(compact) {
  const size = compact ? 32 : 40;
  return `
  <div class="brand${compact ? " compact" : ""}">
    <div style="width:${size}px;height:${size}px;flex-shrink:0;">
      <svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#2D7DA8" stroke-width="1.5"/>
        <line x1="20" y1="4" x2="20" y2="8" stroke="#2D7DA8" stroke-width="1.5"/>
        <line x1="20" y1="32" x2="20" y2="36" stroke="#2D7DA8" stroke-width="1.5"/>
        <line x1="4" y1="20" x2="8" y2="20" stroke="#2D7DA8" stroke-width="1.5"/>
        <line x1="32" y1="20" x2="36" y2="20" stroke="#2D7DA8" stroke-width="1.5"/>
        <path d="M 20 10 C 18 12 16 15 16 18 C 16 22 17.8 25 20 25 C 22.2 25 24 22 24 18 C 24 15 22 12 20 10 Z" fill="#2D7DA8"/>
        <circle cx="19" cy="16" r="1.5" fill="white" opacity="0.6"/>
      </svg>
    </div>
    <div class="brand-text">
      <h1>Pozos de África</h1>
      ${compact ? "" : "<p>Exploración Petrolera</p>"}
    </div>
  </div>`;
}

// ---------- Render de la barra lateral ----------
function statsHTML() {
  const total = wells.length;
  const activos = wells.filter((w) => w.estatus === "Activo").length;
  const perforacion = wells.filter((w) => w.estatus === "En perforación").length;
  return `
  <div class="stats">
    <div class="stat"><div class="stat-value">${total}</div><div class="stat-label">Pozos</div></div>
    <div class="stat"><div class="stat-value"><span class="stat-dot" style="background:#2D7DA8"></span>${activos}</div><div class="stat-label">Activos</div></div>
    <div class="stat"><div class="stat-value"><span class="stat-dot" style="background:#F59E0B"></span>${perforacion}</div><div class="stat-label">Perforando</div></div>
  </div>`;
}

function renderSidebarShell(container) {
  container.innerHTML = `
    <header class="sidebar-header">
      ${brandHTML(false)}
      ${statsHTML()}
    </header>
    <div class="search-wrap">
      ${SEARCH_ICON}
      <input id="searchInput_${container.id}" type="text" placeholder="Buscar pozo o país…" />
    </div>
    <div class="filters">
      <div class="filter-row">
        <p>Tipo</p>
        <div class="filter-options" data-group="tipo" id="typeFilters_${container.id}"></div>
      </div>
      <div class="filter-row">
        <p>Estatus</p>
        <div class="filter-options" data-group="estatus" id="statusFilters_${container.id}"></div>
      </div>
    </div>
    <div class="wells-list" id="wellsList_${container.id}"></div>
    <div class="list-counter" id="listCounter_${container.id}"></div>
  `;

  const typeOptions = ["Todos", "Terrestre", "Costa afuera"];
  const statusOptions = ["Todos", "Activo", "En perforación", "Inactivo"];
  const typeWrap = container.querySelector(`#typeFilters_${container.id}`);
  const statusWrap = container.querySelector(`#statusFilters_${container.id}`);

  typeOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (filterType === opt ? " active" : "");
    btn.textContent = opt;
    btn.onclick = () => { filterType = opt; renderAllSidebars(); };
    typeWrap.appendChild(btn);
  });
  statusOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (filterStatus === opt ? " active" : "");
    btn.textContent = opt;
    btn.onclick = () => { filterStatus = opt; renderAllSidebars(); };
    statusWrap.appendChild(btn);
  });

  const input = container.querySelector(`#searchInput_${container.id}`);
  input.value = searchTerm;
  input.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderAllSidebars(true);
  });

  renderWellsList(container);
}

function filteredWells() {
  const term = searchTerm.toLowerCase();
  return wells.filter((w) => {
    const matchesSearch = w.nombre.toLowerCase().includes(term) || w.pais.toLowerCase().includes(term);
    const matchesType = filterType === "Todos" || w.tipo === filterType;
    const matchesStatus = filterStatus === "Todos" || w.estatus === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });
}

function renderWellsList(container) {
  const listEl = container.querySelector(`#wellsList_${container.id}`);
  const counterEl = container.querySelector(`#listCounter_${container.id}`);
  const fw = filteredWells();

  if (fw.length === 0) {
    listEl.innerHTML = `<p class="list-empty">No se encontraron pozos con esos criterios.</p>`;
  } else {
    listEl.innerHTML = fw.map((w) => {
      const isSelected = selectedWell && selectedWell.id === w.id;
      const icon = ICONS_SM[w.tipo];
      return `
      <button class="well-item${isSelected ? " selected" : ""}" data-id="${w.id}">
        <span class="well-dot" style="background:${STATUS_COLORS[w.estatus]}"></span>
        <span class="well-info">
          <p class="well-name">${escapeHtml(w.nombre)}</p>
          <p class="well-meta">${icon}<span>${escapeHtml(w.pais)} · ${w.tipo}</span></p>
          <p class="well-depth">${DEPTH_ICON}${w.profundidad_m.toLocaleString("es")} m</p>
        </span>
      </button>`;
    }).join("");
    listEl.querySelectorAll(".well-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const well = wells.find((w) => w.id === btn.dataset.id);
        if (well) selectWell(well);
      });
    });
  }
  counterEl.textContent = `${fw.length} de ${wells.length} pozos`;
}

function renderAllSidebars(skipInputSync) {
  renderWellsList(document.getElementById("desktopSidebar"));
  renderWellsList(document.getElementById("mobileSidebar"));
  // sync filter button active states
  [document.getElementById("desktopSidebar"), document.getElementById("mobileSidebar")].forEach((container) => {
    container.querySelectorAll('[data-group="tipo"] .filter-btn').forEach((b) => {
      b.classList.toggle("active", b.textContent === filterType);
    });
    container.querySelectorAll('[data-group="estatus"] .filter-btn').forEach((b) => {
      b.classList.toggle("active", b.textContent === filterStatus);
    });
    if (!skipInputSync) {
      const input = container.querySelector('input[type="text"]');
      if (input) input.value = searchTerm;
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Panel de detalle ----------
function renderDetailPanel() {
  const panel = document.getElementById("detailPanel");
  if (!selectedWell) {
    panel.classList.remove("open");
    panel.innerHTML = "";
    return;
  }
  const w = selectedWell;
  const statusColor = STATUS_COLORS[w.estatus];
  const typeIconSm = w.tipo === "Costa afuera" ? ICONS_SM["Costa afuera"] : ICONS_SM["Terrestre"];
  const imageSrc = getWellImage(w);
  const placeholder = getWellPlaceholder(w);

  panel.innerHTML = `
    <div class="detail-header">
      <p>${PIN_ICON} Detalle del pozo</p>
      <button class="detail-close" id="detailCloseBtn" aria-label="Cerrar detalle">${BACK_ICON}</button>
    </div>
    <div class="detail-body">
      <div class="detail-image-wrap">
        <img src="${imageSrc}" alt="Instalación ${w.tipo.toLowerCase()} — ${escapeHtml(w.nombre)}" loading="lazy" onerror="this.onerror=null;this.src='${placeholder}'" />
        <span class="detail-type-badge">${typeIconSm}${w.tipo}</span>
      </div>
      <h2 class="detail-title">${escapeHtml(w.nombre)}</h2>
      <div class="detail-badges">
        <span class="status-pill" style="background:${statusColor}1a;color:${statusColor}">
          <span class="dot" style="background:${statusColor}"></span>${w.estatus}
        </span>
        <span class="detail-country">${escapeHtml(w.pais)}</span>
      </div>
      <p class="detail-desc">${escapeHtml(w.descripcion)}</p>
      <div class="detail-grid">
        <div class="data-tile"><p class="label">${typeIconSm}Tipo</p><p class="value">${w.tipo}</p></div>
        <div class="data-tile"><p class="label">${BUILDING_ICON}Operador</p><p class="value" title="${escapeHtml(w.operador)}">${escapeHtml(w.operador)}</p></div>
        <div class="data-tile"><p class="label">${CALENDAR_ICON}Inicio</p><p class="value">${w.inicio}</p></div>
        <div class="data-tile"><p class="label">${DOWN_ICON}Profundidad</p><p class="value">${w.profundidad_m.toLocaleString("es")} m</p></div>
        ${w.produccion_bpd != null ? `<div class="data-tile"><p class="label">${GAUGE_ICON}Producción</p><p class="value">${(w.produccion_bpd / 1000000).toFixed(1)}M bpd</p></div>` : ""}
        <div class="data-tile"><p class="label">${PIN_ICON}Coordenadas</p><p class="value mono">${w.lat.toFixed(3)}°, ${w.lon.toFixed(3)}°</p></div>
      </div>
    </div>
    <div class="detail-footer">
      <button class="btn-outline" id="detailBackBtn">${BACK_ICON} Ver todo África</button>
    </div>
  `;
  panel.classList.add("open");
  document.getElementById("detailCloseBtn").onclick = backToAfrica;
  document.getElementById("detailBackBtn").onclick = backToAfrica;
}

// ---------- Selección / navegación ----------
function selectWell(well) {
  selectedWell = well;
  closeMobileSidebar();
  afterSelectionChange();
}
function backToAfrica() {
  selectedWell = null;
  afterSelectionChange();
}

function afterSelectionChange() {
  renderDetailPanel();
  renderAllSidebars();
  updateMapForSelection();
}

// ---------- Mapa ----------
function makeMarkerIcon(well) {
  return L.divIcon({
    className: "oil-well-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `<div class="oil-well-marker-icon" style="background-color:${STATUS_COLORS[well.estatus]}">${ICONS[well.tipo]}</div>`,
  });
}
function makeClusterIcon(cluster) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 38 : count < 100 ? 46 : 54;
  return L.divIcon({
    className: "oil-cluster-wrapper",
    iconSize: [size, size],
    html: `<div class="oil-cluster" style="width:${size}px;height:${size}px">${count}</div>`,
  });
}

function initMap() {
  map = L.map("map", {
    center: AFRICA_CENTER,
    zoom: AFRICA_ZOOM,
    zoomControl: true,
    scrollWheelZoom: true,
    worldCopyJump: true,
    preferCanvas: true,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  populateMarkers();
}

function populateMarkers() {
  clusterGroup = L.markerClusterGroup({
    chunkedLoading: true,
    showCoverageOnHover: false,
    maxClusterRadius: 60,
    iconCreateFunction: makeClusterIcon,
  });

  wells.forEach((well) => {
    if (!Number.isFinite(well.lat) || !Number.isFinite(well.lon)) return;
    const marker = L.marker([well.lat, well.lon], {
      icon: makeMarkerIcon(well),
      title: well.nombre,
    })
      .bindPopup(`<strong>${escapeHtml(well.nombre)}</strong><br>${escapeHtml(well.pais)} · ${well.tipo}`)
      .on("click", () => selectWell(well));
    markersById.set(well.id, marker);
    clusterGroup.addLayer(marker);
  });

  map.addLayer(clusterGroup);
}

function updateMapForSelection() {
  if (!map) return;
  map.closePopup();

  markersById.forEach((marker, id) => {
    const isSel = selectedWell && selectedWell.id === id;
    marker.setZIndexOffset(isSel ? 1000 : 0);
    const el = marker.getElement && marker.getElement()?.querySelector(".oil-well-marker-icon");
    if (el) el.classList.toggle("marker-selected", !!isSel);
  });

  map.once("moveend", () => {
    markersById.forEach((marker, id) => {
      const isSel = selectedWell && selectedWell.id === id;
      const el = marker.getElement && marker.getElement()?.querySelector(".oil-well-marker-icon");
      if (el) el.classList.toggle("marker-selected", !!isSel);
    });
  });

  if (selectedWell) {
    map.flyTo([selectedWell.lat, selectedWell.lon], WELL_ZOOM, FLY_OPTIONS);
  } else {
    map.flyTo(AFRICA_CENTER, AFRICA_ZOOM, FLY_OPTIONS);
  }
}

// ---------- Sidebar móvil ----------
function openMobileSidebar() {
  document.getElementById("mobileOverlay").classList.add("open");
}
function closeMobileSidebar() {
  document.getElementById("mobileOverlay").classList.remove("open");
}

// ---------- Inicio ----------
function boot() {
  wells = WELLS_DATA;

  document.getElementById("desktopSidebar").id = "desktopSidebar";
  renderSidebarShell(document.getElementById("desktopSidebar"));
  renderSidebarShell(document.getElementById("mobileSidebar"));
  document.getElementById("mobileBrand").innerHTML = brandHTML(true);

  document.getElementById("loadingPill").style.display = "none";

  document.getElementById("mobileListToggle").addEventListener("click", openMobileSidebar);
  document.getElementById("mobileOverlay").addEventListener("click", (e) => {
    if (e.target.id === "mobileOverlay") closeMobileSidebar();
  });

  initMap();
}

document.addEventListener("DOMContentLoaded", boot);
