// Apply configuration
require('@openzeppelin/test-helpers/configure')({})

const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers')

const CharacterFactory = artifacts.require("CharacterFactory")

describe("Character Factory Contract", () => {
    let accounts
    let cf
    let sender, receiver

    beforeEach(async () => {
        accounts = await web3.eth.getAccounts()
        sender = accounts[0]
        receiver = accounts[1]

        cf = await CharacterFactory.new()
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

})
