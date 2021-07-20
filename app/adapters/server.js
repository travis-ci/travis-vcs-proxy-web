import ApplicationAdapter from 'travis/adapters/application';

export default class ServerAdapter extends ApplicationAdapter {
  pathForType(type) {
    return 'server_providers';
  }
}
