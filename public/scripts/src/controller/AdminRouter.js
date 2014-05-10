define([
    'backbone',
    'underscore',
    'view/admin/Index'
], function(Backbone, _, IndexPage) {

    var AdminRouter = Backbone.Router.extend({
        routes: {
            '*default': 'home'
        },

        initialize: function(app) {
            this.app = app;
        },

        home: function(url) {
            console.log('hi', url);
            this.app.addPage(url, new IndexPage());
        }
    });

    return AdminRouter;
});
