function cadastrarDespesa(){
    let despesa = {
        ano: $('#ano').val(),
        mes: $('#mes').val(),
        dia: $('#dia').val(),
        tipo: $('#tipo').val(),
        descricao: $('#descricao').val(),
        valor: $('#valor').val()
    }
    console.log(despesa)
}