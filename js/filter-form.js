'use strict';

(function () {
  var FilterStatus = {
    ACTIVATE: 'activate',
    DEACTIVATE: 'deactivate'
  };
  var RESET_FILTER_VALUE = 'any';
  var lastTimeout;
  var filtersWrapper = document.querySelector('.map__filters-container');
  var filteredPinsCache = [];
  var filters = [
    {
      element: filtersWrapper.querySelector('#housing-type'),
      active: false,
      filterPins: function (rule) {
        filteredPinsCache = filteredPinsCache.filter(function (data) {
          return data.offer.type === rule;
        });
      }
    },
    {
      element: filtersWrapper.querySelector('#housing-price'),
      active: false,
      filterPins: function (rule) {
        if (rule === 'low') {
          filteredPinsCache = filteredPinsCache.filter(function (data) {
            return data.offer.price < 10000;
          });
        } else if (rule === 'middle') {
          filteredPinsCache = filteredPinsCache.filter(function (data) {
            return data.offer.price >= 10000 && data.offer.price <= 50000;
          });
        } else if (rule === 'high') {
          filteredPinsCache = filteredPinsCache.filter(function (data) {
            return data.offer.price > 50000;
          });
        }
      }
    },
    {
      element: filtersWrapper.querySelector('#housing-rooms'),
      active: false,
      filterPins: function (rule) {
        filteredPinsCache = filteredPinsCache.filter(function (data) {
          return data.offer.rooms === Number(rule);
        });
      }
    },
    {
      element: filtersWrapper.querySelector('#housing-guests'),
      active: false,
      filterPins: function (rule) {
        filteredPinsCache = filteredPinsCache.filter(function (data) {
          return data.offer.guests === Number(rule);
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
      filterPins(evt);
    }, 500);

  }

  function filterPins(evt) {
    evt.preventDefault();
    var currentFilter = evt.target;
    var isResetFilter = currentFilter.value === RESET_FILTER_VALUE || currentFilter.checked === false;
    filteredPinsCache = window.pins.adsCache.slice();

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
        filter.filterPins(filter.element.value);
      }
    });

    window.cards.removeActive();
    window.pins.remove();
    window.pins.render(filteredPinsCache);
  }

  function toggleFilters(status) {
    switch (status) {
      case FilterStatus.ACTIVATE:
        window.utils.toggleStatusOfElements(filterElements, false);
        break;
      case FilterStatus.DEACTIVATE:
        window.utils.toggleStatusOfElements(filterElements, true);
        break;
    }
  }

  FeatureFilter.prototype.filterPins = function (rule) {
    filteredPinsCache = filteredPinsCache.filter(function (data) {
      for (var i = 0; i < data.offer.features.length; i++) {
        if (data.offer.features[i] === rule) {
          break;
        }
      }
      return data.offer.features[i];
    });
  };

  toggleFilters(FilterStatus.DEACTIVATE);
  filtersWrapper.addEventListener('change', onfilterWrapperChange, true);

  window.filterForm = {
    filterStatus: FilterStatus,
    toggleFilters: toggleFilters
  };
})();

