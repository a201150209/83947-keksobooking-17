'use strict';

(function () {
  var Image = {
    WIDTH: 40,
    HEIGHT: 44,
    CLASS: 'preview-image',
    Avatar: {
      PARENT_CLASS: 'ad-form-header__preview',
      DEFAULT_SRC: 'img/muffin-grey.svg'
    },
    Index: {
      START: 0,
      INCREASE: 1
    },
    TYPES: ['gif', 'jpg', 'jpeg', 'png']
  };

  function uploadImages(field, previewWrapper, maxQuantity) {
    var maxIndex = --maxQuantity;
    var file = field.files[0];
    var fileName = file.name.toLowerCase();
    var matches = Image.TYPES.some(function (item) {
      return fileName.endsWith(item);
    });

    if (matches) {
      var reader = new FileReader();
      increaseImagesCounter(field);

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
                previewImage.classList.add(Image.CLASS);
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


  function increaseImagesCounter(field) {
    var isUploadedImage = window.uploadingImages.index.field === field.id;
    if (!isUploadedImage) {
      window.uploadingImages.index.field = field.id;
      window.uploadingImages.index[field.id] = Image.Index.START;
    } else {
      window.uploadingImages.index[field.id] += Image.Index.INCREASE;
    }
  }

  function renderPreviewImage(src, previewWrapper) {
    var previewImage = document.createElement('img');
    previewImage.classList.add(Image.CLASS);
    previewImage.src = src;
    previewImage.width = Image.WIDTH;
    previewImage.height = Image.HEIGHT;
    previewWrapper.appendChild(previewImage);
  }

  function removePreviewImages() {
    var previewImages = Array.from(window.page.adForm.querySelectorAll('.' + Image.CLASS));
    var avatarPreviewParent = window.page.adForm.querySelector('.' + Image.Avatar.PARENT_CLASS);
    previewImages.forEach(function (item) {
      if (item.parentElement === avatarPreviewParent) {
        item.src = Image.Avatar.DEFAULT_SRC;
      } else {
        item.remove();
      }
    });
  }

  window.uploadingImages = {
    upload: uploadImages,
    removePreview: removePreviewImages,
    index: {}
  };
})();
