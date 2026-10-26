'use strict';
// Estado compartido de la vista; los filtros de la API se aplican a todas las páginas.
const API = 'https://rickandmortyapi.com/api/character';
const STORAGE_KEY = 'portal-c137-favorites-v1';
const $ = (id) => document.getElementById(id);
let page = 1;
let pages = 1;
let characters = [];
let favoriteView = false;
let loading = false;
let requestController;
let favorites = [];
let storageWarning = '';
const filters = { name: '', status: '', species: '' };
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!Array.isArray(saved)) throw new Error('Formato inválido');
  favorites = saved.filter((c) => c && Number.isInteger(c.id) && typeof c.name === 'string' && typeof c.status === 'string' && typeof c.species === 'string');
} catch {
  storageWarning = 'No se pudieron leer los favoritos guardados. Puedes volver a seleccionarlos.';
}
const statusLabel = { Alive: 'Vivo', Dead: 'Muerto', unknown: 'Desconocido' };
const speciesLabel = { Human: 'Humano', Alien: 'Alienígena', Humanoid: 'Humanoide', Robot: 'Robot', Animal: 'Animal' };
const genderLabel = { Male: 'Masculino', Female: 'Femenino', Genderless: 'Sin género', unknown: 'Desconocido' };
function showNotice(message) {
  $('notice').textContent = message;
  $('notice').hidden = !message;
}
function makeText(tag, className, text) {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = text;
  return el;
}
function filteredFavorites() {
  return favorites.filter((c) => c.name.toLowerCase().includes(filters.name.toLowerCase()) && (!filters.status || c.status.toLowerCase() === filters.status) && (!filters.species || c.species.toLowerCase().includes(filters.species.toLowerCase())));
}
function updatePagination() {
  $('previous').disabled = loading || page <= 1;
  $('next').disabled = loading || page >= pages;
  $('page-label').textContent = pages ? 'Página ' + page + ' de ' + pages : 'Sin páginas';
}
function renderCards(list) {
  $('results').replaceChildren();
  list.forEach((c) => {
    const article = makeText('article', 'card', '');
    const portrait = makeText('div', 'portrait', '');
    const image = document.createElement('img');
    // Solo aceptar imágenes de la API, incluso al restaurar datos locales.
    if (typeof c.image === 'string' && c.image.startsWith('https://rickandmortyapi.com/')) image.src = c.image;
    image.alt = c.name;
    image.loading = 'lazy';
    image.width = 300;
    image.height = 300;
    const button = makeText('button', 'favorite', '♡');
    button.type = 'button';
    const selected = favorites.some((f) => f.id === c.id);
    button.textContent = selected ? '♥' : '♡';
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', (selected ? 'Quitar de favoritos a ' : 'Guardar en favoritos a ') + c.name);
    button.addEventListener('click', () => toggleFavorite(c, button));
    portrait.append(image, button);
    const body = makeText('div', 'card-body', '');
    body.append(makeText('span', 'badge ' + c.status.toLowerCase(), statusLabel[c.status] || c.status), makeText('span', 'card-id', '#' + String(c.id).padStart(3, '0')), makeText('h3', '', c.name));
    body.append(makeText('p', 'description', (speciesLabel[c.species] || c.species) + ' · ' + (genderLabel[c.gender] || c.gender || 'Desconocido')));
    const location = makeText('p', 'location', '');
    location.append(makeText('small', '', 'ÚLTIMA UBICACIÓN'), document.createTextNode(c.location?.name || 'Desconocida'));
    body.append(location);
    article.append(portrait, body);
    $('results').append(article);
  });
  $('favorite-count').textContent = favorites.length;
  updatePagination();
}
function renderFavorites() {
  const list = filteredFavorites();
  pages = Math.ceil(list.length / 20);
  page = Math.min(page, Math.max(1, pages));
  const current = list.slice((page - 1) * 20, page * 20);
  $('summary').textContent = list.length + ' favoritos encontrados · ' + current.length + ' en esta página';
  showNotice(list.length ? storageWarning : favorites.length ? 'Ningún favorito coincide con los filtros. Prueba con otros criterios.' : 'Tu colección está esperando. Pulsa el corazón de un personaje para guardarlo aquí.');
  $('retry').hidden = true;
  renderCards(current);
}
function toggleFavorite(character, button) {
  const exists = favorites.some((f) => f.id === character.id);
  favorites = exists ? favorites.filter((f) => f.id !== character.id) : [...favorites, character];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    storageWarning = '';
  } catch {
    storageWarning = 'El navegador no permite guardar los favoritos. Se conservarán solo durante esta sesión.';
  }
  if (favoriteView) renderFavorites();
  else {
    const selected = !exists;
    button.textContent = selected ? '♥' : '♡';
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', (selected ? 'Quitar de favoritos a ' : 'Guardar en favoritos a ') + character.name);
    $('favorite-count').textContent = favorites.length;
    showNotice(storageWarning);
  }
}
async function loadCharacters() {
  requestController?.abort();
  const controller = new AbortController();
  requestController = controller;
  // Una consulta nueva cancela la anterior y evita que una respuesta tardía reemplace la vista.
  loading = true;
  $('results').setAttribute('aria-busy', 'true');
  $('results').replaceChildren();
  $('retry').hidden = true;
  $('summary').textContent = 'Abriendo el portal…';
  showNotice('Consultando personajes…');
  updatePagination();
  let timedOut = false;
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 15000);
  try {
    const params = new URLSearchParams({ page: String(page) });
    Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
    const response = await fetch(API + '?' + params, { signal: controller.signal });
    if (requestController !== controller || favoriteView) return;
    if (response.status === 404) {
      characters = [];
      pages = 0;
      $('summary').textContent = '0 personajes encontrados';
      showNotice('No encontramos personajes con esos criterios. Cambia el nombre o limpia los filtros.');
      return;
    }
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (requestController !== controller || favoriteView) return;
    if (!Array.isArray(data.results) || !data.info) throw new Error('Respuesta inesperada');
    characters = data.results;
    pages = data.info.pages;
    $('summary').textContent = data.info.count + ' personajes encontrados · ' + characters.length + ' en esta página';
    showNotice(storageWarning);
    renderCards(characters);
  } catch (error) {
    if (requestController !== controller || favoriteView) return;
    if (error.name === 'AbortError' && !timedOut) return;
    characters = [];
    pages = 0;
    $('summary').textContent = 'No se pudo completar la consulta';
    showNotice(timedOut ? 'La API tardó demasiado en responder. Vuelve a intentarlo.' : 'No pudimos conectar con la API. Revisa tu conexión y vuelve a intentarlo.');
    $('retry').hidden = false;
  } finally {
    clearTimeout(timeout);
    if (requestController === controller) {
      loading = false;
      $('results').setAttribute('aria-busy', 'false');
      updatePagination();
    }
  }
}
function refresh() {
  if (favoriteView) renderFavorites();
  else loadCharacters();
}
function readFilters() {
  filters.name = $('search').value.trim();
  filters.status = $('status').value;
  filters.species = $('species').value;
  page = 1;
  refresh();
}
function setView(showFavorites) {
  requestController?.abort();
  requestController = undefined;
  loading = false;
  $('results').setAttribute('aria-busy', 'false');
  favoriteView = showFavorites;
  page = 1;
  $('all-tab').classList.toggle('active', !showFavorites);
  $('favorites-tab').classList.toggle('active', showFavorites);
  $('all-tab').setAttribute('aria-pressed', String(!showFavorites));
  $('favorites-tab').setAttribute('aria-pressed', String(showFavorites));
  refresh();
}
$('search-form').addEventListener('submit', (event) => { event.preventDefault(); readFilters(); });
$('status').addEventListener('change', readFilters);
$('species').addEventListener('change', readFilters);
$('reset').addEventListener('click', () => { $('search-form').reset(); readFilters(); });
$('all-tab').addEventListener('click', () => setView(false));
$('favorites-tab').addEventListener('click', () => setView(true));
$('previous').addEventListener('click', () => { if (!loading && page > 1) { page--; refresh(); } });
$('next').addEventListener('click', () => { if (!loading && page < pages) { page++; refresh(); } });
$('retry').addEventListener('click', refresh);
$('favorite-count').textContent = favorites.length;
loadCharacters();
