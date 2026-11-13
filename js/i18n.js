// ===== Traduções =====
// Cada texto tem uma linha com os idiomas na ordem de LANG_CODES:
//        português, inglês, espanhol, francês, alemão, italiano.
// O idioma do site traduz o painel; o "idioma da arte" traduz o pôster
// (data, planetas, Lua, pontos cardeais e a mensagem padrão).
// Nomes de constelações (latim, padrão da IAU) e de estrelas não mudam.

var LANG_CODES = ["pt", "en", "es", "fr", "de", "it"];
var LANG_NAMES = { pt: "Português", en: "English", es: "Español", fr: "Français", de: "Deutsch", it: "Italiano" };
var LANG_LOCALES = { pt: "pt-BR", en: "en-US", es: "es-ES", fr: "fr-FR", de: "de-DE", it: "it-IT" };

var I18N = {
	// --- Painel: seções ---
	sec_moment: ["Momento", "Moment", "Momento", "Moment", "Zeitpunkt", "Momento"],
	sec_location: ["Local", "Location", "Ubicación", "Lieu", "Ort", "Luogo"],
	sec_frame: ["Quadro", "Poster", "Póster", "Affiche", "Poster", "Poster"],
	sec_border: ["Moldura e contorno do céu", "Border and sky outline", "Marco y contorno del cielo", "Bordure et contour du ciel", "Rahmen und Himmelsumriss", "Cornice e contorno del cielo"],
	sec_sky: ["Céu e estrelas", "Sky and stars", "Cielo y estrellas", "Ciel et étoiles", "Himmel und Sterne", "Cielo e stelle"],
	sec_planets: ["Planetas", "Planets", "Planetas", "Planètes", "Planeten", "Pianeti"],
	sec_moon: ["Lua", "Moon", "Luna", "Lune", "Mond", "Luna"],
	sec_const: ["Constelações", "Constellations", "Constelaciones", "Constellations", "Sternbilder", "Costellazioni"],
	sec_dso: ["Objetos de céu profundo", "Deep-sky objects", "Objetos de cielo profundo", "Objets du ciel profond", "Deep-Sky-Objekte", "Oggetti del cielo profondo"],
	sec_grid: ["Grade de coordenadas", "Coordinate grid", "Cuadrícula de coordenadas", "Grille de coordonnées", "Koordinatengitter", "Griglia delle coordinate"],
	sec_texts: ["Textos", "Texts", "Textos", "Textes", "Texte", "Testi"],
	sec_fonts: ["Fontes", "Fonts", "Fuentes", "Polices", "Schriftarten", "Caratteri"],
	sec_spotify: ["Código do Spotify", "Spotify code", "Código de Spotify", "Code Spotify", "Spotify-Code", "Codice Spotify"],

	// --- Painel: rótulos ---
	language: ["Idioma", "Language", "Idioma", "Langue", "Sprache", "Lingua"],
	place_name: ["Nome do local", "Place name", "Nombre del lugar", "Nom du lieu", "Ortsname", "Nome del luogo"],
	format: ["Formato", "Format", "Formato", "Format", "Format", "Formato"],
	custom: ["Personalizado", "Custom", "Personalizado", "Personnalisé", "Benutzerdefiniert", "Personalizzato"],
	bg_color: ["Cor do fundo", "Background color", "Color de fondo", "Couleur de fond", "Hintergrundfarbe", "Colore di sfondo"],
	resolution: ["Resolução do PNG (px, lado maior)", "PNG resolution (px, longest side)", "Resolución del PNG (px, lado mayor)", "Résolution du PNG (px, plus grand côté)", "PNG-Auflösung (px, längste Seite)", "Risoluzione PNG (px, lato lungo)"],
	show: ["Mostrar", "Show", "Mostrar", "Afficher", "Anzeigen", "Mostra"],
	color: ["Cor", "Color", "Color", "Couleur", "Farbe", "Colore"],
	thickness: ["Espessura", "Thickness", "Grosor", "Épaisseur", "Stärke", "Spessore"],
	opacity: ["Opacidade (%)", "Opacity (%)", "Opacidad (%)", "Opacité (%)", "Deckkraft (%)", "Opacità (%)"],
	sky_color: ["Cor do céu", "Sky color", "Color del cielo", "Couleur du ciel", "Himmelsfarbe", "Colore del cielo"],
	star_color: ["Cor das estrelas", "Star color", "Color de las estrellas", "Couleur des étoiles", "Sternfarbe", "Colore delle stelle"],
	star_size: ["Tamanho das estrelas", "Star size", "Tamaño de las estrellas", "Taille des étoiles", "Sterngröße", "Dimensione delle stelle"],
	star_names: ["Nomes das estrelas", "Star names", "Nombres de las estrellas", "Noms des étoiles", "Sternnamen", "Nomi delle stelle"],
	names_color: ["Cor dos nomes", "Name color", "Color de los nombres", "Couleur des noms", "Farbe der Namen", "Colore dei nomi"],
	names_size: ["Tamanho dos nomes", "Name size", "Tamaño de los nombres", "Taille des noms", "Größe der Namen", "Dimensione dei nomi"],
	planet_size: ["Tamanho dos planetas", "Planet size", "Tamaño de los planetas", "Taille des planètes", "Planetengröße", "Dimensione dei pianeti"],
	planet_names: ["Nomes dos planetas", "Planet names", "Nombres de los planetas", "Noms des planètes", "Planetennamen", "Nomi dei pianeti"],
	moon_show: ["Mostrar (na fase do momento)", "Show (in its phase at that moment)", "Mostrar (en la fase de ese momento)", "Afficher (dans sa phase du moment)", "Anzeigen (in der Phase des Zeitpunkts)", "Mostra (nella fase del momento)"],
	size: ["Tamanho", "Size", "Tamaño", "Taille", "Größe", "Dimensione"],
	name: ["Nome", "Name", "Nombre", "Nom", "Name", "Nome"],
	name_color: ["Cor do nome", "Name color", "Color del nombre", "Couleur du nom", "Farbe des Namens", "Colore del nome"],
	name_size: ["Tamanho do nome", "Name size", "Tamaño del nombre", "Taille du nom", "Größe des Namens", "Dimensione del nome"],
	lines: ["Linhas", "Lines", "Líneas", "Lignes", "Linien", "Linee"],
	lines_color: ["Cor das linhas", "Line color", "Color de las líneas", "Couleur des lignes", "Linienfarbe", "Colore delle linee"],
	lines_thickness: ["Espessura das linhas", "Line thickness", "Grosor de las líneas", "Épaisseur des lignes", "Linienstärke", "Spessore delle linee"],
	lines_opacity: ["Opacidade das linhas (%)", "Line opacity (%)", "Opacidad de las líneas (%)", "Opacité des lignes (%)", "Linien-Deckkraft (%)", "Opacità delle linee (%)"],
	names: ["Nomes", "Names", "Nombres", "Noms", "Namen", "Nomi"],
	dso_show: ["Mostrar (galáxias, nebulosas, aglomerados)", "Show (galaxies, nebulae, clusters)", "Mostrar (galaxias, nebulosas, cúmulos)", "Afficher (galaxies, nébuleuses, amas)", "Anzeigen (Galaxien, Nebel, Sternhaufen)", "Mostra (galassie, nebulose, ammassi)"],
	grid_labels: ["Rótulos (horas e declinações)", "Labels (hours and declinations)", "Etiquetas (horas y declinaciones)", "Étiquettes (heures et déclinaisons)", "Beschriftungen (Stunden und Deklinationen)", "Etichette (ore e declinazioni)"],
	labels_color: ["Cor dos rótulos", "Label color", "Color de las etiquetas", "Couleur des étiquettes", "Farbe der Beschriftungen", "Colore delle etichette"],
	labels_size: ["Tamanho dos rótulos", "Label size", "Tamaño de las etiquetas", "Taille des étiquettes", "Größe der Beschriftungen", "Dimensione delle etichette"],
	labels_opacity: ["Opacidade dos rótulos (%)", "Label opacity (%)", "Opacidad de las etiquetas (%)", "Opacité des étiquettes (%)", "Deckkraft der Beschriftungen (%)", "Opacità delle etichette (%)"],
	message: ["Mensagem", "Message", "Mensaje", "Message", "Nachricht", "Messaggio"],
	date: ["Data", "Date", "Fecha", "Date", "Datum", "Data"],
	time: ["Hora", "Time", "Hora", "Heure", "Uhrzeit", "Ora"],
	coords: ["Coordenadas", "Coordinates", "Coordenadas", "Coordonnées", "Koordinaten", "Coordinate"],
	text_color: ["Cor dos textos", "Text color", "Color de los textos", "Couleur des textes", "Textfarbe", "Colore dei testi"],
	text_size: ["Tamanho dos textos", "Text size", "Tamaño de los textos", "Taille des textes", "Textgröße", "Dimensione dei testi"],
	art_lang: ["Idioma da arte", "Poster language", "Idioma del póster", "Langue de l'affiche", "Sprache des Posters", "Lingua del poster"],
	same_as_site: ["Igual ao do site", "Same as the site", "Igual que el sitio", "Comme le site", "Wie die Seite", "Come il sito"],
	fonts_details: ["Data, hora e coordenadas", "Date, time and coordinates", "Fecha, hora y coordenadas", "Date, heure et coordonnées", "Datum, Uhrzeit und Koordinaten", "Data, ora e coordinate"],
	custom_font: ["Fonte personalizada", "Custom font", "Fuente personalizada", "Police personnalisée", "Eigene Schriftart", "Carattere personalizzato"],
	import_file: ["Importar arquivo", "Import file", "Importar archivo", "Importer un fichier", "Datei importieren", "Importa file"],
	dafont_hint: [
		'Não gostou de nenhuma fonte? Quem sabe você não encontra a fonte ideal no <a href="https://www.dafont.com" target="_blank" rel="noopener">dafont</a>? Copie o link da fonte desejada e cole logo abaixo.',
		'Didn\'t like any of the fonts? Maybe you\'ll find the perfect one on <a href="https://www.dafont.com" target="_blank" rel="noopener">dafont</a>! Copy the link of the font you want and paste it below.',
		'¿No te gustó ninguna fuente? ¡Quizás encuentres la fuente ideal en <a href="https://www.dafont.com" target="_blank" rel="noopener">dafont</a>! Copia el enlace de la fuente que quieras y pégalo abajo.',
		'Aucune police ne vous plaît ? Vous trouverez peut-être la police idéale sur <a href="https://www.dafont.com" target="_blank" rel="noopener">dafont</a> ! Copiez le lien de la police souhaitée et collez-le ci-dessous.',
		'Keine Schriftart gefällt dir? Vielleicht findest du die perfekte auf <a href="https://www.dafont.com" target="_blank" rel="noopener">dafont</a>! Kopiere den Link der gewünschten Schriftart und füge ihn unten ein.',
		'Nessun carattere ti piace? Forse troverai quello ideale su <a href="https://www.dafont.com" target="_blank" rel="noopener">dafont</a>! Copia il link del carattere che vuoi e incollalo qui sotto.'
	],
	paste: ["Colar", "Paste", "Pegar", "Coller", "Einfügen", "Incolla"],
	link: ["Link", "Link", "Enlace", "Lien", "Link", "Link"],
	save_image: ["SALVAR IMAGEM", "SAVE IMAGE", "GUARDAR IMAGEN", "ENREGISTRER L'IMAGE", "BILD SPEICHERN", "SALVA IMMAGINE"],
	save_vector: ["SALVAR VETOR", "SAVE VECTOR", "GUARDAR VECTOR", "ENREGISTRER EN VECTORIEL", "VEKTOR SPEICHERN", "SALVA VETTORIALE"],
	map_title: ["Toque no mapa ou arraste o marcador até o local", "Tap the map or drag the pin to the place", "Toca el mapa o arrastra el marcador hasta el lugar", "Touchez la carte ou faites glisser le repère jusqu'au lieu", "Tippe auf die Karte oder ziehe die Markierung zum Ort", "Tocca la mappa o trascina il segnaposto sul luogo"],
	zoom_touch: ["Toque para ampliar", "Tap to enlarge", "Toca para ampliar", "Touchez pour agrandir", "Zum Vergrößern tippen", "Tocca per ingrandire"],
	zoom_click: ["Clique para ampliar", "Click to enlarge", "Haz clic para ampliar", "Cliquez pour agrandir", "Zum Vergrößern klicken", "Clicca per ingrandire"],
	now: ["Agora", "Now", "Ahora", "Maintenant", "Jetzt", "Adesso"],
	search_ph: ["Buscar cidade, rua ou endereço", "Search for a city, street or address", "Buscar ciudad, calle o dirección", "Rechercher une ville, une rue ou une adresse", "Stadt, Straße oder Adresse suchen", "Cerca città, via o indirizzo"],
	pick_map: ["Selecionar no mapa", "Pick on the map", "Elegir en el mapa", "Choisir sur la carte", "Auf der Karte wählen", "Scegli sulla mappa"],
	my_location: ["Minha localização", "My location", "Mi ubicación", "Ma position", "Mein Standort", "La mia posizione"],
	place_ph: ["Ex.: Belém, Pará, Brasil", "e.g. Paris, France", "Ej.: Madrid, España", "Ex. : Paris, France", "z. B. Berlin, Deutschland", "Es.: Roma, Italia"],
	lat_ph: ["Latitude", "Latitude", "Latitud", "Latitude", "Breitengrad", "Latitudine"],
	lon_ph: ["Longitude", "Longitude", "Longitud", "Longitude", "Längengrad", "Longitudine"],
	width_ph: ["Largura (cm)", "Width (cm)", "Ancho (cm)", "Largeur (cm)", "Breite (cm)", "Larghezza (cm)"],
	height_ph: ["Altura (cm)", "Height (cm)", "Alto (cm)", "Hauteur (cm)", "Höhe (cm)", "Altezza (cm)"],
	message_ph: ["Deixe vazio para não mostrar", "Leave empty to hide", "Déjalo vacío para no mostrarlo", "Laisser vide pour masquer", "Leer lassen zum Ausblenden", "Lascia vuoto per nasconderlo"],
	cancel: ["Cancelar", "Cancel", "Cancelar", "Annuler", "Abbrechen", "Annulla"],
	confirm: ["Confirmar", "Confirm", "Confirmar", "Confirmer", "Bestätigen", "Conferma"],
	close: ["Fechar", "Close", "Cerrar", "Fermer", "Schließen", "Chiudi"],
	font_default: ["{name} (padrão)", "{name} (default)", "{name} (predeterminada)", "{name} (par défaut)", "{name} (Standard)", "{name} (predefinito)"],
	font_custom_opt: ["Personalizada: {name}", "Custom: {name}", "Personalizada: {name}", "Personnalisée : {name}", "Eigene: {name}", "Personalizzato: {name}"],

	// --- Mensagens ---
	spotify_empty: ["Cole o link de uma música, álbum, playlist ou podcast do Spotify.", "Paste the link of a Spotify song, album, playlist or podcast.", "Pega el enlace de una canción, álbum, playlist o pódcast de Spotify.", "Collez le lien d'un titre, album, playlist ou podcast Spotify.", "Füge den Link eines Spotify-Songs, -Albums, einer Playlist oder eines Podcasts ein.", "Incolla il link di un brano, album, playlist o podcast di Spotify."],
	spotify_short: ["Links curtos (spotify.link) não funcionam. No Spotify, use Compartilhar → Copiar link da música e cole o link do open.spotify.com.", "Short links (spotify.link) don't work. In Spotify, use Share → Copy song link and paste the open.spotify.com link.", "Los enlaces cortos (spotify.link) no funcionan. En Spotify, usa Compartir → Copiar enlace de la canción y pega el enlace de open.spotify.com.", "Les liens courts (spotify.link) ne fonctionnent pas. Dans Spotify, utilisez Partager → Copier le lien du titre et collez le lien open.spotify.com.", "Kurzlinks (spotify.link) funktionieren nicht. Nutze in Spotify Teilen → Link zum Song kopieren und füge den open.spotify.com-Link ein.", "I link brevi (spotify.link) non funzionano. In Spotify usa Condividi → Copia link del brano e incolla il link di open.spotify.com."],
	spotify_bad: ["Link não reconhecido. Use um link do open.spotify.com.", "Link not recognized. Use an open.spotify.com link.", "Enlace no reconocido. Usa un enlace de open.spotify.com.", "Lien non reconnu. Utilisez un lien open.spotify.com.", "Link nicht erkannt. Verwende einen open.spotify.com-Link.", "Link non riconosciuto. Usa un link di open.spotify.com."],
	spotify_loading: ["Baixando o código do Spotify…", "Downloading the Spotify code…", "Descargando el código de Spotify…", "Téléchargement du code Spotify…", "Spotify-Code wird geladen…", "Download del codice Spotify…"],
	spotify_ok: ["Código do Spotify adicionado ao quadro.", "Spotify code added to the poster.", "Código de Spotify añadido al póster.", "Code Spotify ajouté à l'affiche.", "Spotify-Code zum Poster hinzugefügt.", "Codice Spotify aggiunto al poster."],
	spotify_error: ["Não foi possível baixar o código do Spotify. Verifique a conexão e tente de novo.", "Couldn't download the Spotify code. Check your connection and try again.", "No se pudo descargar el código de Spotify. Revisa la conexión e inténtalo de nuevo.", "Impossible de télécharger le code Spotify. Vérifiez la connexion et réessayez.", "Der Spotify-Code konnte nicht geladen werden. Prüfe die Verbindung und versuche es erneut.", "Impossibile scaricare il codice Spotify. Controlla la connessione e riprova."],
	retry: ["Tentar de novo", "Try again", "Reintentar", "Réessayer", "Erneut versuchen", "Riprova"],
	img_fail_res: ["Não foi possível gerar a imagem. Tente uma resolução menor.", "Couldn't create the image. Try a lower resolution.", "No se pudo generar la imagen. Prueba una resolución menor.", "Impossible de créer l'image. Essayez une résolution plus basse.", "Das Bild konnte nicht erstellt werden. Versuche eine geringere Auflösung.", "Impossibile creare l'immagine. Prova una risoluzione più bassa."],
	img_fail: ["Não foi possível gerar a imagem.", "Couldn't create the image.", "No se pudo generar la imagen.", "Impossible de créer l'image.", "Das Bild konnte nicht erstellt werden.", "Impossibile creare l'immagine."],
	date_invalid: ["Data inválida: '{value}'. Use o formato AAAA-MM-DD.", "Invalid date: '{value}'. Use the YYYY-MM-DD format.", "Fecha no válida: '{value}'. Usa el formato AAAA-MM-DD.", "Date invalide : '{value}'. Utilisez le format AAAA-MM-JJ.", "Ungültiges Datum: '{value}'. Verwende das Format JJJJ-MM-TT.", "Data non valida: '{value}'. Usa il formato AAAA-MM-GG."],
	time_invalid: ["Hora inválida. Use o formato HH:MM.", "Invalid time. Use the HH:MM format.", "Hora no válida. Usa el formato HH:MM.", "Heure invalide. Utilisez le format HH:MM.", "Ungültige Uhrzeit. Verwende das Format HH:MM.", "Ora non valida. Usa il formato HH:MM."],
	geo_error: ["Não foi possível obter sua localização ({msg}). Use a busca ou o mapa.", "Couldn't get your location ({msg}). Use the search or the map.", "No se pudo obtener tu ubicación ({msg}). Usa la búsqueda o el mapa.", "Impossible d'obtenir votre position ({msg}). Utilisez la recherche ou la carte.", "Dein Standort konnte nicht ermittelt werden ({msg}). Nutze die Suche oder die Karte.", "Impossibile ottenere la tua posizione ({msg}). Usa la ricerca o la mappa."],
	geo_unsupported: ["Este navegador não informa a localização. Use a busca ou o mapa.", "This browser doesn't provide your location. Use the search or the map.", "Este navegador no informa la ubicación. Usa la búsqueda o el mapa.", "Ce navigateur ne fournit pas la position. Utilisez la recherche ou la carte.", "Dieser Browser gibt keinen Standort an. Nutze die Suche oder die Karte.", "Questo browser non fornisce la posizione. Usa la ricerca o la mappa."],
	font_load_fail: ["Não foi possível carregar a fonte {name}; o texto usa a fonte do sistema.", "Couldn't load the {name} font; the text uses the system font.", "No se pudo cargar la fuente {name}; el texto usa la fuente del sistema.", "Impossible de charger la police {name} ; le texte utilise la police du système.", "Die Schriftart {name} konnte nicht geladen werden; der Text nutzt die Systemschrift.", "Impossibile caricare il carattere {name}; il testo usa il carattere di sistema."],
	font_file_proto: ["Abrindo o index.html direto do computador, o navegador bloqueia as fontes: use um servidor local (veja o README).", "When index.html is opened straight from the computer, the browser blocks the fonts: use a local server (see the README).", "Al abrir index.html directamente desde el ordenador, el navegador bloquea las fuentes: usa un servidor local (ver el README).", "En ouvrant index.html directement depuis l'ordinateur, le navigateur bloque les polices : utilisez un serveur local (voir le README).", "Wird index.html direkt vom Computer geöffnet, blockiert der Browser die Schriftarten: nutze einen lokalen Server (siehe README).", "Aprendo index.html direttamente dal computer, il browser blocca i caratteri: usa un server locale (vedi il README)."],
	check_connection: ["Verifique a conexão.", "Check your connection.", "Revisa la conexión.", "Vérifiez la connexion.", "Prüfe die Verbindung.", "Controlla la connessione."],
	woff2: ["O formato WOFF2 não é suportado. Use um arquivo TTF, OTF ou WOFF.", "The WOFF2 format is not supported. Use a TTF, OTF or WOFF file.", "El formato WOFF2 no es compatible. Usa un archivo TTF, OTF o WOFF.", "Le format WOFF2 n'est pas pris en charge. Utilisez un fichier TTF, OTF ou WOFF.", "Das Format WOFF2 wird nicht unterstützt. Verwende eine TTF-, OTF- oder WOFF-Datei.", "Il formato WOFF2 non è supportato. Usa un file TTF, OTF o WOFF."],
	zip_nofont: ["O arquivo .zip não tem nenhuma fonte TTF, OTF ou WOFF.", "The .zip file has no TTF, OTF or WOFF font.", "El archivo .zip no tiene ninguna fuente TTF, OTF o WOFF.", "Le fichier .zip ne contient aucune police TTF, OTF ou WOFF.", "Die .zip-Datei enthält keine TTF-, OTF- oder WOFF-Schriftart.", "Il file .zip non contiene caratteri TTF, OTF o WOFF."],
	font_added: ["Fonte \"{name}\" adicionada e aplicada à mensagem. Ela também aparece como opção para os detalhes.", "Font \"{name}\" added and applied to the message. It's also available for the details.", "Fuente \"{name}\" añadida y aplicada al mensaje. También aparece como opción para los detalles.", "Police « {name} » ajoutée et appliquée au message. Elle est aussi proposée pour les détails.", "Schriftart „{name}“ hinzugefügt und auf die Nachricht angewendet. Sie steht auch für die Details zur Wahl.", "Carattere \"{name}\" aggiunto e applicato al messaggio. È disponibile anche per i dettagli."],
	font_reading: ["Lendo {file}…", "Reading {file}…", "Leyendo {file}…", "Lecture de {file}…", "{file} wird gelesen…", "Lettura di {file}…"],
	font_read_fail: ["Não foi possível ler essa fonte. Use um arquivo TTF, OTF, WOFF ou o .zip baixado do dafont.", "Couldn't read this font. Use a TTF, OTF or WOFF file, or the .zip downloaded from dafont.", "No se pudo leer esa fuente. Usa un archivo TTF, OTF, WOFF o el .zip descargado de dafont.", "Impossible de lire cette police. Utilisez un fichier TTF, OTF, WOFF ou le .zip téléchargé sur dafont.", "Diese Schriftart konnte nicht gelesen werden. Verwende eine TTF-, OTF- oder WOFF-Datei oder die .zip von dafont.", "Impossibile leggere questo carattere. Usa un file TTF, OTF, WOFF o lo .zip scaricato da dafont."],
	dafont_bad: ["Link não reconhecido. Abra a fonte no dafont e copie o endereço da página (termina em .font).", "Link not recognized. Open the font on dafont and copy the page address (it ends in .font).", "Enlace no reconocido. Abre la fuente en dafont y copia la dirección de la página (termina en .font).", "Lien non reconnu. Ouvrez la police sur dafont et copiez l'adresse de la page (elle se termine par .font).", "Link nicht erkannt. Öffne die Schriftart auf dafont und kopiere die Seitenadresse (sie endet auf .font).", "Link non riconosciuto. Apri il carattere su dafont e copia l'indirizzo della pagina (termina con .font)."],
	dafont_loading: ["Baixando a fonte do dafont…", "Downloading the font from dafont…", "Descargando la fuente de dafont…", "Téléchargement de la police depuis dafont…", "Schriftart wird von dafont geladen…", "Download del carattere da dafont…"],
	dafont_fail: ["Não foi possível baixar essa fonte automaticamente. Clique em \"Download\" na página do dafont e importe o arquivo .zip pelo botão \"Importar arquivo\" acima.", "Couldn't download this font automatically. Click \"Download\" on the dafont page and import the .zip file with the \"Import file\" button above.", "No se pudo descargar esa fuente automáticamente. Haz clic en \"Download\" en la página de dafont e importa el archivo .zip con el botón \"Importar archivo\" de arriba.", "Impossible de télécharger cette police automatiquement. Cliquez sur « Download » sur la page dafont et importez le fichier .zip avec le bouton « Importer un fichier » ci-dessus.", "Diese Schriftart konnte nicht automatisch geladen werden. Klicke auf der dafont-Seite auf „Download“ und importiere die .zip-Datei über „Datei importieren“ oben.", "Impossibile scaricare questo carattere automaticamente. Fai clic su \"Download\" nella pagina di dafont e importa il file .zip con il pulsante \"Importa file\" qui sopra."],
	clipboard_unsupported: ["Seu navegador não deixa o site ler a área de transferência. Cole o link no campo manualmente.", "Your browser doesn't let the site read the clipboard. Paste the link into the field manually.", "Tu navegador no deja que el sitio lea el portapapeles. Pega el enlace en el campo manualmente.", "Votre navigateur n'autorise pas le site à lire le presse-papiers. Collez le lien dans le champ manuellement.", "Dein Browser erlaubt der Seite nicht, die Zwischenablage zu lesen. Füge den Link manuell ein.", "Il tuo browser non consente al sito di leggere gli appunti. Incolla il link nel campo manualmente."],
	clipboard_fail: ["Não foi possível colar automaticamente. Cole o link no campo manualmente.", "Couldn't paste automatically. Paste the link into the field manually.", "No se pudo pegar automáticamente. Pega el enlace en el campo manualmente.", "Impossible de coller automatiquement. Collez le lien dans le champ manuellement.", "Automatisches Einfügen nicht möglich. Füge den Link manuell ein.", "Impossibile incollare automaticamente. Incolla il link nel campo manualmente."],
	search_min: ["Digite pelo menos 3 letras.", "Type at least 3 letters.", "Escribe al menos 3 letras.", "Tapez au moins 3 lettres.", "Gib mindestens 3 Buchstaben ein.", "Digita almeno 3 lettere."],
	search_loading: ["Buscando…", "Searching…", "Buscando…", "Recherche…", "Suche…", "Ricerca…"],
	search_none: ["Nenhum lugar encontrado.", "No places found.", "No se encontró ningún lugar.", "Aucun lieu trouvé.", "Keine Orte gefunden.", "Nessun luogo trovato."],
	search_fail: ["Não foi possível buscar agora. Verifique a conexão ou use o mapa.", "Couldn't search right now. Check your connection or use the map.", "No se pudo buscar ahora. Revisa la conexión o usa el mapa.", "Recherche impossible pour le moment. Vérifiez la connexion ou utilisez la carte.", "Suche gerade nicht möglich. Prüfe die Verbindung oder nutze die Karte.", "Impossibile cercare ora. Controlla la connessione o usa la mappa."],
	map_fail: ["Não foi possível abrir o mapa. Verifique a conexão ou use a busca.", "Couldn't open the map. Check your connection or use the search.", "No se pudo abrir el mapa. Revisa la conexión o usa la búsqueda.", "Impossible d'ouvrir la carte. Vérifiez la connexion ou utilisez la recherche.", "Die Karte konnte nicht geöffnet werden. Prüfe die Verbindung oder nutze die Suche.", "Impossibile aprire la mappa. Controlla la connessione o usa la ricerca."],

	// --- Pôster (idioma da arte) ---
	default_message: ["A melhor noite das nossas vidas", "The best night of our lives", "La mejor noche de nuestras vidas", "La plus belle nuit de nos vies", "Die schönste Nacht unseres Lebens", "La notte più bella delle nostre vite"],
	moon_label: ["Lua", "Moon", "Luna", "Lune", "Mond", "Luna"],
	compass: ["NSLO", "NSEW", "NSEO", "NSEO", "NSOW", "NSEO"], // norte, sul, leste, oeste
	Mercury: ["Mercúrio", "Mercury", "Mercurio", "Mercure", "Merkur", "Mercurio"],
	Venus: ["Vênus", "Venus", "Venus", "Vénus", "Venus", "Venere"],
	Earth: ["Sol", "Sun", "Sol", "Soleil", "Sonne", "Sole"], // a "Terra" é desenhada como o Sol
	Mars: ["Marte", "Mars", "Marte", "Mars", "Mars", "Marte"],
	Jupiter: ["Júpiter", "Jupiter", "Júpiter", "Jupiter", "Jupiter", "Giove"],
	Saturn: ["Saturno", "Saturn", "Saturno", "Saturne", "Saturn", "Saturno"],
	Uranus: ["Urano", "Uranus", "Urano", "Uranus", "Uranus", "Urano"],
	Neptune: ["Netuno", "Neptune", "Neptuno", "Neptune", "Neptun", "Nettuno"],
	Pluto: ["Plutão", "Pluto", "Plutón", "Pluton", "Pluto", "Plutone"]
};

