define([
    'backbone',
    'underscore'
], function(Backbone, _) {

    var SpecialModel = Backbone.Model.extend({
        url: '/admin/api/special',
        defaults: {
            id: "",
            bar: null,
            barName: null,
            deal: "",
            dates: []
        }
    });

    return SpecialModel;
});
