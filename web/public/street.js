(function () {
  if (document.getElementById("hood-street")) return;

  var rooms = [
    ["Book", "https://doghood.aibusiness.fun/", "book"],
    ["Floor", "https://doghood.aibusiness.fun/floor", "floor"],
    ["Dex", "https://dex.aibusiness.fun/", "dex"],
    ["GM", "https://gm.aibusiness.fun/", "gm"],
    ["Mine", "https://mine.aibusiness.fun/", "mine"],
    ["Seats", "https://nft.aibusiness.fun/", "seats"],
    ["Keys", "https://basefriend.tech/", "keys"],
  ];

  var glyphs = {
    book: '<path d="M5 5.5h5.6A2.4 2.4 0 0 1 13 7.9V19a2 2 0 0 0-2-2H5z"/><path d="M19 5.5h-5.6A2.4 2.4 0 0 0 11 7.9V19a2 2 0 0 1 2-2h6z"/>',
    floor: '<path d="M4 9.5h16v8H4z"/><path d="M8 9.5V6.5h8v3M8 17.5v2M16 17.5v2"/>',
    dex: '<path d="M5 8h11M13 5l3 3-3 3"/><path d="M19 16H8M11 13l-3 3 3 3"/>',
    gm: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.5 1.5M16.4 16.4l1.5 1.5M17.9 6.1l-1.5 1.5M7.6 16.4l-1.5 1.5"/>',
    mine: '<path d="M4 16.5 14 6.5l3.5 3.5-10 10z"/><path d="M13 7.5 16.5 4 20 7.5 16.5 11"/>',
    seats: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="9" y="13.5" width="6.5" height="6.5" rx="1"/>',
    keys: '<circle cx="8" cy="12" r="3.2"/><path d="M11 12h9M17 12v3M20 12v2"/>',
  };

  var host = location.hostname;
  var path = location.pathname;

  function here(key) {
    if (key === "floor") return host === "doghood.aibusiness.fun" && path.indexOf("/floor") === 0;
    if (key === "book") return host === "doghood.aibusiness.fun" && path.indexOf("/floor") !== 0;
    if (key === "dex") return host === "dex.aibusiness.fun";
    if (key === "gm") return host === "gm.aibusiness.fun";
    if (key === "mine") return host === "mine.aibusiness.fun";
    if (key === "seats") return host === "nft.aibusiness.fun";
    if (key === "keys") return host === "basefriend.tech";
    return false;
  }

  var style = document.createElement("style");
  style.textContent =
    "#hood-street{position:fixed;z-index:32;left:0;right:0;bottom:0;display:flex;justify-content:center;background:#0b0e11;border-top:1px solid rgba(255,255,255,.08);padding:0 4px env(safe-area-inset-bottom);font-family:Inter,ui-sans-serif,system-ui,sans-serif}" +
    "#hood-street .hood-row{display:flex;align-items:stretch;max-width:100%;overflow-x:auto;scrollbar-width:none}" +
    "#hood-street .hood-row::-webkit-scrollbar{display:none}" +
    "#hood-street .hood-main,#hood-app{display:flex;align-items:stretch}" +
    "#hood-street a,#hood-street button.hood-tab{flex:0 0 auto;min-width:64px;min-height:54px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;margin:0;padding:7px 10px 8px;border:0;background:transparent;color:#848e9c;text-decoration:none;font:500 10px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:0;text-transform:none;cursor:pointer;white-space:nowrap}" +
    "#hood-street a svg,#hood-street button.hood-tab svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}" +
    "#hood-street a[aria-current=page],#hood-street a.on,#hood-street button.hood-tab.on{color:#ccff00}" +
    "#hood-street .hood-seam{width:1px;height:28px;align-self:center;flex:0 0 1px;margin:0 2px;background:rgba(255,255,255,.14)}" +
    "#hood-street .hood-seam[hidden]{display:none}" +
    "body{padding-bottom:calc(62px + env(safe-area-inset-bottom))}";
  document.head.appendChild(style);

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

  var seam = document.createElement("div");
  seam.className = "hood-seam";
  seam.hidden = true;

  var app = document.createElement("nav");
  app.id = "hood-app";
  app.setAttribute("aria-label", "This app");

  row.appendChild(main);
  row.appendChild(seam);
  row.appendChild(app);
  nav.appendChild(row);
  document.body.appendChild(nav);

  function sync() {
    seam.hidden = app.childElementCount === 0;
  }
  sync();
  new MutationObserver(sync).observe(app, { childList: true });
})();
