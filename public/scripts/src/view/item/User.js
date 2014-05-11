define([
    'backbone',
    'underscore',
    'text!template/item/user.html'
], function(Backbone, _, barTemplate) {

    var UserItem = Backbone.View.extend({
        tagName: 'a',
        className: 'item pure-u-1-2 cell',
        template: _.template(barTemplate),
        model: null,

        initialize: function(options) {
            this.listenTo(this.model, 'change', this.render);
            this.$el.attr('href', '/admin/user/' + this.model.get('id'));
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });

    return UserItem;
});
