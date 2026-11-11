var clipped = false;
var ck_starlabels = true;
var ck_conlabels = false;
var ck_dsos = false;
var ck_conlines = false;
var ck_coordinates = true;
var ck_date = true;
var ck_time = true;

var sky_color = "#102";
var star_color = "#fff";
var star_scale = 1;
var starLabel_color = "#888";
var starLabel_size = 10;
var planetLabel_color = "#888";
var planetLabel_size = 10;
var conLine_color = "#ccc";
var conLine_scale = 1;
var conLabel_color = "#789";
var conLabel_size = 10;
var dsoLabel_color = "#0f0";
var dsoLabel_size = 5;

var frame_format = "A4";
var frame_custom = { w: 21, h: 29.7 };

var moon_color = "#f00";
var moon_size = 10;

var message = "The best night of our lives";
var song_link = "https://open.spotify.com/intl-pt/track/0tgVpDi06FyKpA1z0VMD4v";

function draw_star(svg, s) {
	var mdd = svg.viewBox.baseVal.width / 1500;
	// Verifica se a estrela tem posição válida
	if (!s.pos || s.pos.x === undefined || s.pos.y === undefined) {
		console.warn('Estrela sem posição válida:', s);
		return;
	}
	
	var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttribute("cx", s.pos.x);
	circle.setAttribute("cy", s.pos.y);
	circle.setAttribute("r", (s.radius + 1) * star_scale * mdd);
	circle.setAttribute("fill", star_color);
	svg.appendChild(circle);
}

function draw_planet(svg, p) {
	var mdd = svg.viewBox.baseVal.width / 1000;

	if (!p.pos || p.pos.x === undefined || p.pos.y === undefined ||
		isNaN(p.pos.x) || isNaN(p.pos.y) ||
		(p.pos.x === 0 && p.pos.y === 0)) {
		console.warn('Posição inválida para planeta:', p.name, p.pos);
		return;
	}

	// === Desenhar o planeta ===
	var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttribute("cx", p.pos.x);
	circle.setAttribute("cy", p.pos.y);
	circle.setAttribute("r", 3 * mdd); // raio do planeta (ajuste conforme a escala)
	circle.setAttribute("fill", p.color);
	svg.appendChild(circle);

	// === Desenhar o label ===
	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", p.pos.x + 5);
	text.setAttribute("y", p.pos.y);
	text.setAttribute("fill", p.color);
	text.setAttribute("font-size", planetLabel_size * mdd);
	text.textContent = p.name === "Earth" ? "Sun" : p.name;
	svg.appendChild(text);
}

function draw_moon(svg, m) {
	var mdd = svg.viewBox.baseVal.width / 1000;

	if (!m.pos || m.pos.x === undefined || m.pos.y === undefined) {
		return;
	}

	// Desenhar a Lua
	var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttribute("cx", m.pos.x);
	circle.setAttribute("cy", m.pos.y);
	circle.setAttribute("r", (m.radius || 3) * star_scale * mdd);
	circle.setAttribute("fill", "url(#moonGradient)");
	svg.appendChild(circle);

	// Label da Lua
	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", m.pos.x + (m.radius || 3) + 2);
	text.setAttribute("y", m.pos.y);
	text.setAttribute("fill", planetLabel_color || "#ffffff");
	text.setAttribute("font-size", (planetLabel_size || 10) * mdd);
	text.setAttribute("font-family", "Arial, sans-serif");
	text.textContent = "Moon";
	svg.appendChild(text);
}

function draw_star_label(svg, p) {
	var mdd = svg.viewBox.baseVal.width / 1000;
	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", p.pos.x + 5);
	text.setAttribute("y", p.pos.y);
	text.setAttribute("fill", starLabel_color);
	text.setAttribute("font-size", starLabel_size * mdd);
	text.textContent = p.label;
	svg.appendChild(text);
}

function draw_con_label(svg, p) {
	var mdd = svg.viewBox.baseVal.width / 1000;
	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", p.pos.x);
	text.setAttribute("y", p.pos.y);
	text.setAttribute("fill", conLabel_color);
	text.setAttribute("font-size", conLabel_size * mdd);
	text.setAttribute("text-anchor", "middle");
	text.textContent = p.name.toUpperCase();
	svg.appendChild(text);
}

