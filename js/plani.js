var clipped = false;
var ck_starlabels = true;
var ck_conlabels = false;
var ck_dsos = false;
var ck_conlines = false;
var ck_coordinates = true;
var ck_date = true;
var ck_time = true;
var ck_border = true;        // moldura retangular e contorno do céu
var border_color = "#ffffff"; // cor comum aos dois perímetros

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

var SVG_NS = "http://www.w3.org/2000/svg";
var SKY_SIZE = 800;          // sistema de coordenadas usado por draw_sky
var POSTER_WIDTH = 1000;     // largura do pôster em unidades SVG
var POSTER_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
var MAX_CANVAS_AREA = 16777216; // limite de pixels do canvas no Safari/iOS

var resolution = 3000; // lado maior do PNG, em pixels
var poster_count = 0;  // ids únicos de clipPath (prévia e tela cheia coexistem)

var FRAME_SIZES = {
	"A4": { w: 21, h: 29.7 },
	"A3": { w: 29.7, h: 42 },
	"A2": { w: 42, h: 59.4 },
	"15x15": { w: 15, h: 15 },
	"30x40": { w: 30, h: 40 },
	"40x50": { w: 40, h: 50 },
	"50x70": { w: 50, h: 70 },
	"60x90": { w: 60, h: 90 }
};

function frame_size_cm() {
	if (frame_format === "custom") return frame_custom;
	return FRAME_SIZES[frame_format] || FRAME_SIZES["A4"];
}

function svg_el(name, attrs) {
	var el = document.createElementNS(SVG_NS, name);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}

// Quebra o texto em linhas que caibam em maxWidth (medido com canvas)
function wrap_text(text, fontSize, maxWidth) {
	var ctx = document.createElement("canvas").getContext("2d");
	ctx.font = fontSize + "px " + POSTER_FONT;
	var words = text.split(/\s+/).filter(Boolean);
	var lines = [];
	var line = "";
	for (var i = 0; i < words.length; i++) {
		var test = line ? line + " " + words[i] : words[i];
		if (line && ctx.measureText(test).width > maxWidth) {
			lines.push(line);
			line = words[i];
		} else {
			line = test;
		}
	}
	if (line) lines.push(line);
	return lines;
}

function format_coord(value, pos, neg) {
	var v = parseFloat(value);
	return Math.abs(v).toFixed(4) + "° " + (v < 0 ? neg : pos);
}

function poster_texts() {
	var texts = { message: message.trim(), details: [] };
	var dt = document.getElementById("user_date").value;
	var hr = document.getElementById("user_time").value;
	var lat = document.getElementById("user_lat").value;
	var lon = document.getElementById("user_lon").value;

	var when = [];
	if (ck_date && dt) {
		var p = dt.split("-");
		var d = new Date(+p[0], +p[1] - 1, +p[2]);
		when.push(d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }));
	}
	if (ck_time && hr) when.push(hr);
	if (when.length) texts.details.push(when.join("  ·  "));
	if (ck_coordinates && lat !== "" && lon !== "") {
		texts.details.push(format_coord(lat, "N", "S") + "   " + format_coord(lon, "E", "W"));
	}
	return texts;
}

