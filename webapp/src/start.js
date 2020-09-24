import Web3 from 'web3'
import zoneABI from '../../build/contracts/ZoneFactory.json'
import mobABI from '../../build/contracts/MobFactory.json'
import charABI from '../../build/contracts/CharacterFactory.json'
import env from '../env.js'

export default async () => {
    console.log(zoneABI)
    const web3js = new Web3(Web3.currentProvider || "ws://127.0.0.1:7545");
    // Now you can start your app & access web3 freely:
    const characterContractAddress = env.addresses.characters
    const mobContractAddress = env.addresses.mobs
    const zoneContractAddress = env.addresses.zones

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