// Idioma do site: escolha salva neste navegador, senão o do navegador, senão inglês
var ui_lang = detect_language();
var art_lang = ""; // "" = igual ao do site

function detect_language() {
	try {
		var saved = localStorage.getItem("nsp_lang");
		if (LANG_CODES.indexOf(saved) >= 0) return saved;
	} catch (e) { /* armazenamento indisponível */ }
	var prefs = navigator.languages || [navigator.language || ""];
	for (var i = 0; i < prefs.length; i++) {
		var code = (prefs[i] || "").slice(0, 2).toLowerCase();
		if (LANG_CODES.indexOf(code) >= 0) return code;
	}
	return "en";
}

function poster_lang() {
	return art_lang || ui_lang;
}

// Texto traduzido, com {chaves} substituídas por params
function tr(key, lang, params) {
	var row = I18N[key];
	if (!row) return key;
	var s = row[LANG_CODES.indexOf(lang)] || row[0];
	if (params) s = s.replace(/\{(\w+)\}/g, function (m, k) { return params[k] !== undefined ? params[k] : m; });
	return s;
}

// No idioma do site
function t(key, params) {
	return tr(key, ui_lang, params);
}

// No idioma da arte
function ta(key, params) {
	return tr(key, poster_lang(), params);
}

// A mensagem do pôster ainda é a padrão (em qualquer idioma)?
function is_default_message(msg) {
	return I18N.default_message.indexOf(msg) >= 0;
}

