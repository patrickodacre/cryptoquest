// Apply configuration
require('@openzeppelin/test-helpers/configure')({})

const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers')

const MobFactory = artifacts.require("MobFactory")

describe("Mob Factory", () => {
    let accounts
    let contract
    let sender, receiver

    beforeEach(async () => {
        accounts = await web3.eth.getAccounts()
        sender = accounts[0]
        receiver = accounts[1]

        contract = await MobFactory.new()
    })

    describe("createMob", () => {
        it("Should Create a Mob", async() => {
            await contract.createMob("Orc", "A terrible orc.")
            const numOfMobs = await contract.getMobCount()

            assert.equal(numOfMobs, 1)
        })
    })

})
