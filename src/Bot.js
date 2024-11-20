require('colors');
const fs = require('fs');
const WebSocket = require('ws');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');


var today = new Date();
var jam = today.getHours();
var menit = today.getMinutes();
var detik = today.getSeconds();

const xapiUrl = 'https://api.getgrass.io/retrieveUser';

const xheaders = {
  'Authorization': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkJseGtPeW9QaWIwMlNzUlpGeHBaN2JlSzJOSEJBMSJ9.eyJ1c2VySWQiOiIyb2ljVzUxYnNZNlNFaThhZUNiT21aakwzSGwiLCJlbWFpbCI6Imd1bnR1cnlvZ2F0YW1hZmVicmlhZGlAZ21haWwuY29tIiwic2NvcGUiOiJVU0VSIiwiaWF0IjoxNzMxNzg0OTkwLCJuYmYiOjE3MzE3ODQ5OTAsImV4cCI6MTc2Mjg4ODk5MCwiYXVkIjoid3luZC11c2VycyIsImlzcyI6Imh0dHBzOi8vd3luZC5zMy5hbWF6b25hd3MuY29tL3B1YmxpYyJ9.Sj0QnVTLKbxO8sfQwieQHWg1KlTbUuwsuAzBoffdkmx_1mhcBoH201afIWlaUWBTYQZwulxchfZwxjMFidG44fUrz2LADg9StP-BEPAXP3Mfj1PJOv86x0TpyuAzpm2U8XDzAsZaPeDDbJklmw_FOPMqZDTZrNe6OXB-UmwH5JZnf3Vt24IENEjvVD3-Q3kpK2DckIkIemRvKovQezuSfFTWfTxA4I6GSZk2sgxMnH6VUbOU2EYzA2g55pWj_vUd560KN-MmRPINVYvH2Rr4_oio8SU3YxoKfou_ZctQvvSk8JwdXpk2sQU3YOs4_ho5ZqttQaJqMNwsCr_iaDCicQ' // Masukkan accesstoken disini
};
// Mengirim permintaan GET ke API dengan header
axios.get(xapiUrl, { headers: xheaders })
  .then(response => {
    if (response.status === 200) {
      // Jika berhasil, cetak respons JSON
      const data = response.data;
      const akun_email = data.result.data.email;
      const akun_username = data.result.data.username;
      const akun_userId = data.result.data.userId;
      const akun_totalpoints = data.result.data.totalPoints;
      const akun_wallet = data.result.data.walletAddress
      //    const.log = (hasil);
      console.log("==================================================================");
      console.log(`== Email      : ${akun_email}`);
      console.log(`== UserName   : ${akun_username}`);
      console.log(`== Uid        : ${akun_userId}`);
      console.log(`== Total poin : ${akun_totalpoints}`);
      console.log(`== Wallet     : ${akun_wallet}`);
      console.log("==================================================================");

      // Menyimpan hasil ke file.txt dan menghapus isi sebelumnya
      fs.writeFileSync('uid.txt', akun_userId, 'utf8');
    } else {
      // Jika gagal, cetak status code dan pesan kesalahan
      const error_message = `Gagal mengambil uid: ${response.status} - ${response.statusText}`;
      console.error(error_message);

      // Menyimpan pesan kesalahan ke file.txt dan menghapus isi sebelumnya
      fs.writeFileSync('error.txt', error_message, 'utf8');
    }
  })
  .catch(error => {
    const error_message = `${error.message}`;
    console.error("\n\nFATAL ERROR, SILAHKAN CEK ERROR.TXT");

    // Menyimpan pesan kesalahan ke file.txt dan menghapus isi sebelumnya
    fs.writeFileSync('error.txt', error_message, 'utf8');
    process.exit();
  });





class Bot {
  constructor(config) {
    this.config = config;
  }

  async getProxyIP(proxy) {
    const agent = proxy.startsWith('http')
      ? new HttpsProxyAgent(proxy)
      : new SocksProxyAgent(proxy);
    try {
      const response = await axios.get(this.config.ipCheckURL, {
        httpsAgent: agent,
        timeout: 5000, // Timeout untuk menghindari lama koneksi
      });
      console.log(`${jam}:${menit}:${detik} - Connected through proxy ${proxy}`.green);
      return response.data;
    } catch (error) {
      // console.error(
      //   `${jam}:${menit}:${detik} - Skipping proxy ${proxy}${jam}:${menit}:${detik} - due to connection error: ${error.message}`.yellow
      // );
      return null;
    }
  }

  async processProxiesSequentially(proxies, userID) {
    for (const proxy of proxies) {
      console.log(`${jam}:${menit}:${detik} - Checking proxy: ${proxy}`.cyan);
      const proxyInfo = await this.getProxyIP(proxy);

      if (proxyInfo) {
        await this.connectToProxy(proxy, userID);
      } else {
        console.log(`${jam}:${menit}:${detik} - Proxy ${proxy} is not usable.`.yellow);
      }

      // Delay sebelum memproses proxy berikutnya
      await new Promise((resolve) => setTimeout(resolve, this.config.proxyDelay));
    }
    console.log(`${jam}:${menit}:${detik} - All proxies processed.`.green);
  }

