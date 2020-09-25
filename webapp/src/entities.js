import media from "./media"

export default {
    zoneMobs,
    mobTypes,
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
