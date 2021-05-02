// Radialize the colors
Highcharts.setOptions({
    colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {radialGradient: {cx: 0.5,cy: 0.3,r: 0.7},
            stops: [[0, color],[1, Highcharts.color(color).brighten(-0.3).get('rgb')]]
        };
    })
});

// Build the chart
var grafico = Highcharts.chart('grafico_pizza', {
    chart: {plotBackgroundColor: null,plotBorderWidth: null,plotShadow: false,type: 'pie'},
    credits: {enabled: false},
    title: { text: '' },
    tooltip: {pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'},
    accessibility: {point: {valueSuffix: '%'}},
    plotOptions: {
        pie: {allowPointSelect: true,cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                connectorColor: 'silver'
            },showInLegend: true
        }
    },
    series: [{name: 'Tipo',data: []}]
});

let somaAlimentacao = 0
let somaEducacao = 0
let somaLazer = 0
let somaSaude = 0
let somaTransporte = 0
let numeroDespesas = 0
let total = 0
class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) { localStorage.setItem('id', 0)}
    }
    //---Recupera próximo id de localStorage
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    //---Grava a despesa em local storage
    gravar(despesa) {
        let id = this.getProximoId()
        total += parseInt(despesa.valor)
        localStorage.setItem('despesa' + id, JSON.stringify(despesa))
        localStorage.setItem('id', id)
    }
    //---Recupera registros de localStorage e retorna como array
    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem('id')
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem('despesa' + i))
            if (despesa === null) {continue}
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    removerDespesa(id) {
        let despesa = JSON.parse(localStorage.getItem('despesa' + id))
        total -= parseFloat(despesa.valor)
        localStorage.removeItem('despesa' + id)
        return parseInt(despesa.tipo) + "/" + parseFloat(despesa.valor)
    }
}

let bd = new Bd()

//---Recupera dados do form e grava
function cadastrarDespesa() {
    if (validaForm($('#descricao')) && validaForm($('#tipo')) && validaForm($('#data')) && validaForm($('#valor'))) {

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
        somaAlimentacao = 0
        somaEducacao = 0
        somaLazer = 0
        somaSaude = 0
        somaTransporte = 0
        carregaLista(0)
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
function carregaLista(parm) {
    let despesas
    despesas = bd.recuperarTodosRegistros()
    let concat = ''
    let tipo = ''
    total = 0
    numeroDespesas = 0
    despesas.forEach(element => {
        numeroDespesas++
        total += parseFloat(element.valor)
        if (element.data === undefined) {
            dataCadastro = ''
        } else {
            anoCadastro = element.data.substring(0, 4)
            mesCadastro = element.data.substring(5, 7)
            diaCadastro = element.data.substring(8, 10)
            dataCadastro = diaCadastro + '/' + mesCadastro + '/' + anoCadastro
            if (parm == 0) {
                switch (parseInt(element.tipo)) {
                    case 1:
                        tipo = 'Alimentação'
                        somaAlimentacao += parseFloat(element.valor)
                        break
                    case 2:
                        tipo = 'Educação'
                        somaEducacao += parseFloat(element.valor)
                        break
                    case 3:
                        tipo = 'Lazer'
                        somaLazer += parseFloat(element.valor)
                        break
                    case 4:
                        tipo = 'Saúde'
                        somaSaude += parseFloat(element.valor)
                        break
                    case 5:
                        tipo = 'Transporte'
                        somaTransporte += parseFloat(element.valor)
                        break
                }
            }

        }
        valor = parseFloat(element.valor).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        concat += `<tr>
                    <td>${dataCadastro}</td>
                    <td>${tipo}</td>
                    <td>${element.descricao}</td>
                    <td>${valor}</td>
                    <td><i class="fas fa-trash-alt btn_excluir" onclick="excluirDespesa(${element.id})"></i></td>
                    </tr>`
    });
    $('#table_body').html(concat)
    carregaGraficos()
}

function excluirDespesa(id) {
    numeroDespesas--
    retorno = bd.removerDespesa(id).split("/")
    switch (parseInt(retorno[0])) {
        case 1:
            somaAlimentacao -= parseFloat(retorno[1])
            break;
        case 2:
            somaEducacao -= parseFloat(retorno[1])
            break;
        case 3:
            somaLazer -= parseFloat(retorno[1])
            break;
        case 4:
            somaSaude -= parseFloat(retorno[1])
            break;
        case 5:
            somaTransporte -= parseFloat(retorno[1])
            break;
    }
    carregaLista(1)
    carregaGraficos()

}

function carregaGraficos() {
    $('#valorTotal').html(`${total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`)
    $('#NumeroTotal').html(numeroDespesas)

    grafico.update({
        series: [{
            name: 'Tipo',
            data: [
                { name: 'Alimentação', y: somaAlimentacao },
                { name: 'Educação', y: somaEducacao },
                { name: 'Lazer', y: somaLazer },
                { name: 'Saúde', y: somaSaude },
                { name: 'Transporte', y: somaTransporte }
            ]
        }]
    });
}

carregaLista(0)


