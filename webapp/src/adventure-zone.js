import media from "./media"
import entities from "./entities"

export default ({characters, mobs, zones}, user) => {

    const zoneID = document.querySelector('[data-zone-id]').getAttribute('data-zone-id')
    const zoneMobData = {}
    let isAttacking = false

    entities.zone(zones, zoneID)
        .then(zone => {

            // update page info:
            {
                document.querySelector('[data-page-title]')
                    .innerHTML = `
                    <div>
                        <h1 class="page-title">Entering ${zone.name}...</h1>
                    </div>
                `

                document.querySelector('[data-zone-description]')
                    .innerHTML = `
                    <p>${zone.description}</p>
                `
            }
        })

    entities.zoneMobs(zones, zoneID).then(zoneMobs => {
        // render the HTML list
        {
            const list = document.querySelector('[data-zone-mob-list]')
            list.innerHTML = ""

            zoneMobs.forEach(m => {

                const image = media.getRandomThumbnail()
                zoneMobData[m.id] = m

                const zMob = `
                    <div class="trending-item mb-3" style="flex:1 0 48%">
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
                                    class="btn btn-danger"
                                    data-attack-zone-mob
                                    data-zone-mob-id="${m.id}"
                                >Attack</button>
                            </p>
                        </div>
                    </div>

                    `
                list.innerHTML += zMob
            })
        }

        // add event listeners for the ATTACK!
        {
            const attackMobBtns = document.querySelectorAll('[data-attack-zone-mob]')

            attackMobBtns.forEach(btn => {
                btn.addEventListener('click', evt => {
                    isAttacking = true

                    const mobID = evt.currentTarget.getAttribute("data-zone-mob-id")

                    const zoneMob = zoneMobData[mobID]

                    alert("Attacking " + zoneMob.name + " - level " + zoneMob.level)
                })
            })
        }

    })
}
