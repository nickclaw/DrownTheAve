var koa = require('koa'),
    body = require('koa-body'),
    compress = require('koa-compress'),
    mount = require('koa-mount'),
    session = require('koa-session');

var app = module.exports = koa();
