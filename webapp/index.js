import start from './src/start'
import admin from './src/admin'
import zone from './src/zone'
import adventureZone from './src/adventure-zone'
import home from './src/home'
import characters from './src/characters'
import storage from './src/storage'
import styles from './src/styles/index.scss'

const modules = {
    admin: (...things) => admin(...things),
    home: (...things) => home(...things),
    characters: (...things) => characters(...things),
    zone: (...things) => zone(...things),
    adventureZone: (...things) => adventureZone(...things),
}

window.addEventListener('load', () => {
    start()
        .then(abis => {
            const module = document.querySelector('[dapp-module]').getAttribute('dapp-module')

            if (!module || !modules[module]) {

                console.log("no module found")
                return
            }

            if (!abis.userAccount) {
                alert("You cannot use this site without an account.")
                return
            }

            // bootstrap the account:
            const storedAccount = storage().account(abis.userAccount)

            storedAccount.updateLastVisited()

            modules[module](abis, storedAccount)
        })
})


