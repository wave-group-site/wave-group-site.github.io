(function(){
  var STORAGE_KEY = "wave-cookie-consent";
  var LANG_KEY = "wave-lang";

  var text = {
    en: {
      message: "We use only essential, first-party browser storage — to remember your language choice. This site does not use tracking or advertising cookies.",
      policy: "Cookie Policy",
      accept: "Got it"
    },
    it: {
      message: "Utilizziamo solo memorizzazione locale essenziale del browser, per ricordare la lingua scelta. Questo sito non utilizza cookie di tracciamento o pubblicitari.",
      policy: "Informativa sui cookie",
      accept: "Ho capito"
    }
  };

  function getLang(){
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch(e){}
    if (saved && text[saved]) return saved;
    var htmlLang = document.documentElement.getAttribute("lang");
    if (htmlLang && text[htmlLang]) return htmlLang;
    return (navigator.language && navigator.language.toLowerCase().indexOf("it") === 0) ? "it" : "en";
  }

  function hasConsented(){
    try { return localStorage.getItem(STORAGE_KEY) === "accepted"; } catch(e){ return false; }
  }

  function buildBanner(){
    var bar = document.createElement("div");
    bar.className = "cookie-bar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Cookie notice");

    var p = document.createElement("p");
    p.className = "cookie-bar-text";

    var policyLink = document.createElement("a");
    policyLink.className = "cookie-bar-link";
    policyLink.href = "cookie-policy.html";

    var actions = document.createElement("div");
    actions.className = "cookie-bar-actions";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cookie-bar-accept";
    actions.appendChild(btn);

    function render(){
      var t = text[getLang()] || text.en;
      p.textContent = t.message + " ";
      policyLink.textContent = t.policy;
      p.appendChild(policyLink);
      btn.textContent = t.accept;
    }
    render();

    bar.appendChild(p);
    bar.appendChild(actions);

    btn.addEventListener("click", function(){
      try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch(e){}
      bar.classList.remove("is-visible");
      setTimeout(function(){ if (bar.parentNode) bar.parentNode.removeChild(bar); }, 350);
    });

    document.addEventListener("click", function(e){
      if (e.target && e.target.closest && e.target.closest("[data-lang-btn]")){
        render();
      }
    });

    return bar;
  }

  function init(){
    if (hasConsented()) return;
    var bar = buildBanner();
    document.body.appendChild(bar);
    window.requestAnimationFrame(function(){
      window.requestAnimationFrame(function(){ bar.classList.add("is-visible"); });
    });
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
