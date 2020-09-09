// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// @title Character Factory
// @author pwho
contract CharacterFactory is Ownable {

    using SafeMath for uint256;

    event NewCharacter(uint indexed id, string name, uint level);

    mapping(uint => address) characterToOwner;
    mapping(address => uint) ownerCharacterCount;

    Character[] public characters;

    struct Character {
        string FirstName;
        string Surname;
        uint level;
        uint8 remainingXP;
    }

    function createCharacter(string memory _name) public {
        string memory surname = "";
        uint level = 1;
        uint8 remainingXP = 250;

        characters.push(Character(_name, surname, level, remainingXP));

        uint id = (characters.length - uint(1));

        ownerCharacterCount[msg.sender] = ownerCharacterCount[msg.sender].add(1);
        characterToOwner[id] = msg.sender;

        emit NewCharacter(id, _name, level);
    }

}
