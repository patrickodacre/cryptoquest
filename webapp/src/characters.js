import media from "./media"
import entities from "./entities"

export default ({characters, mobs, zones}, user) => {

    loadCharacters()

    let characterData = {}
    let selectedCharacter = null

    const saveCharacterBtn = document.querySelector('[data-save-character]')
    const clearForm = document.querySelector('[data-clear-character]')
    const heading = document.querySelector('[data-character-form-heading]')
    let isEditing = false

    // initialize form
    {
        const {surname} = getFormFields()

        surname.value = "(must be at least level 20)"
        surname.setAttribute('disabled', true)
    }

    // listen for a clear form request:
    {
        clearForm.addEventListener('click', evt => {
            isEditing = false
            selectedCharacter = null
            heading.innerHTML = "Create a Character"

            const {firstname, surname, bio, message} = getFormFields()
            // these would have been disabled when the edit is initialized
            firstname.value = ""
            surname.value = ""
            bio.value = ""
            message.innerHTML = ""

            // can't set surname for a new character
            surname.value = "(must be at least level 20)"
            surname.setAttribute('disabled', true)
        })
    }

    // save character
    {
        saveCharacterBtn.addEventListener('click', evt => {
            const {firstname, surname, bio, message} = getFormFields()

            // EDIT existing char
            if (isEditing && selectedCharacter && typeof selectedCharacter.id !== "undefined") {

                characters.methods
                    .editCharacter(selectedCharacter.id, firstname.value, surname.value, bio.value)
                    .send({from: user.hash, gas: 6721975, gasPrice: "20000000000"})
                    .on('receipt', function (resp) {
                        // these would have been disabled when the edit is initialized
                        message.innerHTML = ""
                        loadCharacters()
                    })
                    .on('error', function (err) {
                        alert(err.message)
                        message.innerHTML = err.message
                    })

                return
            }

            // create a new char
            // new chars cannot have a surname
            characters.methods
                .createCharacter(firstname.value, bio.value)
                .send({from: user.accountNumber(), gas: 6721975, gasPrice: "20000000000"})
                .on('receipt', function (resp) {
                    loadCharacters()
                })
                .on('error', function (err) {
                    alert(err.message)
                    message.innerHTML = err.message
                })
        })
    }

    function getFormFields() {
        const firstname = document.querySelector('[data-character-firstname]')
        const surname = document.querySelector('[data-character-surname]')
        const bio = document.querySelector('[data-character-bio]')
        const message = document.querySelector('[data-character-form-messages]')

        return {firstname, surname, bio, message}
    }

    function loadCharacters() {
        return entities.characters(characters).then(chars => {

            // add HTML to the page
            {
                const charList = document.querySelector('[data-character-list]')
                charList.innerHTML = ""

                chars.forEach(c => {
                    const image = media.getRandomThumbnail()
                    characterData[c.id] = c

                    const char = `
                        <div class="trending-item mb-3">
                            <div class="ti-pic">
                                <img src="${image}" alt="" style="max-width:80px; max-height:80px;">
                            </div>
                            <div class="ti-text">
                                <h6><a>${c.name}</a></h6>
                                <p>${c.bio}
                                    <br/>
                                    <button
                                        class="btn btn-primary"
                                        data-edit-character
                                        data-character-id="${c.id}"
                                    >Edit</button>
                                </p>
                            </div>
                        </div>

                        `
                    charList.innerHTML += char

                })
            }

            // add event listeners to each EDIT button
            {
                const editCharBtns = document.querySelectorAll('[data-edit-character]')

                editCharBtns.forEach(btn => {
                    btn.addEventListener('click', evt => {
                        isEditing = true

                        const charID = evt.currentTarget.getAttribute("data-character-id")
                        const m = characterData[charID]
                        selectedCharacter = m

                        const {firstname, surname, bio, message} = getFormFields()

                        heading.innerHTML = "Editing Character " + charID
                        firstname.value = m.firstname
                        bio.value = m.bio
                        message.innerHTML = ""

                        if (m.level >= 20) {
                            surname.value = m.surname
                            surname.removeAttribute('disabled')
                        } else {
                            surname.value = "(must be at least level 20)"
                            surname.setAttribute('disabled', true)
                        }
                    })
                })
            }
        })
    }
}
