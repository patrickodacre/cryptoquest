pragma solidity ^0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Console.sol";
import "../contracts/CharacterFactory.sol";

contract TestCharacterFactory is CharacterFactory, Console {

    function clearData() private {
        delete characters;
    }

 
    function testCreateCharacter() public {
        clearData();
        createCharacter("Danny");
    }
}
