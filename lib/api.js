const BASE_URL = 'https://qzaway-backend.onrender.com';

async function request(path, options = {}) {
  const { signal, ...restOptions } = options;
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    signal,
    ...restOptions,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

// ── Mall ──────────────────────────────────────────
export function getMalls() {
  return request('/malls');
}

export function getRestaurants(mallId, page = 1, limit = 20) {
  return request(`/malls/${mallId}/restaurants?page=${page}&limit=${limit}`);
}

export function searchFood(mallId, q, { page = 1, limit = 20, veg = '', sugarFree = '', signal } = {}) {
  const params = new URLSearchParams({ q, page, limit });
  if (veg) params.set('veg', veg);
  if (sugarFree) params.set('sugarFree', sugarFree);
  return request(`/malls/${mallId}/search?${params}`, { signal });
}

// ── Restaurant ────────────────────────────────────
export function getMenu(restaurantId, { page = 1, limit = 50, veg = '', sugarFree = '' } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (veg) params.set('veg', veg);
  if (sugarFree) params.set('sugarFree', sugarFree);
  return request(`/restaurants/${restaurantId}/menu?${params}`);
}

// ── Cart ──────────────────────────────────────────
export function getCart(userId, mallId) {
  return request(`/cart/${userId}/${mallId}`);
}

export function addToCart(body) {
  return request('/cart/add', { method: 'POST', body: JSON.stringify(body) });
}

export function updateCartItem(cartItemId, body) {
  return request(`/cart/item/${cartItemId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function removeCartItem(cartItemId) {
  return request(`/cart/item/${cartItemId}`, { method: 'DELETE' });
}

// ── Orders ────────────────────────────────────────
export function placeOrder(body) {
  return request('/orders/place', { method: 'POST', body: JSON.stringify(body) });
}

export function getOrders(userId, page = 1, limit = 20) {
  return request(`/orders/${userId}?page=${page}&limit=${limit}`);
}

export function reorder(orderId) {
  return request(`/orders/reorder/${orderId}`, { method: 'POST' });
}
