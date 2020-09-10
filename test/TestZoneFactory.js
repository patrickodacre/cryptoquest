// Apply configuration
require('@openzeppelin/test-helpers/configure')({})

const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers')

const ZF = artifacts.require("ZoneFactory")

describe("Zone Factory Contract", () => {
    let accounts
    let c
    let sender, receiver

    beforeEach(async () => {
        accounts = await web3.eth.getAccounts()
        sender = accounts[0]
        receiver = accounts[1]

        c = await ZF.new()
    })

    describe("createZone", () => {
        it("should emit a NewZone event after creating a new zone", async () => {

            const res = await c.createZone("Butcherblock Mountains", "Home of the dwarves.", 1, 5)

            expectEvent(res, "NewZone", {
                creator : sender,
                id : new BN(0),
                name: "Butcherblock Mountains",
                description: "Home of the dwarves.",
                levelmin: new BN(1),
                levelmax: new BN(5),
            })
        })

        it("should prevent non-owners from creating a new zone", async() => {
            await expectRevert(c.createZone("thing", "thing", 1, 5, {from: accounts[3]}), "Ownable: caller is not the owner")
        })

        it("should add new zone to zones array", async () => {
            const res = await c.createZone("Butcherblock Mountains", "Home of the dwarves.", 1, 5)

            const zone = await c.zones(0)

            assert.equal(zone.name, "Butcherblock Mountains")

        })
    })

    describe("getZones", () => {
        it("should return all zones", async () => {
            const ids = await c.getZones()

            for (var i = 0; i < ids.length; i++) {
                assert.equal(i, ids[i])
            }
        })
    })
})
