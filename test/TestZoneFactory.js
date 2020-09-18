// Apply configuration
require('@openzeppelin/test-helpers/configure')({})

const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers')

const ZF = artifacts.require("ZoneFactory")
const MF = artifacts.require("MobFactory")

describe("Zone Factory Contract", () => {
    let accounts
    let contract
    let mobFactory
    let sender, receiver

    beforeEach(async () => {
        accounts = await web3.eth.getAccounts()
        sender = accounts[0]
        receiver = accounts[1]

        mobFactory = await MF.new()
        contract = await ZF.new(mobFactory.address)
    })

    describe("createZone", () => {
        it("should emit a NewZone event after creating a new zone", async () => {

            const res = await contract.createZone("Butcherblock Mountains", "Home of the dwarves.", 1, 5)

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
            await expectRevert(contract.createZone("thing", "thing", 1, 5, {from: accounts[3]}), "Ownable: caller is not the owner")
        })

        it("should add new zone to zones array", async () => {
            const res = await contract.createZone("Butcherblock Mountains", "Home of the dwarves.", 1, 5)

            const zone = await contract.zones(0)

            assert.equal(zone.name, "Butcherblock Mountains")

        })
    })

    describe("createZoneMob", () => {
        it("should create a zone mob", async () => {
            await contract.createZone("ZoneName", "This zone is great.", 1, 10)
            await mobFactory.createMob("orc", "uh oh")

            const zoneID = await contract.getZoneCount() - 1;
            const mobID = await mobFactory.getMobCount() - 1;

            const receipt = await contract.createZoneMob(zoneID, mobID, 1, 10)
            const length = await contract.getZoneMobCount(zoneID)

            const mob = await contract.getZoneMob(zoneID, length -1)

            assert.equal(mob.name, "orc")
            assert.equal(mob.description, "uh oh")
            assert.equal(mob.level >= 1 && mob.level <= 10, true)
        })
    })

    describe("getZones", () => {
        it("should return all zones", async () => {
            await contract.createZone("ZoneName", "This zone is great.", 1, 10)
            await contract.createZone("ZoneName", "This zone is great.", 1, 10)
            await contract.createZone("ZoneName", "This zone is great.", 1, 10)

            const numOfZones = await contract.getZoneCount()

            assert.equal(numOfZones, 3)

            for (var i = 0; i < numOfZones; i++) {
                const zone = await contract.zones(i)

                assert.equal(zone.name, "ZoneName")
                assert.equal(zone.description, "This zone is great.")
                assert.equal(zone.levelmin, 1)
                assert.equal(zone.levelmax, 10)
            }
        })
    })

    describe("getZoneMobs", () => {
        it("should return all mobs in the zone", async () => {
            await contract.createZone("ZoneOne", "This zone is great.", 1, 10)
            const zoneOne = await contract.getZoneCount() - 1;

            await contract.createZone("ZoneTwo", "This zone is great.", 1, 10)
            const zoneTwo = await contract.getZoneCount() - 1;

            await mobFactory.createMob("orc", "uh oh")
            await mobFactory.createMob("orc", "uh oh")
            await mobFactory.createMob("orc", "uh oh")

            await contract.createZoneMob(zoneOne, 0, 1, 10)
            await contract.createZoneMob(zoneOne, 1, 1, 10)
            await contract.createZoneMob(zoneOne, 2, 1, 10)

            const numOfZoneMobs = await contract.getZoneMobCount(zoneOne)


            for (let zoneMobID = 0; zoneMobID < numOfZoneMobs; zoneMobID++) {
                const zoneMob = await contract.getZoneMob(zoneOne, zoneMobID)
                assert.equal(zoneMob.name, "orc")
            }

            const zoneTwoMobCount = await contract.getZoneMobCount(zoneTwo)

            assert.equal(zoneTwoMobCount, 0)
        })
    })
})
