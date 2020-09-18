export default ({characters, mobs, zones}, user) => {

    loadZones()

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

    function loadZones() {
        const zoneList = document.querySelector('[data-zone-list]')
        zoneList.innerHTML = ""

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
                            zoneList.innerHTML += `
<li class="list-group-item">${z.name} - ${z.description}</li>
`
                        })


                    })
            })

    }
}
