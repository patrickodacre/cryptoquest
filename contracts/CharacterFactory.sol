// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@nomiclabs/buidler/console.sol";
import "./ZoneFactory.sol";

// @title Character Factory
// @author pwho
contract CharacterFactory is Ownable {

    using SafeMath for uint256;

    uint8 constant maxCharacters = 2;
    uint constant minLevelForSurname = 20;
    uint randNonce = 0;
    uint attackVictoryProbability = 70;

    ZoneFactory internal zoneFactory;

    event NewCharacter(
        address indexed owner,
        uint id,
        string firstname,
        string bio,
        uint level
    );

    event EditCharacter(
        address indexed owner,
        uint id,
        string firstname,
        string surname,
        string bio
    );

    event CharacterWonBattle(address indexed owner, uint indexed characterID, uint8 experiencePoints, uint8 remainingxp);
    event CharacterLostBattle(address indexed owner, uint indexed characterID);
    event CharacterLeveledUp(address indexed owner, uint indexed characterID, uint level);
    event CharacterGainedXP(address indexed owner, uint indexed characterID, uint8 remainingxp, uint8 xp);

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

    constructor(address zoneFactoryAddress) public {
        zoneFactory = ZoneFactory(zoneFactoryAddress);
    }

    function createCharacter(string memory _name, string memory _bio) public {

        require(ownerCharacterCount[msg.sender] <= maxCharacters);

        string memory surname = "";
        uint level = 1;
        uint8 remainingxp = 250;

        characters.push(Character(_name, surname, _bio, level, remainingxp));

        uint id = (characters.length - uint(1));

        ownerCharacterCount[msg.sender] = ownerCharacterCount[msg.sender].add(1);
        characterToOwner[id] = msg.sender;

        emit NewCharacter(msg.sender, id, _name, _bio, level);
    }

    function editCharacter(uint _id, string memory _firstname, string memory _surname, string memory _bio) public {

        Character storage char = characters[_id];

        require(characterToOwner[_id] == msg.sender);

        if (char.level >= minLevelForSurname) {
            char.surname = _surname;
        }

        char.firstname = _firstname;
        char.bio = _bio;

        emit EditCharacter(msg.sender, _id, _firstname, _surname, _bio);
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

    function getCharacterCount() public view returns (uint) {
        return characters.length;
    }

    function attackZoneMob(uint characterID, uint zoneID, uint zoneMobID) public {

        // only the owner of the character can attack with the character
        require(characterToOwner[characterID] == msg.sender, "Character does not belong to msg sender");

        (,, uint mobLevel) = zoneFactory.getZoneMob(zoneID, zoneMobID);

        Character storage c = characters[characterID];

        uint rand = randMod(100);

        uint8 percentageChanceOfWinning;
        uint8 experienceEarned;

        // blue con
        if (c.level > mobLevel) {
            percentageChanceOfWinning = 90;
            experienceEarned = 25;
        }
        // white con
        else if (c.level == mobLevel) {
            percentageChanceOfWinning = 70;
            experienceEarned = 50;
        }
        // yellow con -> c.level +1 || +2
        else if (mobLevel > c.level && mobLevel <= c.level.add(2)) {
            percentageChanceOfWinning = 40;
            experienceEarned = 80;
        }
        // red con
        else {
            percentageChanceOfWinning = 20;
            experienceEarned = 120;
        }

        // won!!
        if (rand <= percentageChanceOfWinning) {

            gainExperience(characterID, experienceEarned);

            emit CharacterWonBattle(msg.sender, characterID, experienceEarned, c.remainingxp);
        } else {
            emit CharacterLostBattle(msg.sender, characterID);
        }

    }

    function gainExperience(uint characterID, uint8 experience) public {

        require(experience <= uint8(250));

        Character storage c = characters[characterID];

        /* level up */
        if (experience >= c.remainingxp) {

            uint8 leftOverExperience = experience - c.remainingxp;

            c.level = c.level.add(1);
            // start fresh:
            c.remainingxp = uint8(250) - leftOverExperience;

            // ding!
            emit CharacterLeveledUp(msg.sender, characterID, c.level);
        } else {
            // at this point I've checked for possible overflow,
            // and max values are well controlled,
            // so I don't bother with SafeMath
            c.remainingxp = c.remainingxp - experience;
        }

        emit CharacterGainedXP(msg.sender, characterID, c.remainingxp, experience);
    }

    function randMod(uint _modulus) internal returns(uint) {
        randNonce = randNonce.add(1);
        return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
    }
}
