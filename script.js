let nomeUser;

function perguntarNome () {
    nomeUser = prompt("Qual o seu lindo nome?");
}

perguntarNome();
cadastrarUser();

function cadastrarUser () {
    const cadastroUser = {
        name: nomeUser
    }

    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', cadastroUser);

    requisicao.then(tratarSucesso);
    requisicao.catch(tratarErro);
}

function tratarSucesso (response) {
    const resposta = response.data;
    console.log("deu certo");
    console.log(response);
    buscarMsgs();
}

function tratarErro (erro){
    const resposta = erro.data;
    console.log("deu errado");
    console.log(resposta);
}

function buscarMsgs () {
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisse.then(processarResposta);    
}

function processarResposta (resposta) {

    const ul = document.querySelector("ul");
    ul.innerHTML = "";

    for (let i = 0; i < resposta.data.length; i++) {
        let emissorMsg = resposta.data[i].from;
        let destMsg = resposta.data[i].to;
        let textoMsg = resposta.data[i].text;
        let tipoMsg = resposta.data[i].type;
        let horaMsg = resposta.data[i].time;

        if (tipoMsg === "status") {
            ul.innerHTML += `<li class="status-msg">
            <span class="hora">(${horaMsg})&nbsp</span>
            <span class="user">${emissorMsg}&nbsp</span>
            <span>${textoMsg}</span>
            </li>`
        }

        if (tipoMsg === "message") {
            ul.innerHTML += `<li class="normal-msg">
            <span class="hora">(${horaMsg})&nbsp</span>
            <span class="user">${emissorMsg}&nbsp</span>
            <span>to&nbsp</span>
            <span class="destinatario">${destMsg}:&nbsp</span>
            <span>${textoMsg}</span>
            </li>`
        }

    }

}