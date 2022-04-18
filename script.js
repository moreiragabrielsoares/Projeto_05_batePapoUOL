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

    let emissorMsg;
    let destMsg;
    let textoMsg;
    let tipoMsg;
    let horaMsg;
    let ultPos = resposta.data.length - 1;

    for (let i = 0; i < ultPos; i++) {
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

        if (tipoMsg === "private_message" && (destMsg === nomeUser || destMsg === "Todos")) {
            ul.innerHTML += `<li class="private-msg">
            <span class="hora">(${horaMsg})&nbsp</span>
            <span class="user">${emissorMsg}&nbsp</span>
            <span>reservadamente para&nbsp</span>
            <span class="destinatario">${destMsg}:&nbsp</span>
            <span class="texto-msg">${textoMsg}</span>
            </li>`
        }
    }

    emissorMsg = resposta.data[ultPos].from;
    destMsg = resposta.data[ultPos].to;
    textoMsg = resposta.data[ultPos].text;
    tipoMsg = resposta.data[ultPos].type;
    horaMsg = resposta.data[ultPos].time;

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

    if (tipoMsg === "private_message" && (destMsg === nomeUser || destMsg === "Todos")) {
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