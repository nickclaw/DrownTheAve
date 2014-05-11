define([
    'backbone',
    'underscore',
    'text!template/item/special.html'
], function(Backbone, _, specialTemplate) {

    var SpecialItem = Backbone.View.extend({
        tagName: 'a',
        className: 'item pure-u-1-2 cell',
        template: _.template(specialTemplate),
        model: null,

        initialize: function(options) {
            this.listenTo(this.model, 'change', this.render);
            this.$el.attr('href', '/admin/special/' + this.model.get('id'));
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });

    return SpecialItem;
});
