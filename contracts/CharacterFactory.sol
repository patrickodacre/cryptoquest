// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@nomiclabs/buidler/console.sol";

// @title Character Factory
// @author pwho
contract CharacterFactory is Ownable {

    using SafeMath for uint256;

    uint8 constant maxCharacters = 2;

    event NewCharacter(
        address indexed owner,
        uint id,
        string firstname,
        string bio,
        uint level
    );

    struct Character {
        string firstname;
        string surname;
        string bio;
        uint level;
        uint8 remainingxp;
    }

    mapping(uint => address) characterToOwner;
    mapping(address => uint) ownerCharacterCount;

    Character[] public characters;

    function createCharacter(string memory _name, string memory _bio) public {

        require(ownerCharacterCount[msg.sender] <= maxCharacters);

        /* console.log("This is a test!!", msg.sender); */

        string memory surname = "";
        uint level = 1;
        uint8 remainingxp = 250;

        characters.push(Character(_name, surname, _bio, level, remainingxp));

        uint id = (characters.length - uint(1));

        ownerCharacterCount[msg.sender] = ownerCharacterCount[msg.sender].add(1);
        characterToOwner[id] = msg.sender;

        emit NewCharacter(msg.sender, id, _name, _bio, level);
    }

    function getOwnerCharacters() public view returns(uint[] memory) {
        uint[] memory result = new uint[](ownerCharacterCount[msg.sender]);

        uint counter = 0;
        for (uint i = 0; i < characters.length; i ++ ) {
            if (characterToOwner[i] == msg.sender) {
                result[counter] = i;
                counter++;
            }
        }

        return result;
    }
}
