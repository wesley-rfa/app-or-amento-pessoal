class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    //---Recupera próximo id de localStorage
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    //---Grava a despesa em local storage
    gravar(despesa) {
        let id = this.getProximoId()
        localStorage.setItem('despesa' + id, JSON.stringify(despesa))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem('id')
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem('despesa' + i))
            if (despesa === null) {
                continue
            }
            despesas.push(despesa)
        }
        return despesas
    }
}

let bd = new Bd()

//---Recupera dados do form e grava
function cadastrarDespesa() {
    if (validaForm($('#data')) && validaForm($('#tipo')) && validaForm($('#valor')) && validaForm($('#descricao'))) {
        
        let despesa = {
            data: $('#data').val(),
            tipo: $('#tipo').val(),
            descricao: $('#descricao').val(),
            valor: $('#valor').val()
        }
        bd.gravar(despesa)
        $('#staticBackdrop').modal()
    }

}

function validaForm(dado) {
    if (dado.val() === '') {
        dado.addClass('is-invalid')
    } else {
        dado.removeClass('is-invalid')
        return true
    }
}

function carregaLista() {
    let despesas
    despesas = bd.recuperarTodosRegistros()
    let concat = ''
    despesas.forEach(element => {
        anoCadastro = element.data.substring(0, 4)
        mesCadastro = element.data.substring(5, 7)
        diaCadastro = element.data.substring(8, 10)
        dataCadastro = diaCadastro + '/' + mesCadastro + '/' + anoCadastro
        concat += `<tr>
                        <td>${dataCadastro}</td>
                        <td>${element.tipo}</td>
                        <td>${element.descricao}</td>
                        <td>${element.valor}</td>
                        </tr>`
    });

    $('#table_body').html(concat)
}

function registro() {
    $('#titulo').html('Registro de Nova Despesa')
    $('#registro').removeClass('d-none')
    $('#consulta').addClass('d-none')

}
function consulta() {
    $('#titulo').html('Consulta de Despesas')
    $('#registro').addClass('d-none')
    $('#consulta').removeClass('d-none')
    carregaLista()
}