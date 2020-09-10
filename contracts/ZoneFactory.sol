// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@nomiclabs/buidler/console.sol";

contract ZoneFactory is Ownable {

    event NewZone(
        address indexed creator,
        uint id,
        string name,
        string description,
        uint levelmin,
        uint levelmax
    );

    struct Zone {
        string name;
        string description;
        uint levelmin;
        uint levelmax;
    }

    Zone[] public zones;

    function createZone(string memory _name, string memory _description, uint _levelmin, uint _levelmax) public onlyOwner {
        zones.push(Zone(_name, _description, _levelmin, _levelmax));

        emit NewZone(msg.sender, zones.length -1, _name, _description, _levelmin, _levelmax);
    }

    function getZones() public view returns (uint[] memory) {
        uint[] memory result = new uint[](zones.length);

        for (uint i = 0; i < zones.length; i++) {
            result[i] = i;
        }

        return result;
    }
}
