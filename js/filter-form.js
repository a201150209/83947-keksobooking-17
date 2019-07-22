'use strict';

(function () {
  var FilterStatus = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  };
  var RESET_FILTER_VALUE = 'any';
  var lastTimeout;
  var filtersWrapper = document.querySelector('.map__filters-container');
  var filteredAdsCache = [];
  var filters = [
    {
      element: filtersWrapper.querySelector('#housing-type'),
      active: false,
      filterAds: function (rule) {
        filteredAdsCache = filteredAdsCache.filter(function (ad) {
          return ad.offer.type === rule;
        });
      }
    },
    {
      element: filtersWrapper.querySelector('#housing-price'),
      active: false,
      filterAds: function (rule) {
        if (rule === 'low') {
          filteredAdsCache = filteredAdsCache.filter(function (ad) {
            return ad.offer.price < 10000;
          });
        } else if (rule === 'middle') {
          filteredAdsCache = filteredAdsCache.filter(function (ad) {
            return ad.offer.price >= 10000 && ad.offer.price <= 50000;
          });
        } else if (rule === 'high') {
          filteredAdsCache = filteredAdsCache.filter(function (ad) {
            return ad.offer.price > 50000;
          });
        }
      }
    },
    {
      element: filtersWrapper.querySelector('#housing-rooms'),
      active: false,
      filterAds: function (rule) {
        filteredAdsCache = filteredAdsCache.filter(function (ad) {
          return ad.offer.rooms === Number(rule);
        });
      }
    },
    {
      element: filtersWrapper.querySelector('#housing-guests'),
      active: false,
      filterAds: function (rule) {
        filteredAdsCache = filteredAdsCache.filter(function (ad) {
          return ad.offer.guests === Number(rule);
        });
      }
    },
    new FeatureFilter(filtersWrapper.querySelector('#filter-wifi')),
    new FeatureFilter(filtersWrapper.querySelector('#filter-dishwasher')),
    new FeatureFilter(filtersWrapper.querySelector('#filter-parking')),
    new FeatureFilter(filtersWrapper.querySelector('#filter-washer')),
    new FeatureFilter(filtersWrapper.querySelector('#filter-elevator')),
    new FeatureFilter(filtersWrapper.querySelector('#filter-conditioner'))
  ];
  var filterElements = filters.map(function (element) {
    return element.element;
  });

  function FeatureFilter(element) {
    this.element = element;
    this.active = false;
  }

  function onfilterWrapperChange(evt) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      filterAds(evt);
    }, 500);

  }

  function filterAds(evt) {
    evt.preventDefault();
    var currentFilter = evt.target;
    var isResetFilter = currentFilter.value === RESET_FILTER_VALUE || currentFilter.checked === false;
    filteredAdsCache = window.pins.adsCache.slice();

    for (var i = 0; i < filters.length; i++) {
      var isCurrentFilter = currentFilter === filters[i].element;
      if (isResetFilter && isCurrentFilter) {
        filters[i].active = false;
        break;
      } else if (isCurrentFilter) {
        filters[i].active = true;
        break;
      }
    }

    filters.forEach(function (filter) {
      if (filter.active) {
        filter.filterAds(filter.element.value);
      }
    });

    window.cards.removeActive();
    window.pins.hide();
    window.pins.show(filteredAdsCache);
  }

  function toggleFilters(status) {
    switch (status) {
      case FilterStatus.ACTIVE:
        window.utils.toggleStatusOfElements(filterElements, false);
        break;
      case FilterStatus.INACTIVE:
        window.utils.toggleStatusOfElements(filterElements, true);
        break;
    }
  }

  FeatureFilter.prototype.filterAds = function (rule) {
    filteredAdsCache = filteredAdsCache.filter(function (ad) {
      for (var i = 0; i < ad.offer.features.length; i++) {
        if (ad.offer.features[i] === rule) {
          break;
        }
      }
      return ad.offer.features[i];
    });
  };

  toggleFilters(FilterStatus.INACTIVE);
  filtersWrapper.addEventListener('change', onfilterWrapperChange, true);

  window.filterForm = {
    filterStatus: FilterStatus,
    toggleFilters: toggleFilters
  };
})();

