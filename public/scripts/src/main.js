require.config({
    paths: {
        backbone: '../lib/backbone-min',
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
    'view/app'
], function(App) {
    window.app = new App({
        el: document.body
    });
});
