export default function (dataHandler, htmlElement, eventHandler) {
    htmlElement.innerHTML = ''
    console.log(dataHandler.getItems())
    dataHandler.getItems().forEach((row) => {

        const rowNode = document.createElement('tr')
        rowNode.addEventListener('dblclick', eventHandler)
        htmlElement.appendChild(rowNode)

        row.forEach((tableItem) => {

            const tableDataNode = document.createElement('td')

            tableDataNode.textContent = tableItem
            rowNode.appendChild(tableDataNode)
        })
    })
}