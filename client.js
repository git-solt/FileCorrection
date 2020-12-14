import separator from './separator.js'
import readSourceAndCreateTable, { parseLogFileAndExtractData } from './fileOperations.js'
import storage from './storage.js'
import renderData from './renderData.js'
import { clearSorting, getFilter, toggleShowAllLinenumbers, sendDataAndDecideLineNumberDisplay, setFilterRecordType_40, setFilterRecordType_60, clearFilterRecordType, manipulateData, setFilterSortBySum, clearAllFilters } from './uiutils.js'


const upload = document.querySelector('#upload')
const buttonPanel = document.querySelector('#buttonpanel')
const uploadLabel = document.querySelector('#uploadLabel')
const content = document.querySelector('#content')


upload.addEventListener('input', handleUpload, { once: true })


function handleUpload(e) {
    const file = e.target.files[0]

    if (file) {
        const stream = file.stream()
        const reader = stream.getReader()


        function readTheStream() {

            reader.read().then(({ done, value }) => {

                readSourceAndCreateTable(separator.SPACE, { done, value }, reader, handleTableRowDoubleClick)
            })
        }

        readTheStream()
        invokeToggleLineNumberButton()
        invokeFilterPanel()
        invokeSortingButton()
        uploadLabel.textContent = "Add Error Log"

        //Adding a new eventlistener for handeling log file
        function handleUploadErrorLog(e) {
            const file = e.target.files[0]
            parseLogFileAndExtractData(file, (e) => {
                if (e) {
                    content.textContent = "Error parsing data"
                } else {
                    if (storage.getErrorInstances().length > 0) {

                        renderData(manipulateData(storage), sendDataAndDecideLineNumberDisplay(document.querySelector('table')), handleTableRowDoubleClick)
                        uploadLabel.classList.add("button--hide", "text-success")
                        uploadLabel.textContent = "Log Added"

                        setTimeout(() => {
                            uploadLabel.style.visibility = "hidden"
                        }, 4500)
                        this.removeEventListener('input', handleUploadErrorLog)
                    } else {
                        content.textContent = "Could not find error entries. Please check the file"
                    }
                }
            })
        }

        this.addEventListener('input', handleUploadErrorLog)
    }
}

function handleTableRowDoubleClick(e) {
    const type = this.children[0].textContent
    const invoiceNumber = this.children[1].textContent
    if (type == 40 || type == 60) {
        const index = storage.getItems().findIndex((cur) => cur[0] === type && cur[1] === invoiceNumber)
        storage.removeItemByIndex(index)
        storage.notifyDataChange()
    }
    renderData(manipulateData(storage), sendDataAndDecideLineNumberDisplay(document.querySelector('table')), handleTableRowDoubleClick)
}



function invokeToggleLineNumberButton() {
    const toggleBtn = document.createElement('button')
    toggleBtn.classList.add('button', 'button--small')
    toggleBtn.textContent = 'Show Linenumbers'
    toggleBtn.style.position = 'absolute'
    toggleBtn.style.left = "0px"


    buttonPanel.appendChild(toggleBtn)
    toggleBtn.style.top = "" + buttonPanel.clientHeight - toggleBtn.offsetHeight + "px"


    toggleBtn.addEventListener('click', function (e) {
        if (e.target === this) {
            //Clear all checked checkboxes to avoid double click after linenumber render
            const children = Array.from(buttonPanel.children)
            children.forEach(cur => {
                if (cur.id === "filterpanel") {
                    const checkboxes = Array.from(cur.children)
                    checkboxes.forEach((checkbox) => {
                        if (checkbox.checked) {
                            if (checkbox.id === "type60") {
                                setFilterRecordType_60()
                            } else setFilterRecordType_40()
                        }
                    })
                }
            })
            const showingAll = toggleShowAllLinenumbers()
            this.textContent = showingAll ? 'Hide linenumbers' : 'Show Linenumbers'
            renderData(manipulateData(storage), sendDataAndDecideLineNumberDisplay(document.querySelector('table')), handleTableRowDoubleClick)
        }
    })
}

function invokeFilterPanel() {
    const container = document.createElement('div')
    container.classList.add('container', 'container--row', 'container--flex-end', 'width--minor')
    container.style.position = "absolute"
    container.style.right = "0px"
    container.style.bottom = "1px"
    const [paymentFilter, paymentCheckbox] = createBasicFilter("type40", "Payments")
    const [caseFilter, caseCheckbox] = createBasicFilter("type60", "Cases")

    paymentCheckbox.addEventListener('change', handleFilteringData)
    caseCheckbox.addEventListener('change', handleFilteringData)

    container.id = "filterpanel"
    container.appendChild(paymentCheckbox)
    container.appendChild(paymentFilter)
    container.appendChild(caseCheckbox)
    container.appendChild(caseFilter)
    buttonPanel.appendChild(container)



}

function invokeSortingButton() {
    const button = createBasicSortingButton()
    button.style.right = 0
    button.style.top = '12px'
    buttonPanel.appendChild(button)
    button.addEventListener('click', handleTableSorting)
}

function handleTableSorting(e) {
    if (e.target === this) {
        if (getFilter().orderBy === "sum") {
            clearSorting()
        } else setFilterSortBySum()
    }

    renderData(manipulateData(storage), sendDataAndDecideLineNumberDisplay(document.querySelector('table')), handleTableRowDoubleClick)
}

function createBasicSortingButton(id = "sortingbtn") {
    const button = document.createElement('button')
    button.classList.add("button", "button--small", "button--filter", "margin--tiny-left")
    button.id = id
    button.style.position = "absolute"
    button.textContent = "Sort by sum"
    return button
}

function createBasicFilter(id, textContent) {
    const checkbox = document.createElement('input')
    checkbox.type = "checkbox"
    checkbox.id = id
    const filter = document.createElement('label')
    filter.htmlFor = id
    filter.textContent = textContent
    checkbox.style.display = "none"
    filter.classList.add("button", "button--small", "button--filter", "margin--tiny-left")
    return [filter, checkbox]
}


function handleFilteringData(e) {
    const thisCheckbox = e.target

    const children = Array.from(thisCheckbox.parentElement.children)
    children.forEach(checkBox => {
        if (checkBox !== thisCheckbox && checkBox.checked) {
            checkBox.checked = false
        }
    })

    if (thisCheckbox.checked) {
        console.log("red")
    } else console.log("none")

    if (thisCheckbox.checked && thisCheckbox.id === "type60") {
        setFilterRecordType_60()
    } else if (thisCheckbox.checked && thisCheckbox.id === "type40") {
        setFilterRecordType_40()
    } else clearFilterRecordType()

    renderData(manipulateData(storage), sendDataAndDecideLineNumberDisplay(document.querySelector('table')), handleTableRowDoubleClick)

}