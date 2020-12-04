import separator from './separator.js'
import readSourceAndCreateTable from './fileOperations.js'
import storage from './storage.js'
import renderData from './renderData.js'

const upload = document.querySelector('#upload')
const text = document.querySelector("#textinp")
const main = document.querySelector('#main')

text.addEventListener('input', (e) => {
  renderData(storage, document.querySelector('table'))
})

upload.addEventListener('input', handleUpload)

async function uploadToSpringBackend(e) {
    const file = e.target.files[0]
    const formdata = new FormData()
    formdata.append('file', file)

    try {
        const result = await fetch('http://localhost:8080/upload', {
            method: "POST",
            headers: {

            },
            mode: 'no-cors',
            body: formdata
        })
        console.log(result)

    } catch (e) {
        console.log(e)
    }

}

function handleUpload(e) {
    const file = e.target.files[0]

    if (file) {
        const stream = file.stream()
        const reader = stream.getReader()


        function readTheStream() {

            reader.read().then(({ done, value }) => {

                readSourceAndCreateTable(separator.SPACE,{ done, value }, reader ,handleTableRowDoubleClick)
            })
        }

        readTheStream()
    }
}

function handleTableRowDoubleClick(e) {
    storage.removeIndex(this.rowIndex)
    storage.notifyDataChange()
    renderData(storage, document.querySelector('table'), handleTableRowDoubleClick)
}






