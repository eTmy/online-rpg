const projectName = 'onlinerpg';
let currentRoom = getCookie('currentRoom');

showContent(currentRoom);
showStatistic();

async function showStatistic() {
    let statistic = await getStatistic();

    document.getElementById("login").innerHTML = statistic.login + ': ';
    document.getElementById("hpStatus").innerHTML = 'HP: ' + statistic.hp;
    document.getElementById("strengthStatus").innerHTML = 'STR: ' + statistic.strength;
    document.getElementById("agilityStatus").innerHTML = 'AGI: ' + statistic.agility;
    document.getElementById("staminaStatus").innerHTML = 'CON: ' + statistic.stamina;
    document.getElementById("intellectStatus").innerHTML = 'INT: ' + statistic.intellect;
}

async function getStatistic() {
    const response = await fetch(`/${projectName}/statistic`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

async function showContent(location) {
    let newLocation = await getLocation(location);

    let roomImage = document.querySelector('#roomImage');
    roomImage.src = newLocation.srcImage;

    document.getElementById('npcBar').innerHTML = generateNpcBarHtml(newLocation.creatures);
    document.getElementById('locationBar').innerHTML = generateLocationBarHtml(newLocation);
}

async function getLocation(location) {
    const response = await fetch(`/${projectName}/location?location=${location}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

function generateNpcBarHtml(creatures) {
    let npcBarHtml = '';

    creatures.forEach(
        function (creature) {
            npcBarHtml = npcBarHtml + `
            <a href = "#" class = "list-group-item list-group-item-action py-3 lh-sm">
                <div class = "d-flex w-100 align-items-center justify-content-between">
                    <strong class = "mb-1"> ${creature.name}</strong>
                    <strong class = "mb-1">${creature.nickname}</strong>
                </div>
                <img src="${creature.srcImage}" class="card-img-top" id="npcImage" style="margin-bottom: 15px">
                <div class="text-center" style="margin-bottom: 15px">
                    <strong class="mb-1">
                        HP: ${creature.hp}
                        STR: ${creature.strength}
                        AGI: ${creature.agility}
                        CON: ${creature.stamina}
                        INT: ${creature.intellect}
                    </strong>
                </div>
                <div class="text-center">
                    <div class="mb-1">${creature.description}</div>
                    <div style="margin-top: 15px"> 
                        <button type="button" class="btn btn-dark" onclick="showDialog('${creature.name}', 1, '${creature.srcImage}')">
                            <small>Speak</small>
                        </button>
                        <button type="button" class="btn btn-dark">
                            <small>Attack</small>
                        </button>
                    </div>
                </div>
        </a>`
        }
    )

    return npcBarHtml;
}

function generateLocationBarHtml(location) {
    let locationsHtml = `<h5 class="card-title" id="roomName">${location.name}</h5>
    <p class="card-text">${location.text}</p>`

    location.locations.forEach(
        function (currentValue) {
            locationsHtml = locationsHtml + `<a href="#" class="btn btn-dark" onclick="showContent('${currentValue}')">${currentValue}</a>\n`
        }
    )

    return locationsHtml;
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

async function showDialog(npcName, messageId, srcImage) {
    let dialog = await getDialog(npcName, messageId);
    showModal(getDialogHtml(npcName, dialog, srcImage));
}

async function getDialog(npcName, messageId) {
    const response = await fetch(`/${projectName}/dialog?npcName=${npcName}&messageId=${messageId}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

function getDialogHtml(npcName, dialog, srcImage) {
    let dialogHtml = `
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="text-center " style="margin: 15px"> 
                        <h5>${npcName}</h5>                      
                    </div>
                    <div class="list-group-item list-group-item-action py-3 lh-sm text-center">
                        <img src="${srcImage}" class="card-img-top">                                              
                    </div>
                    <div class="text-center" style="margin: 15px">
                        ${dialog.text}
                    </div>
                    <div class="text-center" style="margin: 15px">                                      
        `;
    dialog.answers.forEach(
        function (answer) {
            dialogHtml = dialogHtml + `
                <button type="button" class="btn btn-dark"  style="margin: 5px" data-bs-dismiss="modal" onclick="showDialog('${npcName}', '${answer.nextMessageId}', '${srcImage}')">${answer.text}</button>       
            `;
        }
    )

    dialogHtml = dialogHtml + `
                    </div>
                </div>
            </div>
        </div>`

    return dialogHtml;

//         <!--<button type="button" class="btn btn-dark" data-bs-dismiss="modal">Close</button>-->
// <!--        <button type="button" class="btn btn-primary">Understood</button>-->

}

let modalWrap = null;
const showModal = (dialogHtml) => {

    if(modalWrap !== null) {
        modalWrap.remove();
    }

    modalWrap = document.createElement('div');
    modalWrap.innerHTML = dialogHtml;
    document.body.append(modalWrap);

    let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();
}
