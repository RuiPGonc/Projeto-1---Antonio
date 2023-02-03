let listaTarefas = JSON.parse(localStorage.getItem("listaTarefas"));
var tarefaAtivaId;
//let edicaoAtiva = false;

function login() {
  //e.preventDefault();
  var input_user = document.getElementById("username").value;
  var input_password = document.getElementById("password").value;

  if (input_user != "" && input_password != "") {
    // * Grava em loca storage - browser
    localStorage.setItem("nome", input_user);
    //mudar de página
    irHomePage();

    //se ao abrir o programa não existir uma lista de tarefas é criada uma.
    if (localStorage.getItem("listaTarefas") === null) {
      localStorage.setItem("listaTarefas", JSON.stringify([]));
    }
  } else {
    document.getElementById("msgPreenchimento").style.display = "block"; //torna a mensagem de erro visivel
  }
}

function irNewTask() {
  // event.preventDefault();
  window.open("newTask.html", "_self");
}

function irHomePage(event) {
  //event.preventDefault;
  window.open("homePage.html", "_self");
}

function irIndexPage() {
  window.open("index.html", "_self");
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
    novaTarefa.idConclusao = null;

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
  if ("/index.html".includes(window.location.pathname)) {
    document.getElementById("msgPreenchimento").style.display = "none";
  }
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
    //zerar a tarefa ativa
    tarefaAtivaId = null;

    // obter o user from localstorage - browser
    const utilizador = localStorage.getItem("nome");

    //console.log(utilizador.value); // para imprimir na consola
    var userLogado = document.getElementById("nomeLogado");
    if (userLogado) {
      userLogado.innerHTML = "Bem-Vindo!\n" + utilizador;
    } else {
      //se o nome logado for null significa que o user entrou sem fazer login. deve ser direcionado para a pagina login
      irIndexPage();
    }
    if (window.location.pathname === "/homePage.html") {
      //para limpar a session Storage
      sessionStorage.setItem("tarefaAtivaId", null);
      document.getElementById("btnEdit").style.display = "none";
      atualizarLista();
      gerirClickNaTarefa();
      gerirBotaoEditar();
    }
    if (window.location.pathname === "/newTask.html") {
      //carregar a info da SessionStorage
      tarefaAtivaId = JSON.parse(sessionStorage.getItem("tarefaAtivaId"));
      //valida se o user vem do através do btn Nova Tarefa ou se clicou para ver o detalhe de uma tarefa
      if (tarefaAtivaId == null) {
        console.log(tarefaAtivaId);
        gerirClickCriarTarefa();
      } else {
        verDetalhes(tarefaAtivaId);
      }
    }
  });
}

