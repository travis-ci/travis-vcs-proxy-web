import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class OauthAuthorize extends Component {
  @service auth;
  @service api;
  @service flashes;

  @tracked user = this.auth.currentUser;
  @tracked isLoading = false;

  constructor() {
    super(...arguments);
    this.isLoading = true;
    const self = this;
    let oauthFound = false;
    console.log("AUTH");
    this.auth.currentUser.getAuthorizedApps().then((data) => {
      console.log("GET AUTH");
      console.log(data);
      for (const app of data) {
        console.log("APP");
        console.log(app);
        console.log(app.uid);
        console.log(self.args.clientId);
        if (app.uid === self.args.clientId) {
          oauthFound = true;
          console.log("AUTHORIZEUSER");
          this.auth.currentUser
            .authorizeOauth(
              self.args.clientId,
              self.args.responseType,
              self.args.state,
              self.args.redirectUri
            )
            .then((data) => {
              console.log("REDIR1");
              console.log(data);
              if (data.hasOwnProperty('status') && data.status === 'redirect') {
                console.log("REDIR2");
                window.location.href = data.redirect_uri;
              }
            })
            .catch((error) => {
              this.flashes.error(error);
            });

          break;
        }
      }
      if (!oauthFound) {
        this.isLoading = false;
      }
    });
  }

  @action
  authorize() {
    this.user
      .authorizeOauth(
        this.args.clientId,
        this.args.responseType,
        this.args.state,
        this.args.redirectUri
      )
      .then((data) => {
        if (data.hasOwnProperty('status') && data.status === 'redirect') {
          window.location.href = data.redirect_uri;
        }
      })
      .catch((error) => {
        this.flashes.error(error);
      });
  }
}
