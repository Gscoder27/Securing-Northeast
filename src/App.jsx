import { useState, useEffect, useCallback, useRef } from "react";
import { Sun, Moon, Menu, X, ArrowUp, ArrowLeft, ArrowRight, Play, Headphones, MapPin, ExternalLink } from "lucide-react";

const SECTIONS = [
  { id: "sports", label: "Sports & Achievements", short: "Sports" },
  { id: "regional", label: "Regional News", short: "Regional" },
  { id: "development", label: "Development", short: "Development" },
  { id: "security", label: "Security & Strategic Affairs", short: "Security" },
  { id: "society", label: "Society & Youth", short: "Society" },
];

const APPENDICES = [
  {
    id: "appendix-a",
    label: "Appendix A: Sources",
    note: "Every outlet used, with the number of articles taken from each.",
  },
  {
    id: "appendix-b",
    label: "Appendix B: Rationale",
    note: "Why each article was chosen for this issue.",
  },
];

const ALL_ROUTES = [
  { id: "home", label: "Home" },
  ...SECTIONS,
  ...APPENDICES,
];

const THEME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Roboto+Condensed:wght@400;500;700&family=Roboto:wght@400;500;700;900&display=swap');

.nm-app{
  --bg:#FFFFFF; --ink:#14201B; --muted:#55605B; --line:#D5DDD8;
  --surface:#EDF2EF; --accent:#0F5B4A; --accent-ink:#FFFFFF;
  --glass:rgba(255,255,255,.92);
  background:var(--bg); color:var(--ink);
  font-family:'Merriweather',Georgia,'Times New Roman',serif;
  font-size:1rem; line-height:1.8;
  min-height:100vh; display:flex; flex-direction:column;
  transition:background-color .3s ease,color .3s ease;
}
.nm-app[data-theme="dark"]{
  --bg:#0B1512; --ink:#E6EEE9; --muted:#97A59E; --line:#25352E;
  --surface:#12201B; --accent:#7CCBAE; --accent-ink:#0B1512;
  --glass:rgba(11,21,18,.92);
}

/* Roboto for every heading, nav item and button; Merriweather for body */
.nm-app h1,.nm-app h2,.nm-app h3,.nm-app h4,.nm-app h5,.nm-app h6,
.nm-app nav,.nm-app button,.nm-app .nm-head{
  font-family:'Roboto',Helvetica,Arial,sans-serif;
}
.nm-app h1,.nm-app h2,.nm-app h3{ line-height:1.15; letter-spacing:-.015em; }
:where(.nm-app) button{ cursor:pointer; background:none; border:0; color:inherit; }
.nm-app :focus-visible{ outline:2px solid var(--accent); outline-offset:3px; border-radius:2px; }

/* Utility classes used by every page */
.nm-muted{ color:var(--muted); }
.nm-surface{ background:var(--surface); }
.nm-line-t{ border-top:1px solid var(--line); }
.nm-line-b{ border-bottom:1px solid var(--line); }
.nm-body{ font-size:1.0625rem; line-height:1.85; max-width:65ch; }

/* Skip link */
.nm-skip{ position:absolute; left:-999px; top:0; z-index:100; padding:.75rem 1rem;
  background:var(--accent); color:var(--accent-ink); font-family:'Roboto',sans-serif; font-weight:500; }
.nm-skip:focus{ left:1rem; top:1rem; }

/* Header */
.nm-hdr{ background:var(--glass); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line); transition:box-shadow .25s ease; }
.nm-hdr[data-scrolled="true"]{ box-shadow:0 6px 20px -12px rgba(0,0,0,.35); }
.nm-hdr-inner{ transition:padding .25s ease; }
.nm-brand-main{ display:block; font-weight:900; font-size:1.25rem; letter-spacing:-.02em; line-height:1.1; }
.nm-brand-sub{ display:block; margin-top:.2rem; font-size:.75rem; line-height:1.3; color:var(--muted); font-weight:400; }
.nm-link{ font-weight:500; font-size:.9375rem; color:var(--muted); padding:.35rem 0;
  border-bottom:2px solid transparent; transition:color .2s ease,border-color .2s ease; }
.nm-link:hover{ color:var(--ink); }
.nm-link[aria-current="page"]{ color:var(--ink); border-bottom-color:var(--accent); }
.nm-icon-btn{ width:2.5rem; height:2.5rem; display:grid; place-items:center;
  border:1px solid var(--line); border-radius:999px; transition:background-color .2s ease,border-color .2s ease; }
.nm-icon-btn:hover{ background:var(--surface); border-color:var(--accent); }

/* Mobile menu */
.nm-mobile{ border-top:1px solid var(--line); background:var(--bg); animation:nm-drop .22s ease both; }
.nm-mobile-link{ display:block; width:100%; text-align:left; padding:.9rem 0; font-size:1.0625rem; font-weight:500;
  border-bottom:1px solid var(--line); }
.nm-mobile-link[aria-current="page"]{ color:var(--accent); }
@keyframes nm-drop{ from{opacity:0; transform:translateY(-6px);} to{opacity:1; transform:none;} }

/* Footer */
.nm-ftr{ background:var(--surface); border-top:1px solid var(--line); }
.nm-ftr-title{ font-weight:700; font-size:.9375rem; margin-bottom:.9rem; }
.nm-ftr-link{ display:block; text-align:left; color:var(--muted); font-size:.9375rem; padding:.3rem 0; transition:color .2s ease; }
.nm-ftr-link:hover{ color:var(--accent); }
.nm-appx{ border:1px solid var(--accent); background:var(--bg); }
.nm-appx-item{ display:block; width:100%; text-align:left; padding:1rem 1.1rem; transition:background-color .2s ease; }
.nm-appx-item + .nm-appx-item{ border-top:1px solid var(--line); }
.nm-appx-item:hover{ background:var(--surface); }
.nm-appx-item strong{ display:block; font-weight:700; font-size:1rem; }
.nm-appx-item span{ display:block; margin-top:.15rem; font-family:'Merriweather',Georgia,serif; font-size:.8125rem; line-height:1.55; color:var(--muted); }

/* Home: hero */
.nm-hero{ position:relative; min-height:min(86vh,760px); display:flex; align-items:flex-end; overflow:hidden; color:#fff;
  background:linear-gradient(180deg,#071A16 0%,#0D3A30 60%,#14513F 100%); }
.nm-hero-img{ position:absolute; inset:0; background-size:cover; background-position:center; }
.nm-hero-ridges{ position:absolute; left:0; right:0; bottom:0; width:100%; height:58%; }
.nm-mist{ position:absolute; left:-10%; right:-10%; bottom:14%; height:42%; filter:blur(28px);
  background:radial-gradient(ellipse at 50% 60%,rgba(255,255,255,.2),transparent 65%);
  animation:nm-drift 22s ease-in-out infinite alternate; }
@keyframes nm-drift{ from{ transform:translateX(-7%);} to{ transform:translateX(7%);} }
.nm-hero-shade{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.55)); }
.nm-hero-content{ position:relative; width:100%; padding-top:6rem; padding-bottom:4.5rem; }
.nm-hero h1{ font-weight:900; font-size:clamp(2.75rem,8.5vw,7rem); line-height:1.02; letter-spacing:-.03em; max-width:14ch; }
.nm-hero-deck{ margin-top:1.4rem; max-width:34rem; font-size:clamp(1.05rem,2vw,1.3rem); line-height:1.6; opacity:.92; }
.nm-hero-note{ margin-top:2rem; max-width:38rem; font-family:'Roboto',sans-serif; font-size:.875rem; line-height:1.6; opacity:.75; }
.nm-app .nm-btn{ display:inline-block; font-weight:500; font-size:.9375rem; padding:.85rem 1.5rem; border-radius:2px;
  transition:background-color .2s ease,color .2s ease,border-color .2s ease; }
