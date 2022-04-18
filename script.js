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
    console.log("Cadastrando....");
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', cadastroUser);

    requisicao.then(tratarSucessoCadastro);
    requisicao.catch(tratarErroCadastro);
}

function tratarSucessoCadastro (response) {
    console.log("Cadastro Feito");
    manterConexao();
    setInterval(manterConexao, 4000);
    buscarMsgs();
    setInterval(buscarMsgs, 3000);
}

function tratarErroCadastro (erro){
    alert("Este nome já está sendo utilizado. Escolha outro lindo nome.")
    perguntarNome();
}

function manterConexao () {
    console.log("Mantendo conexão");
    const cadastroUser = {
        name: nomeUser
    }
    
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', cadastroUser);

}

function buscarMsgs () {
    console.log("Buscando msgs");
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisse.then(processarResposta);    
}

function processarResposta (resposta) {

    const ul = document.querySelector("ul");
    ul.innerHTML = "";

    let emissorMsg;
    let destMsg;
    let textoMsg;
    let tipoMsg;
    let horaMsg;

    for (let i = 0; i < resposta.data.length - 1; i++) {
        emissorMsg = resposta.data[i].from;
        destMsg = resposta.data[i].to;
        textoMsg = resposta.data[i].text;
        tipoMsg = resposta.data[i].type;
        horaMsg = resposta.data[i].time;

        if (tipoMsg === "status") {
            ul.innerHTML += `<li class="status-msg">
            <span class="hora">(${horaMsg})&nbsp</span>
            <span class="user">${emissorMsg}&nbsp</span>
            <span class="texto-msg">${textoMsg}</span>
            </li>`
        }

        if (tipoMsg === "message") {
            ul.innerHTML += `<li class="normal-msg">
            <span class="hora">(${horaMsg})&nbsp</span>
            <span class="user">${emissorMsg}&nbsp</span>
            <span>para&nbsp</span>
            <span class="destinatario">${destMsg}:&nbsp</span>
            <span class="texto-msg">${textoMsg}</span>
            </li>`
        }

        if (tipoMsg === "private-message") {
            ul.innerHTML += `<li class="private-msg">
            <span class="hora">(${horaMsg})&nbsp</span>
            <span class="user">${emissorMsg}&nbsp</span>
            <span>reservadamente para&nbsp</span>
            <span class="destinatario">${destMsg}:&nbsp</span>
            <span class="texto-msg">${textoMsg}</span>
            </li>`
        }
    }

    emissorMsg = resposta.data[resposta.data.length - 1].from;
    destMsg = resposta.data[resposta.data.length - 1].to;
    textoMsg = resposta.data[resposta.data.length - 1].text;
    tipoMsg = resposta.data[resposta.data.length - 1].type;
    horaMsg = resposta.data[resposta.data.length - 1].time;

    if (tipoMsg === "status") {
        ul.innerHTML += `<li class="status-msg">
        <span class="hora">(${horaMsg})&nbsp</span>
        <span class="user">${emissorMsg}&nbsp</span>
        <span class="texto-msg ult-msg">${textoMsg}</span>
        </li>`
    }

    if (tipoMsg === "message") {
        ul.innerHTML += `<li class="normal-msg">
        <span class="hora">(${horaMsg})&nbsp</span>
        <span class="user">${emissorMsg}&nbsp</span>
        <span>para&nbsp</span>
        <span class="destinatario">${destMsg}:&nbsp</span>
        <span class="texto-msg ult-msg">${textoMsg}</span>
        </li>`
    }

    if (tipoMsg === "private-message") {
        ul.innerHTML += `<li class="private-msg">
        <span class="hora">(${horaMsg})&nbsp</span>
        <span class="user">${emissorMsg}&nbsp</span>
        <span>reservadamente para&nbsp</span>
        <span class="destinatario">${destMsg}:&nbsp</span>
        <span class="texto-msg ult-msg">${textoMsg}</span>
        </li>`
    }

    document.querySelector(".ult-msg").scrollIntoView();

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

    document.querySelector("input").value = "";

    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', obj);

    requisicao.then(tratarSucessoEnvioMsg);
    requisicao.catch(tratarErroEnvioMsg);
}

function tratarSucessoEnvioMsg() {
    buscarMsgs();
}

function tratarErroEnvioMsg(erro) {
    window.location.reload();
}