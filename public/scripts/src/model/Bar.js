define([
    'backbone',
    'underscore'
], function(Backbone, _){

    var BarModel = Backbone.Model.extend({
        url: '/admin/api/bar',
        defaults: {
            id: '',
            name: '',
            website: '',
            location: [-122.313212, 47.658882],
            hours: {
                "0": [],
                "1": [],
                "2": [],
                "3": [],
                "4": [],
                "5": [],
                "6": []
            }
        }
    });

    return BarModel;
})
