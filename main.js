window.addEventListener('load', () => {

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

function newElement() {

  var li = document.createElement("li");
  
  var inputValue = document.getElementById("descricaoAtividade").value;
 
  //createTextNode é usado para fornecer texto a um elemento
  var t = document.createTextNode(inputValue);

  //AppendChild acrescenta ao elemento declarado o que for mencionado nos ().
  li.appendChild(t);

  console.log(li);
  if (inputValue == '') {
     alert("Por favor escreva alguma coisa");
  } else {
    //Adiciona a nova atividade às já existentes
    document.getElementById("listaAtividades").appendChild(li);
  }
  //faz reset ao campo 
  document.getElementById("descricaoAtividade").value = "";

}