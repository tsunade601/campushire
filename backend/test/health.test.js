import test from 'node:test';import assert from 'node:assert/strict';import {app} from '../src/server.js';
test('application exports Express server',()=>{assert.equal(typeof app.listen,'function')});
test('health route is registered',()=>{assert.ok(app._router.stack.some(x=>x.route?.path==='/api/health'))});
