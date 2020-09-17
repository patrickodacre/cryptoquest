import start from './src/start'
import admin from './src/admin'

const modules = {
    admin: abis => admin(abis)
}

start()
    .then(abis => {
        const module = document.querySelector('[dapp-module]').getAttribute('dapp-module')

        if (!module || !modules[module]) {

            console.log("no module found")
            return
        }

        modules[module](abis)
    })

