// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@nomiclabs/buidler/console.sol";

// Mobs are "blueprints" for generating ZoneMobs which are mobs
// spawned in a Zone and have a level
contract MobFactory is Ownable {

    using SafeMath for uint256;

    event NewMob(
        uint id,
        string name,
        string description
    );

    struct Mob {
        string name;
        string description;
    }

    Mob[] public mobs;

    function createMob(string memory _name, string memory _description) public {
        mobs.push(Mob(_name, _description));

        emit NewMob(mobs.length -1, _name, _description);
    }

    function getMobCount() public view returns (uint) {
        return mobs.length;
    }

    function getRandomMob() public view returns (string memory name, string memory description) {

        require(mobs.length != 0);

        if (mobs.length == 0 || mobs.length == 1) {
            return (mobs[0].name, mobs[0].description);
        } else {
            uint randomI = uint(keccak256(abi.encodePacked(now, block.difficulty, msg.sender))) % mobs.length.sub(1);

            return (mobs[randomI].name, mobs[randomI].description);
        }
    }

}
