import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/server.js';

test('GET /api/health should return 200 and online status', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://localhost:${port}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'online');
    assert.ok(body.timestamp);
  } finally {
    server.close();
  }
});
