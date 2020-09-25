import media from "./media"

export default {
    characters,
    zone,
    zoneMobs,
    mobTypes,
}

function characters(characters) {
    return characters.methods.getOwnerCharacters().call().then(ids => {

        const promises = []

        ids.forEach(id => {
            promises.push(characters.methods.characters(id).call()
                .then(char => ({
                    id: parseInt(id),
                    firstname: char.firstname,
                    surname: char.surname,
                    name: (char.firstname + " " + char.surname).trim(),
                    bio: char.bio,
                    remainingxp: parseInt(char.remainingxp),
                    level: parseInt(char.level),
                }))
            )
        })

        return Promise.all(promises)
    })
}

function zone(zones, zoneID) {
    return zones.methods.zones(zoneID).call()
        .then(zoneDetails => ({
            id: parseInt(zoneID),
            name: zoneDetails.name,
            description: zoneDetails.description,
            levelmin: parseInt(zoneDetails.levelmin),
            levelmax: parseInt(zoneDetails.levelmax),
        }))
}

function mobTypes(mobs) {

    return mobs.methods.getMobCount().call().then(count => {
        count = parseInt(count)

        let mobRequests = []

        for (let i = 0; i < count; i++) {
            mobRequests.push(
                mobs.methods.mobs(i).call().then(mob => ({...mob, ...{id: i}}))
            )
        }

        return Promise.all(mobRequests)
    })
}

function zoneMobs(zones, zoneID) {
    return zones.methods.getZoneMobCount(zoneID).call().then(count => {

        count = parseInt(count)

        let zoneMobRequests = []

        if (count != 0) {
            for (let i = 0; i < count; i++) {
                zoneMobRequests.push(
                    zones.methods.getZoneMob(zoneID, i).call().then(mob => ({...mob, ...{id: i}}))
                )
            }
        }

        // show zone mobs
        return Promise.all(zoneMobRequests)
    })
}
