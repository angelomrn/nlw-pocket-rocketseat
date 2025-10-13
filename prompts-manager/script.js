// chave para identificar os dados salvos pela nossa aplicação no navegador 
const STORAGE_KEY = 'prompts-storage'

// carregar os prompts salvos e exibir
const state = {
    prompts: [],
    selectedID: null, // id do prompt selecionado
}

const elements = {
    promptTitle: document.querySelector('#prompt-title'),
    promptContent: document.querySelector('#prompt-content'),
    titleWrapper: document.querySelector('#title-wrapper'),
    contentWrapper: document.querySelector('#content-wrapper'),
    btnOpen: document.querySelector('#btn-open'),
    btnCollapse: document.querySelector('#btn-collapse'),
    sidebar: document.querySelector('.sidebar'),
    app: document.querySelector('.app'),
    btnSave: document.querySelector('#btn-save'),
    list: document.querySelector('.prompt-list'),
    search: document.querySelector('#search-input'),
    btnNew: document.querySelector('#btn-new'),
    btnCopy: document.querySelector('#btn-copy'),
}

function updateEditableWrapperState(element, wrapper) {
    //.trim() remove os caracteres de espaço em branco (como espaços, tabulações e quebras de linha) do início e do fim de uma string. 
    const hasText = element.textContent.trim().length > 0
    wrapper.classList.toggle('is-empty', !hasText)
}

function updateAllEditableStates() {
    updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
    updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
}

// ouvintes de input

function attachAllEditableHandlers() {
    elements.promptTitle.addEventListener('input', () => {
        updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
    })

    elements.promptContent.addEventListener('input', () => {
        updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
    })
}

// funcoes para abrir e fechar a sidebar

function openSidebar() {
    elements.sidebar.classList.add('open')
    elements.sidebar.classList.remove('collapsed')
}

function closeSidebar() {
    elements.sidebar.classList.remove('open')
    elements.sidebar.classList.add('collapsed')
}

// salvar prompt
function save() {
    const title = elements.promptTitle.innerHTML.trim()
    const content = elements.promptContent.innerHTML.trim()
    const hasContent = elements.promptContent.textContent.trim()
    
    if (!title || !hasContent) {
        alert('Titulo e conteudo não podem estar vazios.')
        return
    }

    if (state.selectedID) {
        // Editando um prompt existente
        const existingPrompt = state.prompts.find(p => p.id === state.selectedID)
        
        if (existingPrompt) {
            existingPrompt.title = title || 'Sem Titulo'
            existingPrompt.content = content || 'Sem Conteudo'
        }

    } else {
        // Criando um novo prompt
        const newPrompt = {
            id: Date.now().toString(),
            title,
            content,
        }

        state.prompts.unshift(newPrompt)
        state.selectedID = newPrompt.id
    }

    renderList(elements.search.value)
    persist()
}

// salvar no localStorage
function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts)) // setItem precisa de 2 infos: a chave e o valor
    } catch (error) {
        console.log('Erro ao salvar no localStorage:', error)
    }
}

// carregar o que esta salvo
function load() {
    try {
        const storage = localStorage.getItem(STORAGE_KEY)
        state.prompts = storage ? JSON.parse(storage) : []
        // se tiver algo no storage(?), transforma de volta em objeto, senao(:), array vazio
        state.selectedID = null
    } catch (error) {
        console.log('Erro ao salvar no localStorage:', error)
    }
}

// listando os prompts na sidebar
function createPromptItem(prompt) {
    const tmpContent = document.createElement('div')
    const tmpTitle = document.createElement('div')
    tmpContent.innerHTML = prompt.content
    tmpTitle.innerHTML = prompt.title

    return `
    <li class="prompt-item" data-id="${prompt.id}" data-action="select">
        <div class="prompt-item-content">
            <span class="prompt-item-title">${tmpTitle.textContent}</span>
            <span class="prompt-item-description">${tmpContent.textContent}</span>
        </div>
        <button class="btn-icon" title="Remover" data-action="remove">
            <img src="assets/remove.svg" class="icon icon-trash" alt="Remover">
        </button>
    </li>
    `
}

// renderizando / pesquisa na lista
function renderList(filterText = '') {
    const filteredPrompts = state.prompts.filter(prompt => prompt.title.toLowerCase().includes(filterText.toLowerCase().trim())).map(p => createPromptItem(p)).join('')
    // Ou seja, para cada prompt que passou pelo filtro, ele gera um trecho de HTML correspondente usando createPromptItem.
    // O resultado é um array de strings HTML, que depois é unido em uma única string com .join('') para ser exibido na tela.

    elements.list.innerHTML = filteredPrompts
}

function addNewPrompt() {
    state.selectedID = null
    elements.promptTitle.textContent = ''
    elements.promptContent.textContent = ''
    updateAllEditableStates()
    elements.promptTitle.focus()
}

function copySelected() {
    try {
        const content = elements.promptContent
        
        if (!navigator.clipboard) {
            console.log('API de area de transferencia nao suportada')
            return
        }
        
        navigator.clipboard.writeText(content.innerText)

        alert('Conteudo copiado para a area de transferencia!  ')
    } catch (error) {
        console.log('Erro ao copiar para a area de transferencia:', error)
    }
}

// evento para salvar
elements.btnSave.addEventListener('click', save)

// novo botao
elements.btnNew.addEventListener('click', addNewPrompt)

// evento para buscar
elements.search.addEventListener('input', function (e) {
    renderList(e.target.value)
})

// copiar prompt
elements.btnCopy.addEventListener('click', copySelected)

// selecionar prompt
elements.list.addEventListener('click', function (e) {
    const removeBtn = e.target.closest('[data-action="remove"]')
    const item = e.target.closest('[data-id]')
    if (!item) return

    const id = item.getAttribute('data-id')
    state.selectedID = id

    if (removeBtn) {
        // retorna filtrado todos os prompts, desde que eles sejam diferentes do id que queremos remover

        // novo array sem o prompt removido
        state.prompts = state.prompts.filter(p => p.id !== id)
        renderList(elements.search.value)
        persist()
        return
    } else if (e.target.closest('[data-action="select"]')) {
        const prompt = state.prompts.find(p => p.id === id) 
        // O método .find() procura o objeto cujo p.id seja igual ao valor da variável id. Então, a const prompt será o objeto completo do prompt
        
        if (prompt){
            elements.promptTitle.textContent = prompt.title
            elements.promptContent.innerHTML = prompt.content
            updateAllEditableStates()
        }
    }
})

// inicialização
function init() {
    load()
    renderList('')
    attachAllEditableHandlers()
    updateAllEditableStates()

    // eventos para abrir e fechar a sidebar

    elements.btnOpen.addEventListener('click', openSidebar)
    elements.btnCollapse.addEventListener('click', closeSidebar)
}

init()