.nm-app .nm-btn-primary{ background:#fff; color:#06231D; }
.nm-app .nm-btn-primary:hover{ background:#CFE9DF; }
.nm-app .nm-btn-ghost{ border:1px solid rgba(255,255,255,.65); color:#fff; }
.nm-app .nm-btn-ghost:hover{ background:rgba(255,255,255,.14); }

/* Home: generated visuals (used when an article has no photo) */
.nm-visual{ position:relative; overflow:hidden; background-size:cover; background-position:center; }
.nm-ridge{ position:absolute; left:0; right:0; bottom:0; width:100%; height:42%; }

/* Home: sliding card carousel */
.nm-sec{ scroll-margin-top:5rem; }
.nm-track{ display:flex; gap:1.25rem; overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth; scrollbar-width:none; }
.nm-track::-webkit-scrollbar{ display:none; }
.nm-card{ flex:0 0 min(82%,380px); scroll-snap-align:start; }
.nm-card-btn{ position:relative; display:block; width:100%; aspect-ratio:4/5; text-align:left; overflow:hidden; color:#fff; }
.nm-card .nm-visual{ position:absolute; inset:0; transition:transform .7s cubic-bezier(.2,.7,.2,1); }
.nm-card-btn:hover .nm-visual{ transform:scale(1.07); }
.nm-card-shade{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.8)); }
.nm-card-text{ position:absolute; left:0; right:0; bottom:0; padding:1.4rem; }
.nm-chip{ display:inline-block; font-family:'Roboto',sans-serif; font-size:.8125rem; font-weight:500; padding:.2rem .65rem;
  background:rgba(255,255,255,.18); backdrop-filter:blur(6px); }
.nm-card-text h3{ margin-top:.75rem; font-size:1.375rem; font-weight:700; line-height:1.2; }
.nm-card-date{ margin-top:.65rem; font-family:'Roboto',sans-serif; font-size:.8125rem; opacity:.85; }
.nm-progress{ height:2px; background:var(--line); margin-top:1.5rem; }
.nm-progress i{ display:block; height:100%; background:var(--accent); transition:width .25s ease; }

/* Home: news grid */
.nm-story{ display:block; width:100%; text-align:left; }
.nm-story h3{ transition:color .2s ease; }
.nm-story:hover h3{ color:var(--accent); }
.nm-thumb{ aspect-ratio:16/9; }
.nm-meta{ display:flex; gap:.9rem; align-items:baseline; font-size:.8125rem; color:var(--muted); }
.nm-meta b{ color:var(--accent); font-weight:700; }
.nm-clamp{ display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.nm-src{ font-family:'Roboto',sans-serif; font-size:.75rem; color:var(--muted); margin-top:.6rem; }

/* Typography in the style of adreform.com: heavy italic serif display,
   condensed capitals for navigation and buttons, tracked caps for small captions */
.nm-app{ letter-spacing:-.005em; }
.nm-app h1,.nm-app h2{ font-family:'Merriweather',Georgia,serif; font-style:italic; font-weight:900; letter-spacing:-.045em; line-height:.98; }
.nm-app h3,.nm-app h4{ font-family:'Roboto Condensed','Roboto',Arial,sans-serif; font-weight:700; letter-spacing:-.005em; line-height:1.12; }
.nm-app nav,.nm-app button,.nm-app .nm-head{ font-family:'Roboto Condensed','Roboto',Arial,sans-serif; }
.nm-app .nm-hero h1{ font-size:clamp(2.5rem,8vw,6.5rem); }
.nm-app .nm-brand-main,.nm-app .nm-link,.nm-app .nm-mobile-link,.nm-app .nm-ftr-title,.nm-app .nm-ftr-link,
.nm-app .nm-btn,.nm-app .nm-chip,.nm-app .nm-back,.nm-app .nm-appx-item strong{ text-transform:uppercase; letter-spacing:.03em; }
.nm-app .nm-brand-main{ font-weight:700; font-size:1.5rem; letter-spacing:.01em; }
.nm-app .nm-link{ font-size:1.0625rem; }
.nm-app .nm-mobile-link{ font-size:1.375rem; }
.nm-app .nm-btn{ font-weight:700; font-size:1.0625rem; letter-spacing:.04em; }
.nm-app .nm-chip{ font-family:'Roboto Condensed',sans-serif; font-weight:700; letter-spacing:.08em; }
.nm-app .nm-ftr-title{ font-size:1.0625rem; }
.nm-app .nm-ftr-link{ font-size:1rem; }
.nm-app .nm-appx-item strong{ font-size:1.0625rem; }
.nm-app .nm-meta,.nm-app .nm-src,.nm-app .nm-card-date{ font-family:'Roboto',Arial,sans-serif; font-weight:500; font-size:.75rem; text-transform:uppercase; letter-spacing:.12em; }
.nm-app .nm-story > p.nm-muted{ font-family:'Merriweather',Georgia,serif; }

/* Layout grids written as plain CSS (the preview does not ship every responsive Tailwind utility) */
.nm-ftr-grid{ display:grid; gap:2.5rem; grid-template-columns:minmax(0,1fr); padding-top:3.5rem; padding-bottom:3.5rem; }
@media(min-width:768px){ .nm-ftr-grid{ grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) minmax(0,1.2fr); gap:3.5rem; } }
.nm-ftr-bar{ display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem 2rem; padding-top:1.5rem; padding-bottom:1.75rem; }
.nm-ftr-copy{ flex:1 1 20rem; max-width:44rem; font-size:.8125rem; line-height:1.65; color:var(--muted); }
.nm-split{ display:grid; gap:2.5rem; grid-template-columns:minmax(0,1fr); }
@media(min-width:1024px){ .nm-split{ grid-template-columns:minmax(0,2fr) minmax(0,1fr); gap:3.5rem; } }
.nm-cards4{ display:grid; gap:2.5rem; grid-template-columns:minmax(0,1fr); }
@media(min-width:640px){ .nm-cards4{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media(min-width:1024px){ .nm-cards4{ grid-template-columns:repeat(4,minmax(0,1fr)); } }

/* Article page */
.nm-readbar{ position:fixed; top:0; left:0; right:0; height:3px; z-index:60; }
.nm-readbar i{ display:block; height:100%; background:var(--accent); }
.nm-ahero{ position:relative; min-height:min(70vh,560px); display:flex; align-items:flex-end; overflow:hidden; color:#fff; }
.nm-ahero .nm-visual{ position:absolute; inset:0; }
.nm-ahero-shade{ position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.74)); }
.nm-ahero-content{ position:relative; width:100%; padding-top:5rem; padding-bottom:3rem; }
.nm-ahero h1{ max-width:22ch; font-size:clamp(2rem,5.4vw,3.75rem); }
.nm-app .nm-back{ display:inline-flex; align-items:center; gap:.5rem; margin-bottom:1.5rem; font-weight:700; font-size:1rem; opacity:.9; }
.nm-app .nm-back:hover{ opacity:1; }
.nm-ahero-meta{ margin-top:1.5rem; display:flex; flex-wrap:wrap; gap:.5rem 1.5rem; font-family:'Roboto',sans-serif; font-size:.8125rem; font-weight:500; letter-spacing:.1em; text-transform:uppercase; opacity:.9; }
.nm-article{ display:grid; gap:3.5rem; padding-top:3.5rem; grid-template-columns:minmax(0,1fr); }
@media(min-width:1024px){ .nm-article{ grid-template-columns:minmax(0,1fr) 19rem; gap:4.5rem; }
  .nm-related{ position:sticky; top:6rem; align-self:start; } }
.nm-deck{ font-size:1.375rem; line-height:1.6; font-style:italic; max-width:46rem; margin-bottom:2rem; }
.nm-article-main .nm-body{ margin-bottom:1.5rem; }
.nm-embed{ margin:2.5rem 0; max-width:46rem; }
.nm-embed-label{ display:flex; align-items:center; gap:.5rem; margin-bottom:.7rem; font-family:'Roboto Condensed',sans-serif;
  font-weight:700; font-size:.875rem; letter-spacing:.08em; text-transform:uppercase; color:var(--accent); }
.nm-embed-box{ display:block; width:100%; border:0; background:var(--surface); }
.nm-embed-video{ aspect-ratio:16/9; }
.nm-embed-map{ aspect-ratio:16/10; }
.nm-embed-spotify{ height:152px; }
.nm-embed-empty{ display:flex; align-items:center; justify-content:center; text-align:center; padding:1.5rem;
  border:1.5px dashed var(--line); color:var(--muted); font-size:.875rem; line-height:1.65; }
.nm-embed-empty code{ font-family:ui-monospace,Menlo,monospace; font-size:.8125rem; color:var(--accent); }
.nm-cite{ margin-top:3rem; padding:1.4rem 1.5rem; border-left:3px solid var(--accent); background:var(--surface); max-width:46rem; }
.nm-cite a{ display:inline-flex; align-items:center; gap:.4rem; margin-top:.5rem; color:var(--accent); font-family:'Roboto Condensed',sans-serif;
  font-weight:700; letter-spacing:.04em; text-transform:uppercase; text-decoration:underline; text-underline-offset:4px; }

/* Category and appendix pages */
.nm-cards3{ display:grid; gap:2.5rem; grid-template-columns:minmax(0,1fr); }
@media(min-width:640px){ .nm-cards3{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media(min-width:1024px){ .nm-cards3{ grid-template-columns:repeat(3,minmax(0,1fr)); } }
.nm-table-wrap{ overflow-x:auto; }
.nm-table{ width:100%; border-collapse:collapse; font-size:.9375rem; }
.nm-table th{ text-align:left; padding:.8rem 1rem .8rem 0; border-bottom:2px solid var(--ink); font-family:'Roboto Condensed',sans-serif;
  font-weight:700; font-size:.875rem; letter-spacing:.06em; text-transform:uppercase; }
.nm-table td{ padding:1rem 1rem 1rem 0; border-bottom:1px solid var(--line); vertical-align:top; line-height:1.6; }
.nm-table .nm-td-src,.nm-table .nm-td-num{ font-family:'Roboto Condensed',sans-serif; font-weight:700; font-size:1.125rem; }
.nm-table .nm-td-src{ white-space:nowrap; }
.nm-table .nm-td-num{ width:6rem; }
.nm-table td a{ display:block; padding:.15rem 0; color:var(--ink); text-decoration:underline; text-decoration-color:var(--line); text-underline-offset:3px; }
.nm-table td a:hover{ color:var(--accent); text-decoration-color:var(--accent); }
.nm-table tfoot td{ border-bottom:0; font-family:'Roboto Condensed',sans-serif; font-weight:700; letter-spacing:.06em; text-transform:uppercase; }
.nm-why-item{ display:grid; gap:.5rem 3rem; grid-template-columns:minmax(0,1fr); padding:1.1rem 0; border-top:1px solid var(--line); }
@media(min-width:768px){ .nm-why-item{ grid-template-columns:minmax(0,1fr) minmax(0,1.2fr); } }

/* Placeholder frame (fallback page and empty article text) */
.nm-frame{ border:1.5px dashed var(--line); padding:2rem; }

@media (prefers-reduced-motion:reduce){
  .nm-app *{ transition:none !important; animation:none !important; }
}
`;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function getInitialTheme() {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */
function Header({ route, navigate, theme, toggleTheme, scrolled, menuOpen, setMenuOpen }) {
  return (
    <header className="nm-hdr sticky top-0 z-50" data-scrolled={scrolled}>
      <div
        className={`nm-hdr-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <button
          onClick={() => navigate("home")}
          className="text-left"
          aria-label="Securing the Northeast: go to home page"
        >
          <span className="nm-brand-main">Securing the Northeast</span>
          <span className="nm-brand-sub hidden sm:block">
            Indian Army’s Role in Stability, Peace & National Security
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(s.id)}
              className="nm-link"
              aria-current={route === s.id ? "page" : undefined}
            >
              {s.short}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="nm-icon-btn"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nm-icon-btn lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="nm-mobile lg:hidden" aria-label="Mobile sections">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
            {[{ id: "home", label: "Home" }, ...SECTIONS, ...APPENDICES].map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(r.id)}
                className="nm-mobile-link"
                aria-current={route === r.id ? "page" : undefined}
              >
                {r.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
function Footer({ navigate }) {
  return (
    <footer className="nm-ftr mt-20">
      <div className="nm-ftr-grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-3xl">Securing the Northeast</h2>
          <p className="nm-muted mt-3 text-sm max-w-md" style={{ lineHeight: 1.75 }}>
            Indian Army’s Role in Stability, Peace & National Security. An e-magazine on
            sports, regional affairs, development, security and youth across India’s
            Northeast.
          </p>
        </div>

        <div>
          <h3 className="nm-ftr-title">Sections</h3>
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => navigate(s.id)} className="nm-ftr-link">
              {s.label}
            </button>
          ))}
        </div>

        <div>
          <h3 className="nm-ftr-title">Appendices</h3>
          <div className="nm-appx">
            {APPENDICES.map((a) => (
              <button key={a.id} onClick={() => navigate(a.id)} className="nm-appx-item">
                <strong>{a.label}</strong>
                <span>{a.note}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="nm-line-t">
        <div className="nm-ftr-bar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="nm-ftr-copy nm-head">
            © 2026 Securing the Northeast. Compiled from open-source reporting published
            between 1 September and 5 October 2026.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="nm-link inline-flex items-center gap-2"
          >
            <ArrowUp size={14} /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Placeholder page (swapped for real pages in Phases 2 and 3)        */
/* ------------------------------------------------------------------ */
function PlaceholderPage({ route }) {
  const isHome = route === "home";
  const current = ALL_ROUTES.find((r) => r.id === route);
  const title = isHome ? "Securing the Northeast" : current?.label;
  const deck = isHome
    ? "Indian Army’s Role in Stability, Peace & National Security"
    : "This page will list every article in the section.";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 w-full">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black max-w-4xl">{title}</h1>
      <p className="nm-muted mt-5 text-lg max-w-2xl" style={{ lineHeight: 1.7 }}>
        {deck}
      </p>
      <div className="nm-line-t mt-10 pt-10 nm-split">
        <div>
          <p className="nm-body">
            Body copy is set in Merriweather at a comfortable measure, while headlines,
            navigation and buttons use Roboto. Every page inherits the same colours, spacing
            and type scale from this shell, in both light and dark mode.
          </p>
          <div className="nm-frame mt-8">
            <h2 className="text-xl font-bold">
              {isHome ? "Homepage content goes here" : "Page content goes here"}
            </h2>
            <p className="nm-muted mt-2 text-sm">
              {isHome
                ? "Phase 2 replaces this block with the hero, the sliding card carousel and the news grid."
                : "Category, article and appendix pages plug into this slot in the next phases."}
            </p>
          </div>
        </div>
        <aside>
          <div className="nm-surface p-6">
            <h3 className="font-bold">Layout check</h3>
            <p className="nm-muted mt-2 text-sm" style={{ lineHeight: 1.7 }}>
              Scroll the page to see the sticky header shrink, resize the window to see the
              menu collapse on mobile, and use the toggle in the header to switch themes.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Home page: hero, carousel, latest news                             */
/* ------------------------------------------------------------------ */
const HERO_IMAGE = "/cover%20pic.jpg"; // optional: paste a photo URL to replace the drawn ridgeline

const TONES = {
  sports: ["#0F5B4A", "#06231D"],
  regional: ["#2B4A63", "#0E1C28"],
  development: ["#5A5F2A", "#1D200D"],
  security: ["#5A2D2D", "#1F0F0F"],
  society: ["#6B4A2A", "#241810"],
};

/* Article data, mirrored from articles.json. In your own project, delete this array and use:
   import ARTICLES from "./articles.json";
   Add an `image` URL to any article to replace its generated visual. */
const ARTICLES = [
  {
    "id": "khangchengyao",
    "featured": true,
    "category": "sports",
    "date": "2026-09-18",
    "source": "Nation Press",
    "headline": "Army team summits 6,889-metre Mt Khangchengyao in North Sikkim",
    "summary": "A Spear Corps expedition reached the summit on 18 September after a month on the move, climbing steep, sub-zero flanks close to the Line of Actual Control.",
    "url": "https://www.nationpress.com/national/army-scales-mt-khangchengyao-in-north-sikkim",
    "rationale": "Shows the Army’s high-altitude capability and visible presence on the Sikkim frontier; a strong lead for the Sports section.",
    "body": [
      "An Indian Army mountaineering expedition under Eastern Command’s Spear Corps reached the 6,889-metre summit of Mt Khangchengyao in North Sikkim on 18 September 2026. The team left Arunachal Pradesh a month earlier and worked through extreme altitude, sub-zero temperatures and technically demanding terrain.",
      "The mountain’s 75 to 80 degree flanks and its lack of a conventional pointed summit made the climb especially difficult. Beyond the sporting feat, the expedition tested acclimatisation, leadership and survival skills in terrain near the Line of Actual Control, and raised the Army’s profile among frontier communities in Sikkim and the wider Northeast."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "india-china-talks",
    "featured": true,
    "category": "regional",
    "date": "2026-09-08",
    "source": "Indian Express",
    "headline": "India and China hold Corps Commander-level talks in Arunachal Pradesh",
    "summary": "The first Corps Commander talks for the Eastern Sector took place at the Wacha-Damai meeting point near Kibithu, extending military dialogue to the Arunachal frontier.",
    "url": "https://indianexpress.com/article/india/days-after-doval-wang-talks-in-beijing-corps-commander-set-to-meet-chinese-counterpart-in-n-e-10863833/",
    "rationale": "A major strategic development: senior military dialogue extended to the Eastern Sector of the LAC.",
    "body": [
      "India and China held their first Corps Commander-level talks in Arunachal Pradesh at the Wacha-Damai Border Personnel Meeting point near Kibithu. The meeting extended the senior military dialogue mechanism to the Eastern Sector of the Line of Actual Control, where the Army’s Spear Corps holds responsibility for large parts of central and eastern Arunachal Pradesh.",
      "It followed wider discussions on border management, new military hotlines and additional meeting points. Direct contact between commanders can reduce miscommunication and help manage local incidents on a contested frontier, which makes the talks relevant to stability across the Northeast."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "bonv-uavs",
    "featured": true,
    "category": "development",
    "date": "2026-09-28",
    "source": "Economic Times Manufacturing",
    "headline": "BonV Aero supplies 45 heavy-payload UAVs to Eastern Command",
    "summary": "Odisha-based BonV Aero delivered the drones on 28 September for logistics and mission support in Northeast terrain where roads are often cut off.",
    "url": "https://manufacturing.economictimes.indiatimes.com/news/aerospace-defence/bonv-aero-supplies-45-heavy-payload-uavs-to-armys-eastern-command/134543096",
    "rationale": "A concrete example of drone logistics for forward areas and of start-up involvement in Army capability.",
    "body": [
      "Odisha-based BonV Aero delivered 45 heavy-payload unmanned aerial vehicles to the Indian Army’s Eastern Command on 28 September 2026. The drones are meant for tactical logistics and mission-specific tasks across the Northeast.",
      "Eastern Command covers river plains, dense forest and high-altitude Himalayan posts, where roads are often closed by landslides, floods or snow. Carrying supplies, equipment and mission payloads by air shortens resupply times to forward locations and reduces reliance on vulnerable surface routes.",
      "The induction also points to a growing role for Indian defence-technology start-ups in supplying the Army."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": "https://www.google.com/maps?q=Fort+William,+Kolkata&output=embed"
  },
  {
    "id": "joint-ops-manipur-mizoram",
    "featured": true,
    "category": "security",
    "date": "2026-09-15",
    "source": "Brighter Kashmir",
    "headline": "Joint Manipur-Mizoram operations yield 12 arrests and 38 weapons",
    "summary": "Army and Assam Rifles units working with state police and central forces ran operations from 7 to 13 September, detaining 12 cadres and recovering 38 weapons.",
    "url": "https://brighterkashmir.com/12-held-38-weapons-recovered-in-joint-manipur-mizoram-operations",
    "rationale": "Gives measurable outcomes (arrests and weapons recovered) and shows cross-state cooperation.",
    "body": [
      "Between 7 and 13 September 2026, Army and Assam Rifles formations under Spear Corps ran intelligence-based joint operations with Manipur Police, Mizoram Police and Central Armed Police Forces. The operations, at sensitive locations across both states, led to 12 apprehensions and the recovery of 38 weapons, along with ammunition and other war-like stores.",
      "Insurgent logistics, arms movement and criminal networks often cross state boundaries, so coordinated action across Manipur and Mizoram depends on shared intelligence and interoperability between forces."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "agartala-swachhata",
    "featured": true,
    "category": "society",
    "date": "2026-10-02",
    "source": "The News Mill",
    "headline": "Spear Corps and APS Agartala students run Swachhata Hi Seva drive",
    "summary": "Troops and schoolchildren held a four-day cleanliness programme, ending with a clean-up at the Albert Ekka War Memorial.",
    "url": "https://thenewsmill.com/2026/10/indian-armys-spear-corps-and-aps-agartala-students-conduct-swachhata-hi-seva-drive/",
    "rationale": "Shows youth civic engagement and community service at a military station.",
    "body": [
      "From 29 September to 2 October 2026, troops of Spear Corps and students of Army Public School Agartala ran activities at Agartala Military Station under the nationwide Swachhata Hi Seva campaign. They included poster, banner, essay and drawing competitions on cleanliness and public health.",
      "The campaign ended with a large cleanliness drive at the Albert Ekka War Memorial, and troops carried out a station-wide Shramdaan. The Army framed youth participation as part of building responsible citizens alongside operational readiness."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "cijws-ncc",
    "featured": false,
    "category": "sports",
    "date": "2026-10-05",
    "source": "DD News",
    "headline": "Army's CIJWS trains 83 NCC cadets in Mizoram",
    "summary": "The Counter Insurgency and Jungle Warfare School at Vairengte hosted the cadets from 21 September to 4 October for a programme on discipline, fitness and fieldcraft.",
    "url": "https://ddnews.gov.in/en/armys-elite-cijws-conducts-training-programme-for-83-ncc-cadets-in-mizoram/",
    "rationale": "Shows a military training institution opening to young people and civil society.",
    "body": [
      "The Army’s Counter Insurgency and Jungle Warfare School at Vairengte, Mizoram, ran a two-week programme for 83 NCC cadets from 21 September to 4 October 2026. Cadets were introduced to military discipline, physical standards, fieldcraft and teamwork.",
      "Mixed-group training encouraged camaraderie among young participants from different parts of Mizoram. The Army described the programme as part of wider efforts to engage the state’s youth and encourage interest in national service."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "youth-sports-skills",
    "featured": false,
    "category": "sports",
    "date": "2026-10-02",
    "source": "Brighter Kashmir",
    "headline": "Army backs youth through sports and skills",
    "summary": "Assam Rifles donated sports gear to a youth group in Kohima, while a formation in Pasighat honoured young people who finished IT and hospitality courses.",
    "url": "https://brighterkashmir.com/army-backs-youth-through-sports-skills",
    "rationale": "Links sport with employability under Operation Sadbhavana.",
    "body": [
      "Assam Rifles, under the aegis of Spear Corps, continued community outreach in Nagaland and Arunachal Pradesh. In Kohima district, sports equipment was handed to the Pfuchama Youth Organisation to encourage teamwork and healthy recreation.",
      "In Pasighat, an Army formation honoured Arunachal Pradesh Staff Selection Board aspirants and young people who completed IT and hospitality courses under Project SeVaA, part of Operation Sadbhavana. The programmes link physical activity with employability and public service."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "army-bsf-seminar",
    "featured": false,
    "category": "regional",
    "date": "2026-09-30",
    "source": "Ground News",
    "headline": "Army and BSF hold strategic seminar in Shillong",
    "summary": "The Army's 101 Area hosted the synergy seminar to align intelligence-sharing and response procedures along the 4,096-kilometre border with Bangladesh.",
    "url": "https://ground.news/article/army-bsf-hold-strategic-seminar-in-shillong-to-strengthen-border-coordination",
    "rationale": "Illustrates inter-agency coordination along the Bangladesh border.",
    "body": [
      "The Army’s 101 Area, under Eastern Command, hosted the Army-BSF Synergy Seminar 2026 in Shillong. Senior officers from BSF’s Meghalaya, Guwahati, Mizoram, and Cachar and Tripura Frontiers took part.",
      "The seminar addressed management of India’s 4,096-kilometre border with Bangladesh, including cross-border movement, smuggling and infiltration. Its aim was to align intelligence-sharing, surveillance and response procedures between the two forces."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "tripura-medical-camp",
    "featured": false,
    "category": "development",
    "date": "2026-09-28",
    "source": "SSB Crack",
    "headline": "Assam Rifles medical camp benefits over 350 villagers in Tripura",
    "summary": "Personnel ran a camp at Kanchanbari that gave villagers access to consultations and basic treatment in a remote border area.",
    "url": "https://www.ssbcrack.com/2026/09/assam-rifles-organises-medical-camp-in-tripura-over-350-villagers-benefit.html",
    "rationale": "Shows civic action building trust through healthcare.",
    "body": [
      "Assam Rifles personnel under Spear Corps organised a medical camp at Kanchanbari in Tripura that reached more than 350 villagers. The camp offered consultations, basic treatment and health awareness in an area with limited access to specialist care.",
      "Such camps are part of the Army’s civic-action and Operation Sadbhavana work, which pairs a security presence with practical public welfare and builds trust with border communities."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "indianoil-xwg",
    "featured": false,
    "category": "development",
    "date": "2026-09-26",
    "source": "Indian Masterminds",
    "headline": "IndianOil flags off extreme-weather diesel for Eastern Command",
    "summary": "The first rake left Panipat with fuel built to work in extreme cold at high-altitude posts, including those in Sikkim and Arunachal Pradesh.",
    "url": "https://indianmasterminds.com/news/indianoil-xwg-diesel-rake-army-eastern-command-specialised-fuel-237167/",
    "rationale": "Shows energy assurance as an enabler of winter readiness in mountain sectors.",
    "body": [
      "IndianOil flagged off the first rake of Xtreme Weather Grade High Speed Diesel from its Panipat Marketing Complex for the Army’s Eastern Command. The fuel is designed to perform in extreme cold and high-altitude conditions, and supply now extends to Sikkim and Arunachal Pradesh.",
      "Reliable fuel is central to mobility, power generation and sustained operations in remote mountain sectors, particularly in winter when road closures and landslides complicate resupply."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "arunachal-governor",
    "featured": false,
    "category": "society",
    "date": "2026-09-26",
    "source": "The News Mill",
    "headline": "Arunachal Governor and Army general discuss coordination and welfare",
    "summary": "Lt Gen Mohit Waghwa, GOC 101 Area, met Governor Lt Gen K.T. Parnaik in Itanagar to discuss logistics, disaster response and veteran welfare.",
    "url": "https://thenewsmill.com/2026/09/arunachal-governor-and-army-general-discuss-civil-military-coordination-and-disaster-preparedness/",
    "rationale": "Shows civil-military coordination, disaster response and youth outreach at state level.",
    "body": [
      "Lt Gen Mohit Waghwa, General Officer Commanding 101 Area, met Arunachal Pradesh Governor Lt Gen K.T. Parnaik in Itanagar to discuss logistics support, civil-military coordination and humanitarian assistance and disaster relief. The Governor praised 101 Area’s role in combat logistics and in rescue and relief after floods and landslides.",
      "Talks also covered transit routes, communications, veteran welfare and resettlement support. Separately, the Governor visited the Armed Forces Goodwill Enclosures at Ziro, which are designed to connect young people with military service opportunities."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "commander-manipur",
    "featured": false,
    "category": "regional",
    "date": "2026-09-24",
    "source": "SSB Crack",
    "headline": "Eastern Army Commander reviews Manipur security with Spear Corps and Assam Rifles",
    "summary": "Lt Gen VMB Krishnan met senior officers in Manipur to review the security situation, operational readiness and troop morale.",
    "url": "https://news.ssbcrack.com/army-commander-lt-gen-vmb-krishnan-visits-assam-rifles-formations-in-manipur/",
    "rationale": "Shows senior leadership attention to the security situation in Manipur.",
    "body": [
      "Lt Gen VMB Krishnan, General Officer Commanding-in-Chief of Eastern Command, met senior officers of Spear Corps and Assam Rifles in Manipur to review the security situation. The visit came amid continuing ethnic violence in parts of the state.",
      "The discussions covered operational readiness, coordination among security agencies, troop morale and aid-to-civil-authority tasks, underlining senior-level attention to protecting civilians and preventing further violence."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "counter-ied-training",
    "featured": false,
    "category": "security",
    "date": "2026-09-21",
    "source": "SSB Crack",
    "headline": "Eastern Command runs joint Counter-IED training for Army and Assam Rifles",
    "summary": "The Counter Explosive Device Unit trained both forces together to detect and neutralise IEDs and to build common response procedures.",
    "url": "https://www.ssbcrack.com/2026/09/eastern-command-conducts-joint-counter-ied-training-for-indian-army-and-assam-rifles-troops.html",
    "rationale": "Shows preventive capability-building and jointness between the Army and Assam Rifles.",
    "body": [
      "Eastern Command’s Counter Explosive Device Unit ran joint Counter-IED training for Army and Assam Rifles personnel. The course focused on skills to detect, disrupt and neutralise explosive threats.",
      "Training the two forces together helps build common procedures. That matters in Manipur and other parts of the Northeast where armed groups have used IEDs against security forces and infrastructure."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "anjaw-bailey-bridge",
    "featured": false,
    "category": "development",
    "date": "2026-09-16",
    "source": "Arunachal Observer",
    "headline": "Strategic Bailey bridge restored in Anjaw district",
    "summary": "The Army and BRO reopened the Krowti bridge over the Lohit River after eight days, restoring access to forward villages near the China border.",
    "url": "https://arunachalobserver.org/2026/09/16/strategic-bailey-bridge-restored-in-anjaw-district-after-8-day-army-bro-operation/",
    "rationale": "Shows security and development converging through connectivity to forward villages.",
    "body": [
      "The Army and the Border Roads Organisation restored the KKG-BSB Bailey bridge at Krowti in Arunachal Pradesh’s Anjaw district after an eight-day repair operation. The bridge spans the Lohit River and links forward villages including Kaho, Musai and Dong near the India-China border.",
      "Its restoration matters for civilian connectivity and military logistics alike, improving access for residents, supply movement and the Army’s ability to sustain forces in a remote, high-altitude sector."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "chaglagam-volleyball",
    "featured": false,
    "category": "sports",
    "date": "2026-09-04",
    "source": "Brighter Kashmir",
    "headline": "Chaglagam volleyball league unites Arunachal youth",
    "summary": "A Spear Corps formation organised the Chaglagam Volleyball Premier League 2026, giving youth in a remote border area a platform for sport and teamwork.",
    "url": "https://brighterkashmir.com/chaglagam-volleyball-league-unites-arunachal-youth",
    "rationale": "Shows sport used to engage youth in a remote border district.",
    "body": [
      "A formation under the Army’s Spear Corps organised the Chaglagam Volleyball Premier League 2026 at Chaglagam Stadium in Arunachal Pradesh. The tournament brought together young players from across the state and promoted teamwork, leadership and national integration.",
      "In remote border areas such as Anjaw district, geography can limit access to organised sport. The league gave local youth a constructive platform for competition and for interaction with the Army."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "cocomi-kamjong",
    "featured": false,
    "category": "regional",
    "date": "2026-09-27",
    "source": "NENow",
    "headline": "COCOMI demands probe after Kamjong border infiltration killings",
    "summary": "After an alleged infiltration from Myanmar on 24 September in which four civilians were killed at Pilong village, COCOMI called it external aggression and sought a special probe.",
    "url": "https://nenow.in/north-east-news/manipur/manipur-cocomi-calls-kamjong-killings-external-aggression-demands-special-probe.html",
    "rationale": "Gives the civil-society view of border insecurity and the demands placed on security forces.",
    "body": [
      "According to the report, suspected Kuki National Army (Burma) militants allegedly crossed from Myanmar on 24 September 2026 and killed four civilians at Pilong village in Manipur’s Kamjong district. The Coordinating Committee on Manipur Integrity described the incident as external aggression and demanded a special investigation.",
      "The episode shows the pressure on Manipur’s frontier districts, where armed-group activity, ethnic tensions and porous terrain intersect, and the burden on the Army and Assam Rifles to prevent infiltration and protect remote settlements."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "jiribam-ied",
    "featured": false,
    "category": "security",
    "date": "2026-09-07",
    "source": "Counter IED Report",
    "headline": "20-kg IED cache recovered and defused in Manipur's Jiribam",
    "summary": "Acting on intelligence, Spear Corps units and Manipur Police recovered three improvised explosive devices weighing about 20 kg in jungle terrain near Jiribam.",
    "url": "https://counteriedreport.com/india-20-kg-ied-cache-recovered-defused-in-jiribam/",
    "rationale": "Shows counter-IED capability protecting civilians and movement corridors.",
    "body": [
      "Acting on specific intelligence, Spear Corps formations and Manipur Police recovered three improvised explosive devices weighing around 20 kg in a jungle area between Leishabithol and Jiribam. The joint search prevented potential harm to civilians, security personnel and movement corridors.",
      "IEDs remain a serious asymmetric threat because they can target patrols, roads and civilian areas, and neutralising them takes timely intelligence and specialised disposal skills."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "gajraj-resilience",
    "featured": false,
    "category": "security",
    "date": "2026-09-15",
    "source": "SSB Crack",
    "headline": "Gajraj Corps holds seminar on psychological resilience and adaptability",
    "summary": "A four-day seminar at Tezpur brought the Army and Central Armed Police Forces together to examine mental resilience and stress management in demanding operations.",
    "url": "https://www.ssbcrack.com/2026/09/eastern-commands-gajraj-corps-holds-seminar-on-psychological-resilience-and-adaptability.html",
    "rationale": "Shows attention to the mental readiness of personnel as an operational asset.",
    "body": [
      "Eastern Command’s Gajraj Corps began a four-day Psychological Resilience and Adaptability Seminar at Tezpur, Assam. It brought together representatives of the Army and Central Armed Police Forces to discuss mental resilience and operational stress management.",
      "Army Commander Lt Gen VMB Krishnan addressed the gathering and stressed resilience and adaptability as part of operational preparedness, reflecting the strain that prolonged counter-insurgency and border duties place on personnel."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "first-aid-day",
    "featured": false,
    "category": "development",
    "date": "2026-09-14",
    "source": "Brighter Kashmir",
    "headline": "Spear Corps trains communities across Northeast in first aid",
    "summary": "To mark World First Aid Day, Army and Assam Rifles units ran life-saving training for residents across Assam, Arunachal Pradesh, Manipur and Nagaland.",
    "url": "https://www.brighterkashmir.com/spear-corps-trains-communities-across-northeast",
    "rationale": "Shows community resilience and preparedness in a disaster-prone region.",
    "body": [
      "Marking World First Aid Day, Army and Assam Rifles formations under Spear Corps ran first-aid training and life-saving awareness programmes across Assam, Arunachal Pradesh, Manipur and Nagaland. Community members learned practical skills for injuries, accidents and emergencies.",
      "In a region prone to floods, landslides and remote-area isolation, such training builds local resilience and creates regular contact between troops and residents."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "border-outreach",
    "featured": false,
    "category": "society",
    "date": "2026-09-16",
    "source": "Brighter Kashmir",
    "headline": "Army and Assam Rifles step up border outreach in Nagaland, Manipur and Arunachal",
    "summary": "Spear Corps formations ran security and community programmes in border areas, pairing youth engagement and dialogue with operational preparedness.",
    "url": "https://www.brighterkashmir.com/army-assam-rifles-step-up-border-outreach",
    "rationale": "Shows trust-building with border communities.",
    "body": [
      "Army and Assam Rifles formations under Spear Corps ran security and community-outreach activities across Nagaland, Manipur and Arunachal Pradesh, focusing on border security, youth engagement and closer coordination with local communities.",
      "Communities near international boundaries are often the first to notice cross-border activity, so dialogue and welfare work help build the trust that border management depends on."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "manipur-cm-reviews",
    "featured": false,
    "category": "regional",
    "date": "2026-10-01",
    "source": "NENow",
    "headline": "Manipur CM reviews security and Myanmar border fencing with Assam Rifles",
    "summary": "Manipur Chief Minister N. Biren Singh’s office reviewed the state’s security situation and progress on fencing along the India-Myanmar border with Assam Rifles officials.",
    "url": "https://nenow.in/north-east-news/manipur/manipur-cm-reviews-security-myanmar-border-fencing-with-assam-rifles-officials.html",
    "rationale": "Reflects ongoing civil-military coordination to secure villages, improve surveillance and support long-term border infrastructure.",
    "body": [
      "Manipur Chief Minister N. Biren Singh’s office reviewed the state’s security situation and progress on fencing along the India-Myanmar border with Assam Rifles officials. Approximately 55 kilometres of border fencing had been completed as of September 2026. The discussion is significant because Manipur’s 398-kilometre international border faces challenges including militant movement, smuggling, infiltration and cross-border criminal networks.",
      "Assam Rifles, operating under the Ministry of Home Affairs but closely integrated with the Army’s counter-insurgency and border-management framework, remains a principal force in the sector. The meeting reflects ongoing civil-military coordination to secure villages, improve surveillance and support long-term border infrastructure. It also highlights the connection between physical border management, local security perceptions and the wider stability of India’s Northeast frontier."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "joint-ops-manipur",
    "featured": false,
    "category": "security",
    "date": "2026-09-27",
    "source": "Spear Corps",
    "headline": "Joint operations apprehend 10 insurgent cadres, recover 48 weapons in Manipur",
    "summary": "Intelligence-based joint operations launched from 20 to 27 September 2026 resulted in the apprehension of 10 insurgent cadres across multiple districts.",
    "url": "https://nitter.jaydenha.uk/Spearcorps",
    "rationale": "A strong example of the Army’s contribution to reducing armed-group capability and creating conditions for peace and normalcy.",
    "body": [
      "Intelligence-based joint operations launched from 20 to 27 September 2026 by Indian Army and Assam Rifles formations under Spear Corps, in coordination with Central Armed Police Forces and Manipur Police, resulted in the apprehension of 10 insurgent cadres. Operations covered Imphal West, Imphal East, Bishnupur, Churachandpur and Thoubal districts.",
      "Security forces also recovered 48 weapons, ammunition and war-like stores. The actions targeted armed networks, illegal arms circulation and activities threatening civilian security in a state affected by prolonged ethnic conflict. The operation demonstrates the value of intelligence-led, multi-agency action: Army, Assam Rifles, police and CAPFs combined surveillance, local knowledge and enforcement capacity."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  },
  {
    "id": "operation-sadbhavana",
    "featured": false,
    "category": "society",
    "date": "2026-10-02",
    "source": "Brighter Kashmir",
    "headline": "Operation Sadbhavana and Project SeVaA create opportunities for Northeast youth",
    "summary": "Under Operation Sadbhavana, a Spear Corps formation in Pasighat felicitated selected APSSB aspirants and young people who completed IT and hospitality courses.",
    "url": "https://brighterkashmir.com/news/army-backs-youth-through-sports-skills-92922.html",
    "rationale": "Positions young people as stakeholders in regional peace and nation-building through education and vocational skills.",
    "body": [
      "Under Operation Sadbhavana, a Spear Corps formation in Pasighat felicitated selected Arunachal Pradesh Staff Selection Board aspirants and young people who completed IT and hospitality courses under Project SeVaA. The programme linked education, vocational skills and career guidance with the Army’s broader civic-action agenda. For youth in remote Arunachal Pradesh, such courses can open pathways into employment, higher education and public service while reducing dependence on limited local opportunities.",
      "The initiative also strengthens the Army’s relationship with communities by showing that security forces contribute directly to aspiration, mobility and social development. Combined with sports support in Nagaland, the effort reflects a comprehensive approach to youth empowerment: discipline and physical activity, digital and service-sector skills, and exposure to national institutions."
    ],
    "image": "",
    "video": "",
    "audio": "",
    "map": ""
  }
];

const CAT = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));
const fmtDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function Visual({ article, className = "" }) {
  const [a, b] = TONES[article.category];
  const style = article.image
    ? { backgroundImage: `url(${article.image})` }
    : { background: `linear-gradient(160deg, ${a}, ${b})` };
  return (
    <div className={`nm-visual ${className}`} style={style} aria-hidden="true">
      {!article.image && (
        <svg className="nm-ridge" viewBox="0 0 400 120" preserveAspectRatio="none">
          <path d="M0 80 L50 50 L90 70 L150 25 L210 65 L270 40 L330 70 L400 45 V120 H0Z" fill="rgba(0,0,0,.28)" />
        </svg>
      )}
    </div>
  );
}

function Meta({ article }) {
  return (
    <p className="nm-meta nm-head">
      <b>{CAT[article.category].short}</b>
      <time dateTime={article.date}>{fmtDate(article.date)}</time>
    </p>
  );
}

function Hero() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <section className="nm-hero">
      {HERO_IMAGE ? (
        <div className="nm-hero-img" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
      ) : (
        <>
          <div className="nm-mist" />
          <svg className="nm-hero-ridges" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 260 L120 200 L230 240 L380 150 L520 230 L640 170 L780 250 L930 140 L1080 220 L1220 170 L1340 230 L1440 200 V400 H0Z" fill="#0C2A24" />
            <path d="M0 320 L140 270 L260 300 L420 230 L560 300 L700 250 L860 310 L1000 240 L1160 300 L1300 260 L1440 300 V400 H0Z" fill="#081D19" />
            <path d="M0 370 L180 340 L340 365 L520 320 L720 365 L900 335 L1100 370 L1280 345 L1440 365 V400 H0Z" fill="#05120F" />
          </svg>
        </>
      )}
      <div className="nm-hero-shade" />
      <div className="nm-hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1>Securing the Northeast</h1>
        <p className="nm-hero-deck">Indian Army’s Role in Stability, Peace & National Security</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <button className="nm-btn nm-btn-primary" onClick={() => go("top-stories")}>Read the top stories</button>
          <button className="nm-btn nm-btn-ghost" onClick={() => go("latest")}>Latest reports</button>
        </div>
        <p className="nm-hero-note">
          Reports published between 1 September and 5 October 2026 from Arunachal Pradesh, Assam,
          Manipur, Meghalaya, Mizoram, Nagaland, Sikkim and Tripura.
        </p>
      </div>
    </section>
  );
}

function Carousel({ items, onOpen }) {
  const track = useRef(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const step = (dir) => {
    const el = track.current;
    if (!el) return;
    const cards = el.querySelectorAll(".nm-card");
    const w = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : el.clientWidth;
    const max = el.scrollWidth - el.clientWidth;
    if (dir > 0 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && el.scrollLeft <= 4) el.scrollTo({ left: max, behavior: "smooth" });
    else el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  useEffect(() => {
    let reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { /* empty */ }
    if (paused || reduce) return;
    const t = setInterval(() => step(1), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const onScroll = () => {
    const el = track.current;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <section id="top-stories" className="nm-sec max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black">Top stories</h2>
          <p className="nm-muted mt-2 text-sm">One lead report from each section.</p>
        </div>
        <div className="flex gap-2">
          <button className="nm-icon-btn" onClick={() => step(-1)} aria-label="Previous story"><ArrowLeft size={18} /></button>
          <button className="nm-icon-btn" onClick={() => step(1)} aria-label="Next story"><ArrowRight size={18} /></button>
        </div>
      </div>

      <div className="nm-track" ref={track} onScroll={onScroll}>
        {items.map((a) => (
          <article key={a.id} className="nm-card">
            <button className="nm-card-btn" onClick={() => onOpen(a)} aria-label={`${CAT[a.category].label}: ${a.headline}`}>
              <Visual article={a} />
              <div className="nm-card-shade" />
              <div className="nm-card-text">
                <span className="nm-chip">{CAT[a.category].short}</span>
                <h3>{a.headline}</h3>
                <p className="nm-card-date">{fmtDate(a.date)}</p>
              </div>
            </button>
          </article>
        ))}
      </div>
      <div className="nm-progress" aria-hidden="true"><i style={{ width: `${20 + progress * 80}%` }} /></div>
    </section>
  );
}

function NewsGrid({ items, onOpen }) {
  const [lead, ...rest] = items;
  const list = rest.slice(0, 4);
  const grid = rest.slice(4);
  return (
    <section id="latest" className="nm-sec max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <h2 className="text-3xl sm:text-4xl font-black mb-8">Latest reports</h2>

      <div className="nm-split">
        <button className="nm-story" onClick={() => onOpen(lead)}>
          <Visual article={lead} className="nm-thumb" />
          <div className="mt-5"><Meta article={lead} /></div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold">{lead.headline}</h3>
          <p className="nm-muted mt-3 max-w-2xl">{lead.summary}</p>
          <p className="nm-src">Source: {lead.source}</p>
        </button>

        <div>
          {list.map((a) => (
            <button key={a.id} className="nm-story nm-line-t py-5" onClick={() => onOpen(a)}>
              <Meta article={a} />
              <h3 className="mt-1.5 text-lg font-bold">{a.headline}</h3>
            </button>
          ))}
        </div>
      </div>

      <div className="nm-line-t mt-12 pt-10 nm-cards4">
        {grid.map((a) => (
          <button key={a.id} className="nm-story" onClick={() => onOpen(a)}>
            <Visual article={a} className="nm-thumb" />
            <div className="mt-4"><Meta article={a} /></div>
            <h3 className="mt-1.5 text-lg font-bold">{a.headline}</h3>
            <p className="nm-muted mt-2 text-sm nm-clamp" style={{ lineHeight: 1.7 }}>{a.summary}</p>
            <p className="nm-src">Source: {a.source}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function HomePage({ navigate }) {
  const open = (a) => navigate(a.id);
  const featured = ARTICLES.filter((a) => a.featured);
  const latest = ARTICLES.filter((a) => !a.featured).sort((x, y) => y.date.localeCompare(x.date));
  return (
    <>
      <Hero />
      <Carousel items={featured} onOpen={open} />
      <NewsGrid items={latest} onOpen={open} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Article page template (Phase 3)                                    */
/* ------------------------------------------------------------------ */
const EMBEDS = {
  video: { label: "Video briefing", Icon: Play, field: "video", hint: "a YouTube video ID, such as dQw4w9WgXcQ" },
  audio: { label: "Audio brief", Icon: Headphones, field: "audio", hint: "an MP3 link or a Spotify embed link" },
  map: { label: "Map", Icon: MapPin, field: "map", hint: "a Google Maps embed URL" },
};

/* One slot per media type. With a value it renders the player; without one it shows a placeholder. */
function EmbedSlot({ kind, src, title }) {
  const { label, Icon, field, hint } = EMBEDS[kind];
  let player = null;
  if (src && kind === "video") {
    player = <iframe className="nm-embed-box nm-embed-video" src={`https://www.youtube-nocookie.com/embed/${src}`}
      title={title} loading="lazy" allowFullScreen />;
  } else if (src && kind === "audio") {
    player = src.includes("spotify.com")
      ? <iframe className="nm-embed-box nm-embed-spotify" src={src} title={title} loading="lazy" allow="encrypted-media" />
      : <audio controls preload="none" src={src} style={{ width: "100%" }} />;
  } else if (src && kind === "map") {
    player = <iframe className="nm-embed-box nm-embed-map" src={src} title={title} loading="lazy" />;
  }
  return (
    <figure className="nm-embed">
      <figcaption className="nm-embed-label"><Icon size={16} />{label}</figcaption>
      {player || (
        <div className="nm-embed-empty">
          <p>Embed slot. Add <code>{field}</code> to this article’s data with {hint}.</p>
        </div>
      )}
    </figure>
  );
}

function ArticlePage({ article, navigate }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [article.id]);

  const cat = CAT[article.category];
  const paras = article.body || [];
  const related = ARTICLES.filter((a) => a.id !== article.id)
    .sort((a, b) =>
      (b.category === article.category) - (a.category === article.category) || b.date.localeCompare(a.date))
    .slice(0, 5);
  const P = (arr, off) => arr.map((t, i) => <p key={off + i} className="nm-body">{t}</p>);

  return (
    <>
      <div className="nm-readbar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>

      <section className="nm-ahero">
        <Visual article={article} />
        <div className="nm-ahero-shade" />
        <div className="nm-ahero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button className="nm-back" onClick={() => navigate(article.category)}>
            <ArrowLeft size={16} /> {cat.label}
          </button>
          <h1>{article.headline}</h1>
          <p className="nm-ahero-meta">
            <time dateTime={article.date}>{fmtDate(article.date)}</time>
            <span>Source: {article.source}</span>
          </p>
        </div>
      </section>

      <div className="nm-article max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="nm-article-main">
          <p className="nm-deck">{article.summary}</p>

          {/* Body: paragraphs and embed slots alternate. Move a slot up or down to change where it appears. */}
          {paras.length ? P(paras.slice(0, 1), 0) : (
            <div className="nm-frame nm-muted text-sm">
              Full article text goes here. Add paragraphs to this article’s <code>body</code> list in the data.
            </div>
          )}
          <EmbedSlot kind="video" src={article.video} title={`Video: ${article.headline}`} />
          {P(paras.slice(1, 2), 1)}
          <EmbedSlot kind="audio" src={article.audio} title={`Audio: ${article.headline}`} />
          {P(paras.slice(2), 2)}
          <EmbedSlot kind="map" src={article.map} title={`Map: ${article.headline}`} />

          <div className="nm-cite">
            <p className="text-sm">Reported by {article.source}, {fmtDate(article.date)}.</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read the original report <ExternalLink size={14} />
            </a>
          </div>
        </article>

        <aside className="nm-related" aria-label="Related news">
          <h2 className="text-2xl mb-3">Related news</h2>
          {related.map((a) => (
            <button key={a.id} className="nm-story nm-line-t py-4" onClick={() => navigate(a.id)}>
              <Meta article={a} />
              <h3 className="mt-1.5 text-lg">{a.headline}</h3>
            </button>
          ))}
        </aside>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Category and appendix pages (built automatically from the data)   */
/* ------------------------------------------------------------------ */
const byDate = (x, y) => y.date.localeCompare(x.date);

function PageHead({ title, deck }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 w-full">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl max-w-4xl">{title}</h1>
      {deck && <p className="nm-muted mt-5 text-lg max-w-2xl" style={{ lineHeight: 1.7 }}>{deck}</p>}
    </div>
  );
}

function CategoryPage({ section, navigate }) {
  const items = ARTICLES.filter((a) => a.category === section.id).sort(byDate);
  return (
    <>
      <PageHead title={section.label} deck={`${items.length} reports published between 1 September and 5 October 2026.`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="nm-line-t pt-10 nm-cards3">
          {items.map((a) => (
            <button key={a.id} className="nm-story" onClick={() => navigate(a.id)}>
              <Visual article={a} className="nm-thumb" />
              <div className="mt-4"><Meta article={a} /></div>
              <h3 className="mt-1.5 text-xl">{a.headline}</h3>
              <p className="nm-muted mt-2 text-sm nm-clamp" style={{ lineHeight: 1.7 }}>{a.summary}</p>
              <p className="nm-src">Source: {a.source}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function AppendixA() {
  const bySource = {};
  ARTICLES.forEach((a) => { (bySource[a.source] = bySource[a.source] || []).push(a); });
  const rows = Object.entries(bySource).sort((x, y) => y[1].length - x[1].length || x[0].localeCompare(y[0]));
  return (
    <>
      <PageHead title="Appendix A: Sources"
        deck="Every outlet used in this issue and the number of articles taken from each. Links open the original reports." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="nm-table-wrap">
          <table className="nm-table">
            <thead><tr><th>Source</th><th>Articles</th><th>Reports used</th></tr></thead>
            <tbody>
              {rows.map(([src, list]) => (
                <tr key={src}>
                  <td className="nm-td-src">{src}</td>
                  <td className="nm-td-num">{list.length}</td>
                  <td>
                    {list.map((a) => (
                      <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer">{a.headline}</a>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td>Total</td><td className="nm-td-num">{ARTICLES.length}</td><td /></tr></tfoot>
          </table>
        </div>
      </div>
    </>
  );
}

function AppendixB({ navigate }) {
  return (
    <>
      <PageHead title="Appendix B: Rationale" deck="Why each article was chosen for this issue, grouped by section." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {SECTIONS.map((s) => (
          <section key={s.id} className="pt-8 pb-6">
            <h2 className="text-3xl mb-4">{s.label}</h2>
            {ARTICLES.filter((a) => a.category === s.id).sort(byDate).map((a) => (
              <div key={a.id} className="nm-why-item">
                <button className="nm-story" onClick={() => navigate(a.id)}>
                  <Meta article={a} />
                  <h3 className="mt-1 text-lg">{a.headline}</h3>
                </button>
                <p className="nm-muted text-sm" style={{ lineHeight: 1.75 }}>{a.rationale}</p>
              </div>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [route, setRoute] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = useCallback((id) => {
    setRoute(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const article = ARTICLES.find((a) => a.id === route);

  return (
    <div className="nm-app" data-theme={theme}>
      <style>{THEME_CSS}</style>
      <a href="#main" className="nm-skip">Skip to content</a>

      <Header
        route={article ? article.category : route}
        navigate={navigate}
        theme={theme}
        toggleTheme={toggleTheme}
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main id="main" className="flex-1">
        {article ? (
          <ArticlePage article={article} navigate={navigate} />
        ) : route === "home" ? (
          <HomePage navigate={navigate} />
        ) : CAT[route] ? (
          <CategoryPage section={CAT[route]} navigate={navigate} />
        ) : route === "appendix-a" ? (
          <AppendixA />
        ) : route === "appendix-b" ? (
          <AppendixB navigate={navigate} />
        ) : (
          <PlaceholderPage route={route} />
        )}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}