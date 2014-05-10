define([
    'backbone',
    'underscore',
    'text!template/page.html'
], function(Backbone, _, pageTemplate) {

    var template = _.template(pageTemplate);

    var PageView = Backbone.View.extend({
        initialize: function() {
            this.$el
                .addClass('page')
                .html(template());
            this.content = this.$('.content');

            this.init.apply(this, arguments);
        },

        init: function(){}

    });

    return PageView;
});
