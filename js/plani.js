var clipped = false;

// ===== Configurações do pôster (valores padrão) =====
// Cada uma é ligada a um campo do formulário pela tabela SETTINGS, mais abaixo.

// Quadro
var bg_color = "#110022";
var frame_format = "A4";
var frame_custom = { w: 21, h: 29.7 };

// Moldura retangular e contorno do céu
var ck_border = true;
var border_color = "#ffffff";
var border_scale = 1;

// Céu e estrelas
var sky_color = "#110022";
var star_color = "#ffffff";
var star_scale = 1;
var ck_starlabels = true;
var starLabel_color = "#888888";
var starLabel_size = 10;

// Planetas
var ck_planets = true;
var planet_scale = 1;
var ck_planetlabels = true;
var planetLabel_color = "#cccccc";
var planetLabel_size = 10;

// Constelações
var ck_conlines = false;
var conLine_color = "#cccccc";
var conLine_scale = 1;
var ck_conlabels = false;
var conLabel_color = "#778899";
var conLabel_size = 10;

// Objetos de céu profundo
var ck_dsos = false;
var dsoLabel_color = "#00ff00";
var dsoLabel_size = 5;

// Grade de coordenadas equatoriais
var ck_grid = false;
var grid_color = "#ffffff";
var grid_scale = 1;
var ck_gridlabels = true;
var gridLabel_color = "#ffffff";
var gridLabel_size = 10;

// Textos
var message = "The best night of our lives";
var ck_date = true;
var ck_time = true;
var ck_coordinates = true;
var text_color = "#ffffff";
var text_scale = 1;
var song_link = "https://open.spotify.com/intl-pt/track/0tgVpDi06FyKpA1z0VMD4v";

// Lua (desenhada na fase do momento escolhido)
var ck_moon = true;
var moon_color = "#f4f1e6";
var moon_scale = 1;
var ck_moonlabel = true;
var moonLabel_color = "#cccccc";
var moonLabel_size = 10;

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
	circle.setAttribute("r", 3 * planet_scale * mdd);
	circle.setAttribute("fill", p.color);
	svg.appendChild(circle);

	if (!ck_planetlabels) return;

	// === Desenhar o label ===
	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", p.pos.x + (3 * planet_scale + 2) * mdd);
	text.setAttribute("y", p.pos.y);
	text.setAttribute("fill", planetLabel_color);
	text.setAttribute("font-size", planetLabel_size * mdd);
	text.textContent = p.name === "Earth" ? "Sun" : p.name;
	svg.appendChild(text);
}

