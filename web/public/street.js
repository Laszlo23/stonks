(function () {
  if (document.getElementById("hood-dock") || document.getElementById("hood-street")) return;

  var rooms = [
    ["Book", "https://doghood.aibusiness.fun/", "book"],
    ["Seats", "https://nft.aibusiness.fun/", "seats"],
    ["Names", "https://doghood.aibusiness.fun/floor/names", "names"],
    ["Floor", "https://doghood.aibusiness.fun/floor", "floor"],
    ["Dex", "https://dex.aibusiness.fun/", "dex"],
    ["Stock", "https://doghood.aibusiness.fun/floor/stock", "stock"],
    ["Keys", "https://doghood.aibusiness.fun/floor/keys", "keys"],
    ["Members", "https://doghood.aibusiness.fun/floor/members", "members"],
  ];

  var games = [
    ["Greeting", "https://gm.aibusiness.fun/", "gm"],
    ["Field", "https://mine.aibusiness.fun/", "mine"],
    ["Hood", "https://dex.aibusiness.fun/rfgame", "hood"],
    ["Whale", "https://playwhale.io/", "casino"],
  ];

  var glyphs = {
    book: '<path d="M5 5.5h5.6A2.4 2.4 0 0 1 13 7.9V19a2 2 0 0 0-2-2H5z"/><path d="M19 5.5h-5.6A2.4 2.4 0 0 0 11 7.9V19a2 2 0 0 1 2-2h6z"/>',
    floor: '<path d="M4 9.5h16v8H4z"/><path d="M8 9.5V6.5h8v3M8 17.5v2M16 17.5v2"/>',
    dex: '<path d="M5 8h11M13 5l3 3-3 3"/><path d="M19 16H8M11 13l-3 3 3 3"/>',
    gm: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.5 1.5M16.4 16.4l1.5 1.5M17.9 6.1l-1.5 1.5M7.6 16.4l-1.5 1.5"/>',
    mine: '<path d="M4 16.5 14 6.5l3.5 3.5-10 10z"/><path d="M13 7.5 16.5 4 20 7.5 16.5 11"/>',
    seats: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="9" y="13.5" width="6.5" height="6.5" rx="1"/>',
    keys: '<circle cx="8" cy="12" r="3.2"/><path d="M11 12h9M17 12v3M20 12v2"/>',
    members: '<circle cx="9" cy="9" r="2.4"/><circle cx="16" cy="9.5" r="2"/><path d="M4.8 18c.7-2.4 2.4-3.6 4.4-3.6s3.6 1.2 4.3 3.6M13.2 14.6c.8-1.4 2-2.1 3.4-2.1 1.6 0 2.8 1 3.4 2.8"/>',
    names: '<path d="M4 8.5h16v7H4z"/><path d="M8 12h5"/>',
    stock: '<path d="M4 16.5 9 11l3 3 8-8"/><path d="M15 6h5v5"/>',
    hood: '<path d="M5 11.5 12 5l7 6.5V19H5z"/><path d="M10 19v-4h4v4"/>',
    casino: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.4"/><path d="M12 4.5v2.4M12 17.1v2.4M4.5 12h2.4M17.1 12h2.4"/>',
  };

  var host = location.hostname;
  var path = location.pathname;

  function here(key) {
    if (key === "names") return host === "doghood.aibusiness.fun" && path.indexOf("/floor/names") === 0;
    if (key === "stock") return host === "doghood.aibusiness.fun" && path.indexOf("/floor/stock") === 0;
    if (key === "floor") return host === "doghood.aibusiness.fun" && path.indexOf("/floor") === 0 && path.indexOf("/floor/keys") !== 0 && path.indexOf("/floor/names") !== 0 && path.indexOf("/floor/stock") !== 0 && path.indexOf("/floor/members") !== 0;
    if (key === "members") return host === "doghood.aibusiness.fun" && path.indexOf("/floor/members") === 0;
    if (key === "book") return host === "doghood.aibusiness.fun" && path.indexOf("/floor") !== 0;
    if (key === "hood") return host === "dex.aibusiness.fun" && path.indexOf("/rfgame") === 0;
    if (key === "dex") return host === "dex.aibusiness.fun" && path.indexOf("/rfgame") !== 0;
    if (key === "gm") return host === "gm.aibusiness.fun";
    if (key === "mine") return host === "mine.aibusiness.fun";
    if (key === "seats") return host === "nft.aibusiness.fun";
    if (key === "keys") return host === "doghood.aibusiness.fun" && path.indexOf("/floor/keys") === 0;
    if (key === "casino") return host === "playwhale.io" || host === "www.playwhale.io" || host === "whale.io" || host === "www.whale.io";
    return false;
  }

  var style = document.createElement("style");
  style.textContent =
    "#hood-dock{position:fixed;z-index:80;left:0;right:0;bottom:0;pointer-events:none}" +
    "#hood-street{position:absolute;left:0;right:0;bottom:var(--hood-lift,0px);display:flex;justify-content:center;overflow:hidden;background:#0b0e11;border-top:1px solid rgba(204,255,0,.28);padding-bottom:env(safe-area-inset-bottom);font-family:Inter,ui-sans-serif,system-ui,sans-serif;transform:translateY(110%);transition:transform .42s cubic-bezier(.16,1,.3,1);pointer-events:none}" +
    "#hood-dock.hood-open #hood-street{transform:none;pointer-events:auto}" +
    "#hood-street .hood-row{display:flex;align-items:stretch;justify-content:safe center;width:100%;min-width:0;max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;touch-action:pan-x;scroll-padding-inline:12px;padding-inline:8px;scrollbar-width:thin;scrollbar-color:rgba(204,255,0,.55) transparent}" +
    "#hood-street .hood-row.hood-scrolling{cursor:grabbing;user-select:none}" +
    "#hood-street .hood-row::-webkit-scrollbar{height:3px}" +
    "#hood-street .hood-row::-webkit-scrollbar-thumb{background:rgba(204,255,0,.55);border-radius:999px}" +
    "#hood-street .hood-main,#hood-games,#hood-app{display:flex;align-items:stretch;flex:0 0 auto}" +
    "#hood-street a,#hood-street button.hood-tab{flex:0 0 auto;min-width:64px;min-height:54px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;margin:0;padding:7px 10px 8px;border:0;background:transparent;color:#848e9c;text-decoration:none;font:500 10px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:0;text-transform:none;cursor:pointer;white-space:nowrap}" +
    "#hood-street a svg,#hood-street button.hood-tab svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}" +
    "#hood-street a[aria-current=page],#hood-street a.on,#hood-street button.hood-tab.on{color:#ccff00;box-shadow:inset 0 -2px 0 #ccff00}" +
    "#hood-street .hood-seam{width:1px;height:28px;align-self:center;flex:0 0 1px;margin:0 2px;background:rgba(255,255,255,.14)}" +
    "#hood-street .hood-seam[hidden]{display:none}" +
    "@keyframes hood-pop{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}" +
    "#hood-dock.hood-open #hood-street a{animation:hood-pop .42s cubic-bezier(.16,1,.3,1) both}" +
    "#hood-dock.hood-open #hood-main a:nth-child(2){animation-delay:.03s}#hood-dock.hood-open #hood-main a:nth-child(3){animation-delay:.06s}#hood-dock.hood-open #hood-main a:nth-child(4){animation-delay:.09s}#hood-dock.hood-open #hood-main a:nth-child(5){animation-delay:.12s}#hood-dock.hood-open #hood-main a:nth-child(6){animation-delay:.15s}#hood-dock.hood-open #hood-main a:nth-child(7){animation-delay:.18s}#hood-dock.hood-open #hood-main a:nth-child(8){animation-delay:.21s}#hood-dock.hood-open #hood-main a:nth-child(9){animation-delay:.24s}#hood-dock.hood-open #hood-main a:nth-child(10){animation-delay:.27s}" +
    "#hood-plus{pointer-events:auto;position:absolute;left:50%;bottom:calc(14px + var(--hood-lift,0px) + env(safe-area-inset-bottom));display:flex;align-items:center;gap:6px;height:36px;width:auto;margin:0;padding:3px 3px 3px 10px;border:1px solid rgba(204,255,0,.45);border-radius:999px;background:transparent;color:#ccff00;cursor:grab;box-shadow:none;transform:translateX(-50%);touch-action:none;user-select:none}" +
    "#hood-plus .hood-mark,#hood-plus .hood-add svg{stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}" +
    "#hood-plus .hood-mark{width:14px;height:14px}" +
    "#hood-plus .hood-here{font:600 10px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}" +
    "#hood-plus .hood-add{display:grid;place-items:center;width:26px;height:26px;border:1px solid rgba(204,255,0,.55);border-radius:999px;background:transparent;color:#ccff00}" +
    "#hood-plus .hood-add svg{width:12px;height:12px}" +
    "#hood-plus.hood-placed{transform:none}" +
    "#hood-plus.hood-drag{cursor:grabbing}" +
    "#hood-dock.hood-open #hood-plus .hood-add{transform:rotate(45deg)}";
  document.head.appendChild(style);

  var dock = document.createElement("div");
  dock.id = "hood-dock";

  var nav = document.createElement("nav");
  nav.id = "hood-street";
  nav.setAttribute("aria-label", "Hood Street");

  var row = document.createElement("div");
  row.className = "hood-row";

  var main = document.createElement("div");
  main.className = "hood-main";
  rooms.forEach(function (room) {
    var link = document.createElement("a");
    link.href = room[1];
    link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + glyphs[room[2]] + "</svg><span>" + room[0] + "</span>";
    if (here(room[2])) link.setAttribute("aria-current", "page");
    main.appendChild(link);
  });

  var gamesNav = document.createElement("nav");
  gamesNav.id = "hood-games";
  gamesNav.setAttribute("aria-label", "Games");
  games.forEach(function (game) {
    var link = document.createElement("a");
    link.href = game[1];
    link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + glyphs[game[2]] + "</svg><span>" + game[0] + "</span>";
    if (here(game[2])) link.setAttribute("aria-current", "page");
    gamesNav.appendChild(link);
  });

  var gamesSeam = document.createElement("div");
  gamesSeam.className = "hood-seam";

  var seam = document.createElement("div");
  seam.className = "hood-seam";
  seam.hidden = true;

  var app = document.createElement("nav");
  app.id = "hood-app";
  app.setAttribute("aria-label", "This app");

  var plus = document.createElement("button");
  plus.id = "hood-plus";
  plus.type = "button";
  plus.setAttribute("aria-controls", "hood-street");
  var standing = null;
  var walk = rooms.concat(games);
  for (var i = 0; i < walk.length; i++) {
    if (here(walk[i][2])) standing = walk[i];
  }
  if (!standing) standing = rooms[0];
  plus.innerHTML =
    '<svg class="hood-mark" viewBox="0 0 24 24" aria-hidden="true">' + glyphs[standing[2]] + "</svg>" +
    '<span class="hood-here">' + standing[0] + "</span>" +
    '<span class="hood-add" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span>';

  row.appendChild(main);
  row.appendChild(gamesSeam);
  row.appendChild(gamesNav);
  row.appendChild(seam);
  row.appendChild(app);

  var rowPointer = null;
  var rowStartX = 0;
  var rowStartLeft = 0;
  var rowMoved = false;
  row.addEventListener(
    "wheel",
    function (event) {
      if (row.scrollWidth <= row.clientWidth + 1) return;
      var along = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      var delta = along ? event.deltaX : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      row.scrollLeft += delta;
    },
    { passive: false },
  );
  row.addEventListener("pointerdown", function (event) {
    if (event.button !== 0) return;
    rowPointer = event.pointerId;
    rowStartX = event.clientX;
    rowStartLeft = row.scrollLeft;
    rowMoved = false;
  });
  row.addEventListener("pointermove", function (event) {
    if (rowPointer !== event.pointerId) return;
    var dx = event.clientX - rowStartX;
    if (!rowMoved && Math.abs(dx) < 8) return;
    rowMoved = true;
    row.classList.add("hood-scrolling");
    if (!row.hasPointerCapture(event.pointerId)) row.setPointerCapture(event.pointerId);
    row.scrollLeft = rowStartLeft - dx;
  });
  function endRow(event) {
    if (rowPointer !== event.pointerId) return;
    rowPointer = null;
    row.classList.remove("hood-scrolling");
    if (row.hasPointerCapture(event.pointerId)) row.releasePointerCapture(event.pointerId);
  }
  row.addEventListener("pointerup", endRow);
  row.addEventListener("pointercancel", endRow);
  row.addEventListener(
    "click",
    function (event) {
      if (!rowMoved) return;
      event.preventDefault();
      event.stopPropagation();
      rowMoved = false;
    },
    true,
  );
  nav.appendChild(row);
  dock.appendChild(nav);
  dock.appendChild(plus);
  document.body.appendChild(dock);

  var open = false;
  var openedAt = 0;

  function setOpen(next) {
    open = next;
    dock.classList.toggle("hood-open", open);
    nav.inert = !open;
    nav.setAttribute("aria-hidden", open ? "false" : "true");
    plus.setAttribute("aria-expanded", open ? "true" : "false");
    plus.setAttribute("aria-label", open ? "Close the street" : "Open the street");
    if (open) {
      openedAt = Date.now();
      var current = nav.querySelector("[aria-current=page]");
      if (current && current.scrollIntoView) requestAnimationFrame(function () { current.scrollIntoView({ inline: "center", block: "nearest" }); });
    }
  }

  var dragged = false;
  var PLACE = "hood-plus-place";

  function clampPlace(left, bottom) {
    var width = plus.offsetWidth || 120;
    var height = plus.offsetHeight || 36;
    var maxLeft = Math.max(8, window.innerWidth - width - 8);
    var maxBottom = Math.max(8, window.innerHeight - height - 8);
    return {
      left: Math.min(maxLeft, Math.max(8, left)),
      bottom: Math.min(maxBottom, Math.max(8, bottom)),
    };
  }

  function putPlace(spot) {
    plus.style.left = spot.left + "px";
    plus.style.bottom = spot.bottom + "px";
    plus.style.right = "auto";
    plus.style.transform = "none";
    plus.classList.add("hood-placed");
  }

  try {
    var saved = JSON.parse(localStorage.getItem(PLACE) || "null");
    if (saved && typeof saved.left === "number" && typeof saved.bottom === "number") putPlace(clampPlace(saved.left, saved.bottom));
  } catch (err) {
    saved = null;
  }

  var startX = 0;
  var startY = 0;
  var originLeft = 0;
  var originBottom = 0;
  var moving = false;
  var tracking = false;

  plus.addEventListener("pointerdown", function (event) {
    if (event.button !== 0) return;
    var rect = plus.getBoundingClientRect();
    startX = event.clientX;
    startY = event.clientY;
    originLeft = rect.left;
    originBottom = window.innerHeight - rect.bottom;
    moving = false;
    tracking = true;
    plus.setPointerCapture(event.pointerId);
  });
  plus.addEventListener("pointermove", function (event) {
    if (!tracking) return;
    var dx = event.clientX - startX;
    var dy = event.clientY - startY;
    if (!moving && Math.hypot(dx, dy) < 6) return;
    moving = true;
    dragged = true;
    plus.classList.add("hood-drag");
    putPlace(clampPlace(originLeft + dx, originBottom - dy));
  });
  function endDrag(event) {
    if (!tracking) return;
    tracking = false;
    plus.classList.remove("hood-drag");
    if (plus.hasPointerCapture(event.pointerId)) plus.releasePointerCapture(event.pointerId);
    if (!moving) return;
    var rect = plus.getBoundingClientRect();
    var spot = clampPlace(rect.left, window.innerHeight - rect.bottom);
    putPlace(spot);
    try {
      localStorage.setItem(PLACE, JSON.stringify(spot));
    } catch (err) {
      spot = null;
    }
  }
  plus.addEventListener("pointerup", endDrag);
  plus.addEventListener("pointercancel", endDrag);
  window.addEventListener("resize", function () {
    if (!plus.classList.contains("hood-placed")) return;
    var rect = plus.getBoundingClientRect();
    putPlace(clampPlace(rect.left, window.innerHeight - rect.bottom));
  });

  plus.addEventListener("click", function () {
    if (dragged) {
      dragged = false;
      return;
    }
    setOpen(!open);
  });
  setOpen(false);

  function otherLift() {
    var nodes = document.querySelectorAll("nav, footer");
    var lift = 0;
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (dock.contains(el)) continue;
      var css = getComputedStyle(el);
      if (css.position !== "fixed" && css.position !== "sticky") continue;
      if (css.display === "none" || css.visibility === "hidden") continue;
      var rect = el.getBoundingClientRect();
      var wide = rect.width > window.innerWidth * 0.55;
      var low = rect.height >= 40 && rect.bottom >= window.innerHeight - 12 && rect.top >= window.innerHeight - 180;
      if (wide && low) lift = Math.max(lift, Math.round(rect.height));
    }
    dock.style.setProperty("--hood-lift", lift + "px");
  }

  function sync() {
    seam.hidden = app.childElementCount === 0;
  }
  sync();
  new MutationObserver(sync).observe(app, { childList: true });

  var lastY = window.scrollY || 0;
  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY || 0;
      if (open && Date.now() - openedAt > 400 && Math.abs(y - lastY) > 12) setOpen(false);
      lastY = y;
      otherLift();
    },
    { passive: true },
  );
  window.addEventListener("resize", otherLift);
  otherLift();
})();
