if (screenfull.enabled) {
  screenfull.onchange(function onFullScreenChange () {
    if (!screenfull.isFullscreen) {
      return Fliplet.App.Orientation.lock();
    }
    Fliplet.App.Orientation.unlock();
  });
}

$('[data-video-online-id] video').each(function(){
  var video = this;

  if (!screenfull.enabled) {
    // iOS likes to be different
    video.addEventListener('webkitbeginfullscreen', Fliplet.App.Orientation.unlock);
    video.addEventListener('webkitendfullscreen', Fliplet.App.Orientation.lock);
  }
});
