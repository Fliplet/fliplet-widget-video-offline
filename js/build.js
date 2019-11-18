(function() {
  var videoEntersFullscreen = function() {
    Fliplet.App.Orientation.unlock();
  }
  var videoExitsFullscreen = function() {
    Fliplet.App.Orientation.lock();
  }

  if (screenfull.enabled) {
    screenfull.onchange(function onFullScreenChange() {
      if (!screenfull.isFullscreen) {
        return videoExitsFullscreen();
      }
      videoEntersFullscreen();
    });
  }

  Fliplet.Widget.instance('video-online', function (data) {
    var url = _.get(data, 'file.video.bundledFile.url');

    if (url) {
      var $video = $('[data-video-online-id="' + data.id + '"] video');
      $video.attr('url', Fliplet.Media.authenticate(url));
    }

    if (!screenfull.enabled) {
      // iOS likes to be different
      this.addEventListener('webkitbeginfullscreen', videoEntersFullscreen);
      this.addEventListener('webkitendfullscreen', videoExitsFullscreen);
    }
  });
})();