function draw_line(svg, s1, s2) {
	if (s1.pos.visible && s2.pos.visible) {
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("x1", s1.pos.x);
		line.setAttribute("y1", s1.pos.y);
		line.setAttribute("x2", s2.pos.x);
		line.setAttribute("y2", s2.pos.y);
		line.setAttribute("stroke", conLine_color);
		line.setAttribute("stroke-width", conLine_scale);
		svg.appendChild(line);
	}
}

function draw_dso(svg, m) {
	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", m.pos.x + m.offsetx);
	text.setAttribute("y", m.pos.y + m.offsety);
	text.setAttribute("fill", dsoLabel_color);
	text.setAttribute("font-size", dsoLabel_size);
	text.textContent = m.name;
	svg.appendChild(text);

	var shape;
	switch (m.type) {
		case 1:
		case 2:
			shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			shape.setAttribute("cx", m.pos.x);
			shape.setAttribute("cy", m.pos.y);
			shape.setAttribute("r", 2.5);
			shape.setAttribute("stroke", dsoLabel_color);
			shape.setAttribute("fill", "none");
			break;
		case 3:
		case 4:
		case 5:
			shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			shape.setAttribute("x", m.pos.x - 2);
			shape.setAttribute("y", m.pos.y - 2);
			shape.setAttribute("width", 4);
			shape.setAttribute("height", 4);
			shape.setAttribute("stroke", dsoLabel_color);
			shape.setAttribute("fill", "none");
			break;
		case 6:
			shape = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
			shape.setAttribute("cx", m.pos.x);
			shape.setAttribute("cy", m.pos.y);
			shape.setAttribute("rx", 4);
			shape.setAttribute("ry", 2);
			shape.setAttribute("fill", dsoLabel_color);
			break;
		default:
			shape = document.createElementNS("http://www.w3.org/2000/svg", "line");
			shape.setAttribute("x1", m.pos.x - 2);
			shape.setAttribute("y1", m.pos.y);
			shape.setAttribute("x2", m.pos.x + 2);
			shape.setAttribute("y2", m.pos.y);
			shape.setAttribute("stroke", dsoLabel_color);
			svg.appendChild(shape);
			shape = document.createElementNS("http://www.w3.org/2000/svg", "line");
			shape.setAttribute("x1", m.pos.x);
			shape.setAttribute("y1", m.pos.y - 2);
			shape.setAttribute("x2", m.pos.x);
			shape.setAttribute("y2", m.pos.y + 2);
			shape.setAttribute("stroke", dsoLabel_color);
			break;
	}
	if (shape) svg.appendChild(shape);
}

function draw_sky(svg, w, h) {
	var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	var radius = Math.min(w, h) / 2;
	circle.setAttribute("cx", w / 2);
	circle.setAttribute("cy", h / 2);
	circle.setAttribute("r", radius);
	circle.setAttribute("fill", sky_color);
	svg.appendChild(circle);

	if (ck_conlines) {
		var len = conline.length;
		for (var i = 0; i < len; i++) {
			draw_line(svg, star[conline[i][0]], star[conline[i][1]]);
		}
	}

	var len = star.length;
	for (var i = 0; i < len; i++) {
		skypos_transform(star[i].pos, now, w, h);
		if (star[i].pos.visible) {
			draw_star(svg, star[i]);
		}
	}

	if (ck_starlabels) {
		len = starname.length;
		for (var i = 0; i < len; i++) {
			skypos_transform(starname[i].pos, now, w, h);
			if (starname[i].pos.visible) {
				draw_star_label(svg, starname[i]);
			}
		}
	}

	if (ck_conlabels) {
		len = conname.length;
		for (var i = 0; i < len; i++) {
			skypos_transform(conname[i].pos, now, w, h);
			if (conname[i].pos.visible) {
				draw_con_label(svg, conname[i]);
			}
		}
	}

	// CORREÇÃO: Calcular posição para TODOS os planetas
	for (var i = 0; i < 9; i++) {
		find_planet(planet[i], planet[2], now.jd);
		skypos_transform(planet[i].pos, now, w, h);
		
		if (planet[i].pos.visible) {
			draw_planet(svg, planet[i]);
		}
	}

	if (ck_dsos) {
		len = dso.length;
		for (var i = 0; i < len; i++) {
			skypos_transform(dso[i].pos, now, w, h);
			if (dso[i].pos.visible) {
				draw_dso(svg, dso[i]);
			}
		}
	}
}

