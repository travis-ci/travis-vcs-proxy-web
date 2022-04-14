import TravisRoute from 'travis/routes/basic';

export default class IndexRoute extends TravisRoute {
  renderTemplate(...args) {
    super.renderTemplate(args);
    this.render('repositories/index', {into: 'index', controller: 'repositories/index'});
  }
}
