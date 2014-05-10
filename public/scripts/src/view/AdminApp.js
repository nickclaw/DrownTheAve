define([
    'backbone',
    'underscore',
    'controller/AdminRouter'
], function(Backbone, _, AdminRouter) {

    var App = Backbone.View.extend({
        el: null,
        user: null,

        events: {
            'click a:not(.external)' : 'route'
        },

        initialize: function(options) {
            this.user = options.user;

            new AdminRouter(this);

            Backbone.history.start({
                pushState: true,
                root: '/'
            });
        },

        addPage: function(url, title, page) {
            if (page === undefined) {
                page = title;
                title = "Drown The Ave";
            }
            a = page;
            this.$("#pages").html(page.render().$el);
        },

        route: function(evt) {
            evt.preventDefault();
            var href = evt.target.getAttribute('href');

            Backbone.history.navigate(href, {
                trigger: true,
                replace: false
            });
        }
    });

    return App;
});
