(function() {
  var videoEntersFullscreen = function() {
    Fliplet.App.Orientation.unlock();
  };
  var videoExitsFullscreen = function() {
    Fliplet.App.Orientation.lock();
  };

  if (screenfull.enabled) {
    screenfull.onchange(function onFullScreenChange() {
      if (!screenfull.isFullscreen) {
        return videoExitsFullscreen();
      }
      videoEntersFullscreen();
    });
  }

  Fliplet.Widget.instance('video-offline', function(data) {
    var url = _.get(data, 'file.video.bundledFile.url') || _.get(data, 'file.video.selectFiles.url');
    var $container = $(this);
    var video = $container.find('video').get(0);

    if (!video) {
      return;
    }

    if (url && Fliplet.Media.isRemoteUrl(url)) {
      Fliplet().then(function() {
        $(video).attr('src', Fliplet.Media.authenticate(url));
      });
    }

    if (!screenfull.enabled) {
      // iOS likes to be different
      video.addEventListener('webkitbeginfullscreen', videoEntersFullscreen);
      video.addEventListener('webkitendfullscreen', videoExitsFullscreen);
    }
  });
})();
