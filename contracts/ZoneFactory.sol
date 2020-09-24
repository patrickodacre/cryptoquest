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

    mapping(uint => uint) zoneMobCount;
    mapping(uint => ZoneMob[]) zoneMobs;

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

    function editZone(uint zoneID, string memory _name, string memory _description, uint _levelmin, uint _levelmax) public onlyOwner {
        Zone storage z = zones[zoneID];

        z.name = _name;
        z.description = _description;

        // we cannot edit min / max levels as the zone mobs
        // associated with the zone could then be rendered out of range.
        uint mobCount = getZoneMobCount(zoneID);
        if (mobCount == 0) {
            z.levelmin = _levelmin;
            z.levelmax = _levelmax;
        }
    }

    function createZoneMob(uint zoneID, uint templateMobID, uint levelmin, uint levelmax) public returns (uint) {

        (string memory name, string memory description) = mobFactory.getMob(templateMobID);

        // effectively get a number between some MIN and MAX
        uint rand = uint(keccak256(abi.encodePacked(now, block.difficulty, msg.sender))) % (levelmax - levelmin);
        rand = levelmin + rand;

        zoneMobs[zoneID].push(ZoneMob(name, description, rand));

        return zoneMobs[zoneID].length -1;
    }

    function getZoneMobCount(uint zoneID) public view returns (uint) {
        return zoneMobs[zoneID].length;
    }

    function getZoneMob(
            uint zoneID,
            uint mobID)
        public view returns (
            string memory name,
            string memory description,
            uint level)
    {
        ZoneMob memory mob = zoneMobs[zoneID][mobID];

        return (mob.name, mob.description, mob.level);
    }

    function zoneIn(uint zoneAdd) public view returns (uint[] memory) {
        console.log("testing");

        uint[] memory result = new uint[](zoneMobCount[zoneAdd]);

        for (uint i = 0; i < zoneMobCount[zoneAdd]; i++) {

            /* if (zoneMobs[i]) */

        }
    }
}
