var transacao = [];
var alunos = []
var Found = ""
var Id = ""

//  valida o formulario e se estiver tudo ok , salva no Local storage

function validarform(e) {

    e.preventDefault()

    var divvalormercadoria = document.getElementById("valorempty");

    var divmercadoria = document.getElementById("mercadoriaempty");

    var tipotrs = document.getElementById("transacao").value;

    var inputmercadoria = document.getElementById("mercadoria").value;

    var inputvalormercadoria = document.getElementById("valormercadoria").value;

    var dado_incompleto = false;


    if (inputmercadoria == "") {

        dado_incompleto = true;
        divmercadoria.innerHTML = "preencha a mercadoria"
    }


    if (inputvalormercadoria == "") {
        dado_incompleto = true;
        divvalormercadoria.innerHTML = "preencha o valor"

    }

    if (
        inputmercadoria == "" ||
        inputvalormercadoria == ""
    ) {

        console.log('formulario incompleto')


    }
    else {

        document.getElementById("mercadoria").value = "".innerHTML = "";
        document.getElementById("valormercadoria").value = "".innerHTML = "";


        console.log('formulario ok')
    }





    if (!dado_incompleto) {

        inputvalormercadoria = inputvalormercadoria.replace(".", "").replace(",", ".").toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


        if (tipotrs == "-") {
            inputvalormercadoria = parseFloat(inputvalormercadoria) * -1;

        } else {
            inputvalormercadoria = parseFloat(inputvalormercadoria) * 1;
        }


        transacao.push({ tipo: tipotrs, mercadoria: inputmercadoria, valor: inputvalormercadoria })
        localStorage.setItem('transacao', JSON.stringify(transacao))
        listarextrato()
    }



}


//  criei com exemplos de MAP e FOR, funcao para listar transacoes adicionadas

function listarextrato() {


    transacao = JSON.parse(localStorage.getItem('transacao'));
    if (transacao != null) {
        document.querySelector('.content-table').innerHTML = transacao.map((trsc) => {
            return `
                        
                        <tr>
                            <td class="simbolofuncao">`+ trsc.tipo + `</td>
                            <td id="tdmercado">`+ trsc.mercadoria + `</td>
                            <td id="tdvalor" class="tdleft">`+ trsc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + `</td>
                        </tr>

                        <tr>
                        <td class="bordertd" colspan="3"></td>
                        </tr>

                        
    `

        }

        ).join('')


        total = 0;
        for (let idx_trsc in transacao) {
            total += transacao[idx_trsc].valor;
        }

        document.getElementById("tdlucro").innerHTML =
            `
            <td id="tdlucro" class="tdleft">`+ total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + `</td>
            `

        if (total > 0) {
            document.getElementById('balance').innerHTML = "[Lucro]";
        }
        if (total < 0) {
            document.getElementById('balance').innerHTML = "[Prejuizo]";
        }

        if (total == 0) {
            document.getElementById('balance').innerHTML = "[Balancete]";
        }


    }


}



//  funcao Limpar o extrato e localstorage

function limparDados(trsc) {
    confirm('Ja Salvou no Servidor?');
    transacao.splice(trsc);
    localStorage.setItem('transacao', JSON.stringify(transacao));
    listarextrato();
    document.getElementById('tdlucro').innerHTML = "R$0,00";
    if (transacao = []) {
        document.querySelector('.content-table').innerHTML =
            ` <tbody class="content-table">
        <tr>
            <td id="simbolofuncao">*</td>
            <td id="tdmercado">Nenhuma Transacao Cadastrada</td>
            <td id="tdvalor" class="tdleft">R$ 0,00</td>
        </tr>
        <tr>
            <td class="borderdouble" colspan="3"></td>
        </tr>
    </tbody>
        `
    }
    console.log('limpei e relistei')
}


// mascara monetaria do input valor do form

function mascara() {
    var elemento = document.getElementById("valormercadoria");
    var valor = elemento.value;

    valor = valor + '';
    valor = parseInt(valor.replace(/[\D]+/g, ''));
    valor = valor + '';
    valor = valor.replace(/([0-9]{2}$)/g, ",$1");

    if (valor.length > 6) {
        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }
    elemento.value = valor;

    if (valor == 'NaN') {
        elemento.value = '';
    }

    if (valor == 'null') {
        elemento.value = '';
    }
}

// Salvar na Api, requestoptions manual,


function SalvarTrsc() {


    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {

        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM',
        }
    }).then((resp) => {
        return resp.json()
    }).then((data) => {
        alunos = data.records

        alunos.map((aluno) => {


            if (aluno.fields.Aluno == "3809") {

                Found = aluno.fields.Aluno;
                Id = aluno.id;


            }



        })
    }).then(() => {

        console.log("Aluno=" + Found + " ID=" + Id)

        if (Found == "3809") {

            console.log("entrou PATCH")


            fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
                method: "PATCH",
                headers: {
                    Authorization: 'Bearer key2CwkHb0CKumjuM',
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({

                    "records": [
                        {
                            "id": Id,
                            "fields": {
                                "Aluno": "3809",
                                "Json": JSON.stringify(transacao),
                            }
                        }
                    ]

                })
            });
        }else{

            console.log("entrou POST")
        
            fetch('https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico', {
                method: "POST",
                headers: {
                    Authorization: 'Bearer key2CwkHb0CKumjuM',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
        
                    "records": [
                        {
                            "fields": {
                                "Aluno": "3809",
                                "Json": JSON.stringify(transacao),
                            }
                        }
                    ]
        
                })
            })
        }

    })


    alert("salvo com sucesso")

}






