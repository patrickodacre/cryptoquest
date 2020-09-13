// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@nomiclabs/buidler/console.sol";
import "./MobFactory.sol";

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

    struct ZoneMob {
        string name;
        string description;
        uint level;
    }

    Zone[] public zones;
    ZoneMob[] public zoneMobs;

    mapping(uint => uint) zoneMobCount;

    MobFactory internal mobFactory;

    constructor(address mobFactoryAddress) public {
        mobFactory = MobFactory(mobFactoryAddress);
    }

    function createZone(string memory _name, string memory _description, uint _levelmin, uint _levelmax) public onlyOwner {
        zones.push(Zone(_name, _description, _levelmin, _levelmax));

        emit NewZone(msg.sender, zones.length -1, _name, _description, _levelmin, _levelmax);
    }

    function getZoneCount() public view returns (uint) {
        return zones.length;
    }

    function createZoneMob(uint levelmin, uint levelmax) public returns (uint) {

        (string memory name, string memory description) = mobFactory.getRandomMob();

        // effectively get a number between some MIN and MAX
        uint rand = uint(keccak256(abi.encodePacked(now, block.difficulty, msg.sender))) % (levelmax - levelmin);
        rand = levelmin + rand;

        zoneMobs.push(ZoneMob(name, description, rand));

        return zoneMobs.length - 1;
    }

    function getZoneMobCount() public view returns (uint) {
        return zoneMobs.length;
    }

    function zoneIn(uint zoneAdd) public view returns (uint[] memory) {
        console.log("testing");

        uint[] memory result = new uint[](zoneMobCount[zoneAdd]);

        for (uint i = 0; i < zoneMobCount[zoneAdd]; i++) {

            /* if (zoneMobs[i]) */

        }
    }
}
