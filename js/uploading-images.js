'use strict';

(function () {

  var Image = {
    WIDTH: 40,
    HEIGHT: 44,
    INDEX: {
      START: 0,
      INCREASE: 1
    },
    TYPES: ['gif', 'jpg', 'jpeg', 'png']
  };

  function uploadImages(field, previewWrapper, maxIndex) {
    var file = field.files[0];
    var fileName = file.name.toLowerCase();
    var matches = Image.TYPES.some(function (item) {
      return fileName.endsWith(item);
    });

    if (matches) {
      var isUploadedImage = window.uploadingImages.index.field === field.id;
      if (!isUploadedImage) {
        window.uploadingImages.index.field = field.id;
        window.uploadingImages.index[field.id] = Image.INDEX.START;
      } else {
        window.uploadingImages.index[field.id] += Image.INDEX.INCREASE;
      }

      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var currentIndex = window.uploadingImages.index[field.id];
        var isNotMaxIndex = currentIndex <= maxIndex;
        var previewImages = Array.from(previewWrapper.querySelectorAll('img'));
        if (isNotMaxIndex) {
          if (previewImages.length > 0) {
            for (var i = currentIndex; i <= maxIndex; i++) {
              var previewImage = previewImages[i];
              if (previewImage && i === maxIndex) {
                previewImage.src = reader.result;
              } else if (!previewImage && i <= maxIndex) {
                renderPreviewImage(reader.result, previewWrapper);
                break;
              }
            }
            if (currentIndex === maxIndex) {
              field.disabled = true;
            }
          } else {
            renderPreviewImage(reader.result, previewWrapper);
          }
        }

      });
      reader.addEventListener('error', function () {
        window.popup.showError('Не удалось загрузить файл. Попробуйте еще раз или выберите другой файл.');
      });
      reader.readAsDataURL(file);
    }
  }

  function renderPreviewImage(reader, previewWrapper) {
    var previewImage = document.createElement('img');
    previewImage.src = reader.result;
    previewImage.width = Image.WIDTH;
    previewImage.height = Image.HEIGHT;
    previewWrapper.appendChild(previewImage);
  }

  window.uploadingImages = {
    upload: uploadImages,
    index: {}
  };
})();