// Monta o pôster completo (fundo, céu e textos) no formato escolhido
function build_poster() {
	var size = frame_size_cm();
	var W = POSTER_WIDTH;
	var H = Math.round(W * size.h / size.w);
	var margin = 0.08 * Math.min(W, H);

	var svg = svg_el("svg", {
		xmlns: SVG_NS,
		width: size.w + "cm",
		height: size.h + "cm",
		viewBox: "0 0 " + W + " " + H,
		"font-family": POSTER_FONT
	});
	svg.appendChild(svg_el("rect", { x: 0, y: 0, width: W, height: H, fill: sky_color }));

	// Tamanhos proporcionais ao lado menor, para valer em qualquer formato
	var unit = Math.min(W, H);
	var lineWidth = 0.0025 * unit; // espessura da moldura e do contorno do céu

	// Moldura: retângulo a uma pequena distância das bordas do quadro.
	// Fica dentro da margem do conteúdo, então não encosta no céu nem no texto.
	if (ck_border) {
		var inset = 0.035 * unit;
		svg.appendChild(svg_el("rect", {
			x: inset, y: inset, width: W - 2 * inset, height: H - 2 * inset,
			fill: "none", stroke: border_color, "stroke-width": lineWidth
		}));
	}
	var texts = poster_texts();
	var msgSize = 0.045 * unit;
	var detSize = 0.024 * unit;
	var gap = 0.06 * unit;
	var hasText = texts.message || texts.details.length;

	// Formatos horizontais: céu à esquerda e texto à direita.
	// Demais formatos: céu em cima e texto embaixo.
	var landscape = W > H * 1.15;
	var textW = landscape ? W - 2 * margin - (H - 2 * margin) - gap : W - 2 * margin;
	var msgLines = texts.message ? wrap_text(texts.message, msgSize, textW) : [];
	var textH = 0;
	if (msgLines.length) textH += msgLines.length * msgSize * 1.25;
	if (texts.details.length) textH += (msgLines.length ? detSize : 0) + texts.details.length * detSize * 1.6;

	var diameter, skyX, skyY, textX, textY;
	if (landscape) {
		diameter = H - 2 * margin;
		if (!hasText) {
			skyX = (W - diameter) / 2;
		} else {
			skyX = margin;
		}
		skyY = margin;
		textX = skyX + diameter + gap + textW / 2;
		textY = (H - textH) / 2;
	} else {
		var availH = H - 2 * margin - (hasText ? textH + gap : 0);
		diameter = Math.max(0, Math.min(W - 2 * margin, availH));
		skyX = (W - diameter) / 2;
		skyY = margin + (availH - diameter) / 2;
		textX = W / 2;
		textY = skyY + diameter + gap;
	}

	var sky = svg_el("svg", {
		x: skyX, y: skyY, width: diameter, height: diameter,
		viewBox: "0 0 " + SKY_SIZE + " " + SKY_SIZE
	});
	var clipId = "sky-clip-" + (++poster_count);
	var clip = svg_el("clipPath", { id: clipId });
	clip.appendChild(svg_el("circle", { cx: SKY_SIZE / 2, cy: SKY_SIZE / 2, r: SKY_SIZE / 2 }));
	var defs = svg_el("defs", {});
	defs.appendChild(clip);
	sky.appendChild(defs);
	var skyGroup = svg_el("g", { "clip-path": "url(#" + clipId + ")" });
	draw_sky_into(sky, skyGroup);
	sky.appendChild(skyGroup);
	// Contorno com a mesma espessura da moldura, convertida para as unidades
	// do céu (o svg do céu é escalado de SKY_SIZE para diameter).
	if (ck_border && diameter) {
		var skyLine = lineWidth * SKY_SIZE / diameter;
		sky.appendChild(svg_el("circle", {
			cx: SKY_SIZE / 2, cy: SKY_SIZE / 2, r: SKY_SIZE / 2 - skyLine / 2,
			fill: "none", stroke: border_color, "stroke-width": skyLine
		}));
	}
	svg.appendChild(sky);

	// Textos
	var y = textY;
	for (var i = 0; i < msgLines.length; i++) {
		y += msgSize;
		var t = svg_el("text", {
			x: textX, y: y, "text-anchor": "middle", fill: star_color,
			"font-size": msgSize, "font-family": POSTER_FONT, "font-weight": 300
		});
		t.textContent = msgLines[i];
		svg.appendChild(t);
		y += msgSize * 0.25;
	}
	if (msgLines.length && texts.details.length) y += detSize;
	for (var j = 0; j < texts.details.length; j++) {
		y += detSize * 1.6;
		var d = svg_el("text", {
			x: textX, y: y, "text-anchor": "middle", fill: star_color,
			"fill-opacity": 0.75, "font-size": detSize, "font-family": POSTER_FONT,
			"letter-spacing": detSize * 0.08
		});
		d.textContent = texts.details[j];
		svg.appendChild(d);
	}
	return svg;
}

// draw_sky desenha direto no svg do céu (as funções de desenho leem o viewBox
// dele); depois os elementos são movidos para o grupo recortado no círculo.
function draw_sky_into(sky, group) {
	var start = sky.childNodes.length;
	draw_sky(sky, SKY_SIZE, SKY_SIZE);
	while (sky.childNodes.length > start) group.appendChild(sky.childNodes[start]);
}

function refresh() {
	if (validateFields()) {
		var container = document.getElementById("planicanvas");
		container.innerHTML = "";
		container.appendChild(build_poster());
	}
}

// Mostra o quadro inteiro em tela cheia, para conferir textos e detalhes
function openPosterZoom() {
	if (!validateFields()) return;
	var zoom = document.getElementById("poster-zoom");
	var old = zoom.querySelector("svg");
	if (old) zoom.removeChild(old);
	zoom.appendChild(build_poster());
	zoom.classList.add("open");
}

function closePosterZoom(event) {
	event.stopPropagation();
	document.getElementById("poster-zoom").classList.remove("open");
}

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape") document.getElementById("poster-zoom").classList.remove("open");
});

