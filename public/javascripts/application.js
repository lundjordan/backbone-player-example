var Tunes = Tunes || {};

Tunes.Album = Backbone.Model.extend({

    isFirstTrack: function(index) {
        return (index == 0);
    },

    isLastTrack: function(index) {
        return (index == (this.models.length -1));
    },

    trackUrlAtIndex: function(index) {
        if (this.get('tracks').length >= index) {
            return this.get('tracks')[index].url;
        }
        return null;
    };

});

Tunes.Albums = Backbone.Collection.extend({
    model: Tunes.Album,
    url: '/albums',
});

Tunes.Playlist = Tunes.Albums.extend({

    isFirstAlbum: function(index) {
        return (index == 0);
    },

    isLastAlbum: function(index) {
        return (index == (this.models.length -1));
    },

});

Tunes.Player = Backbone.Model.extend({

    defaults: {
        'currentAlbumIndex': 0,
        'currentTrackIndex': 0,
        'state': 'stop'
    },

    initialize: function() {
        this.playlist = new Tunes.Playlist();
    },

    reset: function() {
        this.set({
            'currentAlbumIndex': 0,
            'currentTrackIndex': 0,
            'state': 'stop'
        });
    },

    play: function() {
        this.set({'state': 'play'});
    },

    pause: function() {
        this.set({'state': 'stop'});
    },

    isPlaying: function() {
        return (this.get('state') == 'play');
    },

    isStopped: function() {
        return (!this.isPlaying());
    },

    currentAlbum: function() {
        return this.playlist.at(this.get('currentAlbumIndex'));
    },

    currentTrackUrl: function() {
        album = this.currentAlbum();
        if (album) {
            return album.trackUrlAtIndex(this.get('currenttrackIndex'));
        else {
            return null;
        }
    },

    nextTrack: function() {
        var currentAlbumIndex = this.get('currentAlbumIndex');
        var currentTrackIndex = this.get('currentTrackIndex');
        if (this.currentAlbum().isLastTrack(currentTrackIndex)) {
            if (this.playlist.isLastAlbum(currentAlbumIndex)) {
                this.set('currentAlbumIndex: 0, 'currentTrackIndex': 0);
            else {
                this.set('currentTrackIndex': 0);
            }
        }
        else {
            this.set('currentTrackIndex': currentTrackIndex + 1);
        }
    };

    prevTrack: function() {
        if (this.currentAlbum().isFirstTrack(currentTrackIndex)) {
            if (this.playlist.isFirstAlbum(currentAlbumIndex)) {
                this.set({'currentAlbumIndex': this.playlist.models.length -1,
                    'currentTrackIndex': this.playlist.at(this.get('currentAlbumIndex').get('tracks').length -1})
           }
    };
});



Tunes.library = new Tunes.Albums();

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

Tunes.LibraryAlbumView = Tunes.AlbumView.extend({

    events: {
        'click .queue.add': 'select'
    },

    select: function() {
        this.model.collection.trigger('select', this.model);
    },


});

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
            albums.append(view.render().el);
        });
        return this;

    },

});

Tunes.Router = Backbone.Router.extend({

    routes: {
        '': 'home',
        'blank': 'blank',
    },

    initialize: function() {
        this.libraryView = new Tunes.LibraryView({
            collection: Tunes.library
        });
    },

    home: function() {
        container = $('#container');
        container.empty();
        container.append(this.libraryView.render().el);
    },

    blank: function() {
        container = $('#container');
        container.empty();
        container.text('blank');
    },

});

$(function() {
    Tunes.library.fetch();
    Tunes.router = new Tunes.Router();
    Backbone.history.start();
});


