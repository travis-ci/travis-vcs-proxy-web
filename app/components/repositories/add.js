import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default class RepositoriesAdd extends Component {
  @service api;
  @service flashes;
  @service router;
  @service store;
  @service auth;

  @tracked user = this.auth.currentUser;
  @tracked repositories = this.user.repositories;

  @tracked name = '';
  @tracked url = '';
  @tracked type = 'svn';
  @tracked username = '';
  @tracked token = '';
  @tracked svnRealm = '';
  @tracked selectedOrganization = null;

  @tracked isOrganizationAdmin = this.user.isOrganizationAdmin;

  config = config;

  constructor() {
    super(...arguments);

    if (this.args.editMode && this.args.repo) {
      this.repository = this.args.repo;
      this.displayName = this.repository.displayName;
      this.url = this.repository.url;
      this.type = this.repository.type;
      this.username = this.repository.username;
      this.token = this.repository.token;
      this.svnRealm = this.repository.svnRealm;
      this.repositoryListenerToken = this.repository.listener_token;

      this.organizations.then((orgs) => {
        this.selectedOrganization = orgs.find(
          (org) => org.id === this.repository.ownerId
        );
      });
    }
  }

  get organizations() {
    return this.api.get('/v1/user/organizations_for_choice');
  }

  @action
  editRepository() {
    this.store
      .findRecord('organization', this.selectedOrganization.id)
      .then((org) => {
        this.repository.displayName = this.displayName;
        this.repository.url = this.url;
        this.repository.type = this.type;
        this.repository.username = this.username;
        this.repository.token = this.token;
        this.repository.svnRealm = this.svnRealm;
        this.repository.ownerId = this.selectedOrganization.id;
        this.repository.organization = org;
        this.repository.save().then(() => {
          this.flashes.success(`Repository "${this.repository.displayName}" has been successfully updated.`);
          this.router.transitionTo('repositories.index');
        }).catch((error) => {
          if (error) {
            this.flashes.error(`${error.split(/ (.+)/)[1]}`);
          } else {
            this.flashes.error(`Could not update Repository "${this.repository.displayName}".`);
          }
        });    
      });
  }

  @action
  addRepository() {
    this.name = this.displayName;
    this.store
      .findRecord('organization', this.selectedOrganization.id)
      .then((org) => {
        org
          .addRepository(
            this.name,
            this.url,
            this.type,
            this.username,
            this.token
          )
          .then(() => {
            this.flashes.success('Repository has been successfully added.');
            this.repositories.reload();
            this.router.transitionTo('repositories.index');
          })
          .catch((error) => {
            if (error) {
              this.flashes.error(`${error.split(/ (.+)/)[1]}`);
            } else {
              this.flashes.error('Could not add repository.');
            }
          });
      });
  }
}
