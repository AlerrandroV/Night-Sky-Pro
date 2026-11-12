// ===== Escolha do local =====
// Duas formas além das coordenadas:
// - busca com sugestões: Photon (photon.komoot.io), busca de endereços
//   gratuita sobre o OpenStreetMap que permite sugerir enquanto se digita;
// - "Selecionar no mapa": janela com mapa do OpenStreetMap (Leaflet).
// Nenhum dos dois precisa de chave ou cadastro.

var PHOTON_URL = "https://photon.komoot.io";
var TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

// ----- Utilidades -----

// Nome legível de um resultado do Photon, sem repetições
function photon_label(props, short) {
	var parts = [];
	function add(v) {
		if (v && parts.indexOf(v) < 0) parts.push(v);
	}
	if (!short) {
		var street = props.street ? props.street + (props.housenumber ? ", " + props.housenumber : "") : "";
		if (props.name && props.name !== props.city && props.name !== props.street) add(props.name);
		add(street);
		add(props.district);
	}
	add(props.city || (short ? props.name : ""));
	add(props.state);
	add(props.country);
	if (!parts.length) add(props.name);
	return parts.join(", ");
}

// Aplica o local escolhido: coordenadas, nome e redesenho do pôster
function apply_place(lat, lon, name) {
	document.getElementById("user_lat").value = (+lat).toFixed(6);
	document.getElementById("user_lon").value = (+lon).toFixed(6);
	if (name !== undefined) document.getElementById("place_name").value = name;
	get_user_obs();
}

// Descobre o nome da cidade de um ponto (para o mapa e "Minha localização")
function reverse_place_name(lat, lon) {
	return fetch(PHOTON_URL + "/reverse?lat=" + lat + "&lon=" + lon)
		.then(function (r) {
			if (!r.ok) throw new Error("HTTP " + r.status);
			return r.json();
		})
		.then(function (data) {
			var f = data.features && data.features[0];
			return f ? photon_label(f.properties, true) : "";
		})
		.catch(function (err) {
			console.warn("Nome do local:", err);
			return "";
		});
}

function fill_place_name(lat, lon) {
	var field = document.getElementById("place_name");
	field.value = "";
	field.placeholder = "Buscando o nome do local…";
	reverse_place_name(lat, lon).then(function (name) {
		field.placeholder = "Ex.: Belém, Pará, Brasil";
		if (name && !field.value) {
			field.value = name;
			get_user_obs();
		}
	});
}

// ----- Busca com sugestões -----

var search_timer = null;
var search_ctrl = null;
var search_results = [];
var search_active = -1;

function on_place_search_input() {
	var q = document.getElementById("place_search").value.trim();
	clearTimeout(search_timer);
	if (q.length < 3) {
		show_suggestions([], q.length ? "Digite pelo menos 3 letras." : "");
		return;
	}
	search_timer = setTimeout(function () { run_place_search(q); }, 350);
}

function run_place_search(q) {
	if (search_ctrl) search_ctrl.abort();
	search_ctrl = window.AbortController ? new AbortController() : null;
	show_suggestions([], "Buscando…");
	fetch(PHOTON_URL + "/api/?limit=6&q=" + encodeURIComponent(q), search_ctrl ? { signal: search_ctrl.signal } : {})
		.then(function (r) {
			if (!r.ok) throw new Error("HTTP " + r.status);
			return r.json();
		})
		.then(function (data) {
			var items = (data.features || []).map(function (f) {
				return {
					lat: f.geometry.coordinates[1],
					lon: f.geometry.coordinates[0],
					label: photon_label(f.properties),
					short: photon_label(f.properties, true)
				};
			});
			show_suggestions(items, items.length ? "" : "Nenhum lugar encontrado.");
		})
		.catch(function (err) {
			if (err.name === "AbortError") return;
			console.warn("Busca de local:", err);
			show_suggestions([], "Não foi possível buscar agora. Verifique a conexão ou use o mapa.");
		});
}

function show_suggestions(items, msg) {
	search_results = items;
	search_active = -1;
	var list = document.getElementById("place_suggestions");
	list.innerHTML = "";
	items.forEach(function (it, i) {
		var li = document.createElement("li");
		li.setAttribute("role", "option");
		li.textContent = it.label;
		// mousedown em vez de click: dispara antes do campo perder o foco
		li.addEventListener("mousedown", function (e) {
			e.preventDefault();
			choose_suggestion(i);
		});
		list.appendChild(li);
	});
	if (msg) {
		var info = document.createElement("li");
		info.className = "info";
		info.textContent = msg;
		list.appendChild(info);
	}
	list.hidden = !items.length && !msg;
}

function choose_suggestion(i) {
	var it = search_results[i];
	if (!it) return;
	var input = document.getElementById("place_search");
	input.value = it.label;
	show_suggestions([], "");
	apply_place(it.lat, it.lon, it.short);
}

function on_place_search_key(e) {
	var list = document.getElementById("place_suggestions");
	var n = search_results.length;
	if (e.key === "ArrowDown" || e.key === "ArrowUp") {
		if (!n) return;
		e.preventDefault();
		search_active = (search_active + (e.key === "ArrowDown" ? 1 : n - 1)) % n;
		Array.prototype.forEach.call(list.querySelectorAll("li[role=option]"), function (li, i) {
			li.classList.toggle("active", i === search_active);
		});
	} else if (e.key === "Enter") {
		e.preventDefault();
		choose_suggestion(search_active >= 0 ? search_active : 0);
	} else if (e.key === "Escape") {
		show_suggestions([], "");
	}
}

function on_place_search_blur() {
	setTimeout(function () { show_suggestions([], ""); }, 150);
}

// ----- Mapa -----

var pick_map = null;
var pick_marker = null;

function open_map_picker() {
	var modal = document.getElementById("map-modal");
	modal.classList.add("open");
	var lat = parseFloat(document.getElementById("user_lat").value) || 0;
	var lon = parseFloat(document.getElementById("user_lon").value) || 0;

	if (!pick_map) {
		pick_map = L.map("map", { zoomControl: true, worldCopyJump: true });
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
	pick_map.setView([lat, lon], 11);
	pick_marker.setLatLng([lat, lon]);
	// O mapa foi criado/redimensionado com a janela escondida: recalcula o tamanho
	setTimeout(function () { pick_map.invalidateSize(); }, 50);
}

function close_map_picker() {
	document.getElementById("map-modal").classList.remove("open");
}

function confirm_map_picker() {
	var p = pick_marker.getLatLng().wrap();
	close_map_picker();
	document.getElementById("place_search").value = "";
	apply_place(p.lat, p.lng);
	fill_place_name(p.lat, p.lng);
}

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape" && document.getElementById("map-modal").classList.contains("open")) close_map_picker();
});
