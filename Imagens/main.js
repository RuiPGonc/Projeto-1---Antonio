
 let listaTarefas=JSON.parse(localStorage.getItem("listaTarefas"));

function send(){
  //e.preventDefault();
  var input_user = document.getElementById("username").value;
  var input_password = document.getElementById("password").value;
  
  if(input_user!="" && input_password!=""){
  // * Grava em loca storage - browser
    localStorage.setItem("nome",input_user);
    //mudar de página
    window.open("homePage.html","_self");

   
    //se ao abrir o programa não existir uma lista de tarefas é criada uma.
    if(localStorage.getItem("listaTarefas")===null){
localStorage.setItem("listaTarefas",JSON.stringify([]))}

  }else{
    document.getElementById("msgAlerta").style.display="block"; //torna a mensagemd e erro visivel
  }
}

function irAdicionarTarefa(){
  //e.preventDefault();
  window.open("newTask.html","_self");
}
function irHomePage(){
  window.open("homePage.html","_self");
}

function validarFormularioNovaTarefa(){
var descr_input = document.getElementById("descricao").value;
var nome_input= document.getElementById("nameTask").value;


if(descr_input !="" && nome_input!=""){
//criar um novo objeto "Tarefa"
  let novaTarefa = new Object();
  novaTarefa.id = atribuirId();
  novaTarefa.nome=nome_input;
  novaTarefa.descricao=descr_input;
  novaTarefa.realizada=false;


  //traz a lista de tarefas que já existe
  let listaTarefas=JSON.parse(localStorage.getItem("listaTarefas"));
  //adiciona a nova tarefa à lista que existe
  listaTarefas.push(novaTarefa);
 // * Grava em loca storage - browser
 localStorage.setItem("listaTarefas",JSON.stringify(listaTarefas));
 
 irHomePage();
}else{
  document.getElementById("mensagemErro").style.display="block";
}
  
}

function atribuirId() {
  let listaTarefas=JSON.parse(localStorage.getItem("listaTarefas"));
  let iD = listaTarefas.length;
  return iD++;
}

window.addEventListener('load', (event) => {
// obter o user from localstorage - browser
  const utilizador = localStorage.getItem('nome');

  //console.log(utilizador.value); // para imprimir na consola
  var userLogado=document.getElementById("nomeLogado");
  if (userLogado)
    userLogado.innerHTML='Bem-Vindo!\n'+utilizador;
 

    // chamar a atualizaçao aqui!!!!!!!!!!!!!!!!!!
    atualizarLista();
   
    
    });
    
  const atualizarLista=() =>{
    limparTarefas();
    //a linha abaixo envia cada item a lista de tarefas para o criarItem, para ser impresso no ecrã
   for(let i=0;i<listaTarefas.length;i++){
    criarItem(listaTarefas[i].nome, listaTarefas[i].realizada)
   }
   
  }

  const limparTarefas =() => {
    const div_ListaTarefas=document.getElementById("div_ListaTarefas");
   //enquanto houver um elemento na div_ListaTarefas o ciclo remove o último elemento da lista
    while(div_ListaTarefas.firstChild){
      div_ListaTarefas.removeChild(div_ListaTarefas.lastChild);
    }
  }
  
    //criar tarefas para serem mostradas na lista
 const criarItem =(nome_tarefa,realizada) => {
  const item=document.createElement('label');
  item.classList.add('class_listaTarefas');  
  //envia para dentro do item o código HTML
  item.innerHTML = `
  <input type='checkbox'${realizada}> ${nome_tarefa}  
  <p></p></input>`;
//coloca o item, com o respetivo cod HTML dentro da div que vai mostrar a lista
  document.getElementById('div_ListaTarefas').appendChild(item);
  }


/*para ver/editar e remover tarefas -> falta acabar

//quando o user clica na checkbox a tarefa passa a concluída
document.getElementById(div_ListaTarefas).addEventListener('click',clickedItem);

const clickedItem = (evento) => {
 //para ver em que sitio o utilizador carregou
  const elemento = evento.target;
  if(elemento.type === 'button'){
    const indice=
    removerItem()
  }

}
*/
 
//para ver a descrição na div "Detalhe"
const verDescricao =(id_tarefa) => {
  for(let i=0;i<listaTarefas.length;i++){
if(listaTarefas[i].id == id_tarefa){
  const item=document.createElement('label');
  item.classList.add('class_DetalheTarefa');  
  item.innerHTML = listaTarefas[i].descricao;
  document.setElementById('div_DetalheTarefas').appendChild(item);
  break;
}
}
}