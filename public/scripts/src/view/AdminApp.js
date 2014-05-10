define([
    'backbone',
    'underscore',
    'controller/AdminRouter'
], function(Backbone, _, AdminRouter) {

    var App = Backbone.View.extend({
        el: null,
        user: null,

        initialize: function(options) {
            this.user = options.user;

            new AdminRouter(this);

            Backbone.history.start({
                pushState: true
            });
        },

        addPage: function(url, title, page) {
            if (page === undefined) {
                page = title;
                title = "Drown The Ave";
            }
            a = page;
            this.$("#pages").html(page.render().$el);
        }
    });

    return App;
});
