define([
    'backbone',
    'underscore',
    'view/admin/Index',
    'view/admin/SearchPage',
    'model/Search',
    'model/Bar',
    'model/Special',
    'model/User',
], function(Backbone, _, IndexPage, SearchPage, Search, Bar, Special, User) {

    var AdminRouter = Backbone.Router.extend({
        routes: {
            'browse/:type': 'search',

            'bar/add': 'newBar',
            'bar/:id': 'editBar',


            '*default': 'home'
        },

        initialize: function(app) {
            this.app = app;
        },

        search: function(type, url) {
            var Model = null;
            if (type === 'bar') {Model = Bar}
            else if (type === 'special') {Model = Special}
            else if (type === 'user') {Model = User}

            if (Model === null) {
                return;
            }

            this.app.addPage(url, new SearchPage({
                search: new Search([], {
                    model: Model
                })
            }))
        },

        home: function(url) {
            console.log('hi', url);
            this.app.addPage(url, new IndexPage());
        }
    });

    return AdminRouter;
});
