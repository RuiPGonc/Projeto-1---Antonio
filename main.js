let listaTarefas = JSON.parse(localStorage.getItem("listaTarefas"));
let tarefaAtivaId;
let edicaoAtiva = false;

function login() {
  //e.preventDefault();
  var input_user = document.getElementById("username").value;
  var input_password = document.getElementById("password").value;

  if (input_user != "" && input_password != "") {
    // * Grava em loca storage - browser
    localStorage.setItem("nome", input_user);
    //mudar de página
    window.open("homePage.html", "_self");

    //se ao abrir o programa não existir uma lista de tarefas é criada uma.
    if (localStorage.getItem("listaTarefas") === null) {
      localStorage.setItem("listaTarefas", JSON.stringify([]));
    }
  } else {
    document.getElementById("msgPreenchimento").style.display = "block"; //torna a mensagemd e erro visivel
  }
}

function irAdicionarTarefa() {
 // event.preventDefault();
  window.open("newTask.html", "_self");
}
function irHomePage(event) {
  console.log("Aqui há gato!!")
  event.preventDefault;
  //window.open("homePage.html", "_self");
}

/**
 * Cria uma nova tarefa se os dados forem válidos
 */
function criarNovaTarefa(event) {
  //event.preventDefault();

  //acede ao elemento e obtem os valores da descrição e nome da tarefa
  var descr_input = document.getElementById("descricao").value;
  var nome_input = document.getElementById("nameTask").value;

 
  //filtra a possibilidade de existirem tarefas em que os carateres são espaços
  if (
    descr_input &&
    nome_input &&
    descr_input.trim() !== "" &&
    nome_input.trim() !== ""
  ) {
    //criar um novo objeto "Tarefa"
    let novaTarefa = new Object();
    novaTarefa.id = atribuirId();
    novaTarefa.nome = nome_input;
    novaTarefa.descricao = descr_input;
    //novaTarefa.realizada = false;
    novaTarefa.idConclusao = 0;

    //traz a lista de tarefas que já existe
    let listaTarefas = JSON.parse(localStorage.getItem("listaTarefas"));
    //adiciona a nova tarefa à lista que existe
    listaTarefas.push(novaTarefa);
    // * Grava em loca storage - browser
    localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas));
    irHomePage();
  } else {
    document.getElementById("mensagemErro").style.display = "block";
  }
}

function escondeError() {
  document.getElementById("mensagemErro").style.display = "none";
}

function atribuirId() {
  let listaTarefas = JSON.parse(localStorage.getItem("listaTarefas"));
  let iD = listaTarefas.length + new Date().getTime();
  return iD;
}

//Listener só é ativo quando a homePage ou a newTask são carregadas 
const paginasAutenticadas = ["/homePage.html", "/newTask.html"];
if (paginasAutenticadas.includes(window.location.pathname)) {
  window.addEventListener("load", (event) => {
    // obter o user from localstorage - browser
    const utilizador = localStorage.getItem("nome");

    //console.log(utilizador.value); // para imprimir na consola
    var userLogado = document.getElementById("nomeLogado");
    if (userLogado){
    userLogado.innerHTML = "Bem-Vindo!\n" + utilizador;
    }else{//se o nome logado for null significa que o user entrou sem fazer login. deve ser direcionado para a pagina login
      window.open("index.html", "_self");
    }

    if (window.location.pathname === "/homePage.html") {
      atualizarLista();
      gerirClickNaTarefa();
    }

    if (window.location.pathname === "/newTask.html") {
      gerirClickCriarTarefa();
    
    }
  });
}

//eventListener para não colidir com o submit do button
const gerirClickCriarTarefa = () => {
  
  const formulario = document.getElementById("formNewTask");
  formulario.addEventListener("submit", (event) => {
    event.preventDefault;
    criarNovaTarefa();
   
  });
};

const atualizarLista = () => {
  limparTarefas();

  //ordenar o array para que as tarefas realizadas ocupem o final da lista
  listaTarefas.sort(function (x, y) {
    a = x.idConclusao;
    b = y.idConclusao;

    return a == b ? 0 : a > b ? 1 : -1; // a=b? se true devolve 0, else testa se a>b. se true devolve 1, else -1
  });

  //a linha abaixo envia cada item a lista de tarefas para o criarItem, para ser impresso no ecrã
  for (let i = 0; i < listaTarefas.length; i++) {
    criarItem(listaTarefas[i]);
  }

  //console.log(listaTarefas);
};

const limparTarefas = () => {
  const div_ListaTarefas = document.getElementById("div_ListaTarefas");
  //enquanto houver um elemento na div_ListaTarefas o ciclo remove o último elemento da lista
  while (div_ListaTarefas.firstChild) {
    div_ListaTarefas.removeChild(div_ListaTarefas.lastChild);
  }
};

//criar tarefas para serem mostradas na lista
const criarItem = (tarefa) => {
  const item = document.createElement("button");
  item.textContent = tarefa.nome;
  item.setAttribute("data-id", tarefa.id);
  item.className = "lista-tarefa-item";

  if (tarefa.idConclusao) {
    item.classList.add("riscado");
  }

  //coloca o item, com o respetivo cod HTML dentro da div que vai mostrar a lista
  document.getElementById("div_ListaTarefas").appendChild(item);
};

//para ver a descrição na div "Detalhe"
const verDescricao = (id_tarefa) => {
  for (let i = 0; i < listaTarefas.length; i++) {
    if (listaTarefas[i].id == id_tarefa) {
      const item = document.createElement("label");
      item.classList.add("class_DetalheTarefa");
      item.innerHTML = listaTarefas[i].descricao;
      document.setElementById("div_DetalheTarefas").appendChild(item);
      break;
    }
  }
};

