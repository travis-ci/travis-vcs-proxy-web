import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  classNames: ['avatar-wrapper'],

  userInitials: computed('name', function () {
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
  })
});
