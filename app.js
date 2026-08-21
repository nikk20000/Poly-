const searchEl = document.getElementById('search');
const resultsEl = document.getElementById('results');
const emptyEl = document.getElementById('empty');
const countPill = document.getElementById('count-pill');

const badgeGradients = [
  'linear-gradient(135deg,#5B4FE9,#8B5CF6)',
  'linear-gradient(135deg,#FF6B6B,#FF9472)',
  'linear-gradient(135deg,#17B890,#0EA5A0)',
  'linear-gradient(135deg,#FFB020,#FF6B6B)',
  'linear-gradient(135deg,#3B82F6,#5B4FE9)'
];

function formatPrice(p){
  if(p === '' || p === undefined || p === null) return '—';
  const n = Number(p);
  if(isNaN(n)) return String(p);
  return '₹' + n.toLocaleString('en-IN', {maximumFractionDigits:2});
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function renderRows(rows){
  resultsEl.innerHTML = '';
  if(rows.length === 0){
    emptyEl.style.display = 'block';
    countPill.textContent = '';
    return;
  }
  emptyEl.style.display = 'none';
  countPill.textContent = rows.length + (rows.length === PRODUCTS.length ? ' items loaded' : ' matches');
  const frag = document.createDocumentFragment();
  rows.slice(0, 200).forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.style.animationDelay = (Math.min(i,12) * 0.025) + 's';
    const initial = (r.lineDesc || r.num || '?').trim().charAt(0).toUpperCase();
    const grad = badgeGradients[i % badgeGradients.length];
    div.innerHTML = `
      <div class="badge" style="background:${grad}">${escapeHtml(initial)}</div>
      <div class="card-info">
        <p class="card-num">${escapeHtml(r.num)}</p>
        <p class="card-desc">${escapeHtml(r.lineDesc)}</p>
        ${r.shortDesc ? `<p class="card-short">${escapeHtml(r.shortDesc)}</p>` : ''}
      </div>
      <div class="card-price">${formatPrice(r.price)}</div>
    `;
    frag.appendChild(div);
  });
  resultsEl.appendChild(frag);
}

function filterAndRender(){
  const q = searchEl.value.trim().toLowerCase();
  if(!q){ renderRows(PRODUCTS); return; }
  const filtered = PRODUCTS.filter(r =>
    String(r.num).toLowerCase().includes(q) ||
    String(r.lineDesc).toLowerCase().includes(q) ||
    String(r.shortDesc).toLowerCase().includes(q)
  );
  renderRows(filtered);
}

searchEl.addEventListener('input', filterAndRender);

renderRows(PRODUCTS);
