/* Paso a pasito: wireframe navegable.
   ETAPAS es la única fuente de verdad: escena, puntos, bolos y notas salen de aquí. */
(function () {
  "use strict";

  var ENVIAR_CORREO = location.protocol !== "file:"; // en local (file:) no manda correos; publicada, sí
  var CORREO = "estefano.mateo.p@gmail.com";
  var CLAVE = "paso-a-pasito-v1";

  // brillo del tobillo: de rojizo a dorado y a nada
  var ETAPAS = [
    { etiqueta: "Antes de empezar", titulo: "Paso a pasito", frase: "Siempre estoy a tu lado", img: "img/k0.webp", brillo: "rgba(226,80,60,.6)" },
    { etiqueta: "Sesión 1", titulo: "Primeros pasitos de bebé", frase: "A ver esos piecitos de porcelana", img: "img/k1.webp", nota: "Sé que va a doler, pero yo sé que tú puedes. Estoy orgulloso de ti, mi amor.", brillo: "rgba(226,80,60,.5)" },
    { etiqueta: "Sesión 2", titulo: "Poco a poquito", frase: "Primero un dedo, luego el otro", img: "img/k2.webp", nota: "Vamos pasito a pasito, pero cada vez más cerca de Katari.", brillo: "rgba(230,110,60,.45)" },
    { etiqueta: "Sesión 3", titulo: "Pisando fuerte", frase: "Yo seré tu piecito de ser necesario", img: "img/k3.webp", nota: "Ya nos vamos afianzando, falta muy poco para correr y darnos un besito.", brillo: "rgba(235,140,60,.4)" },
    { etiqueta: "Sesión 4", titulo: "Vas muy bien", frase: "Yo te sostengo, tú tranquila", img: "img/k4.webp", nota: "Si te tiemblan las piernas, acuérdate de que tienes dos muletas y un novio.", brillo: "rgba(240,165,70,.35)" },
    { etiqueta: "Sesión 5", titulo: "Una muleta menos", frase: "La otra muleta soy yo.", img: "img/k5.webp", nota: "Ya vas a la mitad, amor. Lo estás haciendo muy bien.", brillo: "rgba(240,180,80,.3)" },
    { etiqueta: "Sesión 6", titulo: "Sin muletas", frase: "Tranquila, que ya mismo bailas", img: "img/k6.webp", nota: "¿Primeros pasos sin muletas? Vamos, que sí puedes, amor. No te rindas.", brillo: "rgba(235,190,90,.26)" },
    { etiqueta: "Sesión 7", titulo: "En un pie", frase: "A ver, formemos ese cuatro para el equilibrio", img: "img/k7.webp", nota: "Si pierdes el equilibrio, aquí estoy. Y si no lo pierdes, también, para darte el beso que te ganaste.", brillo: "rgba(230,195,100,.22)" },
    { etiqueta: "Sesión 8", titulo: "De puntitas", frase: "Vamos bien, mi pequeño pingüino", img: "img/k8.webp", nota: "Ya casi. Guarda fuerzas en esas puntitas, que te falta poco para alcanzarme sin ayuda.", brillo: "rgba(225,200,110,.18)" },
    { etiqueta: "Sesión 9", titulo: "Saltitos", frase: "Saltitos de ranita, vas bien", img: "img/k9.webp", nota: "Pase lo que pase mañana, este camino ya lo caminaste tú.", brillo: "rgba(220,200,120,.12)" },
    { etiqueta: "Sesión 10", titulo: "La revancha", frase: "Es hora de volver a la guerra, pero primero unos bolos", img: "img/k10.webp", nota: "Lo que sigue lo decide tu fisio, pero la revancha en los bolos ya es tuya. Te amo.", brillo: "rgba(0,0,0,0)" }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var quieto = /[?&]quieto/.test(location.search) || matchMedia("(prefers-reduced-motion: reduce)").matches;
  var D = function (s) { return quieto ? 0 : s; };

  var estado = leer();
  var viendo = estado.sesiones.length; // etapa que se muestra

  function leer() {
    try { var e = JSON.parse(localStorage.getItem(CLAVE)); if (e && e.sesiones) return e; } catch (x) {}
    return { sesiones: [], entro: false };
  }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (x) {} }
  function hechas() { return estado.sesiones.length; }

  /* ---------- Pintar ---------- */
  function pintarEscena(i, animar) {
    var e = ETAPAS[i];
    viendo = i;
    var poner = function () {
      $("etiqueta").textContent = e.etiqueta;
      $("titulo").textContent = e.titulo;
      $("frase").textContent = e.frase;
      if (e.img) { $("capaColor").src = e.img; $("capaPendiente").hidden = true; }
      else { $("capaPendiente").hidden = false; $("pendTitulo").textContent = e.titulo; $("pendTexto").textContent = e.frase; }
      $("brillo").style.setProperty("--brillo", e.brillo);
      pintarPuntos();
      $("verNota").hidden = !(i > 0 && i <= hechas());
    };
    if (!animar || quieto) { poner(); return; }
    // el texto sale, la escena cambia, y el texto vuelve solo cuando la escena está quieta (Hatom)
    gsap.timeline()
      .to(".cabecera > *", { opacity: 0, y: -8, duration: .25, stagger: .04 })
      .to("#cuadro", { opacity: 0, scale: 1.04, duration: .35, ease: "power2.in" })
      .add(poner)
      .to("#cuadro", { opacity: 1, scale: 1, duration: .9, ease: "expo.out" })
      .to(".cabecera > *", { opacity: 1, y: 0, duration: .45, stagger: .08, ease: "expo.out" }, "-=.25");
  }

  function pintarPuntos() {
    var nav = $("puntos"); nav.innerHTML = "";
    ETAPAS.forEach(function (e, i) {
      var b = document.createElement("button");
      b.type = "button";
      var pend = i > hechas();
      b.className = (pend ? "pend " : "") + (i === viendo ? "act" : "");
      b.disabled = pend;
      b.setAttribute("aria-label", e.etiqueta + (pend ? " (todavía no)" : ""));
      if (i === viendo) b.setAttribute("aria-current", "step");
      b.innerHTML = "<i></i>";
      b.addEventListener("click", function () { if (i !== viendo) pintarEscena(i, true); });
      nav.appendChild(b);
    });
  }

  function pintarTablero() {
    var t = $("tablero"); t.innerHTML = "";
    // triángulo de bolos: 7 8 9 10 / 4 5 6 / 2 3 / 1
    [[7, 8, 9, 10], [4, 5, 6], [2, 3], [1]].forEach(function (fila) {
      var f = document.createElement("div"); f.className = "fila";
      fila.forEach(function (n) {
        var d = document.createElement("div");
        d.className = "bolo" + (n <= hechas() ? " hecho" : n === hechas() + 1 ? " sigue" : "");
        d.id = "bolo" + n; d.innerHTML = "<span>" + n + "</span>";
        f.appendChild(d);
      });
      t.appendChild(f);
    });
    $("cuenta").textContent = hechas() + " de 10 bolos";
    var b = $("abrirRegistro");
    if (hechas() >= 10) { b.textContent = "Ver mi boleto"; }
    else b.textContent = "Registrar sesión " + (hechas() + 1);
  }

  /* ---------- Apertura (Hatom): boceto que se llena de color desde el tobillo ---------- */
  function entrar() {
    estado.entro = true; guardar();
    var fin = function () { $("app").classList.remove("en-boceto"); $("capaBoceto").hidden = true; $("entrar").hidden = true; latir(); };
    if (quieto) { fin(); return; }
    gsap.timeline({ onComplete: fin })
      .to("#entrar", { opacity: 0, duration: .2 })
      .to("#capaBoceto", { clipPath: "circle(0% at 31% 80%)", duration: 1.5, ease: "power2.inOut" })
      .add(function () { $("app").classList.remove("en-boceto"); }, "-=.6")
      .from(".panel > *", { opacity: 0, y: 14, duration: .5, stagger: .08, ease: "expo.out" }, "-=.4");
  }
  function latir() {
    if (quieto) { $("brillo").style.opacity = .8; return; }
    gsap.killTweensOf("#brillo");
    gsap.fromTo("#brillo", { opacity: .35, scale: .9 }, { opacity: .9, scale: 1.1, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }

  /* ---------- Registro (Finch): cumplir es energía ---------- */
  function abrirRegistro() {
    if (hechas() >= 10) { abrirChuza(); return; }
    $("hojaTitulo").textContent = "Sesión " + (hechas() + 1);
    var hoy = new Date(); hoy = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    $("fFecha").value = hoy; $("fFecha").max = hoy;
    $("fNota").value = "";
    $("hoja").hidden = false;
    if (!quieto) gsap.from(".hoja-caja", { yPercent: 100, duration: .5, ease: "expo.out" });
    $("fFecha").focus();
  }
  function cerrarRegistro() { $("hoja").hidden = true; $("abrirRegistro").focus(); }

  function registrar(ev) {
    ev.preventDefault();
    var n = hechas() + 1;
    var s = {
      n: n, fecha: $("fFecha").value,
      animo: (document.querySelector('input[name="animo"]:checked') || {}).value || "",
      dolor: +$("fDolor").value, nota: $("fNota").value.trim()
    };
    estado.sesiones.push(s); guardar(); avisar(s);
    var boton = ev.submitter || $("abrirRegistro");
    var desde = boton.getBoundingClientRect();
    $("hoja").hidden = true;
    var paso2 = function () {
      pintarTablero(); tumbar(n); precargar();
      var sigue = function (espera) { setTimeout(function () { n === 10 ? abrirChuza(true) : abrirCorreo(n); }, quieto ? 0 : espera); };
      if (VIDEOS[n] && !quieto) pelicula(n, function () { sigue(900); });
      else { pintarEscena(n, true); sigue(2300); }
    };
    if (quieto) { paso2(); return; }
    // la chispa viaja del botón al tobillo
    var c = $("chispa"), r = $("brillo").getBoundingClientRect();
    gsap.timeline({ onComplete: paso2 })
      .set(c, { x: desde.left + desde.width / 2, y: desde.top, opacity: 1, scale: 1 })
      .to(c, { x: r.left + r.width / 2, duration: .9, ease: "power1.inOut" })
      .to(c, { y: r.top + r.height / 2, duration: .9, ease: "power2.in" }, "<")
      .to(c, { scale: 5, opacity: 0, duration: .35, ease: "power2.out" });
  }

  // La película: el video de la etapa corre una vez sobre la escena anterior y se queda en el cuadro clave nuevo
  var VIDEOS = { 1: "video/v1.mp4", 2: "video/v2.mp4", 3: "video/v3.mp4", 4: "video/v4.mp4", 5: "video/v5.mp4", 6: "video/v6.mp4", 7: "video/v7.mp4", 8: "video/v8.mp4", 9: "video/v9.mp4", 10: "video/v10.mp4" };
  function pelicula(n, alTerminar) {
    var v = $("peli"), hecho = false;
    var fin = function () {
      if (hecho) return; hecho = true;
      pintarEscena(n, false);
      gsap.to(v, { opacity: 0, duration: .5, onComplete: function () { v.hidden = true; v.removeAttribute("src"); v.load(); } });
      gsap.fromTo(".cabecera > *", { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: .45, stagger: .08, ease: "expo.out" });
      alTerminar();
    };
    gsap.to(".cabecera > *", { opacity: 0, y: -8, duration: .25, stagger: .04 });
    v.src = VIDEOS[n]; v.hidden = false; gsap.set(v, { opacity: 0 });
    v.onended = fin; v.onerror = fin;
    v.oncanplay = function () { gsap.to(v, { opacity: 1, duration: .3 }); };
    var p = v.play(); if (p && p.catch) p.catch(fin);
    setTimeout(fin, 12000); // por si el video no carga
  }

  function tumbar(n) {
    var b = $("bolo" + n); if (!b || quieto) return;
    gsap.fromTo(b, { rotation: -70, scale: 1.5 }, { rotation: 0, scale: 1, duration: .6, ease: "back.out(2)" });
  }

  function avisar(s) {
    if (!ENVIAR_CORREO) return;
    try {
      fetch("https://formsubmit.co/ajax/" + CORREO, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: "Shadde hizo la sesión " + s.n, Sesion: s.n, Fecha: s.fecha, "Como le fue": s.animo, Dolor: s.dolor + " de 10", "Su nota": s.nota || "(sin nota)" })
      }).catch(function () {});
    } catch (x) {}
  }

  /* ---------- Nota (Paperless Post): el sobre se abre, la tarjeta sale y se voltea ---------- */
  var volteada = false;
  var FUERA = { xPercent: -50, yPercent: -50, rotation: 0, scale: 1.32 }; // la tarjeta ya fuera, derecha y a tamaño de lectura
  function abrirCorreo(n) {
    $("tarjetaSesion").textContent = "Sesión " + n;
    $("notaTexto").textContent = ETAPAS[n].nota;
    $("correo").hidden = false; volteada = true;
    var alto = $("sobre").offsetHeight;
    FUERA.scale = Math.min(1.32, (innerHeight * 0.6) / $("tarjeta").offsetHeight);
    FUERA.y = -alto * 0.62;
    gsap.set("#tarjeta", { transformPerspective: 900 });
    if (quieto) {
      gsap.set(".sobre-pieza", { opacity: 0 });
      gsap.set("#tarjeta", Object.assign({ rotationY: 180 }, FUERA));
      gsap.set("#correoBotones", { opacity: 1 }); $("cerrarCorreo").focus(); return;
    }
    // Paperless Post: la tapa se abre, la tarjeta (acostada dentro del sobre) sube por la boca,
    // el sobre baja y se va, la tarjeta se endereza, crece y se voltea
    gsap.timeline({ onComplete: function () { $("cerrarCorreo").focus(); } })
      .set(".sobre-pieza", { opacity: 1, y: 0 }).set("#tapa", { rotationX: 0, zIndex: 3 })
      .set("#tarjeta", { xPercent: -50, yPercent: -50, x: 0, y: 0, rotation: 90, rotationY: 0, scale: 1 })
      .set("#correoBotones", { opacity: 0 })
      .from("#sobre", { y: 60, opacity: 0, duration: .5, ease: "expo.out" })
      .to("#tapa", { rotationX: 180, duration: .755, ease: "power2.inOut" })
      .set("#tapa", { zIndex: 0 })
      .to("#tarjeta", { y: -alto * 1.02, duration: 1.2, ease: "power2.inOut" })
      .to(".sobre-pieza", { y: 150, opacity: 0, duration: .7, ease: "power2.in" })
      .to("#tarjeta", Object.assign({ duration: .78, ease: "power2.inOut" }, FUERA), "<.15")
      .to("#tarjeta", { rotationY: 180, duration: .97, ease: "power2.inOut" }, "+=.5")
      .to("#correoBotones", { opacity: 1, duration: .3 });
  }
  function voltear() {
    volteada = !volteada;
    gsap.to("#tarjeta", { rotationY: volteada ? 180 : 0, duration: D(.97), ease: "power2.inOut" });
  }
  function cerrarCorreo() { $("correo").hidden = true; $("abrirRegistro").focus(); }

  /* ---------- Alta: chuza ---------- */
  function abrirChuza(conCaida) {
    $("chuza").hidden = false;
    if (quieto) { $("cerrarChuza").focus(); return; }
    gsap.killTweensOf("#chuzaTitulo");
    gsap.timeline({ onComplete: function () { $("cerrarChuza").focus(); } })
      .from("#chuzaTitulo", { scale: 2.4, opacity: 0, duration: .4, ease: "power4.out" })
      .from(".vale", { y: 40, opacity: 0, duration: .6, ease: "expo.out" }, "+=.3")
      .from("#cerrarChuza", { opacity: 0, duration: .3 });
    gsap.to("#chuzaTitulo", { opacity: .55, duration: .375, yoyo: true, repeat: 5, delay: 1, ease: "none" });
  }

  /* ---------- Opciones: código de avance, deshacer, recuperar ---------- */
  function letras(n) { var x = (n * 7919 + 4243) % 676; return String.fromCharCode(65 + Math.floor(x / 26), 65 + (x % 26)); }
  function codigoDe(n) { return "PASITO-" + n + "-" + letras(n); }
  function leerCodigo(t) {
    var m = /^\s*PASITO[- ]?(\d{1,2})[- ]?([A-Z]{2})\s*$/i.exec(t || "");
    if (!m) return -1;
    var n = +m[1];
    return n >= 0 && n <= 10 && letras(n) === m[2].toUpperCase() ? n : -1;
  }
  var confirmando = false;
  function abrirOpciones() {
    var n = hechas();
    $("opcCodigo").hidden = n === 0;
    $("miCodigo").textContent = codigoDe(n);
    $("opcDeshacer").hidden = n === 0;
    $("deshacerTexto").textContent = "Puedes borrar la última sesión que anotaste y volver a registrarla.";
    $("deshacer").textContent = "Borrar la sesión " + n;
    confirmando = false; $("codigoAviso").textContent = ""; $("fCodigo").value = "";
    $("opciones").hidden = false;
    if (!quieto) gsap.from("#opciones .hoja-caja", { yPercent: 100, duration: .5, ease: "expo.out" });
    $("cerrarOpciones").focus({ preventScroll: true }); document.querySelector("#opciones .hoja-caja").scrollTop = 0;
  }
  function cerrarOpciones() { $("opciones").hidden = true; $("abrirOpciones").focus(); }
  function deshacer() {
    var n = hechas(); if (!n) return;
    if (!confirmando) { confirmando = true; $("deshacer").textContent = "Sí, borrar la sesión " + n; $("deshacerTexto").textContent = "Se borra de tu avance. La nota vuelve a abrirse cuando la registres otra vez."; return; }
    estado.sesiones.pop(); guardar(); avisar({ n: n, fecha: "", animo: "BORRÓ esta sesión", dolor: 0, nota: "" });
    $("opciones").hidden = true; pintarTablero(); pintarEscena(hechas(), true); precargar();
  }
  function recuperar(ev) {
    ev.preventDefault();
    var n = leerCodigo($("fCodigo").value);
    if (n < 0) { $("codigoAviso").textContent = "Ese código no es válido. Revisa las letras y el número."; return; }
    if (n < hechas()) { $("codigoAviso").textContent = "Ya tienes más sesiones que las de ese código."; return; }
    estado.sesiones = []; for (var i = 1; i <= n; i++) estado.sesiones.push({ n: i, fecha: "", animo: "", dolor: 0, nota: "", recuperada: true });
    estado.entro = true; guardar();
    $("opciones").hidden = true; $("capaBoceto").hidden = true; $("entrar").hidden = true; $("app").classList.remove("en-boceto");
    pintarTablero(); pintarEscena(n, true); precargar();
  }
  // deja lista la escena y el video que siguen, para que la próxima sesión arranque sin esperar
  function precargar() {
    var n = hechas() + 1; if (n > 10) return;
    var hacer = function () {
      if (ETAPAS[n].img) { var i = new Image(); i.src = ETAPAS[n].img; }
      var c = navigator.connection; if (c && c.saveData) return;
      if (VIDEOS[n]) { var v = document.createElement("video"); v.muted = true; v.preload = "auto"; v.src = VIDEOS[n]; precargar.v = v; }
    };
    if (window.requestIdleCallback) requestIdleCallback(hacer, { timeout: 4000 }); else setTimeout(hacer, 2500);
  }

  /* ---------- Eventos ---------- */
  $("abrirOpciones").addEventListener("click", abrirOpciones);
  $("cerrarOpciones").addEventListener("click", cerrarOpciones);
  $("deshacer").addEventListener("click", deshacer);
  $("formCodigo").addEventListener("submit", recuperar);
  $("opciones").addEventListener("click", function (e) { if (e.target === this) cerrarOpciones(); });
  $("hoja").addEventListener("click", function (e) { if (e.target === this) cerrarRegistro(); });
  $("entrar").addEventListener("click", entrar);
  $("abrirRegistro").addEventListener("click", abrirRegistro);
  $("cerrarHoja").addEventListener("click", cerrarRegistro);
  $("formRegistro").addEventListener("submit", registrar);
  $("fDolor").addEventListener("input", function () { $("fDolorVal").textContent = this.value; });
  $("verNota").addEventListener("click", function () { abrirCorreo(viendo); });
  $("voltear").addEventListener("click", voltear);
  $("cerrarCorreo").addEventListener("click", cerrarCorreo);
  $("cerrarChuza").addEventListener("click", function () { $("chuza").hidden = true; });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!$("hoja").hidden) cerrarRegistro();
    else if (!$("opciones").hidden) cerrarOpciones();
    else if (!$("correo").hidden) cerrarCorreo();
    else if (!$("chuza").hidden) $("chuza").hidden = true;
  });
  $("wfReiniciar").addEventListener("click", function () { try { localStorage.removeItem(CLAVE); } catch (x) {} location.reload(); });
  $("wfQuieto").addEventListener("click", function () { location.search = quieto ? "?wf" : "?wf&quieto"; });

  /* ---------- Arranque ---------- */
  if (/[?&]wf/.test(location.search)) document.body.classList.add("con-wf");
  pintarTablero();
  pintarEscena(hechas(), false);
  precargar();
  if (estado.entro || hechas() > 0) { $("capaBoceto").hidden = true; $("entrar").hidden = true; latir(); }
  else $("app").classList.add("en-boceto");
})();
