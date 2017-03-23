var widgetId = Fliplet.Widget.getDefaultId();
var data = Fliplet.Widget.getData(widgetId) || {};
data.id = widgetId;

var providerInstance;
var $filePicker;
var btnSelector = {
  video: '.add-video'
};
var file = data.file || {
  'video': {
      selectFiles: {},
      selectMultiple: false,
      type: 'video'
  }
};

// 1. Fired from Fliplet Studio when the external save button is clicked
Fliplet.Widget.onSaveRequest(function () {
  if (providerInstance) {
    return providerInstance.forwardSaveRequest();
  }

  save(true);
});

function save(notifyComplete) {
  Fliplet.Widget.save(data).then(function() {
    if (notifyComplete) {
      Fliplet.Widget.complete();
    } else {
      Fliplet.Studio.emit('reload-widget-instance', widgetId);
    }
  }, function(error) {
    console.log(error);
  });
}

function beginAnimationFilePicker() {
  Fliplet.Studio.emit('widget-save-label-update', {  text : 'Select'   });
  Fliplet.Widget.toggleCancelButton(false);
  var animProgress = 100;
  var animInterval;
  $filePicker = $('.fl-widget-provider');

  $filePicker.show();

  animInterval = setInterval(function () {
    animProgress -= 2;
    $filePicker.css({left: animProgress + '%'});
    if (animProgress == 0) {
      clearInterval(animInterval);
    }
  }, 5);
}

$('.add-video').on('click', function (e) {
  e.preventDefault();

  var _this = $(this);
  var config = file.video;

  Fliplet.Widget.toggleSaveButton(config.selectFiles.length > 0);
  providerInstance = Fliplet.Widget.open('com.fliplet.file-picker', {
    data: config,
    onEvent: function (e, data) {
      switch (e) {
        case 'widget-rendered':
          beginAnimationFilePicker();
          break;
        case 'widget-set-info':
          Fliplet.Widget.toggleSaveButton(!!data.length);
          var msg = data.length ? data.length + ' files selected' : 'no selected files';
          Fliplet.Widget.info(msg);
          break;
        default:
          break;
      }
    }
  });

  providerInstance.then(function(providerData) {
    Fliplet.Studio.emit('widget-save-label-update', {  text : 'Save & Close'   });
    Fliplet.Widget.info('');
    Fliplet.Widget.toggleCancelButton(true);
    Fliplet.Widget.toggleSaveButton(true);
    file.video.selectFiles = providerData.data.length === 1 ? providerData.data[0] : providerData.data;
    data.file = file;
    providerInstance = null;
    save();
    $('.video .add-video').text('Replace video');
    $('.video .info-holder').removeClass('hidden');
    $('.video .file-title span').text(file.video.selectFiles.name);
  });
});

$('.video-remove').on('click', function() {
  delete data.file;
  $('.video .add-video').text('Browse your media library');
  $('.video .info-holder').addClass('hidden');
  $('.video .file-title span').text('');
});

window.addEventListener('message', function (event) {
  if (event.data === 'cancel-button-pressed'){
    if (!providerInstance) return;
    providerInstance.close();
    providerInstance = null;
    Fliplet.Studio.emit('widget-save-label-update', {  text : 'Save & Close'   });
    Fliplet.Widget.toggleCancelButton(true);
    Fliplet.Widget.toggleSaveButton(true);
    Fliplet.Widget.info('');
  }
});
