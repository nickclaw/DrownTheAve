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
            options = _.defaults({}, options, {
                url: this.model.prototype.url + 's',
                parse: true,
                data: _.defaults({}, options.data, this.options)
            });

            var success = options.success,
                error = options.error,
                collection = this;

            options.success = function(resp) {
                var method = options.reset ? 'reset' : 'set';
                collection[method](resp, options);
                if (success) success(collection, resp, options);
                collection.trigger('sync', collection, resp, options);
            }

            options.error = function(resp) {
                if (error) error(model, resp, options);
                model.trigger('error', model, resp, options);
            };

            return this.sync('read', this, options);
        },

        next: function(options) {
            options = _.defaults({}, options, {
                reset: false,
                data: {
                    limit: this.options.limit,
                    offset: this.models.length
                }
            });

            return this.fetch(options);
        }
    });

    return SearchCollection;
});
