define([
    'backbone',
    'underscore'
], function(Backbone, _) {

    var UserModel = Backbone.Model.extend({
        url: '/admin/api/user',
        defaults: {
            id: "",
            isAdmin: false,
            twitter: false,
            google: false,
            facebook: false,

            local: {username: ""}

            profile: {
                firstName: "",
                lastName: "",
                picture: "",
                email: "",
                new: true
            }
            location: [-122.313212, 47.658882]
        },
    });

    return UserModel;
});
