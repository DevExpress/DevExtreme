testUtils.postponeUntil(()=>{
    const header = document.querySelector('#dx-col-2 > div.dx-datagrid-text-content.dx-text-content-alignment-right');
    return header && header.innerText === 'Invoice Number';
}, 100, 3000);
