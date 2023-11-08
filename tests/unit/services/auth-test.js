import { test, module } from 'qunit';

// TODO: Replace this with your real tests.


import { setupTest } from 'ember-qunit';

// Skipping til version 4.12
module('Unit | service:auth', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:auth');
    assert.ok(service);
  })
});
