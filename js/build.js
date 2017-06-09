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

  $('[data-video-online-id] video').each(function() {
    if (!screenfull.enabled) {
      // iOS likes to be different
      this.addEventListener('webkitbeginfullscreen', videoEntersFullscreen);
      this.addEventListener('webkitendfullscreen', videoExitsFullscreen);
    }
  });
})();
