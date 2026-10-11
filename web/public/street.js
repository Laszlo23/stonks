(function () {
  if (document.getElementById("hood-street")) return;

  var rooms = [
    ["Book", "https://doghood.aibusiness.fun/", "book"],
    ["Floor", "https://doghood.aibusiness.fun/floor", "floor"],
    ["Dex", "https://dex.aibusiness.fun/", "dex"],
    ["GM", "https://gm.aibusiness.fun/", "gm"],
    ["Mine", "https://mine.aibusiness.fun/", "mine"],
    ["Seats", "https://nft.aibusiness.fun/", "seats"],
  ];

  var host = location.hostname;
  var path = location.pathname;

  function here(key) {
    if (key === "floor") return host === "doghood.aibusiness.fun" && path.indexOf("/floor") === 0;
    if (key === "book") return host === "doghood.aibusiness.fun" && path.indexOf("/floor") !== 0;
    if (key === "dex") return host === "dex.aibusiness.fun";
    if (key === "gm") return host === "gm.aibusiness.fun";
    if (key === "mine") return host === "mine.aibusiness.fun";
    if (key === "seats") return host === "nft.aibusiness.fun";
    return false;
  }

  var style = document.createElement("style");
  style.textContent =
    "#hood-street{position:fixed;z-index:80;left:0;right:0;bottom:0;display:flex;justify-content:center;flex-wrap:wrap;gap:6px;padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:rgba(5,5,5,.94);border-top:1px solid rgba(204,255,0,.28);backdrop-filter:blur(12px);font-family:Inter,ui-sans-serif,sans-serif}" +
    "#hood-street a{color:rgba(244,246,240,.66);text-decoration:none;letter-spacing:.16em;font-size:11px;text-transform:uppercase;padding:6px 12px;border-radius:999px}" +
    "#hood-street a[aria-current=page]{color:#050505;background:#ccff00}" +
    "body{padding-bottom:58px}";
  document.head.appendChild(style);

  var nav = document.createElement("nav");
  nav.id = "hood-street";
  nav.setAttribute("aria-label", "Hood Street");
  rooms.forEach(function (room) {
    var link = document.createElement("a");
    link.href = room[1];
    link.textContent = room[0];
    if (here(room[2])) link.setAttribute("aria-current", "page");
    nav.appendChild(link);
  });
  document.body.appendChild(nav);
})();
