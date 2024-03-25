import config from 'travis/config/environment';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class OrganizationAdd extends Component {
  @service store;
  @service flashes;
  @service router;
  @service auth;

  constructor() {
    super(...arguments);

    if (this.args.editMode && this.args.organization) {
      this.organization = this.args.organization;
      this.organizationName = this.organization.name;
      this.organizationDescription = this.organization.description;
      this.organizationListenerToken = this.organization.listener_token;
    }
  }

  config = config;

  @tracked user = this.auth.currentUser;
  @tracked organizationName = '';
  @tracked connectionDescription = '';
  @tracked connectionListenerToken = '';

  @action
  addOrganization() {
    if (!this.organizationName) {
      this.flashes.error('Organization name can not be blank.');
      return;
    }

    let organization = this.store.createRecord('organization');
    organization.name = this.organizationName;
    organization.description = this.organizationDescription;
    organization.listener_token = this.organizationListenerToken;
    organization
      .save()
      .then(() => {
        this.flashes.success(
          `Organization "${this.organizationName}" is added.`
        );
        this.user.organizations.pushObject(organization);
        this.user.orgPermissions.pushObject({
          id: parseInt(organization.id),
          permission: 'owner',
        });
        if (this.args.searchNoOrganization) {
          this.clearSearch();
        } else {
          this.router.transitionTo('repositories.index');
        }
      })
      .catch((error) => {
        if (error.errors && error.errors.length > 0) {
          this.flashes.error(error.errors[0].detail);
        } else {
          this.flashes.error(
            `Organization "${this.organizationName}" isn’t added.`
          );
        }
      });
  }

  @action
  editOrganization() {
    this.organization.name = this.organizationName;
    this.organization.description = this.organizationDescription;
    this.organization.listener_token = this.organizationListenerToken;
    this.organization
      .save()
      .then(() => {
        this.flashes.success(
          `Organization "${this.organization.name}" has been successfully updated.`
        );
        this.router.transitionTo('repositories.index');
      })
      .catch(() => {
        this.flashes.error(
          `Could not update Organization "${this.organization.name}".`
        );
      });
  }

  @action
  clearSearch() {
    if (this.args.clearSearch) {
      this.args.clearSearch();
    }
  }
}
