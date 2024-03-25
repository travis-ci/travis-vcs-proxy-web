import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class UserAvatar extends Component {
  @tracked name = this.args.name;

  get userInitials() {
    let name = this.name;
    if (name) {
      let arr = name.split(' ');
      let initials = '';

      if (arr.length >= 2) {
        initials = arr[0].split('')[0] + arr[1].split('')[0];
      } else {
        initials = arr[0].split('')[0];
      }
      return initials;
    }
    return '';
  }
}
