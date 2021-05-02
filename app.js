

class Bd {
    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId)+1
    }
    //---Grava a despesa em local storage
    gravar(despesa) {
        let id = this.getProximoId()
        localStorage.setItem('despesa' + id, JSON.stringify(despesa))
        localStorage.setItem('id', id)
    }
}

let bd = new Bd()
//---Recupera dados do form e grava
function cadastrarDespesa() {
    let despesa = {
        ano: $('#ano').val(),
        mes: $('#mes').val(),
        dia: $('#dia').val(),
        tipo: $('#tipo').val(),
        descricao: $('#descricao').val(),
        valor: $('#valor').val()
    }
    bd.gravar(despesa)
}