// Aplica o idioma do site em todos os elementos marcados no HTML:
// data-i18n (texto), data-i18n-html (texto com link), data-i18n-ph
// (placeholder), data-i18n-value (botões), data-i18n-title, data-i18n-aria.
function apply_ui_language() {
	document.documentElement.lang = LANG_LOCALES[ui_lang];
	var attrs = { "data-i18n-ph": "placeholder", "data-i18n-value": "value", "data-i18n-title": "title", "data-i18n-aria": "aria-label" };
	document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
	document.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
	Object.keys(attrs).forEach(function (a) {
		document.querySelectorAll("[" + a + "]").forEach(function (el) { el.setAttribute(attrs[a], t(el.getAttribute(a))); });
	});
	var canvas = document.getElementById("planicanvas");
	canvas.setAttribute("data-hint-touch", t("zoom_touch"));
	canvas.setAttribute("data-hint-click", t("zoom_click"));
}

function set_ui_language(code) {
	if (LANG_CODES.indexOf(code) < 0) return;
	ui_lang = code;
	try { localStorage.setItem("nsp_lang", code); } catch (e) { /* armazenamento indisponível */ }
	apply_ui_language();
	if (typeof on_language_change === "function") on_language_change();
}

// Preenche os seletores de idioma (site e arte)
function fill_language_selects() {
	var site = document.getElementById("ui_lang");
	var art = document.getElementById("art_lang");
	site.innerHTML = "";
	art.innerHTML = "";
	var same = document.createElement("option");
	same.value = "";
	same.setAttribute("data-i18n", "same_as_site");
	same.textContent = t("same_as_site");
	art.appendChild(same);
	LANG_CODES.forEach(function (code) {
		[site, art].forEach(function (sel) {
			var o = document.createElement("option");
			o.value = code;
			o.textContent = LANG_NAMES[code];
			sel.appendChild(o);
		});
	});
	site.value = ui_lang;
}
