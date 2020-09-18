export default ({characters, mobs, zones}, user) => {

    loadZones()

    // create zone form:
    {
        const createZoneBtn = document.querySelector('[data-create-zone]')

        createZoneBtn.addEventListener('click', evt => {
            const name = document.querySelector('[data-zone-name]').value
            const description = document.querySelector('[data-zone-description]').value
            const minLevel = document.querySelector('[data-zone-min-level]').value
            const maxLevel = document.querySelector('[data-zone-max-level]').value

            zones.methods
                .createZone(name, description, parseInt(minLevel), parseInt(maxLevel))
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
                    promises.push(zones.methods.zones(i).call())
                }

                Promise.all(promises)
                    .then((results) => {
                        results.forEach(z => {
                            const image = getRandomThumbnail()

                            const zone = `
                                <div class="trending-item mb-3">
                                    <div class="ti-pic">
                                        <img src="${image}" alt="" style="max-width:80px; max-height:80px;">
                                    </div>
                                    <div class="ti-text">
                                        <h6><a>${z.name}</a></h6>
                                        <p>${z.description}</p>
                                    </div>
                                </div>

                                `
                            zoneList.innerHTML += zone
                        })
                    })
            })

    }
}
