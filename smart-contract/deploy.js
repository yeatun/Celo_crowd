const HDWalletProvider = require('truffle-hdwallet-provider');
const ContractKit = require('@celo/contractkit')
const Web3 = require('web3')
const compiledFactory = require('./build/CampaignFactory.json');
const getAccount = require('./getAccount').getAccount
// require('dotenv').config();
// console.log(process.env.mnemonic);

const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
const kit = ContractKit.newKitFromWeb3(web3);

async function deploy () {
    // const accounts = await web3.eth.getAccounts();
    // console.log('Attemping to deploy to accounts ', accounts[0]);
    let account = await getAccount()
    console.log(account.address)
    kit.connection.addAccount(account.privateKey) 
    let tx = await kit.connection.sendTransaction({
        from: account.address,
        data: compiledFactory.bytecode
    })
    const receipt = await tx.waitReceipt()
    console.log(receipt)

    // const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    //     .deploy({ data: '0x' + compiledFactory.bytecode })
    //     .send({ from: accounts[0] });

    // console.log('Contract deploy to ', result.options.address);
};

deploy();