Highcharts.setOptions({
    lang: {
        decimalPoint: ',',
        thousandsSep: '.',
        viewFullscreen: 'Ver em tela cheia',
        exitFullscreen: 'Sair do modo tela cheia',
        printChart: 'Imprimir GrÃ¡fico',
        downloadPNG: 'Download PNG',
        downloadJPEG: 'Download JPEG',
        downloadPDF: 'Download PDF',
        downloadSVG: 'Download SVG'
    }
});
// Radialize the colors
Highcharts.setOptions({
    colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.5,
                cy: 0.3,
                r: 0.7
            },
            stops: [
                [0, color],
                [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    })
});

// Build the chart
var grafico = Highcharts.chart('grafico_pizza', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    credits: {
        enabled: false
    },
    title: {
        text: 'Gastos por Tipo'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                connectorColor: 'silver'
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Tipo',
        data: [
            { name: 'Chrome', y: 61.41 },
            { name: 'Internet Explorer', y: 11.84 },
            { name: 'Firefox', y: 10.85 },
            { name: 'Edge', y: 4.67 },
            { name: 'Safari', y: 4.18 },
            { name: 'Other', y: 7.05 }
        ]
    }]
});

let somaAlimentacao = 0
let somaEducacao = 0
let somaLazer = 0
let somaSaude = 0
let somaTransporte = 0
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


    removerDespesa(id) {
        localStorage.removeItem('despesa' + id)
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
    let somaValor = 0
    let tipo = ''
    despesas.forEach(element => {
        if (element.data === undefined) {
            dataCadastro = ''
        } else {
            anoCadastro = element.data.substring(0, 4)
            mesCadastro = element.data.substring(5, 7)
            diaCadastro = element.data.substring(8, 10)
            dataCadastro = diaCadastro + '/' + mesCadastro + '/' + anoCadastro
            switch (parseInt(element.tipo)) {
                case 1:
                    tipo = 'Alimentação'
                    somaAlimentacao += parseInt(element.valor)
                    break
                case 2:
                    tipo = 'Educação'
                    somaEducacao += parseInt(element.valor)
                    break
                case 3:
                    tipo = 'Lazer'
                    somaLazer += parseInt(element.valor)
                    break
                case 4:
                    tipo = 'Saúde'
                    somaSaude += parseInt(element.valor)
                    break
                case 5:
                    tipo = 'Transporte'
                    somaTransporte += parseInt(element.valor)
                    break
            }
        }
        somaValor += parseInt(element.valor)
        valor = parseInt(element.valor).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        concat += `<tr>
                    <td>${dataCadastro}</td>
                    <td>${tipo}</td>
                    <td>${element.descricao}</td>
                    <td>${valor}</td>
                    <td><i class="fas fa-trash-alt btn_excluir" onclick="excluirDespesa(${element.id})"></i></td>
                    </tr>`
    });
    concat += `<tr>
                    <td colspan="3" class="text-right"><strong>Total:</strong></td>
                    <td><strong>${somaValor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</strong></td>
                    <td></td>
                    </tr>`
    $('#table_body').html(concat)
    carregaGraficos()
}

function excluirDespesa(id) {
    bd.removerDespesa(id)
    carregaLista()
    carregaGraficos()
}

function carregaGraficos() {
    grafico.update({
        series: [{
            name: 'Tipo',
            data: [
                { name: 'Alimentação', y: somaAlimentacao},
                { name: 'Educação', y: somaEducacao },
                { name: 'Lazer', y: somaLazer },
                { name: 'Saúde', y: somaSaude },
                { name: 'Transporte', y: somaTransporte }
            ]
        }]
    });

}

function registro() {
    $('#nav_registro').addClass('active')
    $('#nav_consulta').removeClass('active')
}
function consulta() {
    $('#nav_registro').removeClass('active')
    $('#nav_consulta').addClass('active')
    carregaLista()
}

carregaLista()
carregaGraficos()


