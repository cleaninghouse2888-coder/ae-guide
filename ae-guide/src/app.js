async function loadEffects() {
  const res = await fetch("effects.json");
  const data = await res.json();
  window.allEffects = data;
  buildCategories(data);
}

function buildCategories(data) {
  const categoriesDiv = document.getElementById("categories");
  const grouped = {};

  data.forEach(eff => {
    if (!grouped[eff.category_en]) grouped[eff.category_en] = [];
    grouped[eff.category_en].push(eff);
  });

  categoriesDiv.innerHTML = "";
  for (const [cat, effects] of Object.entries(grouped)) {
    const catDiv = document.createElement("div");
    catDiv.classList.add("category");

    const btn = document.createElement("button");
    btn.textContent = `📁 ${cat}`;
    const listDiv = document.createElement("div");
    listDiv.classList.add("effect-list");

    btn.onclick = () => listDiv.classList.toggle("show");

    effects.forEach(eff => {
      const effBtn = document.createElement("button");
      effBtn.classList.add("effect");
      effBtn.textContent = `${eff.icon} ${eff.name_en}`;
      effBtn.onclick = () => showEffect(eff);
      listDiv.appendChild(effBtn);
    });

    catDiv.appendChild(btn);
    catDiv.appendChild(listDiv);
    categoriesDiv.appendChild(catDiv);
  }
}

function showEffect(eff) {
  document.getElementById("placeholder").style.display = "none";
  const det = document.getElementById("effect-details");
  det.classList.remove("hidden");
  det.innerHTML = `
    <h2>${eff.icon} ${eff.name_en}</h2>
    <p><strong>Категорія:</strong> ${eff.category_en}</p>
    <p>${eff.description_ua}</p>
    <h3>Призначення:</h3>
    <p>${eff.purpose_ua}</p>
    <h3>Налаштування:</h3>
    <ul>
      ${eff.settings_ua.map(s => `<li><b>${s.name}</b> — ${s.desc}</li>`).join("")}
    </ul>
  `;
}

document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = window.allEffects.filter(
    eff =>
      eff.name_en.toLowerCase().includes(term) ||
      eff.category_en.toLowerCase().includes(term)
  );
  buildCategories(filtered);
});

loadEffects();
