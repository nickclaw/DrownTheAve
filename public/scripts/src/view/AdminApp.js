define([
    'backbone',
    'underscore',
    'controller/AdminRouter',
    'view/admin/Nav'
], function(Backbone, _, AdminRouter, NavView) {

    var App = Backbone.View.extend({
        el: null,
        user: null,

        events: {
            'click a:not(.external)' : 'route'
        },

        initialize: function(options) {
            this.user = options.user;

            this.nav = new NavView({
                user: this.user,
                el: this.$el.find('#nav')
            }).render();

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
            this.$("#pages").html(page.render().$el);
        },

        route: function(evt) {
            evt.preventDefault();
            var href = evt.currentTarget.getAttribute('href');

            Backbone.history.navigate(href, {
                trigger: true,
                replace: false
            });
        }
    });

    return App;
});
