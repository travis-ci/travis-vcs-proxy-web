import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class OrganizationsUserController extends Controller {
  @tracked organization;
  @tracked user;
}
