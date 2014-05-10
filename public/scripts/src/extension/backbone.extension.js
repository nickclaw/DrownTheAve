define([
    '/static/scripts/lib/backbone-min.js',
    'underscore'
], function(Backbone, _) {

    // from Backbone
    var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'patch':  'PATCH',
        'delete': 'DELETE',
        'read':   'GET'
    };

    /**
     * Overwrite Backbone sync method to work with api better
     * @inheritdoc
     */
    Backbone.sync = function(method, model, options) {
        var type = methodMap[method];

        var params = {
            type: type,
            dataType: 'json',
            url: _.result(model, 'url')
        };

        if (method === 'read' || method === 'update' || method === 'delete') {
            params.url += '/' + model.get('id');
        }

        if (method === 'create' || method === 'update') {
            params.contentType = 'application/json';
            params.data = JSON.stringify(options.attrs || model.attributes);
        }


        var error = options.error;
        options.error = function(xhr, textStatus, errorThrown) {
            options.textStatus = textStatus;
            options.errorThrown = errorThrown;
            if (error) error.apply(this, arguments);
        }

        var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
        model.trigger('request', model, xhr, options);
        return xhr;
    }

    return Backbone;
});
