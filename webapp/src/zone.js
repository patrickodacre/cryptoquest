import entities from "./entities"
import media from "./media"

export default ({characters, mobs, zones}, user) => {

    const zoneID = document.querySelector('[data-zone-id]').getAttribute('data-zone-id')

    const saveZoneMobBtn = document.querySelector('[data-save-zone-mob]')
    const heading = document.querySelector('[data-zone-mob-form-heading]')
    const zoneMobData = {}
    let isEditingZoneMob = false
    let selectedZoneMob = null
    const mobTypes = []

    // get the zone details FIRST.
    // These details are required for anything to work properly.
    entities.zone(zones, zoneID).then(zone => {

        // update page info:
        {
            document.querySelector('[data-page-title]')
                .innerHTML = `
                    <div>
                        <h1 class="page-title">Manage ${zone.name} - Levels ${zone.levelmin} - ${zone.levelmax}</h1>
                    </div>
                `

            document.querySelector('[data-zone-description]')
                .innerHTML = `
                    <p>
                        ${zone.description}
                    </p>
                `
        }

        // wire up save
        {
            saveZoneMobBtn.addEventListener('click', evt => {
                const {type} = getFormFields()

                const mobTypeID = type && type.value && typeof type.value.id !== 'undefined'
                                ? type.value.id
                                : null

                if (mobTypeID === null) {
                    alert("Mob type not selected")
                    return
                }

                // creating a new zone mob
                zones.methods
                    .createZoneMob(zoneID, mobTypeID, zone.levelmin, zone.levelmax)
                    .send({from: user.accountNumber(), gas: 6721975, gasPrice: "20000000000"})
                    .on('receipt', function (resp) {
                        loadZoneMobs()
                    })
                    .on('error', function (err) {
                        alert(err.message)
                        debugger
                    })
            })
        }

        // get mob information for the zone.
        // We'll need a list of mob types for our form.
        // We'll need a list of zone mobs created.
        loadMobTypeOptions()
        loadZoneMobs()
    })

    function loadMobTypeOptions() {

        return entities.mobTypes(mobs).then(mobs => {

            // provide list of mob types for the form
            // then prepare the rest of the form
            // list of mob types:
            const selectOptions = document.querySelector('[data-mob-type-options]')
            mobs.forEach(mob => {

                mobTypes.push(mob)

                selectOptions.innerHTML += `
                    <option value="${mob.name}">${mob.name}</option>
                `
            })

            selectOptions.value = selectOptions[0].value

        })
    }

    function loadZoneMobs() {
        return entities.zoneMobs(zones, zoneID).then(zoneMobs => {
            const list = document.querySelector('[data-zone-mob-list]')
            list.innerHTML = ""

            zoneMobs.forEach(m => {

                const image = media.getRandomThumbnail()
                zoneMobData[m.id] = m

                const zMob = `
                    <div class="trending-item mb-3">
                        <div class="ti-pic">
                            <img src="${image}" alt="" style="max-width:80px; max-height:80px;">
                        </div>
                        <div class="ti-text">
                            <h6><a>${m.name}</a></h6>
                            <p>${m.description}
                                <br/>
                                <strong>Level: ${m.level}</strong>
                                <br/>
                                <button
                                    class="btn btn-primary"
                                    data-edit-zone-mob
                                    data-zone-mob-id="${m.id}"
                                >Delete</button>
                            </p>
                        </div>
                    </div>

                    `
                list.innerHTML += zMob
            })

        })
    }

    function getFormFields() {
        const selectedType = document.querySelector('[data-mob-type-options]')

        const type = {
            value: mobTypes.find(mob => mob.name == selectedType.value)
        }
        const message = document.querySelector('[data-zone-mob-form-messages]')

        return {type, message}
    }

}
