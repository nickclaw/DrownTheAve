define([
    'backbone',
    'underscore',
    'model/Search',
    'model/Bar',
    'model/Special',
    'model/User'
], function(Backbone, _, Search, Bar, Special, User) {

    var App = Backbone.View.extend({
        el: null,
        user: null,

        initialize: function(options) {
            this.user = options.user;

            Backbone.history.start({
                pushState: true
            });

            a = new Search([],{
                model: User
            });
        }
    });

    return App;
});
