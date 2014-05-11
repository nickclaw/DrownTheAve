define([
    'view/Page',
    'underscore',
    'text!template/error.html'
], function(Page, _, errorTemplate) {

    var ErrorPage = Page.extend({
        template: _.template(errorTemplate),

        render: function() {
            this.content.html(this.template());
            return this;
        }
    });

    return ErrorPage;
});
