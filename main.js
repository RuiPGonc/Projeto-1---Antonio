/*window.addEventListener('load', () => {

  // * obtem o html do input
  const nomeInput = document.querySelector('#username');

  // * tenta obter o user from localstorage - browser, se não conseguir fica vazio ''
  const utilizador = localStorage.getItem('username') || '';

  nomeInput.value = utilizador;

  // * Grava em loca storage - browser, sempre que houver uma alteração
  nomeInput.addEventListener('change', (e) => {
    localStorage.setItem('username', e.target.value);
  })

  const adicionarAtividadeForm = document.querySelector('#novaAtividade');
    
  adicionarAtividadeForm.addEventListener('submit', e => {
    //previne de uma submissão inesperada ou de reencaminhamento para outro link por parte do browser
    e.preventDefault();

    newElement()
  })

})

*/


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

window.addEventListener('load', (event) => {
// obter o user from localstorage - browser
  const utilizador = localStorage.getItem('nome');

  //console.log(utilizador.value); // para imprimir na consola
  var userLogado=document.getElementById("nomeLogado");
  if (userLogado)
    userLogado.innerHTML='Bem-Vindo!\n'+utilizador;
 

    listaTarefas.forEach(function(task){
    // vou aqui: Rui
      console.log(task);
    
    });
    
    /*<input type="checkbox" id="tarefa1" name="tarefa1" value="Bike">
     <label for="tarefa1"> testetetete</label><br>
*/

})




