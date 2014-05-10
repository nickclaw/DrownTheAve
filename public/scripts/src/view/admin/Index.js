define([
    'view/Page',
    'underscore',
    'text!template/index.html'
], function(Page, _, indexTemplate) {

    var IndexPage = Page.extend({
        template: _.template(indexTemplate),

        init: function(options) {

        },

        render: function() {
            this.content.html(this.template());
            return this;
        }
    });

    return IndexPage;
})
