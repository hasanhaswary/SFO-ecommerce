import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/server.js';

test('POST /api/products/101/reviews without token should fail with 401', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://localhost:${port}/api/products/101/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
  } finally {
    server.close();
  }
});
