define([
    'backbone',
    'underscore'
], function(Backbone, _) {

    var ImageUploadView = Backbone.View.extend({
        value: "",
        image: null,

        _grabbing: false,
        _x: null,
        _y: null,

        options: {
            // how the image is rendered
            xOff: 0,
            yOff: 0,
            imgScale: 1, // scale of image inside canvas

            // size of canvas
            width: 100,
            height: 100,
            scale: 1    // scale of output image to visible canvas size
        },

        tagName: 'div',
        className: 'image-upload',
        canvas: null,
        ctx: null,

        events: {
            'dragover canvas': function(evt){evt.preventDefault();},
            'drop canvas': 'upload',
            'mousedown canvas': 'grabbed',
            'mouseup canvas': 'released',
            'mouseleave canvas': 'released',
            'mousemove canvas': 'dragged',
        },

        initialize: function(options) {
            options = _.clone(options) || {};
            this.value = options.value || this.value;
            this.options = _.extend(this.options, options.options || {});

            // create and size canvas
            this.canvas = document.createElement('canvas');
            $(this.canvas)
                .attr({
                    width: this.options.width * this.options.scale,
                    height: this.options.height * this.options.scale
                })
                .css({
                    width: this.options.width,
                    height: this.options.height
                });
            this.ctx = this.canvas.getContext('2d');

            if (this.value) {
                this.loadDataURL(this.value);
            }
        },

        upload: function(evt) {
            evt.preventDefault();

            var file = evt.originalEvent.dataTransfer.files[0],
                reader = new FileReader(),
                self = this;

            if (!file || file.type.indexOf('image') < 0) return false;

            reader.addEventListener('load', function() {
                self.loadDataURL(reader.result);
            });

            reader.readAsDataURL(file);
        },

        loadDataURL: function(url) {
            var self = this,
                img = new Image();

            img.addEventListener('load', function() {
                self.image = img;
                self.xOff = 0;
                self.yOff = 0;
                self.imgScale = 1;
                self.render();
            });
            img.src = url;
        },

        grabbed: function(evt) {
            this._grabbing = true;
            this._x = evt.pageX;
            this._y = evt.pageY;
            this.$el.addClass('grabbing');
        },

        released: function(evt) {
            this._grabbing = false;
            this._x = null;
            this._y = null;
            this.$el.removeClass('grabbing');
        },

        dragged: function(evt) {
            var _x = evt.pageX,
                _y = evt.pageY;

            if (this._grabbing) {
                // TODO take into account scaling and smaller images
                var dx = _x - this._x,
                    dy = _y - this._y,
                    minX = this.canvas.width - this.image.naturalWidth,
                    maxX = 0,
                    minY = this.canvas.height - this.image.naturalHeight,
                    maxY = 0;

                this.options.xOff = Math.max(Math.min(this.options.xOff + dx, maxX), minX);
                this.options.yOff = Math.max(Math.min(this.options.yOff + dy, maxY), minY);

                this.render();

                this._x = _x;
                this._y = _y;
            }
        },

        render: function() {
            // add canvas to DOM
            this.$el
                .css({
                    width: this.options.width,
                    height: this.options.height,
                })
                .html(this.canvas);

            a = this.image;
            b = this.ctx;
            c = this.options;

            // render image if it exists
            this.image && this.ctx.drawImage(
                this.image,
                this.options.xOff,
                this.options.yOff,
                this.image.naturalWidth * this.options.imgScale,
                this.image.naturalHeight * this.options.imgScale
            );

            return this;
        }
    });

    return ImageUploadView;
})