function verDetalhes(tarefaAtivaId) {
  const task = listaTarefas.find((task) => task.id === tarefaAtivaId);
  const txtNome = document.getElementById("nameTask");
  txtNome.setAttribute("placeholder", task.nome);

  const txtDesc = document.getElementById("descricao");
  txtDesc.setAttribute("placeholder", task.descricao);

  //mudar titulo da página
  var tituloPagina = document.getElementById("headerNovaTarefa");
  tituloPagina.innerHTML = `Ver/Editar Tarefa`;
  tituloPagina.classList.add("tarefas-header");
  topo_div.innerHTML = `  
      <div class="form-item">
      <input type="checkbox" id="realizada" ${
        task.idConclusao ? "checked" : ""
      } />
      <label  for="realizada">Tarefa Concluida </label>
    
      </div>
      `;
  bottom_div.innerHTML = `
      <div>
        
         <button id="botaoRemover" type="button" class="btn">Remover Tarefa</button>
          <button id="btnEditar" type="button" class="btn">Gravar alterações</button>
          <button type="button" id="botaoCancelar" class="btn">Cancelar</button>
      </div> `;

  //btn cancelar
  document
    .getElementById("botaoCancelar")
    .addEventListener("click", (event) => {
      irHomePage();
    });

  //btn removerTarefa
  document.getElementById("botaoRemover").addEventListener("click", (event) => {
    removerTarefa(tarefaAtivaId);
  });

  document.getElementById("btnEditar").addEventListener("click", (evento) => {
    evento.preventDefault();

    var novoNome = "";
    var novaDescricao = "";
    var novaRealizada = "";

    if (document.getElementById("nameTask").value == "") {
      novoNome = task.nome;
    } else {
      novoNome = document.getElementById("nameTask").value;
    }
    if (document.getElementById("descricao").value == "") {
      novaDescricao = task.descricao;
    } else {
      novaDescricao = document.getElementById("descricao").value;
    }
    novaRealizada = novaRealizada =
      document.getElementById("realizada").checked;

    //só pretendemos adicionar um idConclusão, quando a tarefa é concluida. Ou seja, qnd o estado inicial era desmarcada(false) e passa a marcada(true)
    //o if impede que seja atribuido um novo idConclusão. Caso fosse atribuido, a tarefa seria ordenada na lista novamente
    if (task.idConclusao == 0 && novaRealizada == 1) {
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
}

//eventListener para não colidir com o submit do button
const gerirClickCriarTarefa = () => {
  const btnCriarTarefa = document.getElementById("btnAddTask");
  btnCriarTarefa.addEventListener("click", (event) => {
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

  item.innerHTML = `
  <input type="checkbox" id="chkbox_realizada" ${
    tarefa.idConclusao ? "checked" : ""
  }>
  <label for="realizada_text"> &nbsp ${tarefa.nome}</label>
      `;

  if (tarefa.idConclusao) {
    item.classList.add("riscado");
  }
  //coloca o item, com o respetivo cod HTML dentro da div que vai mostrar a lista
  document.getElementById("div_ListaTarefas").appendChild(item);
};

const gerirClickNaTarefa = () => {
  document
    .getElementById("div_ListaTarefas")
    .addEventListener("click", (event) => {
     

      const elemento = event.target;

      if (elemento.tagName === "BUTTON") {
        const tarefaClicadaId = elemento.getAttribute("data-id");
        if (tarefaClicadaId) {
          tarefaAtivaId = Number(tarefaClicadaId);
        }
      } else if (elemento.id === "chkbox_realizada") {
        const tarefaClicadaId = elemento.parentElement.getAttribute("data-id");
        if (tarefaClicadaId) {
          tarefaAtivaId = Number(tarefaClicadaId);
        }
   
        gerirConcluir();
      }
      if (tarefaAtivaId !== null){
        mostrarBotao();
      }
      else {
        document.getElementById("btnEdit").style.display = "none";
      }
    });
};

function gerirConcluir() {

      const tarefa = listaTarefas.find((tarefa) => tarefa.id === tarefaAtivaId);

      if (tarefa.idConclusao == 0) {
        editarTarefa({
          nome: tarefa.nome,
          descricao: tarefa.descricao,
          idConclusao: atribuirId(), });
      } else {
        editarTarefa({
          nome: tarefa.nome,
          descricao: tarefa.descricao,
          idConclusao: false, });
      };
};


//gerir o botão "Editar Tarefa"
const gerirBotaoEditar = () => {
  document.getElementById("btnEdit").addEventListener("click", (event) => {
    const tarefa = listaTarefas.find((tarefa) => tarefa.id === tarefaAtivaId);

    if (tarefa == 0 || tarefa == null) {
      document.getElementById("msgSelecionar").style.display = "block";
    } else {
      //guardar a variável na Session Storage
      sessionStorage.setItem("tarefaAtivaId", JSON.stringify(tarefaAtivaId));

      irNewTask();
    }
  });
};


function removerTarefa(tarefaAtiva) {
  //a função filter filtra todos os elementos que cumpram a condição indicada. Neste caso seleciona todas as que tiverem um id diferente do id da tarefa ativa
  const tarefasLimpas = listaTarefas.filter((tarefa) => tarefa.id !== tarefaAtiva
  );

  listaTarefas = tarefasLimpas;
  localStorage.setItem("listaTarefas", JSON.stringify(tarefasLimpas));

  irHomePage();
  atualizarLista();
  // limparDetalhes();
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

  irHomePage();
  atualizarLista();
  }

function mostrarBotao() {
  document.getElementById("btnEdit").style.display = "block";

}
