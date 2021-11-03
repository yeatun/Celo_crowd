import axios from 'axios';
import React, { Component } from 'react';
// import Post from './Post';
import { CSVLink } from 'react-csv';



class Posts extends Component {

  constructor(props) {
    super(props);
this.state= {
    data :[],
};
this.csvLinkEl = React.createRef();
this.headers = [
    { label: "blockHash", key: "blockHash" },
    { label: "blockNumber", key: "blockNumber" },
    { label: "contractAddress", key: "contractAddress" },
    { label: "from", key: "from" },
    { label: "gasPrice", key: "gasPrice" }
  ];
  }  

  componentDidMount(){
     return fetch (
          `https://alfajores-blockscout.celo-testnet.org/api?module=account&action=tokentx&address=0x16a0d13C5922a10C49a3c0Be10E8A9259a1c090c&fbclid=IwAR2r6pnN12p3lX0SPWXGok0pmsAsEY8MV2LMVWzzStdl34iHpIJPijYI0ek`
      )
      .then(res=>res.json())
    //   .then(response =>{
    //       console.log(response.data.result)
    //   })
  }
  downloadReport = async () => {
    const data = await this.componentDidMount();
    this.setState({ data: data.result }, () => {
      setTimeout(() => {
        this.csvLinkEl.current.link.click();
      });
    });
  
    // const data = await this.getUserList();
    // this.setState({ data: data }, () => {
    //   setTimeout(() => {
    //     this.csvLinkEl.current.link.click();
    //   });
    // });
  }
    
  render() {
    const { data } = this.state;
    return (
        <div>
        <input type="button" value="Export to CSV (Async)" onClick={this.downloadReport} />
        <CSVLink
      headers={this.headers}
          filename="Clue_Mediator_Report_Async.csv"
     data={data}
          ref={this.csvLinkEl}
        />
      </div>
    //   <div className="">
    //    <p>post data</p>
    //  <div>
    //      {/* <Post/> */}
    //  </div>
    //   </div>
    );
  }
}

export default Posts;

