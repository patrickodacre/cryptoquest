import Web3 from 'web3'
import zoneABI from '../../build/contracts/ZoneFactory.json'
import mobABI from '../../build/contracts/MobFactory.json'
import charABI from '../../build/contracts/CharacterFactory.json'

export default async () => {
    console.log(zoneABI)
    const web3js = new Web3(Web3.currentProvider || "ws://127.0.0.1:7545");
    // Now you can start your app & access web3 freely:
    const characterContractAddress = "0xbbe2c311122dd6BD2EC0eAA284d33D66FbE53980"
    const mobContractAddress = "0x5aADF92D944c79Eb1d7e2BF3d1A5AA862D6f28E4"
    const zoneContractAddress = "0x619fA1a899E741Ace8937247Ab88D244E409015A"

    const zones = new web3js.eth.Contract(zoneABI.abi, zoneContractAddress);
    const characters = new web3js.eth.Contract(charABI.abi, characterContractAddress);
    const mobs = new web3js.eth.Contract(mobABI.abi, mobContractAddress);

    const accounts = await web3js.eth.getAccounts()
    let userAccount = null

    if (accounts.length === 0) {
        alert('Use a tool like Metamask to create an account.')
    } else {
        userAccount = accounts[0]
    }

    return {
        userAccount,
        zones,
        characters,
        mobs,
    }
}
