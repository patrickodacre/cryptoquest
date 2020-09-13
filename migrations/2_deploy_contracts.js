const CharacterFactory = artifacts.require("./CharacterFactory.sol");
const MobFactory = artifacts.require("./MobFactory.sol");
const ZoneFactory = artifacts.require("./ZoneFactory.sol");

module.exports = async function (deployer) {
    await deployer.deploy(CharacterFactory);
    await deployer.deploy(MobFactory);
    await deployer.deploy(ZoneFactory, MobFactory.address)
};
