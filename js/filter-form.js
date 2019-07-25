'use strict';

(function () {
  var RESET_FILTER_VALUE = 'any';
  var FILTER_TIMEOUT = 500;
  var PriceBorder = {
    BOTTOM: 10000,
    TOP: 50000
  };
  var FilterStatus = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  };
  var filtersWrapper = document.querySelector('.map__filters-container');
  var filteredAdsCache = [];
  var filters = [
    {
      element: filtersWrapper.querySelector('#housing-type'),
      active: false,
      filterAds: function (rule) {
        filteredAdsCache = filteredAdsCache.filter(function (item) {
          return item.offer.type === rule;
        });
      }
    },
    {
      element: filtersWrapper.querySelector('#housing-price'),
      active: false,
      filterAds: function (rule) {
        filteredAdsCache = filteredAdsCache.filter(function (item) {
          return matchPrice(rule, item.offer.price);
        });
      }
    },
    {
      element: filtersWrapper.querySelector('#housing-rooms'),
      active: false,
      filterAds: function (rule) {
        filteredAdsCache = filteredAdsCache.filter(function (item) {
          return item.offer.rooms === Number(rule);
        });
      }
    },
    {
      element: filtersWrapper.querySelector('#housing-guests'),
      active: false,
      filterAds: function (rule) {
        filteredAdsCache = filteredAdsCache.filter(function (item) {
          return item.offer.guests === Number(rule);
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
  var filterElements = filters.map(function (item) {
    return item.element;
  });
  var lastTimeout;

  function onfilterWrapperChange(evt) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      filterAds(evt);
    }, FILTER_TIMEOUT);
  }

  function matchPrice(rule, price) {
    var ruleToPrice = {
      'low': price < PriceBorder.BOTTOM,
      'middle': price >= PriceBorder.BOTTOM && price <= PriceBorder.TOP,
      'high': price > PriceBorder.TOP
    };
    return ruleToPrice[rule];
  }

  function FeatureFilter(element) {
    this.element = element;
    this.active = false;
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

    filters.forEach(function (item) {
      if (item.active) {
        item.filterAds(item.element.value);
      }
    });

    window.cards.removeActive();
    window.pins.hide();
    window.pins.show(filteredAdsCache);
  }

  function toggleFiltersDisability(status) {
    switch (status) {
      case FilterStatus.ACTIVE:
        window.utils.toggleElementsDisability(filterElements, false);
        break;
      case FilterStatus.INACTIVE:
        window.utils.toggleElementsDisability(filterElements, true);
        break;
    }
  }

  FeatureFilter.prototype.filterAds = function (rule) {
    filteredAdsCache = filteredAdsCache.filter(function (item) {
      for (var i = 0; i < item.offer.features.length; i++) {
        if (item.offer.features[i] === rule) {
          break;
        }
      }
      return item.offer.features[i];
    });
  };

  toggleFiltersDisability(FilterStatus.INACTIVE);
  filtersWrapper.addEventListener('change', onfilterWrapperChange, true);

  window.filterForm = {
    status: FilterStatus,
    toggleDisability: toggleFiltersDisability
  };
})();
