// hardhat.config.js
require("dotenv/config")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-solhint")
// require("@nomiclabs/hardhat-solpp")
require("@tenderly/hardhat-tenderly")
require("@nomiclabs/hardhat-waffle")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("hardhat-gas-reporter")
require("hardhat-spdx-license-identifier")
require("hardhat-typechain");
require("hardhat-watcher")
require("solidity-coverage")

const { task } = require("hardhat/config")

const { normalizeHardhatNetworkAccountsConfig } = require("hardhat/internal/core/providers/util")

const { BN, bufferToHex, privateToAddress, toBuffer } = require("ethereumjs-util")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_, { config }) => {
  const networkConfig = config.networks["ropsten"]

  const accounts = normalizeHardhatNetworkAccountsConfig(networkConfig.accounts)

  console.log("Accounts")
  console.log("========")

  for (const [index, account] of accounts.entries()) {
    const address = bufferToHex(privateToAddress(toBuffer(account.privateKey)))
    const privateKey = bufferToHex(toBuffer(account.privateKey))
    const balance = new BN(account.balance).div(new BN(10).pow(new BN(18))).toString(10)
    console.log(`Account #${index}: ${address} (${balance} ETH)
Private Key: ${privateKey}
`)
  }
})

// // This is a sample Hardhat task. To learn how to create your own go to
// // https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (args, hre) => {
//   const accounts = await hre.ethers.getSigners()
//   for (const account of accounts) {
//     console.log(account.address)
//   }
// })

const { removeConsoleLog } = require("hardhat-preprocessor")

const accounts = {
  mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",
  // accountsBalance: "990000000000000000000",
}

module.exports = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: "USD",
    enabled: process.env.REPORT_GAS === "true",
    excludeContracts: ["contracts/mocks/", "contracts/libraries/"],
  },
  mocha: {
    timeout: 20000
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    alice: {
      default: 1,
      // hardhat: 0,
    },
    bob: {
      default: 2,
      // hardhat: 0,
    },
    carol: {
      default: 3,
      // hardhat: 0,
    },
    fee: {
      // Default to 1
      default: 1,
      // Multi sig feeTo address
      // 1: "",
    },
    dev: {
      // Default to 1
      default: 1,
      // dev address
      // 1: "",
    },
  },
  networks: {
    // mainnet: {
    //   url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   accounts,
    //   gasPrice: 120 * 1000000000,
    //   chainId: 1,
    // },
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
    hardhat: {
      // Seems to be a bug with this, even when false it complains about being unauthenticated.
      // Reported to HardHat team and fix is incoming
      // forking: {
      //   enabled: process.env.FORKING === "true",
      //   url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      // },
      live: false,
      saveDeployments: true,
      tags: ["test", "local"],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 3,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 4,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 5,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 42,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },
  },
  paths: {
    artifacts: "artifacts",
    cache: "cache",
    deploy: "deploy",
    deployments: "deployments",
    imports: "imports",
    sources: "contracts",
    tests: "test",
  },
  preprocess: {
    eachLine: removeConsoleLog((bre) => bre.network.name !== "hardhat" && bre.network.name !== "localhost"),
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000,
          },
        },
      },
    ],
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT,
    username: process.env.TENDERLY_USERNAME,
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  watcher: {
    compile: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
  },
}
