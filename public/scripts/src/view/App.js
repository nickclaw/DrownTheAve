define([
    'backbone',
    'underscore'
], function(Backbone, _) {

    var App = Backbone.View.extend({

        initialize: function(options) {

            Backbone.history.start({
                pushState: true
            });
        }
    });

    return App;
});
