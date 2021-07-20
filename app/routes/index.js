import TravisRoute from 'travis/routes/basic';

export default class IndexRoute extends TravisRoute {
  renderTemplate(...args) {
    super.renderTemplate(args);
    this.render('servers/index', {into: 'index', controller: 'servers/index'});
  }
}
