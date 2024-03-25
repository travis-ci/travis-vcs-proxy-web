import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | sign_up', function (hooks) {
  setupTest(hooks);

  skip('it exists', function (assert) {
    let route = this.owner.lookup('route:sign-up');
    assert.ok(route);
  });
});
