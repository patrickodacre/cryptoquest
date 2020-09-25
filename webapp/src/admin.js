export default ({characters, mobs, zones}, user) => {

    doZoneThings()

    doMobThings()

    function doMobThings() {
        loadMobs()

        let mobData = {}
        let selectedMob = null

        const saveMobBtn = document.querySelector('[data-save-mob]')
        const clearMobBtn = document.querySelector('[data-clear-mob]')
        const heading = document.querySelector('[data-mob-form-heading]')
        let isEditingMob = false


        // listen for a clear form request:
        {
            clearMobBtn.addEventListener('click', evt => {
                isEditingMob = false
                selectedMob = null
                heading.innerHTML = "Create a Mob"

                const {name,description,message} = getFormFields()
                // these would have been disabled when the edit is initialized
                name.value = ""
                description.value = ""
                message.innerHTML = ""
            })
        }

        // create / edit mob types
        // These are more like mob templates;
        // Levels are used for Zone Mobs which
        // are created based on these mob types added.
        {
            saveMobBtn.addEventListener('click', evt => {
                const {name,description,message} = getFormFields()

                // EDIT existing mob
                if (isEditingMob && selectedMob && typeof selectedMob.id !== "undefined") {

                    mobs.methods
                        .editMob(selectedMob.id, name.value, description.value)
                        .send({from: user.hash, gas: 6721975, gasPrice: "20000000000"})
                        .on('receipt', function (resp) {
                            // these would have been disabled when the edit is initialized
                            message.innerHTML = ""
                            loadMobs()
                        })
                        .on('error', function (err) {
                            alert(err.message)
                            message.innerHTML = err.message
                            debugger
                        })

                    return
                }

                // create a new mob type
                mobs.methods
                    .createMob(name.value, description.value)
                    .send({from: user.accountNumber(), gas: 6721975, gasPrice: "20000000000"})
                    .on('receipt', function (resp) {
                        loadMobs()
                    })
                    .on('error', function (err) {
                        alert(err.message)
                        debugger
                    })
            })
        }

        function loadMobs() {
            const mobList = document.querySelector('[data-mob-list]')
            mobList.innerHTML = ""

            mobs.methods.getMobCount().call().then(count => {
                count = parseInt(count)

                let promises = []

                for (let i = 0; i < count; i++) {
                    promises.push(mobs.methods.mobs(i).call().then(resp => ({...resp, ...{id: i}})))
                }

                Promise.all(promises).then((results) => {

                    // create the HTML to build the list of mobs
                    results.forEach(m => {
                        const image = getRandomThumbnail()
                        mobData[m.id] = m

                        const mob = `
                            <div class="trending-item mb-3">
                                <div class="ti-pic">
                                    <img src="${image}" alt="" style="max-width:80px; max-height:80px;">
                                </div>
                                <div class="ti-text">
                                    <h6><a>${m.name}</a></h6>
                                    <p>${m.description}
                                        <br/>
                                        <button
                                            class="btn btn-primary"
                                            data-edit-mob
                                            data-mob-id="${m.id}"
                                        >Edit</button>
                                    </p>
                                </div>
                            </div>

                            `
                        mobList.innerHTML += mob
                    })

                    // add event listeners to each EDIT button
                    {
                        const editMobButtons = document.querySelectorAll('[data-edit-mob]')

                        editMobButtons.forEach(btn => {
                            btn.addEventListener('click', evt => {
                                isEditingMob = true

                                const mobID = evt.currentTarget.getAttribute("data-mob-id")
                                const m = mobData[mobID]
                                selectedMob = m

                                const {name,description,message} = getFormFields()

                                heading.innerHTML = "Editing Mob " + mobID
                                name.value = m.name
                                description.value = m.description
                                message.innerHTML = ""
                            })
                        })
                    }
                })
            })
        }

        function getFormFields() {
            const name = document.querySelector('[data-mob-name]')
            const description = document.querySelector('[data-mob-description]')
            const message = document.querySelector('[data-mob-form-messages]')

            return {name, description, message}
        }
    }

    function doZoneThings() {
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

                const {name,description,minLevel,maxLevel,message} = getFormFields()
                // these would have been disabled when the edit is initialized
                minLevel.removeAttribute('disabled')
                maxLevel.removeAttribute('disabled')
                name.value = ""
                description.value = ""
                minLevel.setAttribute('type', 'number')
                maxLevel.setAttribute('type', 'number')
                minLevel.value = null
                maxLevel.value = null

                message.innerHTML = ""
            })
        }

        // create / edit zone form:
        {
            saveZoneBtn.addEventListener('click', evt => {
                const {name,description,minLevel,maxLevel,message} = getFormFields()

                // edit
                if (isEditingZone && selectedZone && typeof selectedZone.id !== "undefined") {

                    zones.methods
                        .editZone(selectedZone.id, name.value, description.value, parseInt(minLevel.value), parseInt(maxLevel.value))
                        .send({from: user.hash, gas: 6721975, gasPrice: "20000000000"})
                        .on('receipt', function (resp) {
                            // these would have been disabled when the edit is initialized
                            minLevel.removeAttribute('disabled')
                            maxLevel.removeAttribute('disabled')
                            message.innerHTML = ""
                            loadZones()
                        })
                        .on('error', function (err) {
                            alert(err.message)
                            message.innerHTML = err.messsage
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
            const message = document.querySelector('[data-zone-form-messages]')

            return {name, description, minLevel, maxLevel,message}
        }

        function loadZones() {
            const zoneList = document.querySelector('[data-zone-list]')
            zoneList.innerHTML = ""

            // just getting the number of zones
            // and fetching zone info based on the index / id
            // works fine IF/UNTIL I get to the point where I
            // want to support deleting zones.
            zones.methods.getZoneCount().call().then(count => {
                count = parseInt(count)

                let promises = []

                for (let i = 0; i < count; i++) {
                    promises.push(zones.methods.zones(i).call().then(resp => ({...resp, ...{id: i}})))
                }

                Promise.all(promises).then((results) => {

                    // create the HTML for each zone in the list:
                    results.forEach(z => {
                        const image = getRandomThumbnail()
                        zoneData[z.id] = z

                        const zone = `
                            <div class="trending-item mb-3">
                                <div class="ti-pic">
                                    <img src="${image}" alt="" style="max-width:80px; max-height:80px;">
                                </div>
                                <div class="ti-text">
                                    <h6><a href="admin/zones/${z.id}">${z.name}</a></h6>
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

                    // Add event listeners to each list item EDIT button:
                    const editZoneBtns = document.querySelectorAll('[data-edit-zone]')

                    editZoneBtns.forEach(btn => {
                        btn.addEventListener('click', evt => {
                            isEditingZone = true

                            const zoneID = evt.currentTarget.getAttribute("data-zone-id")

                            zones.methods.getZoneMobCount(zoneID).call().then(mobCount => {

                                // update the heading
                                heading.innerHTML = "Editing Zone " + zoneID

                                // fill in the form
                                const z = zoneData[zoneID]
                                selectedZone = z

                                const {name,description,minLevel,maxLevel,message} = getFormFields()

                                name.value = z.name

                                description.value = z.description

                                if (mobCount == "0") {
                                    minLevel.value = z.levelmin
                                    maxLevel.value = z.levelmax
                                    message.innerHTML = ""
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
                            })
                        })
                    })
                    // end add EDIT button event listeners
                })
            })
        }
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

}
