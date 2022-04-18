let nomeUser;

function perguntarNome () {
    nomeUser = prompt("Qual o seu lindo nome?");
    cadastrarUser();
}

perguntarNome();

function cadastrarUser () {
    const cadastroUser = {
        name: nomeUser
    }

    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', cadastroUser);

    requisicao.then(tratarSucessoCadastro);
    requisicao.catch(tratarErroCadastro);
}

function tratarSucessoCadastro (response) {
    setInterval(manterConexao, 4000);
    buscarMsgs();
    setInterval(buscarMsgs, 3000);
}

function tratarErroCadastro (erro){
    alert("Este nome já está sendo utilizado. Escolha outro lindo nome.")
    perguntarNome();
}

function manterConexao () {
    const cadastroUser = {
        name: nomeUser
    }
    
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', cadastroUser);

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

function enviarMsg() {
    console.log("Enviando");
    const textoMsg = document.querySelector("input").value;
    const obj = {
        from: nomeUser,
        to: "Todos",
        text: textoMsg,
        type: "message"
    }

    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', obj);

    requisicao.then(tratarSucessoEnvioMsg);
    requisicao.catch(tratarErroEnvioMsg);
}

function tratarSucessoEnvioMsg() {
    buscarMsgs();
}

function tratarErroEnvioMsg() {
    window.location.reload();
}