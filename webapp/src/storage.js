export default () => {
    return {
        quest,
        account,
        saveAll,
    }

    function account(accountHash) {
        const cq = quest() || {}

        return new UserAccount(accountHash)
    }

}

class UserAccount {
    constructor(hash) {
        // defaults
        this.hash = hash
        this.last_visited = new Date()
        this.selected_character = null

        const cq = quest() || {}

        // if we have a storage record for this account,
        // we'll init the stored values
        if (cq[this.hash]) {
            this.selected_character = cq[this.hash].selected_character || null
        }

        this.save()
    }

    accountNumber() {
        return this.hash
    }

    selectCharacter(character) {
        this.selected_character = character

        this.save('selected_character', this.selected_character)
    }

    updateLastVisited() {
        this.last_visited = new Date()

        this.save('last_visited', this.last_visited)
    }

    lastVisited() {
        return this.last_visited
    }

    save(key, data) {
        if (key && !data) {
            throw new Error('You must either call save() with no args or save(key, data)')
            return
        }

        const cq = quest() || {}

        // this may be our first time saving this account
        if (!cq[this.hash]) {
            cq[this.hash] = {}
        }

        // overwrite the entire userAccount details
        if (!key && !data) {
            cq[this.hash] = this
        }
        // just save a particular key in the user details
        else {
            cq[this.hash][key] = data
        }

        localStorage.setItem('cryptoquest', JSON.stringify(cq))
    }
}

function quest() {
    return JSON.parse(localStorage.getItem('cryptoquest'))
}

// useAccountKey string
// userDetails object
function saveAll(cq) {
    localStorage.setItem('cryptoquest', JSON.stringify(cq))
}

