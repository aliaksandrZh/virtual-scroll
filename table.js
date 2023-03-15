const ROW_HEIGHT = 100;

const createTable = () => {
    const table = document.createElement('table');
    appendTableStyles(table);

    return table;
}

const createRow = (i = 0) => {
    const tr = document.createElement('tr');
    const td = createTableData();


    if (i) {
        td.innerText = i;
        tr.id = i;
    }

    appendRowStyles(tr);
    tr.appendChild(td);

    return tr;
}

const createTableData = () => {
    const td = document.createElement('td');
    td.style.textAlign = "center";

    return td;
}

const createNRows = (nRow) => {
    const rows = [];
    let rowIndex = 1;
    for (let i = 0; i < nRow; i++) {
        rows.push(createRow(rowIndex));
        rowIndex++;
    }

    return rows;
}

const appendRowStyles = (element) => {
    element.style.height = `${ROW_HEIGHT}px`;
    element.style.backgroundColor = "lightblue";
}

const appendRowsToTable = (table, rows) => {
    rows.forEach(r => table.appendChild(r));
}

const prependRowsToTable = (table, rows) => {
    rows.reverse().forEach(r => table.prepend(r));
}

const appendTableStyles = (element) => {
    element.style.height = "100%";
    element.style.width = "100%";
    element.style.backgroundColor = "yellow";
}

export const initTable = (container, nRow = 500) => {
    const table = createTable();
    const rows = createNRows(nRow);

    container.appendChild(table);

    if (rows.length >= 50) {
        virtualScroll(container, table, rows);
    }
}

const virtualScroll = (container, table, rows) => {
    const renderedElementsCount = Math.round(container.offsetHeight / ROW_HEIGHT * 2);
    const bufferCount =  Math.round(renderedElementsCount * 25 / ROW_HEIGHT)

    let startIndex = 0;
    let endIndex = renderedElementsCount;

    const renderedRows = rows.slice(startIndex, endIndex);
    const tH = container.offsetHeight;

    appendRowsToTable(table, renderedRows);

    let prevScrollPosition = 0;

    container.addEventListener('scroll', (e) => {
        if (prevScrollPosition > container.scrollTop) {

            if (container.scrollTop <= bufferCount * ROW_HEIGHT) {

                if (endIndex > renderedElementsCount) {
                    const rowsForDeleting = rows.slice(endIndex - bufferCount, endIndex);
                    endIndex = endIndex - bufferCount;
                    rowsForDeleting.forEach(x => x.remove())
                }

                const difference = startIndex - bufferCount;
                const start = startIndex - bufferCount > 0 ? difference : 0;
                const rowsForAppending = rows.slice(start, startIndex);
                startIndex = start;

                prependRowsToTable(table, rowsForAppending);
            }
        } else {
            if (container.scrollTop >= container.scrollHeight - tH - bufferCount * ROW_HEIGHT) {

                if (startIndex < endIndex - renderedElementsCount) {
                    const rowsForDeleting = rows.slice(startIndex, startIndex + bufferCount);
                    startIndex = startIndex + bufferCount;
                    rowsForDeleting.forEach(x => x.remove());
                }

                const rowsForAppending = rows.slice(endIndex, endIndex + bufferCount);
                endIndex = endIndex + bufferCount > rows.length ? rows.length : endIndex + bufferCount;

                appendRowsToTable(table, rowsForAppending);
            }

        }

        prevScrollPosition = container.scrollTop;
    })
}