export default function (dataHandler, htmlElement, eventHandler) {
    htmlElement.innerHTML = ''
    dataHandler.getItems().forEach((row, rowIndex) => {

        const rowNode = document.createElement('tr')
        rowNode.addEventListener('dblclick', eventHandler)
        htmlElement.appendChild(rowNode)

        row.forEach((tableItem, tableDataIndex) => {

            const tableDataNode = document.createElement('td')
            const isTotalColumn = rowIndex === dataHandler.getItems().length - 1 && tableDataIndex === 2

            const tableDataValue = isTotalColumn ? dataHandler.getTotalAmount()  : tableItem


            tableDataNode.textContent = tableDataValue
            rowNode.appendChild(tableDataNode)
        })
    })
}