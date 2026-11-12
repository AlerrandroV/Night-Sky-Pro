// ===== Escolha do local =====
// Duas formas além das coordenadas:
// - busca com sugestões: Photon (photon.komoot.io), busca de endereços
//   gratuita sobre o OpenStreetMap que permite sugerir enquanto se digita;
// - "Selecionar no mapa": janela com mapa do OpenStreetMap (Leaflet).
// Nenhum dos dois precisa de chave ou cadastro.

var PHOTON_URL = "https://photon.komoot.io";
var TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

// ----- Aplicar um local -----

// Nome legível de um resultado do Photon. A forma curta (cidade, estado,
// país) vai para o pôster; a completa, com rua, para a lista de sugestões.
function photon_label(p, short) {
	var head = short ? [] : [p.name !== p.street ? p.name : "", p.street && p.street + (p.housenumber ? ", " + p.housenumber : ""), p.district];
	var parts = head.concat([p.city || p.name, p.state, p.country]);
	return parts.filter(function (v, i) { return v && parts.indexOf(v) === i; }).join(", ");
}

// Ponto único para trocar de local: grava coordenadas e nome e redesenha
function apply_place(lat, lon, name) {
	document.getElementById("user_lat").value = (+lat).toFixed(6);
	document.getElementById("user_lon").value = (+lon).toFixed(6);
	document.getElementById("place_name").value = name || "";
	document.getElementById("place_search").value = "";
	get_user_obs();
}

// Ponto sem nome (mapa, "Minha localização"): aplica e descobre o nome depois
function pick_point(lat, lon) {
	apply_place(lat, lon, "");
	fetch_ok(PHOTON_URL + "/reverse?lat=" + lat + "&lon=" + lon)
		.then(function (r) { return r.json(); })
		.then(function (data) {
			var f = data.features && data.features[0];
			var field = document.getElementById("place_name");
			if (!f || field.value) return; // sem resultado, ou a pessoa já digitou um nome
			field.value = photon_label(f.properties, true);
			if (ck_place) get_user_obs(); // só redesenha se o nome aparece no pôster
			else place_name = field.value;
		})
		.catch(function (err) { console.warn("Nome do local:", err); });
}

// Coordenadas digitadas à mão: o nome e a busca anteriores deixam de valer.
// Roda antes do listener geral do painel, que então lê o nome já limpo.
document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("location-inputs").addEventListener("change", function () {
		document.getElementById("place_name").value = "";
		document.getElementById("place_search").value = "";
	});
	// A busca não é uma configuração: só aplica o local ao escolher uma sugestão
	document.getElementById("place_search").addEventListener("change", function (e) { e.stopPropagation(); });
});

// ----- Busca com sugestões -----

var search_timer = null;
var search_ctrl = null;
var search_results = [];
var search_active = -1;

function cancel_search() {
	clearTimeout(search_timer);
	if (search_ctrl) search_ctrl.abort();
}

function on_place_search_input() {
	var q = document.getElementById("place_search").value.trim();
	cancel_search();
	if (q.length < 3) {
		show_suggestions([], q.length ? "Digite pelo menos 3 letras." : "");
		return;
	}
	search_timer = setTimeout(function () { run_place_search(q); }, 350);
}

function run_place_search(q) {
	search_ctrl = new AbortController();
	show_suggestions([], "Buscando…");
	fetch_ok(PHOTON_URL + "/api/?limit=6&q=" + encodeURIComponent(q), { signal: search_ctrl.signal })
		.then(function (r) { return r.json(); })
		.then(function (data) {
			var items = (data.features || []).map(function (f) {
				return { lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], props: f.properties };
			});
			show_suggestions(items, items.length ? "" : "Nenhum lugar encontrado.");
		})
		.catch(function (err) {
			if (err.name === "AbortError") return;
			console.warn("Busca de local:", err);
			show_suggestions([], "Não foi possível buscar agora. Verifique a conexão ou use o mapa.", "error");
		});
}

