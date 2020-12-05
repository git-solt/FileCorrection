export default function (dataHandler, htmlElement, eventHandler) {
    htmlElement.innerHTML = ''
    console.log(dataHandler.getItems())
    dataHandler.getItems().forEach((row) => {
        htmlElement.parentElement.style.position = 'relative'
        const rowNode = document.createElement('tr')
        rowNode.addEventListener('dblclick', eventHandler)
        

        if(htmlElement.hasOwnProperty('withAll')) {
            rowNode.appendChild()
        }

        rowNode.addEventListener('mouseenter', function(e) {
            if (e.target === this) {
                const p = document.createElement('p')
                p.id = this.rowIndex
                p.textContent = this.rowIndex + 1
                p.style.width = "10px"
                p.style.height = "5px"
                p.style.margin = "5px"
                p.style.position = 'absolute'
                p.className = "linenumber"
                
                
                p.style.left = "-25px"

                this.appendChild(p)
                console.dir(this)}
        })

        rowNode.addEventListener('mouseleave', function(e){
            if(e.target === this) {
                this.lastChild.remove()
            }
        })
       
        htmlElement.appendChild(rowNode)

        row.forEach((tableItem) => {

            const tableDataNode = document.createElement('td')

            tableDataNode.textContent = tableItem
            rowNode.appendChild(tableDataNode)
        })
    })
}