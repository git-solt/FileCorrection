export default function (dataHandler, htmlElement, eventHandler) {
    const shouldRenderAllLineNumbers = htmlElement.hasOwnProperty("withAll")
    const table = shouldRenderAllLineNumbers ? htmlElement.withAll : htmlElement
    const errorPanel = document.querySelector('#errorpanel')
    errorPanel.firstElementChild.innerHTML = ""

    table.innerHTML = ''
    console.log(dataHandler.getItems())
    dataHandler.getItems().forEach((row, index) => {
        table.parentElement.style.position = 'relative'
        const rowNode = document.createElement('tr')
        rowNode.addEventListener('dblclick', eventHandler)
        const lineNumber = createBasicLineNumber()

        if (dataHandler.isErrorItem(row)) {
            rowNode.classList.add("erroritem")
        }

        table.appendChild(rowNode)

        row.forEach((tableItem, columnIndex) => {
            const isLastRow = index === dataHandler.getItems().length -1
            const isTotalSumColumn = isLastRow && columnIndex === 2
            const tableDataNode = document.createElement('td')

            tableDataNode.textContent =  isTotalSumColumn ?  parseFloat(tableItem).toFixed(2) : tableItem

            rowNode.appendChild(tableDataNode)
            const isRecordType60AndNeedColumnFill = columnIndex === 6 && row[0] == 60
            const isLastRowAndNeedsColumnFill = isLastRow && columnIndex === row.length - 1

            //Unoptimal Hack: Filling row to make it expand accross the entire table
            if(isRecordType60AndNeedColumnFill) {
                tableDataNode.colSpan = "2"
            }
            if (isLastRowAndNeedsColumnFill) {
                const fillTd = document.createElement('td')
                fillTd.colSpan = "2"
                rowNode.appendChild(fillTd)
            }
            //

        })

        if (shouldRenderAllLineNumbers) {
            lineNumber.textContent = rowNode.rowIndex + 1
            rowNode.appendChild(lineNumber)
        } else {
            rowNode.addEventListener('mouseenter', function (e) {
                if (e.target === this) {
                    lineNumber.textContent = this.rowIndex + 1
                    this.appendChild(lineNumber)
                }
            })
            rowNode.addEventListener('mouseleave', function (e) {
                if (e.target === this) {
                    this.lastChild.remove()
                }
            })
        }
    })


    createErrorlist(dataHandler.getErrorInstances(), errorPanel.firstElementChild)
    dataHandler.renderDone()

}

function createBasicLineNumber() {
    const p = document.createElement('p')
    p.style.width = "10px"
    p.style.height = "5px"
    p.style.margin = "5px"
    p.style.position = 'absolute'
    p.className = "linenumber"
    p.style.left = "-25px"
    return p
}


function createErrorlist(errors, list) {
    list.style.padding = "0px"
    if (errors.length > 0) {
        let li = document.createElement('li')
        li.textContent = 'Error log'
        list.style.padding = "5px"

        list.appendChild(li)
        errors.forEach((e) => {
            //Replace original linenumberInfo with the updated one
            const errorDisplayMessage = e.errMsg.split(' ').map((errorpart, index) => {
                if (index > 1 && !isNaN(parseInt(errorpart))) {
                    return e.lineNumber
                }
                return errorpart
            }).join(' ')
            li = document.createElement('li')
            li.textContent = errorDisplayMessage
            list.appendChild(li)
            console.log(errorDisplayMessage)
        })
    }
}