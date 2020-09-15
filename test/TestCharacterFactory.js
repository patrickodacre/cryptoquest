// Apply configuration
require('@openzeppelin/test-helpers/configure')({})

const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers')

const CharacterFactory = artifacts.require("CharacterFactory")
const ZF = artifacts.require("ZoneFactory")
const MF = artifacts.require("MobFactory")

describe("Character Factory Contract", () => {
    let accounts
    let cf
    let sender, receiver
    let mobFactory, zoneFactory

    beforeEach(async () => {
        accounts = await web3.eth.getAccounts()
        sender = accounts[0]
        receiver = accounts[1]

        mobFactory = await MF.new()
        zoneFactory = await ZF.new(mobFactory.address)
        cf = await CharacterFactory.new(zoneFactory.address)
    })

    it("should emit NewCharacter event after creating a new character.", async () => {
        const receipt = await cf.createCharacter("Danny", "This is a brave knight.")

        expectEvent(receipt, "NewCharacter", {
            owner: sender,
            id: new BN(0),
            firstname: "Danny",
            bio: "This is a brave knight.",
            level: new BN(1),
        })
    })

    it("should add new character to characters array", async () => {
        const res = await cf.createCharacter("Danny", "A very brave knight.")

        const charDetails = await cf.characters(0)

        // console.log(charDetails)
        assert.equal(charDetails.firstname, "Danny")
        assert.equal(charDetails.surname, "")
        assert.equal(charDetails.bio, "A very brave knight.")
        assert.equal(charDetails.level, 1)
        assert.equal(charDetails.remainingxp, 250)
    })

    describe("attackZoneMob", () => {
        it("should be able to attack", async () => {
            await cf.createCharacter("Danny", "A very brave knight.", {from: sender.toLowerCase()})
            await zoneFactory.createZone("ZoneName", "This zone is great.", 1, 10)
            await mobFactory.createMob("orc", "uh oh")

            const zoneID = await zoneFactory.getZoneCount() - 1
            const mobID = await mobFactory.getMobCount() - 1

            await zoneFactory.createZoneMob(zoneID, mobID, 1, 10)

            const characterID = await cf.getCharacterCount() - 1;
            const res = await cf.attackZoneMob(characterID, zoneID, mobID, {from: sender.toLowerCase()})

            // there could be a CharacterWonBattle || CharacterLostBattle event
            assert.equal(res.logs[0].event.indexOf("Battle") !== -1, true)
        })
    })

    describe("gainExperience", () => {
        it("should level up when total experience gained exceeds 250", async () => {
            await cf.createCharacter("Danny", "A very brave knight.", {from: sender.toLowerCase()})

            await cf.gainExperience(0, 200)
            const res = await cf.gainExperience(0, 200)

            const character = await cf.characters(0)

            // there could be a CharacterWonBattle || CharacterLostBattle event
            assert.equal(character.level, 2)

            expectEvent(res, "CharacterLeveledUp", {
                owner: sender,
                characterID: new BN(0),
                level: new BN(2),
            })
        })

        it("should emit CharacterGainedXP event", async () => {

            await cf.createCharacter("Danny", "A very brave knight.", {from: sender.toLowerCase()})

            const res = await cf.gainExperience(0, 200)

            // there could be a CharacterWonBattle || CharacterLostBattle event
            expectEvent(res, "CharacterGainedXP", {
                owner: sender,
                characterID: new BN(0),
                remainingxp: new BN(50),
                xp: new BN(200),
            })
        })

    })

})
