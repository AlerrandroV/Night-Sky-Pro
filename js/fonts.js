// ===== Fontes do pôster =====
// Os textos do pôster são desenhados como contornos (paths) gerados com o
// opentype.js a partir do arquivo da fonte. Por isso a fonte escolhida vale
// igual na prévia, no PNG e no SVG, sem depender das fontes instaladas em
// quem abre o arquivo.

// Fontes pré-programadas (arquivos em fonts/, todas com licença SIL OFL)
var FONT_PRESETS = [
	{ id: "inter", name: "Inter (padrão)", file: "fonts/inter-latin-300-normal.woff" },
	{ id: "montserrat", name: "Montserrat", file: "fonts/montserrat-latin-300-normal.woff" },
	{ id: "josefin-sans", name: "Josefin Sans", file: "fonts/josefin-sans-latin-300-normal.woff" },
	{ id: "playfair-display", name: "Playfair Display", file: "fonts/playfair-display-latin-400-normal.woff" },
	{ id: "cormorant-garamond", name: "Cormorant Garamond", file: "fonts/cormorant-garamond-latin-400-normal.woff" },
	{ id: "cinzel", name: "Cinzel", file: "fonts/cinzel-latin-400-normal.woff" },
	{ id: "great-vibes", name: "Great Vibes", file: "fonts/great-vibes-latin-400-normal.woff" },
	{ id: "dancing-script", name: "Dancing Script", file: "fonts/dancing-script-latin-400-normal.woff" },
	{ id: "pacifico", name: "Pacifico", file: "fonts/pacifico-latin-400-normal.woff" },
	{ id: "caveat", name: "Caveat", file: "fonts/caveat-latin-400-normal.woff" }
];

var CUSTOM_FONT_ID = "custom";
var font_cache = {};    // id -> { state: "loading" | "ok" | "error", font, promise }
var custom_font = null; // { name, font } da fonte importada ou do dafont

// ----- Carregamento -----

function load_font(id) {
	if (id === CUSTOM_FONT_ID) return Promise.resolve(custom_font && custom_font.font);
	if (font_cache[id]) return font_cache[id].promise;
	var preset = FONT_PRESETS.filter(function (p) { return p.id === id; })[0];
	if (!preset) return Promise.resolve(null);

	var entry = { state: "loading" };
	entry.promise = fetch(preset.file)
		.then(function (r) {
			if (!r.ok) throw new Error("HTTP " + r.status);
			return r.arrayBuffer();
		})
		.then(function (buf) {
			entry.font = opentype.parse(buf);
			entry.state = "ok";
			return entry.font;
		})
		.catch(function (err) {
			console.warn("Fonte " + id + ":", err);
			entry.state = "error";
			set_font_status("Não foi possível carregar a fonte " + preset.name + "; o texto usa a fonte do sistema. " +
				(location.protocol === "file:" ? "Abrindo o index.html direto do computador, o navegador bloqueia as fontes: use um servidor local (veja o README)." : "Verifique a conexão."), "error");
			return null;
		});
	font_cache[id] = entry;
	entry.promise.then(function () { if (typeof refresh === "function") refresh(); });
	return entry.promise;
}

// Fonte pronta para desenhar, ou null (ainda carregando ou indisponível).
// Se ainda não foi pedida, começa a carregar e redesenha quando terminar.
function get_font(id) {
	if (id === CUSTOM_FONT_ID) return custom_font ? custom_font.font : null;
	var entry = font_cache[id];
	if (!entry) {
		load_font(id);
		return null;
	}
	return entry.state === "ok" ? entry.font : null;
}

// Garante que as fontes usadas no pôster terminaram de carregar (para exportar)
function ensure_poster_fonts() {
	return Promise.all([load_font(msg_font), load_font(det_font)]);
}

// ----- Medida e desenho de texto -----

// Posições dos glifos de uma linha, com kerning e espaçamento extra
function layout_glyphs(font, str, size, spacing) {
	var scale = size / font.unitsPerEm;
	var glyphs = font.stringToGlyphs(str);
	var out = [];
	var x = 0;
	for (var i = 0; i < glyphs.length; i++) {
		if (i > 0) x += font.getKerningValue(glyphs[i - 1], glyphs[i]) * scale + spacing;
		out.push({ glyph: glyphs[i], x: x });
		x += (glyphs[i].advanceWidth || 0) * scale;
	}
	return { glyphs: out, width: x };
}

function measure_text(str, size, fontId, spacing) {
	var font = get_font(fontId);
	if (font) return layout_glyphs(font, str, size, spacing || 0).width;
	var ctx = document.createElement("canvas").getContext("2d");
	ctx.font = size + "px " + POSTER_FONT;
	return ctx.measureText(str).width + (spacing || 0) * Math.max(0, str.length - 1);
}

