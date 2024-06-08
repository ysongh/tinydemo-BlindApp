//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Tinydemo {
  constructor() {}

  Data[] list;

  struct Data {
    string programId;
    string storeId;
  }

  function getList() public view returns (Data[] memory){
    return list;
  }

  function creatData(string memory _programId, string memory _storeId) public {
    list.push(Data(_programId, _storeId));
  }
}
