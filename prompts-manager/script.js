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
    elements.sidebar.style.display = 'flex'
    elements.btnOpen.style.display = 'none'
}

function closeSidebar() {
    elements.sidebar.style.display = 'none'
    elements.btnOpen.style.display = 'block'
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

    persist()
}

// salvar no localStorage
function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts)) // setItem precisa de 2 infos: a chave e o valor
        alert('Prompt salvo com sucesso!')
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
    return `
    <li class="prompt-item" data-id="${prompt.id}" data-action="select">
        <div class="prompt-item-content">
            <span class="prompt-item-title">${prompt.title}</span>
            <span class="prompt-item-description">${prompt.content}</span>
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

    elements.list.innerHTML = filteredPrompts
}

// evento para salvar
elements.btnSave.addEventListener('click', save)

// evento para buscar
elements.search.addEventListener('input', function (e) {
    renderList(e.target.value)
})

// selecionar prompt
elements.list.addEventListener('click', function (e) {
    const removeBtn = e.target.closest('[data-action="remove"]')
    const item = e.target.closest('[data-id]')
    
    if (!item) return

    const id = item.getAttribute('data-id')
    console.log(id)

    if (removeBtn) {
        // ação futura de remover
        return
    } else if (e.target.closest('[data-action="select"]')) {
        const prompt = state.prompts.find(p => p.id === id)
        
        if (prompt){
            elements.promptTitle.textContent = prompt.title
            elements.promptContent.textContent = prompt.content
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