(function(){
  var STORAGE_KEY = "wave-cookie-consent";
  var LANG_KEY = "wave-lang";

  var text = {
    en: {
      title: "Privacy Overview",
      descShort: "This website uses cookies to improve your experience while you navigate through the website.",
      descLong: "This website uses cookies to improve your experience while you navigate through the website. Out of these, the storage categorized as necessary is kept in your browser as it is essential for the working of basic functionalities of the website. This site is fully static and does not use any third-party, tracking, or advertising cookies.",
      showMore: "Show more",
      showLess: "Show less",
      alwaysEnabled: "Always Enabled",
      disabled: "Disabled",
      enabled: "Enabled",
      save: "Save & Accept",
      close: "Close"
    },
    it: {
      title: "Panoramica sulla privacy",
      descShort: "Questo sito utilizza la memorizzazione locale del browser per migliorare la tua esperienza di navigazione.",
      descLong: "Questo sito utilizza la memorizzazione locale del browser per migliorare la tua esperienza di navigazione. Tra questi, quelli classificati come necessari sono conservati nel tuo browser poiché sono essenziali per il funzionamento delle funzionalità di base del sito. Questo sito è interamente statico e non utilizza cookie di terze parti, di tracciamento o pubblicitari.",
      showMore: "Mostra di più",
      showLess: "Mostra meno",
      alwaysEnabled: "Sempre attivo",
      disabled: "Disattivato",
      enabled: "Attivato",
      save: "Salva e accetta",
      close: "Chiudi"
    }
  };

  var categories = [
    {
      id: "necessary",
      alwaysOn: true,
      name: { en: "Necessary", it: "Necessari" },
      detail: {
        en: "Essential for the site to function — this is only your language preference and the fact that you've seen this notice. Stored in your browser, never sent anywhere. Cannot be disabled.",
        it: "Essenziali per il funzionamento del sito — solo la tua preferenza di lingua e il fatto di aver visto questo avviso. Conservati nel tuo browser, mai inviati altrove. Non possono essere disattivati."
      }
    },
    {
      id: "functional",
      alwaysOn: false,
      name: { en: "Functional", it: "Funzionali" },
      detail: {
        en: "Would remember additional preferences to provide enhanced, more personal features. This site does not currently use any storage in this category.",
        it: "Servirebbero a ricordare ulteriori preferenze per offrire funzionalità più personalizzate. Questo sito non utilizza attualmente alcuna memorizzazione in questa categoria."
      }
    },
    {
      id: "performance",
      alwaysOn: false,
      name: { en: "Performance", it: "Prestazioni" },
      detail: {
        en: "Would help understand key performance metrics of the website. This site does not currently use any storage in this category.",
        it: "Aiuterebbero a comprendere le metriche di prestazione chiave del sito. Questo sito non utilizza attualmente alcuna memorizzazione in questa categoria."
      }
    },
    {
      id: "analytics",
      alwaysOn: false,
      name: { en: "Analytics", it: "Analitici" },
      detail: {
        en: "Would help understand how visitors interact with the website. No analytics service is installed on this site.",
        it: "Aiuterebbero a capire come i visitatori interagiscono con il sito. Nessun servizio di analisi è installato su questo sito."
      }
    },
    {
      id: "others",
      alwaysOn: false,
      name: { en: "Others", it: "Altri" },
      detail: {
        en: "Any other, uncategorized storage. This site does not currently use any storage in this category.",
        it: "Qualsiasi altra memorizzazione non classificata. Questo sito non utilizza attualmente alcuna memorizzazione in questa categoria."
      }
    }
  ];

  function getLang(){
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch(e){}
    if (saved && text[saved]) return saved;
    var htmlLang = document.documentElement.getAttribute("lang");
    if (htmlLang && text[htmlLang]) return htmlLang;
    return (navigator.language && navigator.language.toLowerCase().indexOf("it") === 0) ? "it" : "en";
  }

  function getConsent(){
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(e){ return null; }
  }

  function saveConsent(state){
    state.ts = Date.now();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){}
  }

  function buildModal(){
    var overlay = document.createElement("div");
    overlay.className = "cookie-overlay";

    var topbar = document.createElement("div");
    topbar.className = "cookie-topbar";

    var modal = document.createElement("div");
    modal.className = "cookie-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Privacy overview");

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "cookie-modal-close";
    closeBtn.innerHTML = "&times;";

    var h2 = document.createElement("h2");

    var desc = document.createElement("p");
    desc.className = "cookie-modal-desc";

    var toggleDesc = document.createElement("button");
    toggleDesc.type = "button";
    toggleDesc.className = "cookie-modal-toggle-desc";
    var descExpanded = true;

    var catList = document.createElement("div");
    catList.className = "cookie-cat-list";

    var switches = {};
    var catNameEls = {};
    var catStateEls = {};
    var catDetailEls = {};

    categories.forEach(function(cat){
      var row = document.createElement("div");
      row.className = "cookie-cat";

      var head = document.createElement("div");
      head.className = "cookie-cat-head";

      var expand = document.createElement("button");
      expand.type = "button";
      expand.className = "cookie-cat-expand";
      expand.innerHTML = "&#8250;";
      expand.setAttribute("aria-label", "Expand");

      var name = document.createElement("span");
      name.className = "cookie-cat-name";
      catNameEls[cat.id] = name;

      head.appendChild(expand);
      head.appendChild(name);

      if (cat.alwaysOn){
        var stateSpan = document.createElement("span");
        stateSpan.className = "cookie-cat-state";
        catStateEls[cat.id] = stateSpan;
        head.appendChild(stateSpan);
      } else {
        var switchLabel = document.createElement("label");
        switchLabel.className = "cookie-switch";
        var input = document.createElement("input");
        input.type = "checkbox";
        input.checked = false;
        var track = document.createElement("span");
        track.className = "track";
        switchLabel.appendChild(input);
        switchLabel.appendChild(track);
        switches[cat.id] = input;
        input.addEventListener("click", function(e){ e.stopPropagation(); });
        head.appendChild(switchLabel);
      }

      var detail = document.createElement("div");
      detail.className = "cookie-cat-detail";
      var detailP = document.createElement("p");
      detail.appendChild(detailP);
      catDetailEls[cat.id] = detailP;

      head.addEventListener("click", function(){
        row.classList.toggle("is-open");
      });

      row.appendChild(head);
      row.appendChild(detail);
      catList.appendChild(row);
    });

    var actions = document.createElement("div");
    actions.className = "cookie-modal-actions";
    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "cookie-modal-save";
    actions.appendChild(saveBtn);

    function render(){
      var lang = getLang();
      var t = text[lang] || text.en;
      h2.textContent = t.title;
      desc.textContent = descExpanded ? t.descLong : t.descShort;
      toggleDesc.textContent = descExpanded ? t.showLess : t.showMore;
      closeBtn.setAttribute("aria-label", t.close);
      saveBtn.textContent = t.save;

      categories.forEach(function(cat){
        catNameEls[cat.id].textContent = cat.name[lang] || cat.name.en;
        catDetailEls[cat.id].textContent = cat.detail[lang] || cat.detail.en;
        if (cat.alwaysOn){
          catStateEls[cat.id].textContent = t.alwaysEnabled;
        }
      });
    }
    render();

    toggleDesc.addEventListener("click", function(){
      descExpanded = !descExpanded;
      render();
    });

    document.addEventListener("click", function(e){
      if (e.target && e.target.closest && e.target.closest("[data-lang-btn]")){
        render();
      }
    });

    function close(state){
      saveConsent(state);
      overlay.classList.remove("is-visible");
      setTimeout(function(){
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (topbar.parentNode) topbar.parentNode.removeChild(topbar);
      }, 300);
    }

    closeBtn.addEventListener("click", function(){
      var state = { necessary: true };
      categories.forEach(function(cat){ if (!cat.alwaysOn) state[cat.id] = false; });
      close(state);
    });

    saveBtn.addEventListener("click", function(){
      var state = { necessary: true };
      categories.forEach(function(cat){
        if (!cat.alwaysOn) state[cat.id] = !!switches[cat.id].checked;
      });
      close(state);
    });

    modal.appendChild(closeBtn);
    modal.appendChild(h2);
    modal.appendChild(desc);
    modal.appendChild(toggleDesc);
    modal.appendChild(catList);
    modal.appendChild(actions);
    overlay.appendChild(modal);

    return { overlay: overlay, topbar: topbar };
  }

  function init(){
    if (getConsent()) return;
    var built = buildModal();
    document.body.appendChild(built.topbar);
    document.body.appendChild(built.overlay);
    window.requestAnimationFrame(function(){
      window.requestAnimationFrame(function(){ built.overlay.classList.add("is-visible"); });
    });
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
