define([
    'backbone',
    'underscore'
], function(Backbone, _) {

    var UserModel = Backbone.Model.extend({
        url: '/admin/user',
        defaults: {
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            new: true,
            location: [-122.313212, 47.658882]
        },
    });

    return UserModel;
});
