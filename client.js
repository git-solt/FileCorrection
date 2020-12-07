import separator from './separator.js'
import readSourceAndCreateTable, {parseLogFileAndExtractData} from './fileOperations.js'
import storage from './storage.js'
import renderData from './renderData.js'
import { toggleShowAllLinenumbers, sendDataAndDecideLineNumberDisplay } from './uiutils.js'


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
        uploadLabel.textContent = "Add errorlog"
        //Adding a new eventlistener for handeling log file
        this.addEventListener('input', (e) => {
            const file = e.target.files[0]
            parseLogFileAndExtractData(file, (e)=> {
                if(e) {
                    content.textContent = "Error parsing data"
                } else {
                    renderData(storage, sendDataAndDecideLineNumberDisplay(document.querySelector('table')), handleTableRowDoubleClick)
                    
                }
            })
            
        }, { once: true })
    }
}

function handleTableRowDoubleClick(e) {
    storage.removeItemByIndex(this.rowIndex)
    storage.notifyDataChange()
    renderData(storage, sendDataAndDecideLineNumberDisplay(document.querySelector('table')), handleTableRowDoubleClick)
}



function invokeToggleLineNumberButton() {
    const toggleBtn = document.createElement('button')
    toggleBtn.classList.add('button', 'button--small')
    toggleBtn.textContent = 'Show Linenumbers'
    toggleBtn.style.position = 'absolute'
    toggleBtn.style.left = "0px"
    console.dir(buttonPanel.offsetHeight)
    console.dir(buttonPanel.clientHeight)

    buttonPanel.appendChild(toggleBtn)
    toggleBtn.style.top = "" + buttonPanel.clientHeight - toggleBtn.offsetHeight + "px"



    toggleBtn.addEventListener('click', function (e) {
        if (e.target === this) {
            const showingAll = toggleShowAllLinenumbers()
            this.textContent = showingAll ? 'Hide linenumbers' : 'Show Linenumbers'
            renderData(storage, sendDataAndDecideLineNumberDisplay(document.querySelector('table')), handleTableRowDoubleClick)
        }
    })
}



// function parseLogFileAndExtractData(file, cb) {
//     const reader = new FileReader()

//     reader.readAsArrayBuffer(file)

//     reader.onload = () => {
//         const bytebuffer = reader.result
//         const bytes = new Int8Array(bytebuffer)
//         let lineNumber = ""
//         let errMsg = ""
//         for (const byte of bytes) {
//             const char = String.fromCharCode(byte)
//             const isReferanceToLineNumber = !isNaN(parseInt(char))
//             if (isReferanceToLineNumber && errMsg.includes("line")) {
//                 lineNumber += char
//             }
//             errMsg += char
//             if (char === "\n") {
//                 lineNumber = parseInt(lineNumber)
//                 const errorItem = storage.get(lineNumber - 1)
//                 const id = errorItem[1]
//                 const errorInstance = {
//                     lineNumber,
//                     errMsg,
//                     id
//                 }
//                 storage.addErrorInstance(errorInstance)
//                 lineNumber = ""
//                 errMsg = ""
//             }
//         }
//         if (errMsg.length > 0) {
//             console.log("OK")

//         }
//         console.log(storage.getErrorInstances())
//         cb() 
//     }

//     reader.onerror = (e) => {
//         cb(e)
//     }

    
// }