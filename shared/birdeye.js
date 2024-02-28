const axios = require('axios');
const apiKey = '69f30930c7bb4ee7b6a076cab5bcea75';

async function getPrice(address) {
  const url = `https://public-api.birdeye.so/public/price?address=${address}`;

  const response = await axios.get(url, { headers: { 'X-API-KEY': apiKey } });
  const { data } = response.data;

  return data.value.toFixed(3);
}

module.exports = {
  getPrice
};

