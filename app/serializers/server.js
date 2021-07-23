import JSONSerializer from '@ember-data/serializer/json';

export default class ServerSerializer extends JSONSerializer {
  serialize(snapshot, options) {
    let json = super.serialize(...arguments);

    return { server_provider: json };
  }
}