function validateFields() {
	var dt = document.getElementById("user_date");
	var hr = document.getElementById("user_time");
	var lon = document.getElementById("user_lon");
	var lat = document.getElementById("user_lat");

	var valid = true;

	if (!dt.value) {
		dt.style.borderColor = 'red';
		valid = false;
	} else {
		dt.style.borderColor = '';
	}

	if (!hr.value) {
		hr.style.borderColor = 'red';
		valid = false;
	} else {
		hr.style.borderColor = '';
	}

	if (!lon.value || lon.value < -180 || lon.value > 180) {
		lon.style.borderColor = 'red';
		valid = false;
	} else {
		lon.style.borderColor = '';
	}

	if (!lat.value || lat.value < -90 || lat.value > 90) {
		lat.style.borderColor = 'red';
		valid = false;
	} else {
		lat.style.borderColor = '';
	}

	return valid;
}

function refresh() {
	if (validateFields()) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("width", 800);
		svg.setAttribute("height", 800);
		svg.setAttribute("viewBox", "0 0 800 800");

		draw_sky(svg, 800, 800);

		var container = document.getElementById("planicanvas");
		container.innerHTML = "";
		container.appendChild(svg);
	}
}

function saveImage() {
	var link = document.createElement('a');
	var canvas = document.getElementById("planicanvas");
	var dt = document.getElementById("user_date");
	var lon = document.getElementById("user_lon");
	var lat = document.getElementById("user_lat");

	get_user_obs();
	link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	link.download = 'NightSky' + ' - ' + dt.value + ' - ' + lat.value + ' - ' + lon.value + '.png';
	link.click();
	window.URL.revokeObjectURL(url);
}

function saveAsVector() {
	var size = 800;

	var svgNS = "http://www.w3.org/2000/svg";
	var svg = document.createElementNS(svgNS, "svg");
	svg.setAttribute("width", size);
	svg.setAttribute("height", size);
	svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

	draw_sky(svg, size, size);

	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svg);

	var blob = new Blob([svgString], {
		type: "image/svg+xml"
	});
	var url = URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = "sky.svg";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

function set_user_obs() {
	// atualiza o formulário com os valores atuais das variáveis globais
	document.getElementById("resolution").value = planicanvas.width;

	document.getElementById("sky_color").value = sky_color;
	document.getElementById("star_scale").value = star_scale;
	document.getElementById("star_color").value = star_color;
	document.getElementById("starLabel_size").value = starLabel_size;
	document.getElementById("starLabel_color").value = starLabel_color;
	document.getElementById("planetLabel_size").value = planetLabel_size;
	document.getElementById("conLine_scale").value = conLine_scale;
	document.getElementById("conLine_color").value = conLine_color;
	document.getElementById("conLabel_size").value = conLabel_size;
	document.getElementById("conLabel_color").value = conLabel_color;
	document.getElementById("dsoLabel_size").value = dsoLabel_size;
	document.getElementById("dsoLabel_color").value = dsoLabel_color;
	document.getElementById("frame_format").value = frame_format;
	if (frame_format === "custom") {
		document.getElementById("custom_size").style.display = "block";
		document.getElementById("custom_width").value = frame_custom.w;
		document.getElementById("custom_height").value = frame_custom.h;
	} else {
		document.getElementById("custom_size").style.display = "none";
	}

	document.getElementById("user_starlab").checked = ck_starlabels;
	document.getElementById("user_conlab").checked = ck_conlabels;
	document.getElementById("user_dsos").checked = ck_dsos;
	document.getElementById("user_conline").checked = ck_conlines;
	document.getElementById("show_coordinates").checked = ck_coordinates;
	document.getElementById("show_date").checked = ck_date;
	document.getElementById("show_time").checked = ck_time;

	document.getElementById("user_message").value = message;
	document.getElementById("user_music").value = song_link;
}

