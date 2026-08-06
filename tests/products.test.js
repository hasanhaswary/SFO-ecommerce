import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/server.js';

test('GET /api/products should return equipment catalog', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://localhost:${port}/api/products`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.products));
    assert.ok(body.products.length > 0);
  } finally {
    server.close();
  }
});

test('GET /api/products/slug/apex-trail-runner-gen-4 should return product details', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://localhost:${port}/api/products/slug/apex-trail-runner-gen-4`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.product.slug, 'apex-trail-runner-gen-4');
  } finally {
    server.close();
  }
});
