define([
    'view/Page',
    'underscore',
    'text!template/user.html',
    'view/ImageUpload'
], function(Page, _, userTemplate, ImageUploadView) {

    var UserView = Page.extend({
        model: null,
        template: _.template(userTemplate),

        init: function(options) {
            this.model = options.model;
            this.listenTo(this.model, 'change', this.render);
            this.picture = new ImageUploadView({
                options:{
                    width: 300,
                    height: 300,
                    scale: 2
                }
            });
        },

        render: function() {
            this.content.html(this.template(this.model.attributes));
            this.assign(this.picture, '.image-container');
            return this;
        }
    })

    return UserView;
});
