import JSONSerializer from '@ember-data/serializer/json';

export default class OrganizationSerializer extends JSONSerializer {
  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    const newPayload = payload['organizations'];
    newPayload['meta'] = payload['meta'];
    return super.normalizeQueryResponse(store, primaryModelClass, newPayload || [], id, requestType);
  }

  serialize(snapshot, options) {
    let json = super.serialize(...arguments);

    return { organization: json };
  }
}