  async connectToProxy(proxy, userID) {
    const formattedProxy = proxy.startsWith('socks5://')
      ? proxy
      : proxy.startsWith('http')
        ? proxy
        : `socks5://${proxy}`;
    try {
      const agent = formattedProxy.startsWith('http')
        ? new HttpsProxyAgent(formattedProxy)
        : new SocksProxyAgent(formattedProxy);
      const wsURL = `wss://${this.config.wssHost}`;
      const ws = new WebSocket(wsURL, {
        agent,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0',
          Pragma: 'no-cache',
          'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
          OS: 'Windows',
          Platform: 'Desktop',
          Browser: 'Mozilla',
        },
      });

      ws.on('open', () => {
        console.log(`${jam}:${menit}:${detik} - Connected to proxy ${proxy}`.cyan);
        console.log(`${jam}:${menit}:${detik} - Proxy IP Info: ${JSON.stringify(proxy)}`.magenta);
        this.sendPing(ws, proxy.ip);
      });

      ws.on('message', (message) => {
        const msg = JSON.parse(message);
        console.log(`${jam}:${menit}:${detik} - Received message: ${JSON.stringify(msg)}`.blue);

        if (msg.action === 'AUTH') {
          const authResponse = {
            id: msg.id,
            origin_action: 'AUTH',
            result: {
              browser_id: uuidv4(),
              user_id: userID,
              user_agent: 'Mozilla/5.0',
              timestamp: Math.floor(Date.now() / 1000),
              device_type: 'desktop',
              version: '4.28.2',
            },
          };
          ws.send(JSON.stringify(authResponse));
          console.log(
            `${jam}:${menit}:${detik} - Sent auth response: ${JSON.stringify(authResponse)}`.green
          );
        } else if (msg.action === 'PONG') {
          console.log(`${jam}:${menit}:${detik} - Received PONG: ${JSON.stringify(msg)}`);
        }
      });

      ws.on('close', (code, reason) => {
        // console.log(
        //   `${jam}:${menit}:${detik} - WebSocket closed with code: ${code}, reason: ${reason}`.yellow
        // );
        setTimeout(
          () => this.connectToProxy(proxy, userID),
          this.config.retryInterval
        );
      });

      ws.on('error', (error) => {
        // console.error(
        //   `${jam}:${menit}:${detik} - WebSocket error on proxy ${proxy}${jam}:${menit}:${detik} - ${error.message}`.red
        // );
        ws.terminate();
      });
    } catch (error) {
      // console.error(
      //   `${jam}:${menit}:${detik} - Failed to connect with proxy ${proxy} +-${error.message}`.red
      // );
    }
  }

  async connectDirectly(userID) {
    try {
      const wsURL = `wss://${this.config.wssHost}`;
      const ws = new WebSocket(wsURL, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0',
          Pragma: 'no-cache',
          'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
          OS: 'Windows',
          Platform: 'Desktop',
          Browser: 'Mozilla',
        },
      });

      ws.on('open', () => {
        console.log(`${jam}:${menit}:${detik} - Connected directly without proxy`.cyan);
        this.sendPing(ws, 'Direct IP');
      });

      ws.on('message', (message) => {
        const msg = JSON.parse(message);
        console.log(`${jam}:${menit}:${detik} - Received message: ${JSON.stringify(msg)}`.blue);

        if (msg.action === 'AUTH') {
          const authResponse = {
            id: msg.id,
            origin_action: 'AUTH',
            result: {
              browser_id: uuidv4(),
              user_id: userID,
              user_agent: 'Mozilla/5.0',
              timestamp: Math.floor(Date.now() / 1000),
              device_type: 'desktop',
              version: '4.28.2',
            },
          };
          ws.send(JSON.stringify(authResponse));
          console.log(
            `${jam}:${menit}:${detik} - Sent auth response: ${JSON.stringify(authResponse)}`.green
          );
        } else if (msg.action === 'PONG') {
          console.log(`${jam}:${menit}:${detik} - Received PONG: ${JSON.stringify(msg)}`);
        }
      });

      ws.on('close', (code, reason) => {
        console.log(
          `${jam}:${menit}:${detik} - WebSocket closed with code: ${code}, reason: ${reason}`.yellow
        );
        setTimeout(
          () => this.connectDirectly(userID),
          this.config.retryInterval
        );
      });

      ws.on('error', (error) => {
        console.error(`${jam}:${menit}:${detik} - WebSocket error: ${error.message}`.red);
        ws.terminate();
      });
    } catch (error) {
      console.error(`${jam}:${menit}:${detik} - Failed to connect directly: ${error.message}`.red);
    }
  }

  sendPing(ws, proxy) {
    setInterval(() => {
      const pingMessage = {
        id: uuidv4(),
        version: '1.0.0',
        action: 'PING',
        data: {},
      };
      ws.send(JSON.stringify(pingMessage));
      console.log(
        `${jam}:${menit}:${detik} - Sent ping - IP: ${proxy}, Message: ${JSON.stringify(pingMessage)}`
          .cyan
      );
    }, 26000);
  }
}

module.exports = Bot;