// Uma linha de texto do pôster. Com a fonte carregada vira um <path> (texto
// convertido em contorno); sem ela, um <text> com a fonte do sistema.
// opts: { x, y, size, anchor: "start" | "middle" | "end", fill, opacity, spacing, fontId }
function poster_text(str, opts) {
	var spacing = opts.spacing || 0;
	var font = get_font(opts.fontId);
	if (font) {
		var lay = layout_glyphs(font, str, opts.size, spacing);
		var x0 = opts.x - (opts.anchor === "middle" ? lay.width / 2 : opts.anchor === "end" ? lay.width : 0);
		var d = "";
		lay.glyphs.forEach(function (g) {
			d += g.glyph.getPath(x0 + g.x, opts.y, opts.size).toPathData(2);
		});
		var path = document.createElementNS(SVG_NS, "path");
		path.setAttribute("d", d);
		path.setAttribute("fill", opts.fill);
		if (opts.opacity !== undefined) path.setAttribute("fill-opacity", opts.opacity);
		return path;
	}
	var t = document.createElementNS(SVG_NS, "text");
	t.setAttribute("x", opts.x);
	t.setAttribute("y", opts.y);
	t.setAttribute("text-anchor", opts.anchor || "start");
	t.setAttribute("fill", opts.fill);
	if (opts.opacity !== undefined) t.setAttribute("fill-opacity", opts.opacity);
	t.setAttribute("font-size", opts.size);
	t.setAttribute("font-family", POSTER_FONT);
	if (spacing) t.setAttribute("letter-spacing", spacing);
	t.textContent = str;
	return t;
}

// ----- Fonte personalizada (arquivo ou dafont) -----

var FONT_FILE_RE = /\.(ttf|otf|woff)$/i;

// Aceita um arquivo de fonte ou um .zip (como os do dafont) com fontes dentro
function parse_font_buffer(buf, filename) {
	var bytes = new Uint8Array(buf, 0, 4);
	var isZip = bytes[0] === 0x50 && bytes[1] === 0x4b; // "PK"
	if (!isZip) {
		if (/\.woff2$/i.test(filename || "") || (bytes[0] === 0x77 && bytes[1] === 0x4f && bytes[2] === 0x46 && bytes[3] === 0x32)) {
			return Promise.reject(new Error("O formato WOFF2 não é suportado. Use um arquivo TTF, OTF ou WOFF."));
		}
		return Promise.resolve({ font: opentype.parse(buf), file: filename });
	}
	return JSZip.loadAsync(buf).then(function (zip) {
		var files = Object.keys(zip.files).filter(function (name) {
			return FONT_FILE_RE.test(name) && !/__MACOSX|\/\._/.test(name) && !zip.files[name].dir;
		});
		if (!files.length) throw new Error("O arquivo .zip não tem nenhuma fonte TTF, OTF ou WOFF.");
		var best = pick_regular_font(files);
		return zip.files[best].async("arraybuffer").then(function (fb) {
			return { font: opentype.parse(fb), file: best.split("/").pop() };
		});
	});
}

// Entre várias variações (Bold, Italic...), prefere a regular
function pick_regular_font(names) {
	function score(n) {
		var base = n.split("/").pop().toLowerCase();
		var s = 0;
		if (/regular|book|normal/.test(base)) s -= 10;
		if (/bold|black|heavy|italic|oblique|light|thin|medium|semi|extra|condensed/.test(base)) s += 5;
		if (/\.otf$/.test(base)) s -= 1;
		return s * 1000 + base.length;
	}
	return names.slice().sort(function (a, b) { return score(a) - score(b); })[0];
}

function set_custom_font(font, source) {
	var name = (font.names.fullName && (font.names.fullName.en || font.names.fullName[Object.keys(font.names.fullName)[0]])) || source;
	custom_font = { name: name, font: font };
	update_font_selects();
	// A fonte recém-adicionada passa a ser a da mensagem
	document.getElementById("msg_font").value = CUSTOM_FONT_ID;
	set_font_status("Fonte \"" + name + "\" adicionada e aplicada à mensagem. Ela também aparece como opção para os detalhes.", "ok");
	get_user_obs();
}

function load_font_file(input) {
	var file = input.files && input.files[0];
	if (!file) return;
	set_font_status("Lendo " + file.name + "…", "");
	file.arrayBuffer()
		.then(function (buf) { return parse_font_buffer(buf, file.name); })
		.then(function (r) { set_custom_font(r.font, r.file); })
		.catch(function (err) {
			console.warn("Fonte importada:", err);
			set_font_status(font_error_message(err), "error");
		})
		.then(function () { input.value = ""; });
}

