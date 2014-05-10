define([
    'view/Page',
    'underscore',
    'text!template/search.html'
], function(Page, _, searchTemplate) {

    var SearchPage = Page.extend({
        search: null,
        template: _.template(searchTemplate),

        init: function(options) {
            this.search = options.search;
        },

        render: function() {
            return this;
        }
    })

    return SearchPage;
});