function get_user_obs() {
	if (!validateFields()) return;

	var dt = document.getElementById("user_date");
	var hr = document.getElementById("user_time");
	var lon = document.getElementById("user_lon");
	var lat = document.getElementById("user_lat");

	var n = Date.parse(dt.value);
	if (isNaN(n)) {
		alert("Your browser doesn't think\n'" + dt.value + "'\nis a valid date.");
		set_user_obs();
		return;
	}

	var d = new Date(n);
	var timeParts = hr.value.split(':');
	if (timeParts.length === 2) {
		d.setHours(parseInt(timeParts[0]));
		d.setMinutes(parseInt(timeParts[1]));
	} else {
		alert("Invalid time format. Please use HH:MM.");
		set_user_obs();
		return;
	}

	frame_format = document.getElementById("frame_format").value;

	if (frame_format === "custom") {
		var w = parseFloat(document.getElementById("custom_width").value);
		var h = parseFloat(document.getElementById("custom_height").value);
		if (!isNaN(w) && !isNaN(h)) {
			frame_custom = {
				w: w,
				h: h
			};
		}
	}

	now.setDate(d);

	if (lon.value >= -180 && lon.value < 180)
		now.setLonDegrees(lon.value);

	if (lat.value >= -90 && lat.value <= 90)
		now.setLatDegrees(lat.value);

	// checkboxes
	ck_starlabels = document.getElementById("user_starlab").checked;
	ck_conlabels = document.getElementById("user_conlab").checked;
	ck_dsos = document.getElementById("user_dsos").checked;
	ck_conlines = document.getElementById("user_conline").checked;
	ck_coordinates = document.getElementById("show_coordinates").checked;
	ck_date = document.getElementById("show_date").checked;
	ck_time = document.getElementById("show_time").checked;

	// cores, escalas e tamanhos
	sky_color = document.getElementById("sky_color").value;
	star_scale = parseFloat(document.getElementById("star_scale").value);
	star_color = document.getElementById("star_color").value;
	starLabel_size = parseInt(document.getElementById("starLabel_size").value);
	starLabel_color = document.getElementById("starLabel_color").value;
	planetLabel_size = parseInt(document.getElementById("planetLabel_size").value);
	conLine_scale = parseFloat(document.getElementById("conLine_scale").value);
	conLine_color = document.getElementById("conLine_color").value;
	conLabel_size = parseInt(document.getElementById("conLabel_size").value);
	conLabel_color = document.getElementById("conLabel_color").value;
	dsoLabel_size = parseInt(document.getElementById("dsoLabel_size").value);
	dsoLabel_color = document.getElementById("dsoLabel_color").value;

	// mensagens
	message = document.getElementById("user_message").value;
	song_link = document.getElementById("user_music").value;

	// resolução do canvas
	var canvas = document.getElementById("planicanvas");
	var res = parseInt(document.getElementById("resolution").value);
	canvas.width = res;
	canvas.height = res;

	set_user_obs();
	refresh();
}

function canvasApp() {
	init_stars(star);
	init_dsos(dso);
	init_planets(planet);
	now = new Observer();
	set_user_obs();
	refresh();
}

function setGeoPos(geopos) {
	document.getElementById("user_lat").value = geopos.coords.latitude;
	document.getElementById("user_lon").value = geopos.coords.longitude;
	set_user_obs();
	refresh();
}

function errGeoPos(error) {
	alert('Geolocation error ' + error.code + ': ' + error.message);
}

function getGeoPos() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setGeoPos, errGeoPos);
	} else {
		alert('Geolocation is not supported by this browser.');
	}
}

function currentTime() {
	var now = new Date();

	var dateString = now.toISOString().split('T')[0];
	document.getElementById("user_date").value = dateString;

	var timeString = now.toTimeString().split(' ')[0].substring(0, 5);
	document.getElementById("user_time").value = timeString;
}

document.getElementById("frame_format").addEventListener("change", function () {
	if (this.value === "custom") {
		document.getElementById("custom_size").style.display = "block";
	} else {
		document.getElementById("custom_size").style.display = "none";
	}
});