function font_error_message(err) {
	var msg = err && err.message || "";
	if (/WOFF2|zip/.test(msg)) return msg;
	return "Não foi possível ler essa fonte. Use um arquivo TTF, OTF, WOFF ou o .zip baixado do dafont.";
}

// ----- dafont -----

// Converte o link de uma fonte do dafont no link de download do .zip
function dafont_download_url(link) {
	link = (link || "").trim();
	var m = link.match(/dl\.dafont\.com\/dl\/?\?f=([a-z0-9_]+)/i);
	if (m) return "https://dl.dafont.com/dl/?f=" + m[1].toLowerCase();
	m = link.match(/dafont\.com\/(?:[a-z]{2}\/)?([a-z0-9-]+)\.font/i);
	if (m) return "https://dl.dafont.com/dl/?f=" + m[1].toLowerCase().replace(/-/g, "_");
	return null;
}

// O dafont pode não permitir download direto a partir de outro site (CORS).
// Nesse caso, tenta por intermediários públicos e, se nada der certo, orienta
// a baixar o .zip e importar o arquivo.
var DAFONT_FETCHERS = [
	function (url) { return url; },
	function (url) { return "https://api.allorigins.win/raw?url=" + encodeURIComponent(url); },
	function (url) { return "https://corsproxy.io/?url=" + encodeURIComponent(url); }
];

function fetch_first(urls) {
	var i = 0;
	function next() {
		if (i >= urls.length) return Promise.reject(new Error("todas as tentativas falharam"));
		var u = urls[i++];
		return fetch(u)
			.then(function (r) {
				if (!r.ok) throw new Error("HTTP " + r.status);
				return r.arrayBuffer();
			})
			.then(function (buf) {
				var b = new Uint8Array(buf, 0, 2);
				if (b[0] !== 0x50 || b[1] !== 0x4b) throw new Error("resposta não é um .zip");
				return buf;
			})
			.catch(function (err) {
				console.warn("dafont via " + u + ":", err);
				return next();
			});
	}
	return next();
}

var dafont_loading = null;

function load_dafont_link() {
	var link = document.getElementById("dafont_link").value.trim();
	if (!link) {
		set_font_status("", "");
		return;
	}
	var url = dafont_download_url(link);
	if (!url) {
		set_font_status("Link não reconhecido. Abra a fonte no dafont e copie o endereço da página (termina em .font).", "error");
		return;
	}
	if (dafont_loading === url) return;
	dafont_loading = url;
	set_font_status("Baixando a fonte do dafont…", "");
	fetch_first(DAFONT_FETCHERS.map(function (f) { return f(url); }))
		.then(function (buf) { return parse_font_buffer(buf, "dafont.zip"); })
		.then(function (r) { set_custom_font(r.font, r.file); })
		.catch(function (err) {
			console.warn("dafont:", err);
			set_font_status("Não foi possível baixar essa fonte automaticamente. Clique em \"Download\" na página do dafont e importe o arquivo .zip pelo botão \"Importar arquivo\" acima.", "error");
		})
		.then(function () { dafont_loading = null; });
}

function paste_dafont_link() {
	var input = document.getElementById("dafont_link");
	if (!navigator.clipboard || !navigator.clipboard.readText) {
		set_font_status("Seu navegador não deixa o site ler a área de transferência. Cole o link no campo manualmente.", "error");
		input.focus();
		return;
	}
	navigator.clipboard.readText()
		.then(function (text) {
			input.value = text.trim();
			load_dafont_link();
		})
		.catch(function () {
			set_font_status("Não foi possível colar automaticamente. Cole o link no campo manualmente.", "error");
			input.focus();
		});
}

// ----- Painel -----

function set_font_status(msg, cls) {
	var el = document.getElementById("font_status");
	if (!el) return;
	el.textContent = msg;
	el.className = "status " + (cls || "");
}

// Preenche os seletores com as fontes pré-programadas (e a personalizada)
function update_font_selects() {
	["msg_font", "det_font"].forEach(function (id) {
		var sel = document.getElementById(id);
		if (!sel) return;
		var current = sel.value;
		sel.innerHTML = "";
		FONT_PRESETS.forEach(function (p) {
			var o = document.createElement("option");
			o.value = p.id;
			o.textContent = p.name;
			sel.appendChild(o);
		});
		if (custom_font) {
			var o = document.createElement("option");
			o.value = CUSTOM_FONT_ID;
			o.textContent = "Personalizada: " + custom_font.name;
			sel.appendChild(o);
		}
		if (current) sel.value = current;
	});
}
