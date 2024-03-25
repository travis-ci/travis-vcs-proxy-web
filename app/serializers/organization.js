import JSONSerializer from '@ember-data/serializer/json';

export default class OrganizationSerializer extends JSONSerializer {
  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    const newPayload = payload['organizations'];
    newPayload['meta'] = payload['meta'];
    return super.normalizeQueryResponse(
      store,
      primaryModelClass,
      newPayload || [],
      id,
      requestType
    );
  }

  serialize() {
    let json = super.serialize(...arguments);

    return { organization: json };
  }

  extractErrors(store, type, payload) {
    if (payload.errors) {
      return payload.errors;
    } else {
      return super.extractErrors(...arguments);
    }
  }
}
