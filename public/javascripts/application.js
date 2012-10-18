var Tunes = Tunes || {};

Tunes.Album = Backbone.Model.extend({});

Tunes.Albums = Backbone.Collection.extend({
    model: Tunes.Album,
    url: '/albums',
});

Tunes.AlbumView = Backbone.View.extend({

    tagName: 'li',
    className: 'album',

    initialize: function() {
        _.bindAll(this, 'render');
        this.model.on('change', this.render);
        this.template = _.template($('#album-template').html());
    },

    render: function() {
        var renderedContent = this.template(this.model.toJSON());
        $(this.el).html(renderedContent)
        return this;
    }

});

Tunes.LibraryAlbumView = Tunes.AlbumView.extend({});

Tunes.LibraryView = Backbone.View.extend({
    tagName: 'extend',
    className: 'library',

    initialize: function() {
        _.bindAll(this, 'render');
        this.collection.on('reset', this.render);
        this.template = _.template($('#library-template').html())
    },

    render: function() {
        var albums, collection = this.collection;
        $(this.el).html(this.template({}));
        albums = this.$('.albums');
        collection.each(function(album) {
            view = new Tunes.LibraryAlbumView({model: album});
            albums.append(view.render().el());
        };
        return this;

    },


});
