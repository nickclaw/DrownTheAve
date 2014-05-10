define([
    'view/Page',
    'underscore',
    'view/List',
    'text!template/search.html'
], function(Page, _, ListView, searchTemplate) {

    var SearchPage = Page.extend({
        template: _.template(searchTemplate),

        init: function(options) {
            this.list = new ListView({
                view: options.view,
                collection: options.search
            });

            this.list.render();
        },

        render: function() {
            this.content.html(
                this.list.$el
            );
            return this;
        }
    })

    return SearchPage;
});
