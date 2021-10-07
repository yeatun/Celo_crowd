pragma solidity ^0.4.21;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum,string name,string description,string image,uint target, uint deadline) public {
        require(now < deadline, "Deadline can't be in the past");
        address newCampaign = new Campaign(minimum, msg.sender,name,description,image,target, deadline);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}


contract Campaign {
  struct Request {
      string description;
      uint value;
      address recipient;
      bool complete;
      uint approvalCount;
      mapping(address => bool) approvals;
  }

  Request[] public requests;
  address public manager;
  uint public minimunContribution;
  string public CampaignName;
  string public CampaignDescription;
  string public imageUrl;
  uint public targetToAchieve;
  uint public created;
  address[] public contributers;
  uint public CampaignDeadline;
  mapping(address => bool) public approvers;
  mapping(address => uint) public contributerAmount;
  uint public approversCount;



  

   constructor(uint minimun, address creator,string name,string description,string image,uint target, uint deadline) public {
      manager = creator;
      minimunContribution = minimun;
      CampaignName=name;
      CampaignDescription=description;
      imageUrl=image;
      created=now;
      CampaignDeadline=deadline;
      targetToAchieve=target;
  }

  modifier timeThresholdPast(){
      require(address(this).balance >= targetToAchieve && now > CampaignDeadline, "Deadline not passed or goal already met");
      _;
  }

  modifier timeThresholdNotPast(){
      require(address(this).balance < targetToAchieve || now <= CampaignDeadline, "Deadline passed and goal not met");
      _;
  }

   modifier restricted() {
      require(msg.sender == manager, "Only allowed for campaign creator");
      _;
  }

modifier notManager() {
      require(msg.sender != manager, "Only allowed for campaign creator");
      _;
  }

    modifier isContributer() {
        require(approvers[msg.sender], "Not a contributer");
        _;
    }

  function contibute() public payable timeThresholdNotPast{
      require(msg.value > minimunContribution );
      contributerAmount[msg.sender] = msg.value;
      contributers.push(msg.sender);
      approvers[msg.sender] = true;
      approversCount++;
  }

  function createRequest(string description, uint value, address recipient) public restricted timeThresholdNotPast{
      Request memory newRequest = Request({
         description: description,
         value: value,
         recipient: recipient,
         complete: false,
         approvalCount: 0
      });
      requests.push(newRequest);
  }

  function refund() public isContributer timeThresholdPast notManager{
      require(contributerAmount[msg.sender] >= address(this).balance, "Fund already spent.");
      msg.sender.transfer(contributerAmount[msg.sender]);
  }

  function approveRequest(uint index) public isContributer timeThresholdNotPast notManager {
      require(!requests[index].approvals[msg.sender]);
      requests[index].approvals[msg.sender] = true;
      requests[index].approvalCount++;
  }

  function finalizeRequest(uint index) public restricted timeThresholdNotPast{
      require(requests[index].approvalCount > (approversCount / 2));
      require(!requests[index].complete);
      if(contributerAmount[requests[index].recipient]  < requests[index].value){
            contributerAmount[requests[index].recipient] = 0;
      }
      else{
            contributerAmount[requests[index].recipient] -= requests[index].value;
      }
       
      requests[index].recipient.transfer(requests[index].value);
      requests[index].complete = true;
  }


    function getSummary() public view returns (uint,uint,uint,uint,address,string,string,string,uint) {
        return(
            minimunContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            CampaignName,
            CampaignDescription,
            imageUrl,
            targetToAchieve
          );
    }

    function getRequestsCount() public view returns (uint){
        return requests.length;
    }
}