const gerirClickNaTarefa = () => {
  document
    .getElementById("div_ListaTarefas")
    .addEventListener("click", (event) => {
      const elemento = event.target;

      if (elemento.tagName === "BUTTON" || elemento.tagName === "DIV") {
        const tarefaClicadaId = elemento.getAttribute("data-id");
        if (tarefaClicadaId) {
          tarefaAtivaId = Number(tarefaClicadaId);
          atualizarDetalhe();
        }
      }
    });
};

const atualizarDetalhe = () => {
  limparDetalhes();
  document.getElementById("msgConcluida").style.display = "none";
  const tarefa = listaTarefas.find((tarefa) => tarefa.id === tarefaAtivaId);
  const div_DetalheTarefas = document.getElementById("div_DetalheTarefas");

  if (edicaoAtiva) {
    div_DetalheTarefas.innerHTML = `
    <form id="editarTarefa">
      <div class="form-item">
        <label  for="name">Nome:</label>
        <input type="texto"placeholder="Nome" id="nome" value="${
          tarefa.nome
        }" />
      </div>
      <div class="form-item">
        <label for="descricao">Descriçáo:</label>
        <textarea placeholder="Descricao" 
         id="descricao">${tarefa.descricao}</textarea>
      </div>
      <div class="form-item">
         <label  for="realizada">Estado:</label>
          <input type="checkbox" id="realizada" ${
            tarefa.idConclusao ? "checked" : ""
          } />
      </div>
      <div>
          <button type="submit" class="btn">Gravar</button>
          <button class="btn">Cancelar</button>
      </div>
    </form>
    `;


    document
      .getElementById("btnCancelar")
      .addEventListener("click", abortarEdicao);

    document.getElementById("btnEditar").addEventListener("click", (evento) => {
      evento.preventDefault();

      const novoNome = document.getElementById("nome").value;
      const novaDescricao = document.getElementById("descricao").value;
      const novaRealizada = document.getElementById("realizada").checked;

      if (tarefa.idConclusao == 0 && novaRealizada !== tarefa.idConclusao) {
        editarTarefa({
          nome: novoNome,
          descricao: novaDescricao,
          idConclusao: atribuirId(),
        });
      } else {
        editarTarefa({
          nome: novoNome,
          descricao: novaDescricao,
          idConclusao: novaRealizada,
        });
      }
    });
  } else {
    const nome = document.createElement("h4");
    nome.setAttribute("id", "nomeTarefa");
    nome.textContent = tarefa.nome;

    const descricao = document.createElement("p");
    descricao.setAttribute("id", "descricaoTarefa");
    descricao.classList.add("citacao");
    descricao.textContent = tarefa.descricao;

    const estado = document.createElement("p");
    estado.setAttribute("id", "estadoTarefa");
    const estadoSpan = document.createElement("span");
    estadoSpan.classList.add("estado-flag");

    if (tarefa.idConclusao) {
      estadoSpan.textContent = "Concluida";
      estadoSpan.classList.add("estado-flag-concluida");
    } else {
      estadoSpan.textContent = "Por concluir";
      estadoSpan.classList.add("estado-flag-por-concluir");
    }

    estado.appendChild(estadoSpan);

    // estado.textContent = tarefa.realizada ? "Concluida" : "Por concluir";

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn");
    btnEditar.addEventListener("click", () => {
      edicaoAtiva = true;
      atualizarDetalhe();
    });

    const btnConcluir = document.createElement("button");
    btnConcluir.setAttribute("id", "btnConcl");
    btnConcluir.textContent = "Concluir Tarefa";
    btnConcluir.classList.add("btn");

    if (tarefa.idConclusao == 0) {
      btnConcluir.addEventListener("click", () => {
        editarTarefa({ idConclusao: new Date().getTime() });
      });
    } else {
      btnConcluir.addEventListener("click", () => {
        document.getElementById("msgConcluida").style.display = "block";
      });
    }

    div_DetalheTarefas.append(nome, descricao, estado, btnEditar, btnConcluir);
  }

  const btnRemover = document.createElement("button");
  btnRemover.textContent = "Remover";
  btnRemover.addEventListener("click", removerTarefa);
  btnRemover.classList.add("btn");
  div_DetalheTarefas.append(btnRemover);
};

const limparDetalhes = () => {
  const div_DetalheTarefas = document.getElementById("div_DetalheTarefas");
  while (div_DetalheTarefas.firstChild) {
    div_DetalheTarefas.removeChild(div_DetalheTarefas.lastChild);
  }
};

function removerTarefa() {
  //a função filter filtra todos os elementos que cumpram a condição indicada. Neste caso seleciona todas as que tiverem um id diferente do id da tarefa ativa
  const tarefasLimpas = listaTarefas.filter(
    (tarefa) => tarefa.id !== tarefaAtivaId
  );

  listaTarefas = tarefasLimpas;
  localStorage.setItem("listaTarefas", JSON.stringify(tarefasLimpas));
  atualizarLista();
  limparDetalhes();
}

function abortarEdicao() {
  edicaoAtiva = false;
  atualizarDetalhe();
}

function editarTarefa(novaTarefa = {}) {
  const index = listaTarefas.findIndex((tarefa) => tarefaAtivaId === tarefa.id);
  const tarefa = listaTarefas[index];

  const tarefaEditada = {
    ...tarefa,
    ...novaTarefa,
    id: tarefa.id,
  };

  listaTarefas[index] = tarefaEditada;
  localStorage.setItem("listaTarefas", JSON.stringify(listaTarefas));
  edicaoAtiva = false;

  atualizarLista();
  atualizarDetalhe();
}
