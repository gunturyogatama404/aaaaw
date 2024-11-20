class Config {
  constructor() {
    this.ipCheckURL = 'https://api.ipify.org?format=json';
    this.wssList = ['proxy.wynd.network:4444', 'proxy.wynd.network:4650'];
    this.retryInterval = 5000;
    this.proxyDelay = 1000,
    this.wssHost =
      this.wssList[Math.floor(Math.random() * this.wssList.length)];
  }
}

module.exports = Config;
