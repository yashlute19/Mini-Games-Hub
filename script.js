// Main application class to handle all functionality
class MiniGamesHub {
    constructor() {
        // Initialize all DOM elements
        this.initializeElements();
        // Initialize all event listeners
        this.initializeEventListeners();
        // Load saved theme
        this.loadTheme();
        // Load saved feedbacks
        this.displayFeedbacks();
        // Initialize background music
        this.initializeBackgroundMusic();
    }

    // Initialize all DOM elements
    initializeElements() {
        // Theme elements
        this.themeButton = document.getElementById('themeButton');
        this.themeOptions = document.getElementById('themeOptions');
        
        // Sidebar elements
        this.openSidebar = document.getElementById('openSidebar');
        this.closeSidebar = document.getElementById('closeSidebar');
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('overlay');
        
        // Search elements
        this.gameSearch = document.getElementById('gameSearch');
        this.searchResults = document.getElementById('searchResults');
        this.searchBtn = document.getElementById('searchBtn');
        this.voiceBtn = document.getElementById('voiceBtn');
        
        // Feedback elements
        this.feedbackForm = document.getElementById('feedbackForm');
        this.feedbackList = document.getElementById('feedbackList');
        
        // Game elements
        this.gameCards = document.querySelectorAll('.game-card');
        this.gamesLink = document.querySelector('a[href="#games"]');

        // Settings elements
        this.settingsPanel = document.getElementById('settingsPanel');
        this.openSettings = document.getElementById('openSettings');
        this.closeSettings = document.getElementById('closeSettings');
        this.fontSize = document.getElementById('fontSize');
        this.animationSpeed = document.getElementById('animationSpeed');
        this.soundEnabled = document.getElementById('soundEnabled');
        this.musicEnabled = document.getElementById('musicEnabled');
        this.difficulty = document.getElementById('difficulty');
        this.gameNotifications = document.getElementById('gameNotifications');
        this.achievementNotifications = document.getElementById('achievementNotifications');
        this.clearHistory = document.getElementById('clearHistory');
        this.exportData = document.getElementById('exportData');
        this.importData = document.getElementById('importData');

        // Language elements
        this.languagePanel = document.getElementById('languagePanel');
        this.languageSearch = document.getElementById('languageSearch');
        this.languageItems = document.querySelectorAll('.language-item');
        this.closeLanguage = document.getElementById('closeLanguage');
        this.openLanguage = document.getElementById('openLanguage');

        // Privacy Policy elements
        this.privacyPanel = document.getElementById('privacyPanel');
        this.openPrivacy = document.getElementById('openPrivacy');
        this.closePrivacy = document.getElementById('closePrivacy');
        this.acceptPrivacy = document.getElementById('acceptPrivacy');

        // About elements
        this.aboutPanel = document.getElementById('aboutPanel');
        this.openAbout = document.getElementById('openAbout');
        this.closeAbout = document.getElementById('closeAbout');

        // Terms elements
        this.termsPanel = document.getElementById('termsPanel');
        this.openTerms = document.getElementById('openTerms');
        this.closeTerms = document.getElementById('closeTerms');
        this.acceptTerms = document.getElementById('acceptTerms');

        // Background music elements
        this.backgroundMusic = {
            hangman: document.getElementById('hangmanMusic'),
            memory: document.getElementById('memoryMusic'),
            rps: document.getElementById('rpsMusic'),
            snake: document.getElementById('snakeMusic'),
            tictactoe: document.getElementById('tictactoeMusic'),
            wordscramble: document.getElementById('wordscrambleMusic')
        };
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Theme management
        this.themeButton.addEventListener('click', () => this.toggleTheme());
        
        // Sidebar management
        this.openSidebar.addEventListener('click', () => this.toggleSidebar(true));
        this.closeSidebar.addEventListener('click', () => this.toggleSidebar(false));
        this.overlay.addEventListener('click', () => this.toggleSidebar(false));

        // Search functionality
        this.initSearch();

        // Voice search
        this.initializeVoiceSearch();

        // Feedback form
        this.feedbackForm.addEventListener('submit', (e) => this.handleFeedbackSubmit(e));

        // Game cards click effect
        this.gameCards.forEach(card => {
            card.addEventListener('click', () => this.handleGameCardClick(card));
        });

        // Smooth scroll
        if (this.gamesLink) {
            this.gamesLink.addEventListener('click', (e) => this.handleSmoothScroll(e));
        }

        // Global event listeners
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('click', (e) => this.handleGlobalClick(e));

        // Settings event listeners
        this.openSettings.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSettings(true);
        });
        this.closeSettings.addEventListener('click', () => this.toggleSettings(false));
        
        // Settings change handlers
        this.fontSize.addEventListener('change', () => this.handleFontSizeChange());
        this.animationSpeed.addEventListener('change', () => this.handleAnimationSpeedChange());
        this.soundEnabled.addEventListener('change', () => this.handleSoundToggle());
        this.musicEnabled.addEventListener('change', () => this.handleMusicToggle());
        this.difficulty.addEventListener('change', () => this.handleDifficultyChange());
        this.gameNotifications.addEventListener('change', () => this.handleNotificationToggle());
        this.achievementNotifications.addEventListener('change', () => this.handleNotificationToggle());
        
        // Data management handlers
        this.clearHistory.addEventListener('click', () => this.handleClearHistory());
        this.exportData.addEventListener('click', () => this.handleExportData());
        this.importData.addEventListener('click', () => this.handleImportData());

        // Language event listeners
        this.openLanguage.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleLanguagePanel(true);
            this.toggleSidebar(false); // Close sidebar when opening language panel
        });
        this.closeLanguage.addEventListener('click', () => this.toggleLanguagePanel(false));
        this.languageSearch.addEventListener('input', (e) => this.filterLanguages(e.target.value));
        this.languageItems.forEach(item => {
            item.addEventListener('click', () => this.changeLanguage(item.dataset.lang));
        });

        // Privacy Policy Panel
        this.openPrivacy.addEventListener('click', () => {
            this.togglePrivacyPanel(true);
            this.toggleSidebar(false);
        });
        
        this.closePrivacy.addEventListener('click', () => {
            this.togglePrivacyPanel(false);
        });
        
        this.acceptPrivacy.addEventListener('click', () => {
            this.acceptPrivacyPolicy();
        });

        // About Panel
        this.openAbout.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAboutPanel(true);
            this.toggleSidebar(false);
        });
        
        this.closeAbout.addEventListener('click', () => {
            this.toggleAboutPanel(false);
        });

        // Terms Panel
        this.openTerms.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTermsPanel(true);
            this.toggleSidebar(false);
        });
        
        this.closeTerms.addEventListener('click', () => {
            this.toggleTermsPanel(false);
        });
        
        this.acceptTerms.addEventListener('click', () => {
            this.acceptTermsAndConditions();
        });

        // Initialize game preview videos
        this.initializeGamePreviews();
    }

    // Theme Management
    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.themeButton.textContent = `Theme: ${theme === 'dark' ? '🌙 Dark' : '☀️ Light'}`;
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    // Sidebar Management
    toggleSidebar(show) {
        this.sidebar.style.transform = show ? 'translateX(0)' : 'translateX(100%)';
        this.overlay.style.opacity = show ? '1' : '0';
        this.overlay.style.visibility = show ? 'visible' : 'hidden';
        document.body.style.overflow = show ? 'hidden' : '';
    }

    // Search Functionality
    initSearch() {
        const searchInput = document.querySelector('.search-wrapper input');
        const searchIcon = document.querySelector('.search-icon');
        const searchResults = document.querySelector('.search-results');
        let searchTimeout;

        const performSearch = (query) => {
            if (!query.trim()) {
                searchResults.style.display = 'none';
                return;
            }

            const results = this.games.filter(game => 
                game.name.toLowerCase().includes(query.toLowerCase())
            );

            if (results.length > 0) {
                searchResults.innerHTML = results.map(game => 
                    `<li data-game="${game.id}">${game.name}</li>`
                ).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<li>No games found</li>';
                searchResults.style.display = 'block';
            }
        };

        const handleSearch = (query) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => performSearch(query), 300);
        };

        const openGame = (gameId) => {
            const game = this.games.find(g => g.id === gameId);
            if (game) {
                window.location.href = game.path;
            }
        };

        // Handle input changes
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });

        // Handle Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    const game = this.games.find(g => 
                        g.name.toLowerCase() === query.toLowerCase()
                    );
                    if (game) {
                        window.location.href = game.path;
                    }
                }
            }
        });

        // Handle search icon click
        searchIcon.addEventListener('click', () => {
            if (document.activeElement === searchInput) {
                // If search input is focused, perform search
                const query = searchInput.value.trim();
                if (query) {
                    const game = this.games.find(g => 
                        g.name.toLowerCase() === query.toLowerCase()
                    );
                    if (game) {
                        window.location.href = game.path;
                    }
                }
            } else {
                // If search input is not focused, focus it
                searchInput.focus();
            }
        });

        // Handle search results clicks
        searchResults.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI' && e.target.dataset.game) {
                openGame(e.target.dataset.game);
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) {
                searchResults.style.display = 'none';
            }
        });
    }

    // Voice Search
    initializeVoiceSearch() {
        // Check for browser compatibility
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.voiceBtn.style.display = 'none';
            console.warn('Voice recognition is not supported in this browser. Please use Chrome for best results.');
            return;
        }

        // Create speech recognition instance
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        // Configure recognition settings
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // Set language to English
        let isListening = false;

        // Add visual feedback element
        const feedbackElement = document.createElement('div');
        feedbackElement.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            display: none;
        `;
        document.body.appendChild(feedbackElement);

        const showFeedback = (message, duration = 3000) => {
            feedbackElement.textContent = message;
            feedbackElement.style.display = 'block';
            setTimeout(() => {
                feedbackElement.style.display = 'none';
            }, duration);
        };

        this.voiceBtn.addEventListener('click', async () => {
            try {
                if (!isListening) {
                    // Request microphone permission explicitly
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    stream.getTracks().forEach(track => track.stop()); // Stop the stream after getting permission
                    
                    recognition.start();
                    this.voiceBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';
                    isListening = true;
                    showFeedback('Listening... Speak now');
                } else {
                    recognition.stop();
                    this.voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
                    isListening = false;
                    showFeedback('Voice recognition stopped');
                }
            } catch (error) {
                console.error('Microphone permission error:', error);
                showFeedback('Please allow microphone access to use voice search');
                this.voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
                isListening = false;
            }
        });

        recognition.onstart = () => {
            console.log('Voice recognition started');
            showFeedback('Listening... Speak now');
        };

        recognition.onresult = (event) => {
            const query = event.results[0][0].transcript;
            console.log('Voice recognition result:', query);
            
            this.gameSearch.value = query;
            
            // Find the game that matches the recognized speech
            const recognizedGame = this.games.find(game => 
                game.name.toLowerCase() === query.toLowerCase().trim()
            );
            
            if (recognizedGame) {
                showFeedback(`Opening ${recognizedGame.name}...`);
                // Add a small delay to show the feedback message
                setTimeout(() => {
                    window.location.href = recognizedGame.path;
                }, 1000);
            } else {
                // If no exact match, show search results
                this.handleSearch(query);
                showFeedback(`No exact match found for "${query}". Showing search results.`);
            }
            
            this.voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            isListening = false;
        };

        recognition.onend = () => {
            console.log('Voice recognition ended');
            this.voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            isListening = false;
        };

        recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            
            let errorMessage = 'Voice recognition failed. ';
            switch (event.error) {
                case 'no-speech':
                    errorMessage += 'No speech was detected. Please try again.';
                    break;
                case 'aborted':
                    errorMessage += 'Voice recognition was aborted.';
                    break;
                case 'audio-capture':
                    errorMessage += 'No microphone was found. Please ensure your microphone is connected.';
                    break;
                case 'network':
                    errorMessage += 'Network error occurred. Please check your internet connection.';
                    break;
                case 'not-allowed':
                    errorMessage += 'Microphone access was denied. Please allow microphone access.';
                    break;
                case 'service-not-allowed':
                    errorMessage += 'Voice recognition service is not allowed.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred. Please try again.';
            }
            
            showFeedback(errorMessage, 5000);
            this.voiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            isListening = false;
        };

        // Add a tooltip to the voice button
        this.voiceBtn.title = 'Click to start voice search';
        
        // Add keyboard shortcut (Alt+V) for voice search
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'v') {
                e.preventDefault();
                this.voiceBtn.click();
            }
        });
    }

    // Feedback Management
    saveFeedback(feedback) {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        feedbacks.push({
            ...feedback,
            date: new Date().toISOString()
        });
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        this.displayFeedbacks();
    }

    displayFeedbacks() {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        const feedbackListElement = this.feedbackList.querySelector('ul');
        feedbackListElement.innerHTML = '';

        feedbacks.slice(-5).reverse().forEach(feedback => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${feedback.username}</strong> - ${feedback.rating} stars<br>
                ${feedback.review}<br>
                <small>${new Date(feedback.date).toLocaleDateString()}</small>
            `;
            feedbackListElement.appendChild(li);
        });
    }

    handleFeedbackSubmit(e) {
        e.preventDefault();
        const feedback = {
            username: document.getElementById('username').value,
            rating: document.getElementById('rating').value,
            review: document.getElementById('review').value
        };
        
        if (feedback.username && feedback.rating && feedback.review) {
            this.saveFeedback(feedback);
            alert(`Thanks for your feedback, ${feedback.username}! 🙌`);
            this.feedbackForm.reset();
        } else {
            alert('Please fill all fields before submitting.');
        }
    }

    // Game Card Click Effect
    handleGameCardClick(card) {
        card.classList.add('clicked');
        setTimeout(() => {
            card.classList.remove('clicked');
        }, 200);
    }

    // Smooth Scroll
    handleSmoothScroll(e) {
        e.preventDefault();
        document.querySelector('#games').scrollIntoView({ behavior: 'smooth' });
    }

    // Global Event Handlers
    handleKeyPress(e) {
        if (e.key === 'Escape') {
            this.toggleSidebar(false);
            this.toggleSettings(false);
            this.toggleLanguagePanel(false);
            this.togglePrivacyPanel(false);
            this.toggleAboutPanel(false);
            this.toggleTermsPanel(false);
            this.searchResults.style.display = 'none';
        }
    }

    handleGlobalClick(e) {
        if (!e.target.closest('.search-wrapper')) {
            this.searchResults.style.display = 'none';
        }
    }

    // Settings Management
    toggleSettings(show) {
        this.settingsPanel.classList.toggle('show', show);
        if (show) {
            this.loadSettings();
        }
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        
        // Load saved settings or use defaults
        this.fontSize.value = settings.fontSize || 'medium';
        this.animationSpeed.value = settings.animationSpeed || 'normal';
        this.soundEnabled.checked = settings.soundEnabled !== false;
        this.musicEnabled.checked = settings.musicEnabled || false;
        this.difficulty.value = settings.difficulty || 'medium';
        this.gameNotifications.checked = settings.gameNotifications !== false;
        this.achievementNotifications.checked = settings.achievementNotifications !== false;

        // Apply loaded settings
        this.applySettings();
    }

    saveSettings() {
        const settings = {
            fontSize: this.fontSize.value,
            animationSpeed: this.animationSpeed.value,
            soundEnabled: this.soundEnabled.checked,
            musicEnabled: this.musicEnabled.checked,
            difficulty: this.difficulty.value,
            gameNotifications: this.gameNotifications.checked,
            achievementNotifications: this.achievementNotifications.checked
        };
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    applySettings() {
        // Apply font size
        document.body.style.fontSize = {
            small: '14px',
            medium: '16px',
            large: '18px'
        }[this.fontSize.value];

        // Apply animation speed
        document.documentElement.style.setProperty('--animation-speed', {
            slow: '0.5s',
            normal: '0.3s',
            fast: '0.15s'
        }[this.animationSpeed.value]);

        // Save settings
        this.saveSettings();
    }

    handleFontSizeChange() {
        this.applySettings();
    }

    handleAnimationSpeedChange() {
        this.applySettings();
    }

    handleSoundToggle() {
        this.saveSettings();
        // Implement sound toggle logic
    }

    handleMusicToggle() {
        this.saveSettings();
        // Implement music toggle logic
    }

    handleDifficultyChange() {
        this.saveSettings();
        // Implement difficulty change logic
    }

    handleNotificationToggle() {
        this.saveSettings();
        // Implement notification toggle logic
    }

    handleClearHistory() {
        if (confirm('Are you sure you want to clear your game history? This cannot be undone.')) {
            localStorage.removeItem('gameHistory');
            alert('Game history cleared successfully!');
        }
    }

    handleExportData() {
        const settings = localStorage.getItem('settings');
        const blob = new Blob([settings], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'game-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    handleImportData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const settings = JSON.parse(event.target.result);
                    localStorage.setItem('settings', JSON.stringify(settings));
                    this.loadSettings();
                    alert('Settings imported successfully!');
                } catch (error) {
                    alert('Error importing settings. Please make sure the file is valid.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // Language Management
    toggleLanguagePanel(show) {
        this.languagePanel.classList.toggle('show', show);
        if (show) {
            this.loadCurrentLanguage();
        }
    }

    loadCurrentLanguage() {
        const currentLang = localStorage.getItem('language') || 'en';
        this.languageItems.forEach(item => {
            item.classList.toggle('active', item.dataset.lang === currentLang);
        });
    }

    filterLanguages(query) {
        const searchTerm = query.toLowerCase();
        this.languageItems.forEach(item => {
            const languageName = item.querySelector('span').textContent.toLowerCase();
            const nativeName = item.querySelector('.language-native').textContent.toLowerCase();
            const isVisible = languageName.includes(searchTerm) || nativeName.includes(searchTerm);
            item.style.display = isVisible ? 'flex' : 'none';
        });
    }

    changeLanguage(lang) {
        // Remove active class from all items
        this.languageItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to selected language
        const selectedItem = document.querySelector(`.language-item[data-lang="${lang}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }

        // Save language preference
        localStorage.setItem('language', lang);

        // Update UI text based on selected language
        this.updateUIText(lang);

        // Close language panel
        this.toggleLanguagePanel(false);
    }

    updateUIText(lang) {
        const translations = {
            en: {
                games: 'Games',
                settings: 'Settings',
                feedback: 'Feedback',
                search: 'Search games...',
                welcome: 'Welcome to Mini Games Hub!',
                subtitle: 'Play fun & challenging mini games all in one place!'
            },
            es: {
                games: 'Juegos',
                settings: 'Configuración',
                feedback: 'Comentarios',
                search: 'Buscar juegos...',
                welcome: '¡Bienvenido a Mini Games Hub!',
                subtitle: '¡Juega juegos divertidos y desafiantes en un solo lugar!'
            },
            fr: {
                games: 'Jeux',
                settings: 'Paramètres',
                feedback: 'Commentaires',
                search: 'Rechercher des jeux...',
                welcome: 'Bienvenue sur Mini Games Hub!',
                subtitle: 'Jouez à des mini-jeux amusants et stimulants en un seul endroit!'
            },
            de: {
                games: 'Spiele',
                settings: 'Einstellungen',
                feedback: 'Feedback',
                search: 'Spiele suchen...',
                welcome: 'Willkommen bei Mini Games Hub!',
                subtitle: 'Spielen Sie lustige und herausfordernde Mini-Spiele an einem Ort!'
            },
            ja: {
                games: 'ゲーム',
                settings: '設定',
                feedback: 'フィードバック',
                search: 'ゲームを検索...',
                welcome: 'Mini Games Hubへようこそ！',
                subtitle: '楽しく挑戦的なミニゲームを一箇所でプレイ！'
            },
            zh: {
                games: '游戏',
                settings: '设置',
                feedback: '反馈',
                search: '搜索游戏...',
                welcome: '欢迎来到迷你游戏中心！',
                subtitle: '在一个地方玩有趣且具有挑战性的迷你游戏！'
            },
            ar: {
                games: 'الألعاب',
                settings: 'الإعدادات',
                feedback: 'التعليقات',
                search: 'البحث عن الألعاب...',
                welcome: 'مرحباً بك في مركز الألعاب المصغرة!',
                subtitle: 'العب ألعاباً ممتعة وتحديات في مكان واحد!'
            },
            hi: {
                games: 'गेम्स',
                settings: 'सेटिंग्स',
                feedback: 'प्रतिक्रिया',
                search: 'गेम खोजें...',
                welcome: 'मिनी गेम्स हब में आपका स्वागत है!',
                subtitle: 'एक ही जगह पर मज़ेदार और चुनौतीपूर्ण मिनी गेम खेलें!'
            }
        };

        const translation = translations[lang] || translations.en;
        
        // Update text content
        document.querySelector('a[href="#games"]').textContent = translation.games;
        document.querySelector('a[href="#"]').textContent = translation.settings;
        document.querySelector('a[href="#feedback"]').textContent = translation.feedback;
        this.gameSearch.placeholder = translation.search;
        document.querySelector('.hero h1').textContent = translation.welcome;
        document.querySelector('.hero p').textContent = translation.subtitle;

        // Update document direction for RTL languages
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }

    // Privacy Policy Methods
    togglePrivacyPanel(show) {
        if (show) {
            this.privacyPanel.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            this.privacyPanel.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    acceptPrivacyPolicy() {
        localStorage.setItem('privacyAccepted', 'true');
        this.togglePrivacyPanel(false);
        this.showNotification('Privacy policy accepted', 'success');
    }

    checkPrivacyPolicy() {
        const privacyAccepted = localStorage.getItem('privacyAccepted');
        if (!privacyAccepted) {
            this.togglePrivacyPanel(true);
        }
    }

    showNotification(message, type) {
        // Implement notification logic
    }

    // About Panel Methods
    toggleAboutPanel(show) {
        if (show) {
            this.aboutPanel.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            this.aboutPanel.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Terms & Conditions Methods
    toggleTermsPanel(show) {
        if (show) {
            this.termsPanel.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            this.termsPanel.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    acceptTermsAndConditions() {
        localStorage.setItem('termsAccepted', 'true');
        this.toggleTermsPanel(false);
        this.showNotification('Terms and conditions accepted', 'success');
    }

    checkTermsAndConditions() {
        const termsAccepted = localStorage.getItem('termsAccepted');
        if (!termsAccepted) {
            this.toggleTermsPanel(true);
        }
    }

    initializeGamePreviews() {
        const gameContainers = document.querySelectorAll('.game-card-container');
        
        gameContainers.forEach(container => {
            const video = container.querySelector('.game-preview');
            
            container.addEventListener('mouseenter', () => {
                video.play().catch(error => {
                    console.log('Video autoplay failed:', error);
                });
            });
            
            container.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });
    }

    initializeBackgroundMusic() {
        // Get music settings from localStorage, default to true if not set
        const musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
        console.log('Music enabled status:', musicEnabled);
        
        // Set initial volume (70% of max)
        Object.entries(this.backgroundMusic).forEach(([game, audio]) => {
            audio.volume = 0.7;
            
            // Add error handling for audio loading
            audio.addEventListener('error', (e) => {
                console.error(`Error loading audio for ${game}:`, e);
                console.error('Audio error details:', e.target.error);
            });
            
            // Add loaded event listener
            audio.addEventListener('loadeddata', () => {
                console.log(`Audio loaded successfully for ${game}`);
            });

            // Add canplaythrough event listener
            audio.addEventListener('canplaythrough', () => {
                console.log(`Audio can play through for ${game}`);
            });

            // Add playing event listener
            audio.addEventListener('playing', () => {
                console.log(`Audio is now playing for ${game}`);
            });

            // Add pause event listener
            audio.addEventListener('pause', () => {
                console.log(`Audio paused for ${game}`);
            });

            // Log the audio source
            console.log(`Audio source for ${game}:`, audio.querySelector('source').src);
        });

        // Add click handlers to game cards
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.addEventListener('click', async (e) => {
                console.log('Game card clicked:', card.textContent.trim());
                console.log('Music enabled:', musicEnabled);
                
                if (!musicEnabled) {
                    console.log('Music is disabled in settings');
                    return;
                }
                
                // Stop all other music
                Object.values(this.backgroundMusic).forEach(audio => {
                    audio.pause();
                    audio.currentTime = 0;
                });

                // Get the game name from the card text
                const gameName = card.textContent.trim().toLowerCase();
                console.log('Game name:', gameName);
                let musicElement;

                // Map game name to corresponding audio element
                switch(gameName) {
                    case 'hangman game':
                        musicElement = this.backgroundMusic.hangman;
                        break;
                    case 'memory card game':
                        musicElement = this.backgroundMusic.memory;
                        break;
                    case 'rock paper scissors':
                        musicElement = this.backgroundMusic.rps;
                        break;
                    case 'snake game':
                        musicElement = this.backgroundMusic.snake;
                        break;
                    case 'tic tac toe':
                        musicElement = this.backgroundMusic.tictactoe;
                        break;
                    case 'word scramble':
                        musicElement = this.backgroundMusic.wordscramble;
                        break;
                }

                console.log('Selected music element:', musicElement);

                // Play the music if element exists
                if (musicElement) {
                    try {
                        // Reset the audio to the beginning
                        musicElement.currentTime = 0;
                        
                        // Ensure audio is loaded
                        if (musicElement.readyState >= 2) {
                            console.log('Audio is ready to play');
                            
                            // Try to play the audio
                            const playPromise = musicElement.play();
                            
                            if (playPromise !== undefined) {
                                playPromise.then(() => {
                                    console.log(`Music started playing for ${gameName}`);
                                    // Verify if audio is actually playing
                                    if (musicElement.paused) {
                                        console.error('Audio is still paused after play() resolved');
                                    } else {
                                        console.log('Audio is confirmed playing');
                                    }
                                }).catch(error => {
                                    console.error('Background music play failed:', error);
                                    // Show a message to the user about clicking to enable music
                                    const message = document.createElement('div');
                                    message.style.cssText = `
                                        position: fixed;
                                        top: 20px;
                                        left: 50%;
                                        transform: translateX(-50%);
                                        background: rgba(0, 0, 0, 0.8);
                                        color: white;
                                        padding: 10px 20px;
                                        border-radius: 5px;
                                        z-index: 1000;
                                    `;
                                    message.textContent = 'Click anywhere to enable game music';
                                    document.body.appendChild(message);
                                    
                                    // Remove message after 3 seconds
                                    setTimeout(() => {
                                        document.body.removeChild(message);
                                    }, 3000);

                                    // Try to play again after user interaction
                                    const playAfterInteraction = () => {
                                        musicElement.play().then(() => {
                                            console.log('Music started playing after user interaction');
                                            // Verify if audio is actually playing
                                            if (musicElement.paused) {
                                                console.error('Audio is still paused after user interaction');
                                            } else {
                                                console.log('Audio is confirmed playing after user interaction');
                                            }
                                        }).catch(e => {
                                            console.error('Background music play failed even with user interaction:', e);
                                        });
                                    };
                                    document.addEventListener('click', playAfterInteraction, { once: true });
                                });
                            }
                        } else {
                            console.error('Audio is not ready to play. ReadyState:', musicElement.readyState);
                            // Wait for audio to be ready
                            musicElement.addEventListener('canplaythrough', () => {
                                console.log('Audio is now ready to play');
                                musicElement.play().catch(error => {
                                    console.error('Failed to play after canplaythrough:', error);
                                });
                            }, { once: true });
                        }
                    } catch (error) {
                        console.error('Error playing background music:', error);
                    }
                } else {
                    console.warn(`No music element found for game: ${gameName}`);
                }
            });
        });

        // Handle music toggle in settings
        if (this.musicEnabled) {
            this.musicEnabled.checked = musicEnabled; // Set initial state
            this.musicEnabled.addEventListener('change', () => {
                const isEnabled = this.musicEnabled.checked;
                localStorage.setItem('musicEnabled', isEnabled);
                console.log(`Music ${isEnabled ? 'enabled' : 'disabled'}`);
                
                // Stop all music if disabled
                if (!isEnabled) {
                    Object.values(this.backgroundMusic).forEach(audio => {
                        audio.pause();
                        audio.currentTime = 0;
                    });
                }
            });
        }

        // Add a global click handler to enable audio context
        document.addEventListener('click', () => {
            // Try to play and immediately pause all audio elements to enable them
            Object.entries(this.backgroundMusic).forEach(([game, audio]) => {
                if (audio.readyState >= 2) {
                    audio.play().then(() => {
                        console.log(`Audio context enabled for ${game}`);
                        audio.pause();
                        audio.currentTime = 0;
                    }).catch(error => {
                        console.error(`Failed to enable audio context for ${game}:`, error);
                    });
                } else {
                    console.log(`Audio not ready for ${game}, waiting for canplaythrough`);
                    audio.addEventListener('canplaythrough', () => {
                        audio.play().then(() => {
                            console.log(`Audio context enabled for ${game} after waiting`);
                            audio.pause();
                            audio.currentTime = 0;
                        }).catch(error => {
                            console.error(`Failed to enable audio context for ${game} after waiting:`, error);
                        });
                    }, { once: true });
                }
            });
        }, { once: true });
    }
}

// Game data
MiniGamesHub.prototype.games = [
    { id: 'hangman', name: 'Hangman Game', path: 'Hangman game/index.html' },
    { id: 'memory', name: 'Memory Card Game', path: 'memory card/index.html' },
    { id: 'rps', name: 'Rock Paper Scissors', path: 'Rock paper scissor/index.html' },
    { id: 'snake', name: 'Snake Game', path: 'snake game/index.html' },
    { id: 'tictactoe', name: 'Tic Tac Toe', path: 'Tic Tac Toe/index.html' },
    { id: 'wordscramble', name: 'Word Scramble', path: 'Word scramble/index.html' }
];

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new MiniGamesHub();
}); 