function poster_filename(ext) {
	var dt = document.getElementById("user_date").value;
	var lat = document.getElementById("user_lat").value;
	var lon = document.getElementById("user_lon").value;
	return "Night Sky Pro - " + dt + " - " + lat + " - " + lon + "." + ext;
}

function download_blob(blob, filename) {
	var url = URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function poster_svg_string() {
	get_user_obs();
	return new XMLSerializer().serializeToString(build_poster());
}

function saveImage() {
	if (!validateFields()) return;
	var size = frame_size_cm();
	var longSide = Math.max(256, resolution || 3000);
	var w, h;
	if (size.w >= size.h) {
		w = longSide;
		h = Math.round(longSide * size.h / size.w);
	} else {
		h = longSide;
		w = Math.round(longSide * size.w / size.h);
	}
	// Respeita o limite de área de canvas dos navegadores móveis
	if (w * h > MAX_CANVAS_AREA) {
		var k = Math.sqrt(MAX_CANVAS_AREA / (w * h));
		w = Math.floor(w * k);
		h = Math.floor(h * k);
	}

	var svgUrl = URL.createObjectURL(new Blob([poster_svg_string()], { type: "image/svg+xml" }));
	var img = new Image();
	img.onload = function () {
		var canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, w, h);
		URL.revokeObjectURL(svgUrl);
		canvas.toBlob(function (blob) {
			if (blob) download_blob(blob, poster_filename("png"));
			else alert("Não foi possível gerar a imagem. Tente uma resolução menor.");
		}, "image/png");
	};
	img.onerror = function () {
		URL.revokeObjectURL(svgUrl);
		alert("Não foi possível gerar a imagem.");
	};
	img.src = svgUrl;
}

function saveAsVector() {
	if (!validateFields()) return;
	var blob = new Blob([poster_svg_string()], { type: "image/svg+xml" });
	download_blob(blob, poster_filename("svg"));
}

function set_user_obs() {
	// atualiza o formulário com os valores atuais das variáveis globais
	document.getElementById("resolution").value = resolution;

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
	document.getElementById("custom_width").value = frame_custom.w;
	document.getElementById("custom_height").value = frame_custom.h;
	toggleCustomSize();

	document.getElementById("user_starlab").checked = ck_starlabels;
	document.getElementById("user_conlab").checked = ck_conlabels;
	document.getElementById("user_dsos").checked = ck_dsos;
	document.getElementById("user_conline").checked = ck_conlines;
	document.getElementById("show_coordinates").checked = ck_coordinates;
	document.getElementById("show_date").checked = ck_date;
	document.getElementById("show_time").checked = ck_time;
	document.getElementById("show_border").checked = ck_border;

	document.getElementById("user_message").value = message;
	document.getElementById("user_music").value = song_link;
}

function get_user_obs() {
	if (!validateFields()) return;

	var dt = document.getElementById("user_date");
	var hr = document.getElementById("user_time");
	var lon = document.getElementById("user_lon");
	var lat = document.getElementById("user_lat");

	// Monta a data no fuso local do navegador. Date.parse("AAAA-MM-DD") usa
	// meia-noite UTC, o que em fusos negativos (ex.: Brasil) caía no dia anterior.
	var dp = dt.value.split("-").map(Number);
	var tp = hr.value.split(":").map(Number);
	if (dp.length !== 3 || dp.some(isNaN)) {
		alert("Your browser doesn't think\n'" + dt.value + "'\nis a valid date.");
		set_user_obs();
		return;
	}
	if (tp.length < 2 || isNaN(tp[0]) || isNaN(tp[1])) {
		alert("Invalid time format. Please use HH:MM.");
		set_user_obs();
		return;
	}
	var d = new Date(dp[0], dp[1] - 1, dp[2], tp[0], tp[1]);

	frame_format = document.getElementById("frame_format").value;

	if (frame_format === "custom") {
		var w = parseFloat(document.getElementById("custom_width").value);
		var h = parseFloat(document.getElementById("custom_height").value);
		if (w >= 5 && h >= 5) {
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
	ck_border = document.getElementById("show_border").checked;

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

	// resolução do PNG (lado maior, em pixels)
	var res = parseInt(document.getElementById("resolution").value);
	if (res >= 256) resolution = res;

	set_user_obs();
	refresh();
}

function canvasApp() {
	init_stars(star);
	init_dsos(dso);
	init_planets(planet);
	now = new Observer();
	set_user_obs();
	get_user_obs(); // aplica a data e o local do formulário já na abertura
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

function toggleCustomSize() {
	var custom = document.getElementById("frame_format").value === "custom";
	document.getElementById("custom_size").style.display = custom ? "flex" : "none";
}

function onFrameFormatChange() {
	toggleCustomSize();
	get_user_obs();
}
