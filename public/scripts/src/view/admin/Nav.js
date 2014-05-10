define([
    'backbone',
    'underscore',
    'text!template/nav.html'
], function(Backbone, _, navTemplate) {

    var NavView = Backbone.View.extend({
        user: null,
        template: _.template(navTemplate),

        initialize: function(options) {
            this.user = options.user;
        },

        render: function() {
            this.$el.html(this.template(this.user.attributes));
            return this;
        }
    });

    return NavView;
})
