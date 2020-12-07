let showAllLineNumbers = false

function toggleShowAllLinenumbers() {
    showAllLineNumbers = !showAllLineNumbers
    console.log(showAllLineNumbers)
    return showAllLineNumbers
}


function sendDataAndDecideLineNumberDisplay(htmlElement) {
    console.log(showAllLineNumbers)
    return showAllLineNumbers ? {withAll: htmlElement} : htmlElement
}

export {toggleShowAllLinenumbers, sendDataAndDecideLineNumberDisplay}