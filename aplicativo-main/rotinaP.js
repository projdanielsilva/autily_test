// Função para tornar a célula editável
function makeEditable(cell) {
    const originalText = cell.innerHTML;
    cell.contentEditable = true;
    cell.focus();

    cell.addEventListener('blur', function() {
        cell.contentEditable = false;
        if (cell.innerHTML.trim() === '') {
            cell.innerHTML = originalText; // Restaura o texto original se estiver vazio
        }
        salvar(); // Salva automaticamente após a edição
    });
}

// Adiciona evento de clique às células editáveis
function addEditableListeners() {
    document.querySelectorAll('#editableTable .editable').forEach(cell => {
        cell.addEventListener('click', function() {
            makeEditable(this);
        });
    });
}

// Função para adicionar uma nova linha
function adicionarLinha() {
    var tabela = document.querySelector('#editableTable tbody');
    var tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="editable">Nova Data</td>
        <td class="editable">Nova Hora</td>
        <td class="editable">Nova Atividade</td>
        <td>
            <button class="editar-btn" onclick="editarLinha(this)">Editar</button>
            <button class="apagar-btn" onclick="apagarLinha(this)">Apagar</button>
        </td>
    `;
    tabela.appendChild(tr);
    addEditableListeners(); // Adiciona listeners para as novas células
}

// Função para salvar os dados no localStorage
function salvar() {
    var tabela = document.querySelector('#editableTable');
    var linhas = tabela.querySelectorAll('tbody tr');
    var dados = [];

    linhas.forEach(function(linha) {
        var celulas = linha.querySelectorAll('td');
        var linhaDados = [];
        celulas.forEach(function(celula) {
            linhaDados.push(celula.innerText);
        });
        dados.push(linhaDados);
    });

    localStorage.setItem('tabelaDados', JSON.stringify(dados));
    // Opcional: Mensagem de sucesso (remova se não precisar)
    // alert('Dados salvos com sucesso!');
}

// Função para carregar os dados do localStorage
function carregar() {
    var dados = localStorage.getItem('tabelaDados');
    if (dados) {
        dados = JSON.parse(dados);
        var tabela = document.querySelector('#editableTable tbody');
        tabela.innerHTML = ''; // Limpar o corpo da tabela

        dados.forEach(function(linhaDados) {
            var tr = document.createElement('tr');
            linhaDados.forEach(function(celulaDados) {
                var td = document.createElement('td');
                td.classList.add('editable');
                td.setAttribute('contenteditable', 'true');
                td.textContent = celulaDados;
                tr.appendChild(td);
            });
            var tdAcao = document.createElement('td');
            var btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add('editar-btn');
            btnEditar.onclick = function() { editarLinha(btnEditar) };
            var btnApagar = document.createElement('button');
            btnApagar.textContent = 'Apagar';
            btnApagar.classList.add('apagar-btn');
            btnApagar.onclick = function() { apagarLinha(btnApagar) };
            tdAcao.appendChild(btnEditar);
            tdAcao.appendChild(btnApagar);
            tr.appendChild(tdAcao);
            tabela.appendChild(tr);
        });

        addEditableListeners(); // Adiciona listeners para as células carregadas
    }
}

// Função para editar uma linha
function editarLinha(btn) {
    var linha = btn.closest('tr');
    var celulas = linha.querySelectorAll('td.editable');
    celulas.forEach(celula => makeEditable(celula));
}

// Função para apagar uma linha específica
function apagarLinha(btn) {
    var linha = btn.closest('tr');
    linha.remove();
    salvar(); // Salva o estado atualizado após apagar uma linha
}

// Função para apagar todos os dados
function apagarTudo() {
    if (confirm('Tem certeza de que deseja apagar todos os dados?')) {
        localStorage.removeItem('tabelaDados');
        var tabela = document.querySelector('#editableTable tbody');
        tabela.innerHTML = '';
        alert('Todos os dados apagados com sucesso!');
    }
}

// Carregar os dados ao carregar a página
window.onload = carregar;
