# grasbot

This repository contains the code for `getgrass-bot`, a bot designed to establish WebSocket connections through various HTTP and SOCKS proxies, specifically aimed at farming for Grass Airdrop Season 2.

## Overview

`getgrass-bot` connects to a specified WebSocket server using both HTTP and SOCKS proxies. It leverages the `ws` library for WebSocket communication and integrates the `https-proxy-agent` and `socks-proxy-agent` libraries for enhanced proxy support. This allows for more versatile and resilient connections, accommodating a wider range of proxy types.

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/IKSANNURPADILLAH/new.git
   ```

2. Navigate to the project directory:

   ```bash
   cd new
   ```

3. Install the required dependencies using npm:

   ```bash
   npm install
   ```

## Usage

1. Obtain your Accesstoken from the Getgrass website:

   - Visit [[[[https://app.getgrass.io/dashboard]([https://app.getgrass.io/register/?referralCode=NXZg3yAsUsXKzy2](https://app.getgrass.io/register/?referralCode=3zoAM4QCy4c_086))]].]https://app.getgrass.io/register/?referralCode=3zoAM4QCy4c_086
   - Open your browser's developer tools (usually by pressing F12 or right-clicking and selecting "Inspect").
   - Go to the "Console" tab.
   - Paste the following command and press Enter:

     ```javascript
     localStorage.accessToken
     ```

   - Copy the value to new/src/Bot.js


2. To specify proxies, create a file named `proxy.txt` in the project directory and add your desired proxy URLs, following the same new-line format, like this:

   ```text
   http://username:password@hostname:port
   socks5://username:password@hostname:port
   ```

4. To run the `bot`, execute the following command in your terminal:

   ```bash
   npm start
   ```
