define([
    'backbone',
    'underscore',
    'view/admin/Index'
], function(Backbone, _, IndexPage) {

    var AdminRouter = Backbone.Router.extend({
        routes: {
            'admin/browse/:type': 'browse',

            'admin/bar/new': 'newBar',
            'admin/bar/:id': 'editBar',

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
            var app = this.app,
                type = typeMap[type];

            // lazy load the needed resources
            // TODO cleanly handle types we dont' know about
            require([
                'view/admin/SearchPage',
                'model/Search',
                type.model,
                type.view
            ], function(SearchPage, Search, Model, View) {
                app.addPage(url, new SearchPage({
                    search: new Search([], {
                        model: Model,
                    }),
                    view: View
                }));
            }, function() {
                this.error();
            });
        },


        /**
         * Renders a 404 error
         */
        error: function() {
            console.error('errorrrr');
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
    'bar': {model:'model/Bar', view: 'view/item/Bar'},
    'special': {model: 'model/Special', view: 'view/item/Special'},
    'user': {model: 'model/User', view: 'view/item/User'}
}
