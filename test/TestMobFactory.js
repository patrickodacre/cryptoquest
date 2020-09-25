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

    describe("editMob", () => {
        it("should update mob name, description", async() => {
            await contract.createMob("MobOne", "Scary")

            await contract.editMob(0, "MobOneEdited", "Really scary!")

            const mob = await contract.mobs(0)

            assert.equal(mob.name, "MobOneEdited")
            assert.equal(mob.description, "Really scary!")
        })
    })

    describe("getMobs", () => {
        it("should return all available mobs", async () => {
            await contract.createMob("Orc", "A terrible orc.")
            await contract.createMob("Orc", "A terrible orc.")
            await contract.createMob("Orc", "A terrible orc.")

            const numOfMobs = await contract.getMobCount()

            for (var i = 0; i < numOfMobs; i++) {
                const mob = await contract.mobs(i)

                assert.equal(mob.name, "Orc")
                assert.equal(mob.description, "A terrible orc.")
            }
        })
    })

})