function show_suggestions(items, msg, msgClass) {
	search_results = items;
	search_active = -1;
	var list = document.getElementById("place_suggestions");
	list.innerHTML = "";
	items.forEach(function (it, i) {
		var li = document.createElement("li");
		li.setAttribute("role", "option");
		li.textContent = photon_label(it.props);
		// mousedown com preventDefault: escolhe sem o campo perder o foco
		li.addEventListener("mousedown", function (e) {
			e.preventDefault();
			choose_suggestion(i);
		});
		list.appendChild(li);
	});
	if (msg) {
		var info = document.createElement("li");
		info.className = "status " + (msgClass || "");
		info.textContent = msg;
		list.appendChild(info);
	}
	list.hidden = !items.length && !msg;
}

function choose_suggestion(i) {
	var it = search_results[i];
	if (!it) return;
	show_suggestions([], "");
	apply_place(it.lat, it.lon, photon_label(it.props, true));
	document.getElementById("place_search").value = photon_label(it.props);
}

function on_place_search_key(e) {
	var n = search_results.length;
	if (e.key === "ArrowDown" || e.key === "ArrowUp") {
		if (!n) return;
		e.preventDefault();
		search_active = (search_active + (e.key === "ArrowDown" ? 1 : n - 1)) % n;
		document.querySelectorAll("#place_suggestions li[role=option]").forEach(function (li, i) {
			li.classList.toggle("active", i === search_active);
		});
	} else if (e.key === "Enter") {
		e.preventDefault();
		choose_suggestion(Math.max(search_active, 0));
	} else if (e.key === "Escape") {
		show_suggestions([], "");
	}
}

function on_place_search_blur() {
	cancel_search();
	show_suggestions([], "");
}

// ----- Mapa -----
// O Leaflet (~160 KB) só é baixado na primeira vez que o mapa é aberto.

var pick_map = null;
var pick_marker = null;
var leaflet_loading = null;

function load_leaflet() {
	if (!leaflet_loading) {
		// Mesma versão (?v=) dos outros arquivos, para não pegar cache antigo
		var v = (document.querySelector('script[src*="js/location.js"]').src.split("?")[1] || "");
		var q = v ? "?" + v : "";
		var css = document.createElement("link");
		css.rel = "stylesheet";
		css.href = "js/lib/leaflet/leaflet.css" + q;
		document.head.appendChild(css);
		leaflet_loading = new Promise(function (resolve, reject) {
			var s = document.createElement("script");
			s.src = "js/lib/leaflet/leaflet.js" + q;
			s.onload = resolve;
			s.onerror = function () {
				leaflet_loading = null;
				reject(new Error("não foi possível carregar o mapa"));
			};
			document.head.appendChild(s);
		});
	}
	return leaflet_loading;
}

function open_map_picker() {
	document.getElementById("map-modal").classList.add("open");
	var lat = parseFloat(document.getElementById("user_lat").value) || 0;
	var lon = parseFloat(document.getElementById("user_lon").value) || 0;
	load_leaflet().then(function () {
		if (!pick_map) {
			pick_map = L.map("map", { worldCopyJump: true });
			L.tileLayer(TILE_URL, {
				maxZoom: 19,
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
			}).addTo(pick_map);
			pick_marker = L.marker([lat, lon], {
				draggable: true,
				icon: L.divIcon({ className: "map-pin", html: "<span></span>", iconSize: [28, 28], iconAnchor: [14, 28] })
			}).addTo(pick_map);
			pick_map.on("click", function (e) { pick_marker.setLatLng(e.latlng); });
		}
		pick_map.invalidateSize(); // a janela acabou de aparecer
		pick_map.setView([lat, lon], 11);
		pick_marker.setLatLng([lat, lon]);
	}).catch(function (err) {
		console.warn("Mapa:", err);
		close_map_picker();
		alert("Não foi possível abrir o mapa. Verifique a conexão ou use a busca.");
	});
}

function close_map_picker() {
	document.getElementById("map-modal").classList.remove("open");
}

function confirm_map_picker() {
	if (!pick_marker) return; // o mapa ainda está carregando
	var p = pick_marker.getLatLng().wrap();
	close_map_picker();
	pick_point(p.lat, p.lng);
}
