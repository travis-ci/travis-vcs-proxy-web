import config from 'travis/config/environment';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ServersAdd extends Component {
  config = config;

  @tracked serverName = '';
  @tracked connectionUrl = '';
  @tracked serverType = 'perforce';
  @tracked perforceUserName = '';
  @tracked perforceToken = '';

  @action
  addServer() {

  }
}
