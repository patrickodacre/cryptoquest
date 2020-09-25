// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@nomiclabs/buidler/console.sol";
import "./CharacterFactory.sol";


// @title Mock Character Factory
// @author pwho
// For testing purposes only.
contract MockCharacterFactory is CharacterFactory {

    constructor(address zoneFactoryAddress) public CharacterFactory(zoneFactoryAddress) {}

    function setCharacterLevel(uint _charID, uint _level) public {
        Character storage c = characters[_charID];
        console.log("setting character level", c.firstname);

        c.level = _level;
    }
}
