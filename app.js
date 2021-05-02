class Bd {
    constructor(){
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }
    //---Recupera próximo id de localStorage
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

    if(validaForm($('#ano')) && validaForm($('#mes')) && validaForm($('#dia')) && validaForm($('#tipo')) && validaForm($('#descricao')) && validaForm($('#valor'))){
        let despesa = {
            ano: $('#ano').val(),
            mes: $('#mes').val(),
            dia: $('#dia').val(),
            tipo: $('#tipo').val(),
            descricao: $('#descricao').val(),
            valor: $('#valor').val()
        }
        bd.gravar(despesa)
        $('#staticBackdrop').modal()
    }
    
}

function validaForm(dado){
    if(dado.val() === ''){
        dado.addClass('is-invalid')
    }else{
        dado.removeClass('is-invalid')
        return true
    }
}