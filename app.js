const $ = s => document.querySelector(s);
const gallery = $('#gallery'), search = $('#search'), dialog = $('#detail');
let items = [], current;
const normalize = value => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\bcats\b/g, 'cat').replace(/\bdogs\b/g, 'dog').trim();
function render() {
  const words = normalize(search.value).split(/\s+/).filter(Boolean);
  const results = items.filter(item => {
    const text = normalize([item.title, item.alt, ...item.tags].join(' '));
    return words.every(word => text.includes(word));
  });
  gallery.replaceChildren(...results.map(item => {
    const button = document.createElement('button');
    button.className = 'card'; button.setAttribute('aria-label', `View ${item.title}`);
    const img = document.createElement('img'); img.src = item.thumbnail; img.alt = item.alt; img.loading = 'lazy'; img.width = 640; img.height = 640;
    button.append(img); button.addEventListener('click', () => open(item)); return button;
  }));
  $('#status').hidden = results.length > 0;
  $('#status').textContent = results.length ? '' : 'No results.';
  const url = new URL(location.href);
  search.value.trim() ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
  url.searchParams.delete('mood');
  history.replaceState(null, '', url);
}
function open(item) {
  current = item;
  $('#detail-image').src = item.image; $('#detail-image').alt = item.alt;
  $('#download').href = item.image; $('#download').download = `${item.id}.jpg`;
  $('#copy').textContent = 'copy link'; $('#copy-status').hidden = true;
  dialog.showModal();
}
search.addEventListener('input', render);
$('form').addEventListener('submit', event => event.preventDefault());
$('#close').onclick = () => dialog.close();
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
$('#copy').onclick = async () => {
  const item = current;
  try { await navigator.clipboard.writeText(new URL(item.image, location.href).href); if(current === item) { $('#copy').textContent = 'copied'; $('#copy-status').textContent = 'Link copied'; $('#copy-status').hidden = true; } }
  catch { if(current === item) { $('#copy-status').textContent = 'Couldn’t copy link.'; $('#copy-status').hidden = false; } }
};
document.addEventListener('keydown', event => { if (event.key === '/' && !dialog.open && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { event.preventDefault(); search.focus(); } });
try {
  const response = await fetch('collection.json'); if(!response.ok) throw new Error('Collection unavailable'); items = await response.json();
  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || (params.get('mood') === 'Cats' ? 'cat' : params.get('mood') || '');
  render();
} catch { $('#status').textContent = 'Couldn’t load images. Refresh to retry.'; $('#status').hidden = false; }
