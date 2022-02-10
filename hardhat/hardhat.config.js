require('@nomiclabs/hardhat-waffle');

require('dotenv').config();

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const MUMBAI_API_KEY = process.env.MUMBAI_API_KEY;
const MUMBAI_PRIVATE_KEY = process.env.PRIVATE_KEY;
const POLYSCAN_API_KEY = process.env.POLYSCAN_API_KEY;

module.exports = {
  networks: {
    hardhat: {
      // forked mainnet used for testing
      forking: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${POLYGON_API_KEY}`,
      },
    },
  },
  etherscan: {
    apiKey: {
      // polygon
      polygon: POLYSCAN_API_KEY,
      polygonMumbai: POLYSCAN_API_KEY,
    },
  },
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};
