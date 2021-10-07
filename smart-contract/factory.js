import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x1DA67fd5824E9f845f049265Bc875f214f533486"
);

export default instance;
