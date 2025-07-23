document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA PARA O MENU MOBILE LATERAL ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const body = document.body;

    if (menuToggle && mobileMenu && menuOverlay) {
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');

        // Função para abrir/fechar o menu
        const toggleMenu = () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            body.classList.toggle('menu-open');
        };

        // Evento para o botão hambúrguer
        menuToggle.addEventListener('click', toggleMenu);

        // Evento para o overlay (fechar ao clicar fora)
        menuOverlay.addEventListener('click', toggleMenu);

        // Evento para os links do menu (fechar ao clicar em um item)
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // --- LÓGICA PARA BUSCAR ARTIGOS DO MEDIUM (sem alterações) ---
    const articlesContainer = document.getElementById('medium-articles-container');
    if (articlesContainer) {
        const rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40tiagocatojo';

        fetch(rssUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status !== 'ok') {
                    throw new Error('A resposta da API não foi "ok".');
                }
                articlesContainer.innerHTML = ''; // Limpa a mensagem "Carregando..."
                const latestArticles = data.items.slice(0, 2);

                if (latestArticles.length === 0) {
                    articlesContainer.innerHTML = '<p>Nenhum artigo encontrado.</p>';
                    return;
                }

                latestArticles.forEach(item => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(item.content, 'text/html');
                    const description = doc.body.textContent.trim().substring(0, 150) + '...';
                    
                    // Card HTML SEM a tag <img>
                    const articleCardHtml = `
                        <div class="article-card">
                            <div class="article-card-content">
                                <h3>${item.title}</h3>
                                <p>${description}</p>
                                <a href="${item.link}" target="_blank" rel="noopener noreferrer">Leia mais →</a>
                            </div>
                        </div>
                    `;
                    articlesContainer.innerHTML += articleCardHtml;
                });
            })
            .catch(error => {
                console.error('Erro ao buscar artigos do Medium:', error);
                articlesContainer.innerHTML = '<p>Não foi possível carregar os artigos no momento.</p>';
            });
    }
});
