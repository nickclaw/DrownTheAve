define([
    'backbone',
    'underscore'
], function(Backbone, _){

    var SearchCollection = Backbone.Collection.extend({
        model: null,

        options: {
            offset: 0,
            limit: 20,
            sort: '_id',
            order: 'asc'
        },

        initialize: function(options){
            _.defaults(this.options, options.options);
        },

        fetch: function(options){
            options = options ? _.clone(options) : {};
            var success = options.success,
                collection = this;

            options.url = this.model.prototype.url + 's';
            options.data = _.defaults({}, options.data, this.options);

            options.success = function(resp) {
                var method = options.reset ? 'reset' : 'set';
                collection[method](resp, options);
                if (success) success(collection, resp, options);
                collection.trigger('sync', collection, resp, options);
            }

            return this.sync('read', this, options);
        },

        next: function() {
            return this.fetch({
                reset: false,
                options: {offset: this.models.length}
            });
        }
    });

    return SearchCollection;
});
