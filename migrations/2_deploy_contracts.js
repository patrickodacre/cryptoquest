const CharacterFactory = artifacts.require("./CharacterFactory.sol");

module.exports = async function (deployer) {
    await deployer.deploy(CharacterFactory);
};
