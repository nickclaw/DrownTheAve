define([
    'backbone',
    'underscore'
], function(Backbone, _) {

    var SpecialModel = Backbone.Model.extend({
        url: '/admin/special',
        defaults: {
            id: "",
            bar: null,
            start: 0,
            end: 0,
            deal: "",
            dates: []
        }
    });

    return SpecialModel;
});
