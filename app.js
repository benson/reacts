const $ = s => document.querySelector(s);
const gallery = $('#gallery'), search = $('#search'), dialog = $('#detail');
const moods = ['All', 'Chill', 'Cats', 'Tired', 'Approved', 'Peace', 'Skeptical'];
let items = [], mood = 'All', current;
const normalize = value => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\bcats\b/g, 'cat').replace(/\bdogs\b/g, 'dog').trim();
function updateUrl() {
  const url = new URL(location.href);
  search.value.trim() ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
  mood !== 'All' ? url.searchParams.set('mood', mood) : url.searchParams.delete('mood');
  history.replaceState(null, '', url);
}
function render() {
  const words = normalize(search.value).split(/\s+/).filter(Boolean);
  const results = items.filter(item => {
    const text = normalize([item.title, item.alt, ...item.tags].join(' '));
    return words.every(word => text.includes(word)) && (mood === 'All' || item.tags.includes(mood === 'Cats' ? 'cat' : mood.toLowerCase()));
  });
  gallery.replaceChildren(...results.map(item => {
    const button = document.createElement('button');
    button.className = 'card'; button.setAttribute('aria-label', `View ${item.title}`);
    const img = document.createElement('img'); img.src = item.thumbnail; img.alt = item.alt; img.loading = 'lazy'; img.width = 640; img.height = 640;
    const title = document.createElement('span'); title.textContent = item.title;
    button.append(img, title); button.addEventListener('click', () => open(item)); return button;
  }));
  $('#count').textContent = `${results.length} ${results.length === 1 ? 'reaction' : 'reactions'}`;
  $('#heading').textContent = search.value.trim() ? 'Search results' : mood === 'All' ? 'All reactions' : mood;
  $('#empty').hidden = results.length > 0;
  document.querySelectorAll('#filters button').forEach(button => button.setAttribute('aria-pressed', String(button.textContent === mood)));
  updateUrl();
}
function open(item) {
  current = item;
  $('#detail-title').textContent = item.title; $('#detail-image').src = item.image; $('#detail-image').alt = item.alt;
  $('#download').href = item.image; $('#download').download = `${item.id}.jpg`; $('#copy-status').textContent = '';
  $('#tags').replaceChildren(...item.tags.map(tag => {
    const button = document.createElement('button'); button.textContent = tag;
    button.onclick = () => { dialog.close(); search.value = tag; mood = 'All'; render(); search.focus(); };
    return button;
  }));
  dialog.showModal();
}
for (const label of moods) {
  const button = document.createElement('button'); button.textContent = label; button.setAttribute('aria-pressed', String(label === mood));
  button.onclick = () => { mood = label; render(); }; $('#filters').append(button);
}
search.addEventListener('input', render);
$('form').addEventListener('submit', event => event.preventDefault());
$('#reset').onclick = () => { search.value = ''; mood = 'All'; render(); search.focus(); };
$('.close').onclick = () => dialog.close();
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
$('#copy').onclick = async () => {
  try { await navigator.clipboard.writeText(new URL(current.image, location.href).href); $('#copy-status').textContent = 'Link copied'; }
  catch { $('#copy-status').textContent = 'Copy unavailable. Open or download the image instead.'; }
};
document.addEventListener('keydown', event => { if (event.key === '/' && !dialog.open && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { event.preventDefault(); search.focus(); } });
try {
  const response = await fetch('collection.json'); if(!response.ok) throw new Error('Collection unavailable'); items = await response.json();
  const params = new URLSearchParams(location.search); search.value = params.get('q') || ''; mood = moods.includes(params.get('mood')) ? params.get('mood') : 'All'; render();
} catch { $('#heading').textContent = 'Couldn’t load the collection. Refresh to try again.'; }
