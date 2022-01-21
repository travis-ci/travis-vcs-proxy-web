import JSONSerializer from '@ember-data/serializer/json';
import { underscore } from '@ember/string';

export default class UserSerializer extends JSONSerializer {
  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    const newPayload = payload['users'];
    newPayload['meta'] = payload['meta'];
    return super.normalizeQueryResponse(store, primaryModelClass, newPayload || [], id, requestType);
  }

  keyForAttribute(attr) {
    return underscore(attr);
  }
}
