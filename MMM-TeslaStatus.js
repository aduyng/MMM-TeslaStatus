Module.register('MMM-TeslaStatus', {
  sensorEvents: null,
  defaults: {
    firebaseDatabaseRootRef: '/vehicles/131100342',
    title: ' Status',
  },
  getScripts: function() {
    return [
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js',
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
    wrapper.innerHTML = `
      <h2 class="title">${_.get(this.tesla, 'displayName')}</h2>
      <ul class="attributes">
        <li class="attribute">
          <span class="icon zmdi zmdi-battery"></span>
          <span class="name">Battery Level</span>
          <span class="value">${_.get(this.tesla, 'charging.batteryLevel', 'N/A')}%</span>
        </li>
        <li class="attribute">
          <span class="icon zmdi zmdi-car"></span>
          <span class="name">Battery Range</span>
          <span class="value">${_.get(this.tesla, 'charging.batteryRange', 'N/A')}m</span>
        </li>
        <li class="attribute">
          <span class="icon zmdi zmdi-cloud-outline-alt"></span>
          <span class="name">Inside</span>
          <span class="value">${_.get(this.tesla, 'climate.insideTemp', 'N/A')}&deg;F</span>
        </li>
        <li class="attribute">
          <span class="icon zmdi zmdi-cloud-outline"></span>
          <span class="name">Outside</span>
          <span class="value">${_.get(this.tesla, 'climate.outsideTemp', 'N/A')}&deg;F</span>
        </li>
        <li class="attribute">
          <span class="icon zmdi zmdi-shield-security"></span>
          <span class="name">Sentry Mode</span>
          <span class="value">${_.get(this.tesla, 'vehicleState.sentryMode') ? 'on' : 'off'}</span>
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
