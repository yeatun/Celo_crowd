import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
import CeloStarterByteCode from './build/CampaignFactoryABI.json'

const instance = new web3.eth.Contract(
  CeloStarterByteCode,
  "0x40f3a4EBf95CE4A431cffA9803Fcb86f81Ff4ffD"
);

export default instance;
