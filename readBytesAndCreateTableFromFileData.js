import storage from './storage.js'
import SEPARATOR from './separator.js'
import renderData from './renderData.js'

function readSourceAndCreateTable(separator, {done, value}, reader, eventHandler) {
    if(separator === SEPARATOR.SPACE) {
        readBytesAndCreateTableFromFileDataSpaceSeparated({done, value}, reader, eventHandler)
        
    } else readBytesAndCreateTableFromFileDataTabSeparated({done, value}, reader)
}

function readBytesAndCreateTableFromFileDataSpaceSeparated({ done, value }, reader, eventHandler) {
    if (done) {
        reader.cancel()
    }
    const table = document.createElement('table')
    let column = ""
    let tableRow = document.createElement('tr')
    let separated = false
    let item = []

    for (let i = 0; i < value.buffer.byteLength; i++) {
        const char = String.fromCharCode(value[i])

        if (char === " " && !separated) {
            separated = true
            const td = document.createElement('td')
            console.log(column)
            // debugger

            td.textContent = column
            if (tableRow) {
                item.push(column)
                tableRow.appendChild(td)

            }
            column = ""
            continue

        } else if (char === " " && separated) {
            // debugger
            continue
        }

        if (char === "\n") {

            const td = document.createElement('td')
            td.textContent = column
            tableRow.appendChild(td)
            tableRow.addEventListener('dblclick', eventHandler)
            table.appendChild(tableRow)
            item.push(column)
            storage.add(item)
            item = []

            column = ""
            tableRow = document.createElement('tr')
            // debugger
            continue
        }

        separated = false
        column += char
        // debugger 

    }

    //Last row and tabledata column appended here cause no new line for creating it.
    const td = document.createElement('td')
    td.textContent = column
    tableRow.appendChild(td)
    table.appendChild(tableRow)
    main.appendChild(table)

    const exportBtn = document.createElement('button')
    exportBtn.textContent = 'Export table to file'
    exportBtn.addEventListener('click', function (e) {

        if (e.target === this) {
            const table = document.querySelector('table')

            const tableRows = table.children
            const symbolKey = Object.getOwnPropertySymbols(tableRows.__proto__)[1]
            const iterator = tableRows[symbolKey]()

            let buffer = []

            while (true) {
                let result = iterator.next()
                if (!result.done) {
                    const tableRowCollection = result.value.children
                    const tableDataSymbolKeyForIterator = Object.getOwnPropertySymbols(tableRowCollection.__proto__)[1]
                    const iterator = tableRowCollection[tableDataSymbolKeyForIterator]()

                    if (result.value.previousElementSibling) {
                        buffer.push("\n".charCodeAt())
                    }

                    while (true) {
                        const result = iterator.next()
                        let bytes
                        if (!result.done) {
                            bytes = result.value.textContent.split('').map(cur => cur.charCodeAt())
                            console.log(result.value.textContent)
                            if (result.value.nextElementSibling != null) {
                                bytes.push("\t".charCodeAt())
                            }
                            buffer = buffer.concat(bytes)

                        } else {
                            break
                        }
                    }
                } else break

            }

            const int8Array = new Int8Array(buffer)

            const newFile = new Blob([int8Array.buffer], { type: "text/plain" })
            const url = URL.createObjectURL(newFile)
            window.open(url, '_blank')

        }
    })
    main.appendChild(exportBtn)
    main.addEventListener('click', () => {

    })

}

function readBytesAndCreateTableFromFileDataTabSeparated({ done, value }, reader, eventHandler) {
    if (done) {
        reader.cancel()
    }
    const table = document.createElement('table')
    let column = ""
    let tableRow = document.createElement('tr')

    for (let i = 0; i < value.buffer.byteLength; i++) {
        const char = String.fromCharCode(value[i])

        if (char === " ") {
            continue
        }

        if (char === "\n") {
            const td = document.createElement('td')
            td.textContent = column
            tableRow.appendChild(td)
            table.appendChild(tableRow)


            column = ""
            tableRow = document.createElement('tr')
            continue
        }

        if (char === "\t") {
            const td = document.createElement('td')
            console.log(column)
            td.textContent = column
            if (tableRow) {
                tableRow.appendChild(td)

            }
            column = ""
            continue
        }

        column += char

    }

    //Last row and tabledata column appended here cause no new line for creating it.
    const td = document.createElement('td')
    td.textContent = column
    tableRow.appendChild(td)
    table.appendChild(tableRow)
    main.appendChild(table)

    const exportBtn = document.createElement('button')
    exportBtn.textContent = 'Export table to file'
    exportBtn.addEventListener('click', function (e) {

        if (e.target === this) {
            const table = document.querySelector('table')

            const tableRows = table.children
            const symbolKey = Object.getOwnPropertySymbols(tableRows.__proto__)[1]
            const iterator = tableRows[symbolKey]()

            let buffer = []

            while (true) {
                let result = iterator.next()
                if (!result.done) {
                    const tableRowCollection = result.value.children
                    const tableDataSymbolKeyForIterator = Object.getOwnPropertySymbols(tableRowCollection.__proto__)[1]
                    const iterator = tableRowCollection[tableDataSymbolKeyForIterator]()

                    if (result.value.previousElementSibling) {
                        buffer.push("\n".charCodeAt())
                    }

                    while (true) {
                        const result = iterator.next()
                        let bytes
                        if (!result.done) {
                            bytes = result.value.textContent.split('').map(cur => cur.charCodeAt())
                            console.log(result.value.textContent)
                            if (result.value.nextElementSibling != null) {
                                bytes.push("\t".charCodeAt())
                            }
                            buffer = buffer.concat(bytes)

                        } else {
                            break
                        }
                    }
                } else break


            }

            const int8Array = new Int8Array(buffer)


            const newFile = new Blob([int8Array.buffer], { type: "text/plain" })
            const url = URL.createObjectURL(newFile)
            window.open(url, '_blank')


        }
    })
    main.appendChild(exportBtn)
    main.addEventListener('click', () => {

    })

}

export default readSourceAndCreateTable