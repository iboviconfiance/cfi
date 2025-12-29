// État de l'application
let currentPage = 'home';
let currentProfileId = null;
let portfolioData = null;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    // Mettre à jour l'année dans le footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Charger les données JSON
    loadJSONData();
    
    // Configurer les gestionnaires d'événements
    setupEventListeners();
});

// Charger les données depuis le fichier JSON
async function loadJSONData() {
    try {
        const response = await fetch('data.json');
        portfolioData = await response.json();
        
        // Charger la page d'accueil une fois les données chargées
        loadHomePage();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        document.getElementById('loading').innerHTML = 
            '<p>Erreur lors du chargement des données. Veuillez rafraîchir la page.</p>';
    }
}

// Configuration des événements
function setupEventListeners() {
    // Burger menu
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');
    
    burger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Liens de navigation
    document.getElementById('home-link').addEventListener('click', function(e) {
        e.preventDefault();
        loadHomePage();
        navLinks.classList.remove('active');
    });
    
    document.getElementById('profiles-link').addEventListener('click', function(e) {
        e.preventDefault();
        loadHomePage();
        // Scroll vers la section profiles
        setTimeout(() => {
            document.getElementById('profiles').scrollIntoView({ behavior: 'smooth' });
        }, 100);
        navLinks.classList.remove('active');
    });
    
    document.getElementById('footer-home-link').addEventListener('click', function(e) {
        e.preventDefault();
        loadHomePage();
    });
    
    document.getElementById('footer-profiles-link').addEventListener('click', function(e) {
        e.preventDefault();
        loadHomePage();
        setTimeout(() => {
            document.getElementById('profiles').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    });
    
    // Logo - retour à l'accueil
    document.getElementById('site-logo').addEventListener('click', function(e) {
        e.preventDefault();
        loadHomePage();
    });
}

// Charger la page d'accueil
function loadHomePage() {
    if (!portfolioData) return;
    
    currentPage = 'home';
    const mainContent = document.getElementById('main-content');
    
    // Mettre à jour le titre et description du site
    document.title = portfolioData.siteTitle;
    document.getElementById('site-logo').textContent = portfolioData.siteTitle;
    document.getElementById('footer-title').textContent = portfolioData.siteTitle;
    document.getElementById('footer-description').textContent = portfolioData.siteDescription;
    
    let html = `
        <section class="hero">
            <div class="container">
                <h1>${portfolioData.siteTitle}</h1>
                <p>${portfolioData.introduction}</p>
                <a href="#profiles" class="btn">Découvrir les portfolios</a>
            </div>
        </section>
        
        <section class="profiles-section" id="profiles">
            <div class="container">
                <div class="section-title">
                    <h2>Nos Professionnels</h2>
                    <p>Découvrez une sélection de talents dans le domaine du développement web et design</p>
                </div>
                <div class="profiles-grid">
    `;
    
    // Ajouter chaque profil
    portfolioData.profiles.forEach(profile => {
        const hue = (profile.id * 60) % 360;
        
        html += `
            <div class="profile-card" data-profile-id="${profile.id}">
                <div class="profile-image" style="background-color: hsl(${hue}, 70%, 85%);">
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 4rem; color: hsl(${hue}, 50%, 40%);">
                        ${profile.name.charAt(0)}
                    </div>
                </div>
                <div class="profile-content">
                    <h3>${profile.name}</h3>
                    <span class="profile-title">${profile.title}</span>
                    <p class="profile-description">${profile.description}</p>
                    <div class="skills">
                        ${profile.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        ${profile.skills.length > 3 ? `<span class="skill-tag">+${profile.skills.length - 3}</span>` : ''}
                    </div>
                    <button class="btn btn-outline view-profile-btn" data-profile-id="${profile.id}">Voir le portfolio</button>
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
        </section>
    `;
    
    mainContent.innerHTML = html;
    
    // Ajouter les gestionnaires d'événements
    addProfileEventListeners();
    
    // Faire défiler vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Ajouter les événements aux cartes de profil
function addProfileEventListeners() {
    // Boutons "Voir le portfolio"
    document.querySelectorAll('.view-profile-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const profileId = parseInt(this.getAttribute('data-profile-id'));
            loadProfilePage(profileId);
        });
    });
    
    // Clic sur toute la carte
    document.querySelectorAll('.profile-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn')) {
                const profileId = parseInt(this.getAttribute('data-profile-id'));
                loadProfilePage(profileId);
            }
        });
    });
}

// Charger la page d'un profil
function loadProfilePage(profileId) {
    if (!portfolioData) return;
    
    currentPage = 'profile';
    currentProfileId = profileId;
    
    const profile = portfolioData.profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    const mainContent = document.getElementById('main-content');
    
    // Couleur basée sur l'ID
    const hue = (profile.id * 60) % 360;
    
    let html = `
        <div class="container">
            <a href="#" class="back-button" id="back-to-home">
                <i class="fas fa-arrow-left"></i> Retour à l'accueil
            </a>
        </div>
        
        <section class="profile-header">
            <div class="container">
                <div class="profile-header-content">
                    <div class="profile-header-image" style="background-color: hsl(${hue}, 70%, 85%); border: 5px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 5rem; color: hsl(${hue}, 50%, 40%);">
                            ${profile.name.charAt(0)}
                        </div>
                    </div>
                    <div class="profile-header-info">
                        <h1>${profile.name}</h1>
                        <span class="title">${profile.title}</span>
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i> ${profile.location}
                        </div>
                        <p>${profile.description}</p>
                        <div class="contact-info">
                            <a href="mailto:${profile.email}" class="contact-item">
                                <i class="fas fa-envelope"></i> Email
                            </a>
                            <a href="${profile.website}" target="_blank" class="contact-item">
                                <i class="fas fa-globe"></i> Site web
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="profile-details">
            <div class="container">
                <div class="profile-section">
                    <h2>À propos</h2>
                    <p class="profile-bio">${profile.bio}</p>
                </div>
                
                <div class="profile-section">
                    <h2>Compétences</h2>
                    <div class="skills">
                        ${profile.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h2>Projets récents</h2>
                    <div class="projects-grid">
    `;
    
    // Ajouter chaque projet
    profile.projects.forEach((project, index) => {
        const projectHue = (hue + (index * 40)) % 360;
        
        html += `
            <div class="project-card">
                <div class="project-image" style="background-color: hsl(${projectHue}, 60%, 85%);">
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 3rem; color: hsl(${projectHue}, 40%, 30%);">
                        ${project.title.charAt(0)}
                    </div>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="skills">
                        ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
                    </div>
                </div>
            </div>
        </section>
    `;
    
    mainContent.innerHTML = html;
    
    // Gestionnaire d'événement pour le bouton retour
    document.getElementById('back-to-home').addEventListener('click', function(e) {
        e.preventDefault();
        loadHomePage();
    });
    
    // Faire défiler vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}