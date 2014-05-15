define([
    'view/Page',
    'underscore',
    'text!template/user.html',
    'view/ImageUpload'
], function(Page, _, userTemplate, ImageUploadView) {

    var UserView = Page.extend({
        model: null,
        template: _.template(userTemplate),

        events: {
            'submit form': 'submit',
            'reset form': 'reset'
        },

        init: function(options) {
            this.model = options.model;
            this.listenTo(this.model, 'change', this.render);
            this.picture = new ImageUploadView({
                value: this.model.get('profile').picture,
                options:{
                    width: 300,
                    height: 300,
                    scale: 1
                }
            });

             a= this;
        },

        /**
         * Converts DOM rep to something model can work with
         * @return {Object}
         */
        updateModel: function() {
            var data = this.$('form').serializeArray().reduce(function(prev, curr) {
                prev[curr.name] = curr.value;
                return prev;
            }, {});

            return {
                profile: {
                    firstName: data.first,
                    lastName: data.last,
                    phone: data.phone,
                    email: data.email,
                    picture: this.picture.value,
                    new: !!data.new
                },
                isAdmin: !!data.admin
            }
        },

        submit: function(evt) {
            evt.preventDefault();

            var data = this.updateModel();
            if (!this.model.set(this.model.parse(data))) return false;

            this.model.save();

            console.log('submit');
        },

        reset: function(evt) {
            evt.preventDefault();
            console.log('reset');
            this.picture.image = new Image();
            this.render();
        },

        render: function() {
            this.content.html(this.template(this.model.attributes));
            this.assign(this.picture, '.image-upload');
            return this;
        }
    })

    return UserView;
});
