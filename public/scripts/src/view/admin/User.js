define([
    'view/Page',
    'underscore',
    'text!template/user.html'
], function(Page, _, userTemplate) {

    var UserView = Page.extend({
        model: null,
        template: _.template(userTemplate),

        init: function(options) {
            this.model = options.model;
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.content.html(this.template(this.model.attributes));
            return this;
        }
    })

    return UserView;
});
