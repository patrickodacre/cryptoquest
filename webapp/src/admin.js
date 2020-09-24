export default ({characters, mobs, zones}, user) => {

    loadZones()

    let zoneData = {}
    let selectedZone = null

    const saveZoneBtn = document.querySelector('[data-save-zone]')
    const clearZoneBtn = document.querySelector('[data-clear-zone]')
    const heading = document.querySelector('[data-zone-form-heading]')
    let isEditingZone = false

    // listen for a clear form request:
    {
        clearZoneBtn.addEventListener('click', evt => {
            isEditingZone = false
            selectedZone = null
            heading.innerHTML = "Create a Zone"

            const {name,description,minLevel,maxLevel} = getFormFields()
            // these would have been disabled when the edit is initialized
            minLevel.removeAttribute('disabled')
            maxLevel.removeAttribute('disabled')
            name.value = ""
            description.value = ""
            minLevel.setAttribute('type', 'number')
            maxLevel.setAttribute('type', 'number')
            minLevel.value = null
            maxLevel.value = null
        })
    }

    // create / edit zone form:
    {
        saveZoneBtn.addEventListener('click', evt => {
            const {name,description,minLevel,maxLevel} = getFormFields()

            // edit
            if (isEditingZone && selectedZone && typeof selectedZone.id !== "undefined") {

                zones.methods
                    .editZone(selectedZone.id, name.value, description.value, parseInt(minLevel.value), parseInt(maxLevel.value))
                    .send({from: user.hash, gas: 6721975, gasPrice: "20000000000"})
                    .on('receipt', function (resp) {
                        // these would have been disabled when the edit is initialized
                        minLevel.removeAttribute('disabled')
                        maxLevel.removeAttribute('disabled')
                        loadZones()
                    })
                    .on('error', function (err) {
                        alert(err.message)
                        debugger
                    })

                return
            }

            zones.methods
                .createZone(name.value, description.value, parseInt(minLevel.value), parseInt(maxLevel.value))
                .send({from: user.accountNumber(), gas: 6721975, gasPrice: "20000000000"})
                .on('receipt', function (resp) {
                    loadZones()
                })
                .on('error', function (err) {
                    alert(err.message)
                    debugger
                })
        })
    }

    function getFormFields() {

        const name = document.querySelector('[data-zone-name]')
        const description = document.querySelector('[data-zone-description]')
        const minLevel = document.querySelector('[data-zone-min-level]')
        const maxLevel = document.querySelector('[data-zone-max-level]')
        const message = document.querySelector('[data-form-messages]')

        return {name, description, minLevel, maxLevel,message}
    }

    function getRandomThumbnail() {
        const thumbs = [
            "/images/trending/trending-5.jpg",
            "/images/trending/trending-6.jpg",
            "/images/trending/trending-7.jpg",
            "/images/trending/trending-8.jpg",
            "/images/instagram/ip-1.jpg",
            "/images/instagram/ip-2.jpg",
            "/images/instagram/ip-3.jpg",
            "/images/instagram/ip-4.jpg",
        ]

        const min = 0
        const max = thumbs.length - 1

        const rand = Math.floor(Math.random() * (max - min + 1) + min);

        return thumbs[rand]
    }

    function loadZones() {
        const zoneList = document.querySelector('[data-zone-list]')
        zoneList.innerHTML = ""

        // just getting the number of zones
        // and fetching zone info based on the index / id
        // works fine IF/UNTIL I get to the point where I
        // want to support deleting zones.
        zones.methods.getZoneCount().call()
            .then(count => {
                count = parseInt(count)

                let promises = []

                for (let i = 0; i < count; i++) {
                    promises.push(zones.methods.zones(i).call().then(resp => ({...resp, ...{id: i}})))
                }

                Promise.all(promises)
                    .then((results) => {
                        results.forEach(z => {
                            const image = getRandomThumbnail()
                            zoneData[z.id] = z

                            const zone = `
                                <div class="trending-item mb-3">
                                    <div class="ti-pic">
                                        <img src="${image}" alt="" style="max-width:80px; max-height:80px;">
                                    </div>
                                    <div class="ti-text">
                                        <h6><a>${z.name}</a></h6>
                                        <p>${z.description}
                                            <br/>
                                            <strong>Levels: ${z.levelmin} - ${z.levelmax}</strong>
                                            <br/>
                                            <button
                                                class="btn btn-primary"
                                                data-edit-zone
                                                data-zone-id="${z.id}"
                                            >Edit</button>
                                        </p>
                                    </div>
                                </div>

                                `
                            zoneList.innerHTML += zone
                        })

                        {
                            const editZoneBtns = document.querySelectorAll('[data-edit-zone]')

                            // listen for an edit request:
                            editZoneBtns.forEach(btn => {
                                btn.addEventListener('click', evt => {
                                    isEditingZone = true

                                    const zoneID = evt.currentTarget.getAttribute("data-zone-id")

                                    zones.methods.getZoneMobCount(zoneID).call()
                                        .then(mobCount => {
 
                                            // update the heading
                                            heading.innerHTML = "Editing Zone " + zoneID

                                            // fill in the form
                                            {
                                                const z = zoneData[zoneID]
                                                selectedZone = z

                                                const {name,description,minLevel,maxLevel,message} = getFormFields()

                                                name.value = z.name

                                                description.value = z.description

                                                if (mobCount == "0") {
                                                    minLevel.value = z.levelmin
                                                    maxLevel.value = z.levelmax
                                                }
                                                // if we have mobs in the zone, we cannot change the level
                                                else {
                                                    message.innerHTML = "Zone has mobs, so you cannot change the level range."
                                                    minLevel.setAttribute('disabled', true)
                                                    minLevel.setAttribute('type', 'text')
                                                    minLevel.value = z.levelmin + " (cannot edit)"

                                                    maxLevel.setAttribute('type', 'text')
                                                    maxLevel.setAttribute('disabled', true)
                                                    maxLevel.value = z.levelmax + " (cannot edit)"
                                                }
                                            }
                                        })
                                })
                            })
                        }
                    })
            })

    }
}
