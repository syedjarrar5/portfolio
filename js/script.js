/* ====== EDIT YOUR DATA HERE ====== */
const skills = {
  "Programming": [["C++", 80], ["Python", 70], ["Java", 65], ["JavaScript", 70]],
  "Web": [["HTML and CSS", 85], ["React (learning)", 45], ["Node.js (learning)", 40]],
  "Computer Science": [["Data Structures", 75], ["SQL and Databases", 70], ["Git and GitHub", 65]]
};

const projects = [
  { title: "Library Management System", cat: "Desktop", tags: ["C++", "OOP", "File I/O"],
    desc: "Console app to add, search, issue and return books using classes and file storage.", link: "#" },
  { title: "Student Database (SQL)", cat: "Database", tags: ["MySQL", "ER Diagram"],
    desc: "Normalized schema for students, courses and results with queries and views.", link: "#" },
  { title: "Personal Portfolio", cat: "Web", tags: ["HTML", "CSS", "JavaScript"],
    desc: "This responsive site with dark mode, filtering and form validation.", link: "#" },
  { title: "Sorting Visualizer", cat: "Web", tags: ["JavaScript", "Algorithms"],
    desc: "Animates bubble, merge and quick sort so you can compare how they behave.", link: "#" },
  { title: "Expense Tracker", cat: "Python", tags: ["Python", "CSV"],
    desc: "Command line tool that records expenses and prints monthly summaries.", link: "#" }
];

const codeLines = `const student = {
  name: "Syed Jarrar Haider",
  degree: "BS Computer Science",
  semester: 5,
  languages: ["C++", "Python", "JS"],
  interests: ["DSA", "Web", "DBMS"],
  openTo: "internships"
};`;

/* ====== Render skills ====== */
const skillList = document.getElementById("skillList");
for (const [group, items] of Object.entries(skills)) {
  const box = document.createElement("div");
  box.className = "skill-group";
  box.innerHTML = `<h3>${group}</h3>` + items.map(([n, v]) =>
    `<div class="skill"><div><span>${n}</span><span>${v}%</span></div><div class="bar"><i data-w="${v}"></i></div></div>`).join("");
  skillList.appendChild(box);
}

/* ====== Render and filter projects ====== */
const grid = document.getElementById("projectGrid");
const filters = document.getElementById("filters");
document.getElementById("cProjects").textContent = projects.length;

function showProjects(cat) {
  grid.innerHTML = projects.filter(p => cat === "All" || p.cat === cat).map(p => `
    <article class="project">
      <h3>${p.title}</h3><p>${p.desc}</p>
      <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
      <a href="${p.link}">View project</a>
    </article>`).join("");
}
["All", ...new Set(projects.map(p => p.cat))].forEach((cat, i) => {
  const b = document.createElement("button");
  b.className = "chip"; b.textContent = cat; b.setAttribute("aria-pressed", i === 0);
  b.onclick = () => {
    filters.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b));
    showProjects(cat);
  };
  filters.appendChild(b);
});
showProjects("All");

/* ====== Typing effect ====== */
const typed = document.getElementById("typed");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce) typed.textContent = codeLines;
else { let i = 0; (function type() { typed.textContent = codeLines.slice(0, ++i); if (i < codeLines.length) setTimeout(type, 35); })(); }

/* ====== Animate skill bars and counters when visible ====== */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.querySelectorAll("[data-w]").forEach(b => b.style.width = b.dataset.w + "%");
  e.target.querySelectorAll("[data-count]").forEach(el => {
    const end = +el.dataset.count; let n = 0;
    const t = setInterval(() => { el.textContent = ++n; if (n >= end) clearInterval(t); }, 150);
  });
  io.unobserve(e.target);
}), { threshold: .3 });
document.querySelectorAll("#skills, #about").forEach(s => io.observe(s));

/* ====== Theme toggle (remembered) ====== */
const root = document.documentElement, toggle = document.getElementById("themeToggle");
function setTheme(t) { root.dataset.theme = t; toggle.textContent = t === "dark" ? "Light" : "Dark"; try { localStorage.setItem("theme", t); } catch (e) {} }
let saved = null; try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
toggle.onclick = () => setTheme(root.dataset.theme === "dark" ? "light" : "dark");

/* ====== Mobile menu and active link ====== */
const nav = document.getElementById("nav"), menuBtn = document.getElementById("menuBtn");
menuBtn.onclick = () => menuBtn.setAttribute("aria-expanded", nav.classList.toggle("open"));
nav.addEventListener("click", () => { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); });
const links = [...nav.querySelectorAll("a")];
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.hash === "#" + e.target.id));
}), { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));

/* ====== Contact form validation ====== */
const form = document.getElementById("contactForm"), msg = document.getElementById("formMsg");
form.addEventListener("submit", e => {
  e.preventDefault();
  const f = ["name", "email", "message"].map(id => document.getElementById(id));
  f.forEach(x => x.classList.remove("invalid"));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f[1].value.trim());
  const bad = f.filter(x => !x.value.trim() || (x.id === "email" && !emailOk));
  if (bad.length) {
    bad.forEach(x => x.classList.add("invalid"));
    msg.className = "error"; msg.textContent = "Please fill in every field with a valid email address.";
    bad[0].focus(); return;
  }
  msg.className = "ok"; msg.textContent = `Thanks ${f[0].value.trim()}, your message is ready to send.`;
  form.reset();
});
