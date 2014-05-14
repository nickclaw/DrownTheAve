require.config({
    paths: {
        text: '../lib/text',
        backbone: 'extension/backbone.extension',
        underscore: '../lib/underscore-min',
        jquery: '../lib/jquery-2.1.0.min',
    },

    shim: {
        jquery: {
            exports: 'jQuery'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        }
    }
});

require([
    'view/AdminApp',
    'model/User'
], function(App, User) {
    window.app = new App({
        el: document.body,
        user: new User(user)
    });
});