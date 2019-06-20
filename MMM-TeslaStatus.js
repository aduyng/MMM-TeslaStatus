Module.register('MMM-TeslaStatus', {
  defaults: {
    firebaseDatabaseRootRef: '/vehicles/131100342',
    title: 'Tesla Status',
  },
  getScripts: function() {
    return [
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js',
    ];
  },
  getStyles: function() {
    return [
      'https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css',
      'MMM-TeslaStatus.css',
    ];
  },

  getTranslations: function() {
    return false;
  },

  start: function() {
    this.sendConfig();
  },

  sendConfig: function() {
    Log.info(`[${this.name}]: SEND_CONFIG`, this.config);
    this.sendSocketNotification('SEND_CONFIG', this.config);
  },

  getDom: function() {
    const wrapper = document.createElement('div');
    if (this.tesla === null) {
      wrapper.innerHTML =
        '<div class="loading"><span class="zmdi zmdi-rotate-right zmdi-hc-spin"></span> Loading...</div>';
      return wrapper;
    }
    const batteryLevel = _.get(this.tesla, 'charging.batteryLevel', 'N/A');
    const getBatteryLevelClass = function(bl){
      if(bl < 30) {
        return 'danger';
      }
      if(bl < 50) {
        return 'warning';
      }
      if( bl >= 50){
        return 'ok';
      }

      return '';
    }

    const sentryMode = _.get(this.tesla, 'vehicleState.sentryMode');
    wrapper.innerHTML = `
      <h2 class="title"><span class="zmdi zmdi-car zmdi-hc-2x icon"></span> ${_.get(this.tesla, 'displayName', this.config.title)}</h2>
      <ul class="attributes">
        <li class="attribute battery-level battery-level-${getBatteryLevelClass(batteryLevel)}">
          <span class="icon zmdi zmdi-battery zmdi-hc-fw"></span>
          <span class="name">Battery Level</span>
          <span class="value">${batteryLevel}%</span>
        </li>
        <li class="attribute">
          <span class="icon zmdi zmdi-car zmdi-hc-fw"></span>
          <span class="name">Battery Range</span>
          <span class="value">${_.get(this.tesla, 'charging.batteryRange', 'N/A')}m</span>
        </li>
        <li class="attribute">
          <span class="icon zmdi zmdi-cloud-outline-alt zmdi-hc-fw"></span>
          <span class="name">Inside</span>
          <span class="value">${_.get(this.tesla, 'climate.insideTemp', 'N/A')}&deg;F</span>
        </li>
        <li class="attribute">
          <span class="icon zmdi zmdi-cloud-outline zmdi-hc-fw"></span>
          <span class="name">Outside</span>
          <span class="value">${_.get(this.tesla, 'climate.outsideTemp', 'N/A')}&deg;F</span>
        </li>
        <li class="attribute sentry-mode ${sentryMode ? 'sentry-mode-active': ''}">
          <span class="icon zmdi zmdi-shield-security zmdi-hc-fw"></span>
          <span class="name">Sentry Mode</span>
          <span class="value">${sentryMode ? '<span class="zmdi zmdi-play-circle"></span> On' : 'Off'}</span>
        </li>
        <li class="attribute">
          <span class="icon zmdi zmdi-time zmdi-hc-fw"></span>
          <span class="name">Updated</span>
          <span class="value">${moment(this.tesla.updatedAt).fromNow()}</span>
        </li>
		  </ul>
		`;
    return wrapper;
  },

  socketNotificationReceived: function(notification, payload) {
    Log.info(
      `[${this.name}] socketNotificationReceived notification ${notification}`,
      payload,
    );

    if (notification === 'STATUS_CHANGED') {
      this.tesla = payload;
      return this.updateDom();
    }

    return false;
  },
});
