import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default class Landing extends Component {
  @tracked email = '';
  @tracked password = '';
  @service auth;
  isBeta = config.beta == 'true';

  @action
  signIn() {
    this.auth.signIn(this.email, this.password);
  }
}
