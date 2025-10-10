const elements = {
    promptTitle: document.querySelector('#prompt-title'),
    promptContent: document.querySelector('#prompt-content'),
    titleWrapper: document.querySelector('#title-wrapper'),
    contentWrapper: document.querySelector('#content-wrapper'),
    btnOpen: document.querySelector('#btn-open'),
    btnCollapse: document.querySelector('#btn-collapse'),
    sidebar: document.querySelector('.sidebar'),
    app: document.querySelector('.app')
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

// inicialização

function init() {
    attachAllEditableHandlers()
    updateAllEditableStates()

    // eventos para abrir e fechar a sidebar

    elements.btnOpen.addEventListener('click', openSidebar)
    elements.btnCollapse.addEventListener('click', closeSidebar)
}

init()