// Desenha a Lua na fase do momento: um disco escuro com a parte iluminada
// por cima. find_moon fornece:
//   phase:    elongação em relação ao Sol menos π (0 = cheia, ±π = nova);
//   posAngle: ângulo de posição do lado iluminado, do norte celeste para leste.
function draw_moon(svg, m, w, h) {
	var mdd = svg.viewBox.baseVal.width / 1000;
	var x = m.pos.x, y = m.pos.y;
	var r = 9 * moon_scale * mdd;

	// Direções do norte e do leste celestes na tela, no ponto da Lua, para
	// orientar o lado iluminado do jeito que ele aparece no mapa.
	var eps = 0.002;
	var pn = project_radec(m.pos.ra, m.pos.dec + eps, w, h);
	var pe = project_radec(m.pos.ra + eps, m.pos.dec, w, h);
	var nx = pn[0] - x, ny = pn[1] - y;
	var ex = pe[0] - x, ey = pe[1] - y;
	var nl = Math.hypot(nx, ny) || 1, el = Math.hypot(ex, ey) || 1;
	var bx = Math.cos(m.posAngle) * nx / nl + Math.sin(m.posAngle) * ex / el;
	var by = Math.cos(m.posAngle) * ny / nl + Math.sin(m.posAngle) * ey / el;
	var angle = Math.atan2(by, bx) * 180 / Math.PI;

	// Fração iluminada: 1 na cheia, 0 na nova
	var k = (1 + Math.cos(m.phase)) / 2;
	m.illumination = k;

	var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	g.setAttribute("transform", "translate(" + x + " " + y + ") rotate(" + angle + ")");

	// Fundo opaco: a Lua esconde as estrelas que estão atrás dela
	var back = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	back.setAttribute("r", r);
	back.setAttribute("fill", sky_color);
	g.appendChild(back);

	// Disco inteiro, apagado
	var disk = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	disk.setAttribute("r", r);
	disk.setAttribute("fill", moon_color);
	disk.setAttribute("fill-opacity", 0.15);
	disk.setAttribute("stroke", moon_color);
	disk.setAttribute("stroke-opacity", 0.4);
	disk.setAttribute("stroke-width", r * 0.06);
	g.appendChild(disk);

	// Parte iluminada: meio disco voltado para o Sol (+x) fechado pelo
	// terminador, uma meia elipse que vai para o lado escuro na fase gibosa
	// e para o lado claro na fase crescente/minguante.
	if (k > 0.005) {
		var rx = r * Math.abs(2 * k - 1);
		var lit = document.createElementNS("http://www.w3.org/2000/svg", "path");
		lit.setAttribute("d",
			"M0 " + (-r) +
			"A" + r + " " + r + " 0 0 1 0 " + r +
			"A" + rx + " " + r + " 0 0 " + (k > 0.5 ? 1 : 0) + " 0 " + (-r) + "Z");
		lit.setAttribute("fill", moon_color);
		g.appendChild(lit);
	}
	svg.appendChild(g);

	if (ck_moonlabel) {
		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute("x", x + r + 3 * mdd);
		text.setAttribute("y", y + moonLabel_size * mdd * 0.35);
		text.setAttribute("fill", moonLabel_color);
		text.setAttribute("font-size", moonLabel_size * mdd);
		text.textContent = "Lua";
		svg.appendChild(text);
	}
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

// Projeta (ascensão reta, declinação J2000, em radianos) no disco do céu com a
// mesma projeção de skypos_transform, mas também para pontos abaixo do
// horizonte: eles caem fora do círculo e são cortados pelo recorte do céu.
function project_radec(ra, dec, w, h) {
	var coord = [ra, dec];
	Astro.precess(Astro.JD_J2000, now.jd, coord);
	coord[0] = now.lst - coord[0];
	Astro.aa_hadec(now.latitude, coord, coord);
	var tmp = 0.5 - coord[1] / Math.PI;
	return [w * (0.5 - tmp * Math.sin(coord[0])), h * (0.5 - tmp * Math.cos(coord[0]))];
}

function grid_path(points) {
	var d = "";
	for (var i = 0; i < points.length; i++) {
		d += (i ? "L" : "M") + points[i][0].toFixed(2) + " " + points[i][1].toFixed(2);
	}
	return d;
}

// Grade de coordenadas equatoriais: meridianos (círculos horários) a cada
// 1 h de ascensão reta e paralelos de declinação a cada 15°.
function draw_grid(svg, w, h) {
	var DEG = Math.PI / 180;
	var d = "";
	for (var hr = 0; hr < 24; hr++) {
		var ra = hr * 15 * DEG;
		// Só os meridianos de 0, 6, 12 e 18 h chegam aos polos; os demais param
		// no último paralelo, para não formar um borrão onde todos se encontram.
		var lim = hr % 6 === 0 ? 90 : 75;
		var pts = [];
		for (var dec = -lim; dec <= lim; dec += 2.5) pts.push(project_radec(ra, dec * DEG, w, h));
		d += grid_path(pts);
	}
	for (var dc = -75; dc <= 75; dc += 15) {
		var pts2 = [];
		for (var r = 0; r <= 360; r += 2) pts2.push(project_radec(r * DEG, dc * DEG, w, h));
		d += grid_path(pts2);
	}
	var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", d);
	path.setAttribute("fill", "none");
	path.setAttribute("stroke", grid_color);
	path.setAttribute("stroke-opacity", 0.3);
	path.setAttribute("stroke-width", w / 1000 * grid_scale);
	svg.appendChild(path);

	if (ck_gridlabels) draw_grid_labels(svg, w, h);
}

// Rótulos da grade: as horas de ascensão reta ao longo do equador celeste e as
// declinações ao longo do meridiano mais próximo do zênite (o mais visível).
// Só entram os rótulos que caem dentro do círculo do céu.
function draw_grid_labels(svg, w, h) {
	var DEG = Math.PI / 180;
	var radius = Math.min(w, h) / 2;
	var size = gridLabel_size * w / 750;

	function inside(p) {
		return Math.hypot(p[0] - w / 2, p[1] - h / 2) < radius - size * 1.5;
	}

	function label(p, text, anchor, dx, dy) {
		var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
		t.setAttribute("x", p[0] + dx);
		t.setAttribute("y", p[1] + dy);
		t.setAttribute("fill", gridLabel_color);
		t.setAttribute("fill-opacity", 0.6);
		t.setAttribute("font-size", size);
		t.setAttribute("text-anchor", anchor);
		t.textContent = text;
		svg.appendChild(t);
	}

	for (var hr = 0; hr < 24; hr++) {
		var p = project_radec(hr * 15 * DEG, 0, w, h);
		if (inside(p)) label(p, hr + "h", "middle", 0, -size * 0.4);
	}

	var hrZenith = Math.round(now.lst / (15 * DEG)) % 24;
	for (var dec = -75; dec <= 75; dec += 15) {
		if (dec === 0) continue; // o cruzamento com o equador já tem o rótulo da hora
		var q = project_radec(hrZenith * 15 * DEG, dec * DEG, w, h);
		var text = (dec > 0 ? "+" : "\u2212") + Math.abs(dec) + "\u00b0";
		if (inside(q)) label(q, text, "start", size * 0.35, -size * 0.35);
	}
}

function draw_sky(svg, w, h) {
	var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	var radius = Math.min(w, h) / 2;
	circle.setAttribute("cx", w / 2);
	circle.setAttribute("cy", h / 2);
	circle.setAttribute("r", radius);
	circle.setAttribute("fill", sky_color);
	svg.appendChild(circle);

	if (ck_grid) draw_grid(svg, w, h);

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

	// A Terra (planet[2]) vem primeiro: os outros planetas e a Lua usam a
	// posição dela, e o Sol é desenhado a partir dela.
	find_planet(planet[2], planet[2], now.jd);
	for (var i = 0; ck_planets && i < 9; i++) {
		if (i !== 2) find_planet(planet[i], planet[2], now.jd);
		skypos_transform(planet[i].pos, now, w, h);

		if (planet[i].pos.visible) {
			draw_planet(svg, planet[i]);
		}
	}

	if (ck_moon) {
		find_moon(moon, planet[2], now.jd);
		skypos_transform(moon.pos, now, w, h);
		if (moon.pos.visible) draw_moon(svg, moon, w, h);
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
	svg.appendChild(svg_el("rect", { x: 0, y: 0, width: W, height: H, fill: bg_color }));

	// Tamanhos proporcionais ao lado menor, para valer em qualquer formato
	var unit = Math.min(W, H);
	var lineWidth = 0.0025 * unit * border_scale; // moldura e contorno do céu

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
	var msgSize = 0.045 * unit * text_scale;
	var detSize = 0.024 * unit * text_scale;
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
			x: textX, y: y, "text-anchor": "middle", fill: text_color,
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
			x: textX, y: y, "text-anchor": "middle", fill: text_color,
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

// Tabela de configurações: [id do campo, variável global, tipo].
// Tipos: "bool" (interruptor), "color", "float", "int", "text".
var SETTINGS = [
	["bg_color", "bg_color", "color"],
	["resolution", "resolution", "int"],

	["show_border", "ck_border", "bool"],
	["border_color", "border_color", "color"],
	["border_scale", "border_scale", "float"],

	["sky_color", "sky_color", "color"],
	["star_color", "star_color", "color"],
	["star_scale", "star_scale", "float"],
	["user_starlab", "ck_starlabels", "bool"],
	["starLabel_color", "starLabel_color", "color"],
	["starLabel_size", "starLabel_size", "int"],

	["show_planets", "ck_planets", "bool"],
	["planet_scale", "planet_scale", "float"],
	["show_planetlab", "ck_planetlabels", "bool"],
	["planetLabel_color", "planetLabel_color", "color"],
	["planetLabel_size", "planetLabel_size", "int"],

	["show_moon", "ck_moon", "bool"],
	["moon_color", "moon_color", "color"],
	["moon_scale", "moon_scale", "float"],
	["show_moonlab", "ck_moonlabel", "bool"],
	["moonLabel_color", "moonLabel_color", "color"],
	["moonLabel_size", "moonLabel_size", "int"],

	["user_conline", "ck_conlines", "bool"],
	["conLine_color", "conLine_color", "color"],
	["conLine_scale", "conLine_scale", "float"],
	["user_conlab", "ck_conlabels", "bool"],
	["conLabel_color", "conLabel_color", "color"],
	["conLabel_size", "conLabel_size", "int"],

	["user_dsos", "ck_dsos", "bool"],
	["dsoLabel_color", "dsoLabel_color", "color"],
	["dsoLabel_size", "dsoLabel_size", "int"],

	["show_grid", "ck_grid", "bool"],
	["grid_color", "grid_color", "color"],
	["grid_scale", "grid_scale", "float"],
	["show_gridlab", "ck_gridlabels", "bool"],
	["gridLabel_color", "gridLabel_color", "color"],
	["gridLabel_size", "gridLabel_size", "int"],

	["user_message", "message", "text"],
	["show_date", "ck_date", "bool"],
	["show_time", "ck_time", "bool"],
	["show_coordinates", "ck_coordinates", "bool"],
	["text_color", "text_color", "color"],
	["text_scale", "text_scale", "float"],
	["user_music", "song_link", "text"]
];

// Grava os valores das variáveis globais no formulário
function set_user_obs() {
	SETTINGS.forEach(function (st) {
		var el = document.getElementById(st[0]);
		var v = window[st[1]];
		if (!el) return;
		if (st[2] === "bool") el.checked = v;
		else if (st[2] === "color" && el.jscolor) el.jscolor.fromString(v);
		else el.value = v;
	});
	document.getElementById("frame_format").value = frame_format;
	document.getElementById("custom_width").value = frame_custom.w;
	document.getElementById("custom_height").value = frame_custom.h;
	toggleCustomSize();
	update_visibility();
}

// Lê o formulário para as variáveis globais (valores inválidos são ignorados)
function read_settings() {
	SETTINGS.forEach(function (st) {
		var el = document.getElementById(st[0]);
		if (!el) return;
		var v;
		switch (st[2]) {
			case "bool": v = el.checked; break;
			case "float": v = parseFloat(el.value); if (!(v > 0)) return; break;
			case "int": v = parseInt(el.value, 10); if (!(v > 0)) return; break;
			case "color": v = el.value.trim(); if (!v) return; if (v[0] !== "#") v = "#" + v; break;
			default: v = el.value;
		}
		window[st[1]] = v;
	});
	if (resolution < 256) resolution = 256;
}

// Mostra só as opções que fazem efeito: um item com data-show-if="a b"
// aparece apenas se os interruptores a e b estiverem ligados.
function update_visibility() {
	document.querySelectorAll("[data-show-if]").forEach(function (el) {
		var ids = el.getAttribute("data-show-if").split(/\s+/);
		var show = ids.every(function (id) {
			var cb = document.getElementById(id);
			return cb && cb.checked;
		});
		el.style.display = show ? "" : "none";
	});
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
		alert("Data inválida: '" + dt.value + "'. Use o formato AAAA-MM-DD.");
		set_user_obs();
		return;
	}
	if (tp.length < 2 || isNaN(tp[0]) || isNaN(tp[1])) {
		alert("Hora inválida. Use o formato HH:MM.");
		set_user_obs();
		return;
	}
	var d = new Date(dp[0], dp[1] - 1, dp[2], tp[0], tp[1]);

	frame_format = document.getElementById("frame_format").value;
	if (frame_format === "custom") {
		var w = parseFloat(document.getElementById("custom_width").value);
		var h = parseFloat(document.getElementById("custom_height").value);
		if (w >= 5 && h >= 5) frame_custom = { w: w, h: h };
	}

	now.setDate(d);
	if (lon.value >= -180 && lon.value < 180) now.setLonDegrees(lon.value);
	if (lat.value >= -90 && lat.value <= 90) now.setLatDegrees(lat.value);

	read_settings();
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

	// Qualquer mudança no painel atualiza o pôster
	document.getElementById("controls").addEventListener("change", function (e) {
		if (e.target.id === "frame_format") toggleCustomSize();
		update_visibility();
		get_user_obs();
	});
}

function setGeoPos(geopos) {
	document.getElementById("user_lat").value = geopos.coords.latitude;
	document.getElementById("user_lon").value = geopos.coords.longitude;
	get_user_obs();
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
	get_user_obs();
}

function toggleCustomSize() {
	var custom = document.getElementById("frame_format").value === "custom";
	document.getElementById("custom_size").style.display = custom ? "flex" : "none";
}

