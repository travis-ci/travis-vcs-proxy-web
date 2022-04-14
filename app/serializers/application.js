import JSONSerializer from '@ember-data/serializer/json';
import { underscore } from '@ember/string';

export default class ApplicationSerializer extends JSONSerializer {
  keyForAttribute(attr) {
    return underscore(attr);
  }

  keyForRelationship(rawKey) {
    return underscore(rawKey);
  }
}
