define([
    'backbone',
    'underscore',
    'model/Search',
    'model/Bar',
    'model/Special'
], function(Backbone, _, Search, Bar, Special) {

    var App = Backbone.View.extend({

        initialize: function(options) {

            Backbone.history.start({
                pushState: true
            });

            a = new Search([],{
                model: Special
            });
        }
    });

    return App;
});
