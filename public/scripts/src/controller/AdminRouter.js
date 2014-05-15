define([
    'backbone',
    'underscore',
    'view/admin/Index'
], function(Backbone, _, IndexPage) {

    var AdminRouter = Backbone.Router.extend({
        routes: {
            'admin/browse/:type': 'browse',

            'admin/:type/new': 'new',
            'admin/:type/:id': 'edit',

            'admin/': 'home',
            'admin': 'home',
            '*default': 'error'
        },

        initialize: function(app) {
            this.app = app;
        },

        /**
         * Lets users browse models on the server
         */
        browse: function(type, url) {
            var router = this,
                type = typeMap[type];

            // lazy load the needed resources
            // TODO cleanly handle types we dont' know about
            require([
                'view/admin/SearchPage',
                'model/Search',
                type.model,
                type.itemView
            ], function(SearchPage, Search, Model, View) {
                router.app.addPage(url, new SearchPage({
                    search: new Search([], {
                        model: Model,
                    }),
                    view: View
                }));
            }, function() {
                router.error(url);
            });
        },

        new: function(type, url) {
            type = typeMap[type];
            if (!type) return this.error();

            var router = this;
            require([
                type.page,
                type.model
            ], function(Page, Model) {
                router.app.addPage(url, new Page({
                    model: new Model()
                }));
            }, function() {
                router.error(url);
            });
        },

        edit: function(type, id, url) {
            type = typeMap[type];
            if (!type) return this.error();

            var router = this;
            require([
                type.page,
                type.model
            ], function(Page, Model) {
                var model = new Model({
                    id: id
                });

                router.app.addPage(url, new Page({
                    model: model
                }));

                model.fetch();
            }, function() {
                console.error(arguments);
                router.error(url);
            });
        },

        /**
         * Renders a 404 error
         */
        error: function(url) {
            var router = this;
            require([
                'view/Error'
            ], function(ErrorPage) {
                router.app.addPage(url, new ErrorPage());
            }); //no errorback because that means everything has failed...
        },

        /**
         * Index page
         */
        home: function(url) {
            console.log('hi', url);
            this.app.addPage(url, new IndexPage());
        }
    });

    return AdminRouter;
});

var typeMap = {
    'bar': {model:'model/Bar', itemView: 'view/item/Bar', page: 'view/admin/Bar'},
    'special': {model: 'model/Special', itemView: 'view/item/Special', page: 'view/admin/Special'},
    'user': {model: 'model/User', itemView: 'view/item/User', page: 'view/admin/User'}
}
