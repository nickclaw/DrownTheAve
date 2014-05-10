define([
    'backbone',
    'underscore'
], function(Backbone, _) {

    var ListView = Backbone.View.extend({
        collection: null,
        view: null,

        events: {
            'click .loader': 'getNext'
        },

        initialize: function(options) {
            this.collection = options.collection;
            this.view = options.view;

            this.listenTo(this.collection, 'add', this.addChildView);
            this.listenTo(this.collection, 'remove', this.removeChildView);
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'request', function() {
                this.loader.addClass('loading')
            });
            this.listenTo(this.collection, 'sync', function() {
                this.loader.removeClass('loading');
            });
            this.listenTo(this.collection, 'end', function() {
                this.loader.hide();
            });

            this.loader = Backbone.$('<div>', {
                class: 'cell pure-u-1-1 loader',
                text: 'load more?'
            });

            this.$el.append(this.loader);
        },

        addChildView: function(model) {
            this.loader.before(
                new this.view({model: model}).render().$el
            );
            return this;
        },

        removeChildView: function(model) {
            console.error('removeChildView - not implemented');
        },

        render: function(){
            this.clear();

            var view = this;
            this.collection.each(function(model) {
                view.addChildView(model);
            });

            return this;
        },

        clear: function() {
            this.$el
                .empty()
                .append(this.loader);

            return this;
        },

        getNext: function() {
            this.collection.next();
        }
    });

    return ListView;
});
