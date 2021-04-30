
const init = function(e) {
    /*let btnSan = document.getElementById("btn_san");

    btnSan.addEventListener('click', function (){
        localStorage.setItem('empresaMin', 'SAN.MC');
        localStorage.setItem('nombreEmpresa', "Banco Santander")
        window.document.location = './empresa.html';
    });

    let btnAcc = document.getElementById("btn_ana");
    btnAcc.addEventListener('click', function (){
        localStorage.setItem('empresaMin', 'ANA.MC');
        localStorage.setItem('nombreEmpresa', "Acciona")
        window.document.location = './empresa.html';
    });

    let btnCax = document.getElementById("btn_cabk");
    btnCax.addEventListener('click', function (){
        localStorage.setItem('empresaMin', 'CABK.MC');
        localStorage.setItem('nombreEmpresa', "CaixaBank")
        window.document.location = './empresa.html';
    });

    let btnEnd = document.getElementById("btn_ele");
    btnEnd.addEventListener('click', function (){
        localStorage.setItem('empresaMin', 'ELE.MC');
        localStorage.setItem('nombreEmpresa', "Endesa")
        window.document.location = './empresa.html';
    });
    */
}

const dirEmpresa = (e) => {
    let ticker = e.id.slice(4).toUpperCase();
    let nombre = e.parentElement.childNodes[1];
    nombre = nombre.innerHTML;

    localStorage.setItem('ticker', ticker);
    localStorage.setItem('nombreEmpresa', nombre);

    window.document.location = './empresa.html';

}



document.addEventListener('DOMContentLoaded', function (){
init();
});
