import storage from './storage.js'
import SEPARATOR from './separator.js'
import renderData from './renderData.js'

function readSourceAndCreateTable(separator, { done, value }, reader, eventHandler) {
    if (separator === SEPARATOR.SPACE) {
        readBytesAndCreateTableFromFileDataSpaceSeparated({ done, value }, reader, eventHandler)

    } else readBytesAndCreateTableFromFileDataTabSeparated({ done, value }, reader)
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
    exportBtn.addEventListener('click', mapDataForNewFile)
    main.appendChild(exportBtn)


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

function mapDataForNewFile() {


    let firstRow = storage.getItems().filter(row => row[0] === "01")
    let rowRecordType40 = storage.getItems().filter(row => row[0] === "40")
    let rowRecordType60 = storage.getItems().filter(row => row[0] === "60")
    let lastRow = storage.getItems().filter(row => row[0] === "99")
    let totalLength



    firstRow = firstRow.map((firstRow) => {
        return firstRow.map((column, index) => {

            switch (index) {
                case 0:
                case 1:
                    totalLength = 3
                    break;
                case 2:
                    totalLength = 10
                    break;
                case 3:
                    totalLength = 30
                    break;
                case 4:
                    totalLength = 20
                    break;
                case 5:
                    totalLength = 8

            }
            let numberOfWhiteSpaceNeeded = totalLength - column.length
            for (let i = 0; i < numberOfWhiteSpaceNeeded; i++) {

                column += " "


            }
            const endOfLine = index === 5
            if(endOfLine) {
                column += "\n"
            }

            return column
        })

    })

    rowRecordType40 = rowRecordType40.map((row) => {
        return row.map((column, index) => {

            let revertConcatination = false
            switch (index) {
                case 0:
                    totalLength = 7
                    break;
                case 1:
                    totalLength = 9
                    revertConcatination = true
                    break;
                case 2:
                    totalLength = 3
                    break;
                case 3:
                    totalLength = 13
                    revertConcatination = true
                    break;
                case 4:
                    totalLength = 2
                    break;
                case 5:
                    totalLength = 9
                    break;
                case 6:
                    totalLength = 21
                    revertConcatination = true
                    break;
                case 7:
                    totalLength = 25
                    revertConcatination = true
                    break;
                case 8:
                    totalLength = 150
                    revertConcatination = true
                    break;

            }
            let numberOfWhiteSpaceNeeded = totalLength - column.length
            for (let i = 0; i < numberOfWhiteSpaceNeeded; i++) {
                const endOfLine = index === 8 && i === numberOfWhiteSpaceNeeded - 1


                if (revertConcatination) {
                    column = " ".concat(column)
                    if (i === numberOfWhiteSpaceNeeded - 1 && (index === 6 || index === 1 || index === 3 || index === 7)) {
                        //Append whitespace at the end of column
                        column += " "
                    }
                }
                else column += " "

                if (endOfLine) {
                    column += "\n"
                }
            }

            return column

        })
    })



    rowRecordType60 = rowRecordType60.map((row) => {
        return row.map((column, index) => {

            let revertConcatination = false
            switch (index) {
                case 0:
                    totalLength = 7
                    break;
                case 1:
                    totalLength = 9
                    revertConcatination = true
                    break;
                case 2:
                    totalLength = 3
                    break;
                case 3:
                    totalLength = 9
                    break;
                case 4:
                    totalLength = 22
                    revertConcatination = true
                    break;
                case 5:
                    totalLength = 3
                    break
                case 6:
                    totalLength = 150
                    revertConcatination = true
                    break;

            }
            let numberOfWhiteSpaceNeeded = totalLength - column.length
            for (let i = 0; i < numberOfWhiteSpaceNeeded; i++) {
            const endOfLine = index === 6 && i === numberOfWhiteSpaceNeeded - 1

                if (revertConcatination) {
                    column = " ".concat(column)

                    if (i === numberOfWhiteSpaceNeeded - 1 && (index === 4 || index === 1)) {
                        //append one white space at the end of column
                        column += " "
                    }
                }
                else column += " "
                if(endOfLine) {
                    column += "\n"
                }
            }

            return column

        })
    })


    lastRow = lastRow.map((lastrow) => {
        return lastrow.map((column, index) => {
            let revertConcatination = false
            switch (index) {
                case 0:
                    totalLength = 3
                    break;
                case 1:
                    totalLength = 12
                    break;
                case 2:
                    totalLength = 20
                    revertConcatination = true
                    break;
                case 3:
                    totalLength = 7
                    break;
                case 4:
                    totalLength = 7
                    break
                case 5:
                    totalLength = 6
            }
            const totalNumberOfWhiteSpaceNeeded = totalLength - column.length
            for (let i = 0; i < totalNumberOfWhiteSpaceNeeded; i++) {
                const endOfLine = index === 5 && i === totalNumberOfWhiteSpaceNeeded - 1

                if (revertConcatination) {
                    column = " ".concat(column)
                } else column += " "

                if (endOfLine) {
                    column += "\n"
                }
            }

            return column
        })
    })




    let data = []
    data = data.concat(firstRow, rowRecordType40, rowRecordType60, lastRow)
    console.log(data)

    const arrayOfArraysOfBytes = data.map((row)=> {
        return row.map((column)=> {
            return column.split('')
                        .map(char => char.charCodeAt())
        })

    }).flat()
    

    const bytesBuffer = arrayOfArraysOfBytes.flat()
    // bytesBuffer.forEach(cur => {
    //     let char = String.fromCharCode(cur)
    //     let visibleSpace = char === " " ? "*" : char
    //     consoleString+= visibleSpace
    // })


    // console.log(consoleString)

    const typedArrayForByteBuffer = new Int8Array(bytesBuffer)

    const downloadableFile = new Blob([typedArrayForByteBuffer.buffer], {type: "text/plain"})
    const url = URL.createObjectURL(downloadableFile)

    // const a = document.createElement('a')
    // a.href = url
    // a.download = "08collectdownload.txt"
    // a.textContent = "Click for download"
    // a.style.color = "white"
    // document.body.appendChild(a)
    // a.click()

    window.open(url, '_blank')

}


function parseTableAndWriteDownloadableFile(e) {

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
}

export default readSourceAndCreateTable