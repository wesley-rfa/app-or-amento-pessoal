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
    //---Recupera registros de localStorage e retorna como array
    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem('id')
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem('despesa' + i))
            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    removerDespesa(id){
        localStorage.removeItem('despesa'+id)
    }
}

let bd = new Bd()

//---Recupera dados do form e grava
function cadastrarDespesa() {
    if ( validaForm($('#descricao')) && validaForm($('#tipo')) && validaForm($('#data')) && validaForm($('#valor')) ) {
        
        let despesa = {
            data: $('#data').val(),
            tipo: $('#tipo').val(),
            descricao: $('#descricao').val(),
            valor: $('#valor').val()
        }
        bd.gravar(despesa)
        $('#staticBackdrop').modal()
        $('#data').val('')
        $('#tipo').val('')
        $('#descricao').val('')
        $('#valor').val('')

        carregaLista()
    }

}

//---Valida formulário
function validaForm(dado) {
    if (dado.val() === '') {
        dado.addClass('is-invalid')
    } else {
        dado.removeClass('is-invalid')
        return true
    }
}

//---Carrega lista e exibe na tabela
function carregaLista() {
    let despesas
    despesas = bd.recuperarTodosRegistros()
    let concat = ''
    despesas.forEach(element => {
        anoCadastro = element.data.substring(0, 4)
        mesCadastro = element.data.substring(5, 7)
        diaCadastro = element.data.substring(8, 10)
        dataCadastro = diaCadastro + '/' + mesCadastro + '/' + anoCadastro
        valor = parseInt(element.valor).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        concat += `<tr>
                    <td>${dataCadastro}</td>
                    <td>${element.tipo}</td>
                    <td>${element.descricao}</td>
                    <td>${valor}</td>
                    <td><i class="fas fa-trash-alt btn_excluir" onclick="excluirDespesa(${element.id})"></i></td>
                    </tr>`
    });

    $('#table_body').html(concat)
}

function excluirDespesa(id){
    bd.removerDespesa(id)
    carregaLista()
}

function pesquisarDespesa(){}

function registro() {
    $('#titulo').html('Registro de Nova Despesa')
    $('#registro').removeClass('d-none')
    $('#consulta').addClass('d-none')

    $('#nav_registro').addClass('active')
    $('#nav_consulta').removeClass('active')

}
function consulta() {
    $('#nav_registro').removeClass('active')
    $('#nav_consulta').addClass('active')

    $('#titulo').html('Consulta de Despesas')
    $('#registro').addClass('d-none')
    $('#consulta').removeClass('d-none')
    carregaLista()
}

carregaLista()
