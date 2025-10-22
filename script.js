        // ===== CONFIGURAÇÕES GERAIS =====
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const livesElement = document.getElementById('lives');
        const levelElement = document.getElementById('level-indicator');
        const uiElement = document.getElementById('ui');
        const highscoreElement = document.getElementById('highscore');
        const splashScreen = document.getElementById('splash-screen');
        const startScreen = document.getElementById('start-screen');
        const startButton = document.getElementById('start-button');
        const settingsButton = document.getElementById('settings-button');
        const rankingButton = document.getElementById('ranking-button');
        const settingsScreen = document.getElementById('settings-screen');
        const settingsBackBtn = document.getElementById('settings-back-btn');
        const colorSwatches = document.querySelectorAll('.color-swatch');
        const touchSensitivitySlider = document.getElementById('touch-sensitivity');
        const sensitivityValueSpan = document.getElementById('sensitivity-value');
        const versionsButton = document.getElementById('versions-button');
        const versionSelectScreen = document.getElementById('version-select-screen');
        const silverButton = document.getElementById('silver-button');
        const goldButton = document.getElementById('gold-button');
        const emeraldButton = document.getElementById('emerald-button');
        const diamondButton = document.getElementById('diamond-button');
        const versionBackBtn = document.getElementById('version-back-btn');
        const gameOverScreen = document.getElementById('game-over');
        const gameWinScreen = document.getElementById('game-win');
        const pauseScreen = document.getElementById('pause-screen');
        const finalScoreElement = document.getElementById('final-score');
        const finalLevelElement = document.getElementById('final-level');
        const finalScoreWinElement = document.getElementById('final-score-win');
        const restartBtn = document.getElementById('restart-btn');
        const playAgainWinBtn = document.getElementById('play-again-win-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resumeBtn = document.getElementById('resume-btn');
        const backToStartBtn = document.getElementById('back-to-start-btn');
        const muteButton = document.getElementById('mute-btn');
        const missionDisplay = document.getElementById('mission-display');
        const activeMissionsList = document.getElementById('active-missions-list');
        const missionsToggleButton = document.getElementById('missions-toggle-btn');
        let missionsDisplayVisible = false;
        const missionCompleteNotification = document.getElementById('mission-complete-notification');
        const rankingMissionsSelectScreen = document.getElementById('ranking-missions-select-screen');
        const rankingGeneralBtn = document.getElementById('ranking-general-btn');
        const viewMissionsBtn = document.getElementById('view-missions-btn');
        const rankingMissionsBackBtn = document.getElementById('ranking-missions-back-btn');
        const missionsScreen = document.getElementById('missions-screen');
        const missionsActiveList = document.getElementById('missions-active-list');
        const missionsCompletedList = document.getElementById('missions-completed-list');
        const missionsBackBtn = document.getElementById('missions-back-btn');
        let score = 0;
        let lives = 5;
        let currentLevelIndex = 0;
        let transitionActive = false;
        let transitionProgress = 0;
        let highscore = localStorage.getItem('highscore') || 0;
        let lastTime = 0;
        const targetFps = 60;
        const frameInterval = 1000 / targetFps;
        let gameActive = false;
        let isPaused = false;
        let gameLoopRAF;
        let floatingTexts = [];
        let touchSensitivity = parseFloat(localStorage.getItem('touchSensitivity')) || 1.0;
        let currentBackgroundPreset = localStorage.getItem('backgroundPreset') || 'default';
        let currentTotalRankingPoints = parseInt(localStorage.getItem('rankingPoints') || '0');
        let userGold = parseInt(localStorage.getItem('userGold') || '0');
        let userBrics = parseInt(localStorage.getItem('userBrics') || '0');
        const defaultMissions = [
            { id: 'novatoCeu', title: 'NOVATO DOS CÉUS', description: 'Colete 1.000 pontos no Nível "Céu".', rankingPoints: 100, goldReward: 100, bricsReward: 0, progress: 0, target: 1000, type: 'pointsInLevel', level: 'Céu', completed: false },
            { id: 'aventureiroDeserto', title: 'AVENTUREIRO DO DESERTO', description: 'Atinja e jogue por 30 segundos no Nível "Deserto".', rankingPoints: 200, goldReward: 200, bricsReward: 0, progress: 0, target: 30, type: 'timeInLevel', level: 'Deserto', completed: false, timer: 0 },
            { id: 'mergulhadorProfundo', title: 'MERGULHADOR PROFUNDO', description: 'Colete 5 guarda-chuvas azuis (Oceano) em uma única partida.', rankingPoints: 300, goldReward: 300, bricsReward: 0, progress: 0, target: 5, type: 'collectColor', color: ['#00BFFF', '#1E90FF', '#4169E1', '#4682B4'], completed: false },
            { id: 'resistenciaGelida', title: 'RESISTÊNCIA GÉLIDA', description: 'Sobreviva no Nível "Gelo" por 45 segundos.', rankingPoints: 400, goldReward: 400, bricsReward: 0, progress: 0, target: 45, type: 'timeInLevel', level: 'Gelo', completed: false, timer: 0 },
            { id: 'conquistadorCosmos', title: 'CONQUISTADOR DO COSMOS', description: 'Atinja o Nível "Espaço".', rankingPoints: 500, goldReward: 500, bricsReward: 0, progress: 0, target: 1, type: 'reachLevel', level: 'Espaço', completed: false },
            { id: 'colecionadorAgil', title: 'COLECIONADOR ÁGIL', description: 'Clique em 50 guarda-chuvas em uma única partida.', rankingPoints: 350, goldReward: 350, bricsReward: 0, progress: 0, target: 50, type: 'totalClicksMatch', completed: false },
            { id: 'vidaExtra', title: 'VIDA EXTRA', description: 'Termine uma partida com 5 vidas restantes.', rankingPoints: 250, goldReward: 250, bricsReward: 0, progress: 0, target: 1, type: 'livesRemaining', completed: false },
            { id: 'pontuadorMestre', title: 'PONTUADOR MESTRE', description: 'Alcance uma pontuação de 10.000 pontos em qualquer partida.', rankingPoints: 600, goldReward: 600, bricsReward: 0, progress: 0, target: 10000, type: 'totalScore', completed: false },
            { id: 'exploradorCompleto', title: 'EXPLORADOR COMPLETO', description: 'Jogue em todos os 5 níveis (Céu, Deserto, Oceano, Gelo, Espaço) em partidas separadas.', rankingPoints: 700, goldReward: 700, bricsReward: 0, progress: 0, target: 5, type: 'visitAllLevels', completed: false, levelsVisited: { 'Céu': false, 'Deserto': false, 'Oceano': false, 'Gelo': false, 'Espaço': false } },
            { id: 'imbativel', title: 'IMBATÍVEL', description: 'Vença o jogo (alcance a tela "Parabéns! Você Venceu!").', rankingPoints: 1000, goldReward: 0, bricsReward: 1, progress: 0, target: 1, type: 'winGame', completed: false }
        ];
        const defaultRankingRewards = [
            { id: 'pinoBronze', title: 'PINO DE BRONZE', description: 'Receba um "Pino de Bronze" em seu perfil!', pointsRequired: 500, unlocked: false },
            { id: 'pinoPrata', title: 'PINO DE PRATA', description: 'Receba um "Pino de Prata", +1 vida inicial na próxima partida e 1 BRIC!', pointsRequired: 1500, bricsReward: 1, unlocked: false },
            { id: 'pinoOuro', title: 'PINO DE OURO', description: 'Receba um "Pino de Ouro", guarda-chuvas valem 10% mais pontos e 2 BRICS!', pointsRequired: 3000, bricsReward: 2, unlocked: false },
            { id: 'pinoDiamante', title: 'PINO DE DIAMANTE', description: 'Receba um "Pino de Diamante", desbloqueie um tema exclusivo para o jogo e 5 BRICS!', pointsRequired: 5000, bricsReward: 5, unlocked: false }
        ];
        let missions = [];
        let rankingRewards = [];
        function saveAchievementData() {
            localStorage.setItem('rankingPoints', currentTotalRankingPoints);
            localStorage.setItem('userGold', userGold);
            localStorage.setItem('userBrics', userBrics);
            localStorage.setItem('gameMissions', JSON.stringify(missions));
            localStorage.setItem('gameRankingRewards', JSON.stringify(rankingRewards));
            console.log("Dados de conquistas salvos!");
        }
        function loadAchievementData() {
            try {
                const savedMissions = JSON.parse(localStorage.getItem('gameMissions'));
                const savedRankingRewards = JSON.parse(localStorage.getItem('gameRankingRewards'));
                if (savedMissions) {
                    missions = defaultMissions.map(defaultM => {
                        const savedM = savedMissions.find(sm => sm.id === defaultM.id);
                        if (savedM) {
                            return { ...defaultM, ...savedM };
                        }
                        return defaultM;
                    });
                    defaultMissions.forEach(defaultM => {
                        if (!missions.some(m => m.id === defaultM.id)) {
                            missions.push(JSON.parse(JSON.stringify(defaultM)));
                        }
                    });
                } else {
                    missions = JSON.parse(JSON.stringify(defaultMissions));
                }
                if (savedRankingRewards) {
                    rankingRewards = defaultRankingRewards.map(defaultR => {
                        const savedR = savedRankingRewards.find(sr => sr.id === defaultR.id);
                        if (savedR) {
                            return { ...defaultR, ...savedR };
                        }
                        return defaultR;
                    });
                    defaultRankingRewards.forEach(defaultR => {
                        if (!rankingRewards.some(r => r.id === defaultR.id)) {
                            rankingRewards.push(JSON.parse(JSON.stringify(defaultR)));
                        }
                    });
                } else {
                    rankingRewards = JSON.parse(JSON.stringify(defaultRankingRewards));
                }
                currentTotalRankingPoints = parseInt(localStorage.getItem('rankingPoints') || '0');
                userGold = parseInt(localStorage.getItem('userGold') || '0');
                userBrics = parseInt(localStorage.getItem('userBrics') || '0');
                console.log("Dados de conquistas carregados!");
            } catch (e) {
                console.error("Erro ao carregar dados de conquistas do localStorage:", e);
                missions = JSON.parse(JSON.stringify(defaultMissions));
                rankingRewards = JSON.parse(JSON.stringify(defaultRankingRewards));
                currentTotalRankingPoints = 0;
                userGold = 0;
                userBrics = 0;
                saveAchievementData();
            }
        }
        function showMissionCompleteNotification(title, rankingPoints, goldReward, bricsReward) {
            missionCompleteNotification.innerHTML = `
                🏆 MISSÃO CONCLUÍDA! 🏆\n
                <strong>${title}</strong>\n
                +${rankingPoints} PONTOS DE RANKING\n
                +${goldReward} OURO\n
                +${bricsReward} BRIC${bricsReward !== 1 ? 'S' : ''}
            `;
            missionCompleteNotification.style.display = 'block';
            setTimeout(() => {
                missionCompleteNotification.classList.add('show');
            }, 10);
            setTimeout(() => {
                missionCompleteNotification.classList.remove('show');
                missionCompleteNotification.addEventListener('transitionend', function handler() {
                    missionCompleteNotification.style.display = 'none';
                    missionCompleteNotification.removeEventListener('transitionend', handler);
                }, { once: true });
            }, 4000);
        }
        function updateMissionProgress(missionId, progressToAdd, options = {}) {
            const mission = missions.find(m => m.id === missionId);
            if (!mission || mission.completed) return;
            let updated = false;
            switch (mission.type) {
                case 'pointsInLevel':
                case 'totalClicksMatch':
                case 'totalScore':
                    if (mission.type === 'pointsInLevel' && options.levelName !== mission.level) break;
                    mission.progress += progressToAdd;
                    if (mission.progress >= mission.target) {
                        mission.progress = mission.target;
                        mission.completed = true;
                        currentTotalRankingPoints += mission.rankingPoints;
                        userGold += mission.goldReward;
                        userBrics += mission.bricsReward;
                        showMissionCompleteNotification(mission.title, mission.rankingPoints, mission.goldReward, mission.bricsReward);
                    }
                    updated = true;
                    break;
                case 'timeInLevel':
                    if (options.levelName === mission.level) {
                        mission.timer = (mission.timer || 0) + progressToAdd;
                        if (mission.timer >= mission.target && !mission.completed) {
                            mission.progress = mission.target;
                            mission.completed = true;
                            currentTotalRankingPoints += mission.rankingPoints;
                            userGold += mission.goldReward;
                            userBrics += mission.bricsReward;
                            showMissionCompleteNotification(mission.title, mission.rankingPoints, mission.goldReward, mission.bricsReward);
                        }
                    }
                    updated = true;
                    break;
                case 'reachLevel':
                    if (options.levelName === mission.level && !mission.completed) {
                        mission.progress = mission.target;
                        mission.completed = true;
                        currentTotalRankingPoints += mission.rankingPoints;
                        userGold += mission.goldReward;
                        userBrics += mission.bricsReward;
                        showMissionCompleteNotification(mission.title, mission.rankingPoints, mission.goldReward, mission.bricsReward);
                    }
                    updated = true;
                    break;
                case 'collectColor':
                    if (options.clickedColor && mission.color.includes(options.clickedColor)) {
                        mission.progress += progressToAdd;
                        if (mission.progress >= mission.target) {
                            mission.completed = true;
                            currentTotalRankingPoints += mission.rankingPoints;
                            userGold += mission.goldReward;
                            userBrics += mission.bricsReward;
                            showMissionCompleteNotification(mission.title, mission.rankingPoints, mission.goldReward, mission.bricsReward);
                        }
                    }
                    updated = true;
                    break;
                case 'livesRemaining':
                    if (options.livesRemaining === mission.target && !mission.completed) {
                        mission.progress = mission.target;
                        mission.completed = true;
                        currentTotalRankingPoints += mission.rankingPoints;
                        userGold += mission.goldReward;
                        userBrics += mission.bricsReward;
                        showMissionCompleteNotification(mission.title, mission.rankingPoints, mission.goldReward, mission.bricsReward);
                    }
                    updated = true;
                    break;
                case 'visitAllLevels':
                    if (options.levelName && mission.levelsVisited && !mission.levelsVisited[options.levelName]) {
                        mission.levelsVisited[options.levelName] = true;
                        mission.progress++;
                        if (mission.progress >= mission.target && !mission.completed) {
                            mission.completed = true;
                            currentTotalRankingPoints += mission.rankingPoints;
                            userGold += mission.goldReward;
                            userBrics += mission.bricsReward;
                            showMissionCompleteNotification(mission.title, mission.rankingPoints, mission.goldReward, mission.bricsReward);
                        }
                    }
                    updated = true;
                    break;
                case 'winGame':
                    if (options.winStatus === true && !mission.completed) {
                        mission.progress = mission.target;
                        mission.completed = true;
                        currentTotalRankingPoints += mission.rankingPoints;
                        userBrics += mission.bricsReward;
                        showMissionCompleteNotification(mission.title, mission.rankingPoints, mission.goldReward, mission.bricsReward);
                    }
                    updated = true;
                    break;
            }
            if (updated) {
                checkRankingRewards();
                saveAchievementData();
                if (missionsDisplayVisible) {
                    renderActiveMissions();
                }
            }
        }
        function checkRankingRewards() {
            rankingRewards.forEach(reward => {
                if (!reward.unlocked && currentTotalRankingPoints >= reward.pointsRequired) {
                    reward.unlocked = true;
                    userBrics += reward.bricsReward || 0;
                    showMissionCompleteNotification(`🏅 RECOMPENSA DE RANKING! 🏅\n${reward.title}`, reward.pointsRequired, 0, reward.bricsReward || 0);
                    saveAchievementData();
                }
            });
        }
        function resetPerMatchMissions() {
            missions.forEach(mission => {
                const resetTypes = ['collectColor', 'totalClicksMatch', 'livesRemaining', 'pointsInLevel', 'timeInLevel'];
                if (resetTypes.includes(mission.type) && !mission.completed) {
                    mission.progress = 0;
                    if (mission.type === 'timeInLevel') mission.timer = 0;
                }
            });
            saveAchievementData();
        }
        function renderActiveMissions() {
            activeMissionsList.innerHTML = '';
            const missionsToShow = missions.filter(m => !m.completed);
            if (missionsToShow.length === 0) {
                activeMissionsList.innerHTML = 'NENHUMA MISSÃO ATIVA. BOM TRABALHO!';
                return;
            }
            missionsToShow.forEach(mission => {
                const missionDiv = document.createElement('div');
                missionDiv.classList.add('mission-item-in-game');
                let progressText = '';
                if (mission.type === 'pointsInLevel' || mission.type === 'totalClicksMatch' || mission.type === 'totalScore') {
                    progressText = `${Math.min(mission.progress, mission.target)}/${mission.target} PONTOS`;
                } else if (mission.type === 'timeInLevel') {
                    progressText = `${Math.min(Math.floor(mission.timer || 0), mission.target)}/${mission.target} SEGUNDOS`;
                } else if (mission.type === 'collectColor') {
                    progressText = `${Math.min(mission.progress, mission.target)}/${mission.target} COLETADOS`;
                } else if (mission.type === 'livesRemaining') {
                    progressText = `TERMINE COM ${mission.target} VIDAS`;
                } else if (mission.type === 'reachLevel') {
                    progressText = `ATINGIR NÍVEL "${mission.level.toUpperCase()}"`;
                } else if (mission.type === 'visitAllLevels') {
                    progressText = `${mission.progress}/${mission.target} NÍVEIS VISITADOS`;
                } else if (mission.type === 'winGame') {
                    progressText = `VENÇA O JOGO!`;
                }
                missionDiv.innerHTML = `<strong>${mission.title}</strong><br><span class="progress">${progressText}</span>`;
                activeMissionsList.appendChild(missionDiv);
            });
        }
        function renderAllMissions() {
            missionsActiveList.innerHTML = '';
            missionsCompletedList.innerHTML = '';
            const active = missions.filter(m => !m.completed);
            const completed = missions.filter(m => m.completed);
            if (active.length === 0) {
                missionsActiveList.innerHTML = '<div class="mission-item"><p>Nenhuma missão ativa no momento.</p></div>';
            } else {
                active.forEach(mission => {
                    const missionDiv = document.createElement('div');
                    missionDiv.classList.add('mission-item');
                    let progressText = '';
                    if (mission.type === 'pointsInLevel' || mission.type === 'totalClicksMatch' || mission.type === 'totalScore') {
                        progressText = `Progresso: ${Math.min(mission.progress, mission.target)}/${mission.target} Pontos`;
                    } else if (mission.type === 'timeInLevel') {
                        progressText = `Progresso: ${Math.min(Math.floor(mission.timer || 0), mission.target)}/${mission.target} Segundos`;
                    } else if (mission.type === 'collectColor') {
                        progressText = `Progresso: ${Math.min(mission.progress, mission.target)}/${mission.target} Coletados`;
                    } else if (mission.type === 'livesRemaining') {
                        progressText = `Objetivo: Terminar com ${mission.target} vidas`;
                    } else if (mission.type === 'reachLevel') {
                        progressText = `Objetivo: Atingir o Nível "${mission.level.toUpperCase()}"`;
                    } else if (mission.type === 'visitAllLevels') {
                        progressText = `Progresso: ${mission.progress}/${mission.target} Níveis Visitados`;
                    } else if (mission.type === 'winGame') {
                        progressText = `Objetivo: Vencer o Jogo!`;
                    }
                    const rewardsText = `Recompensas: ${mission.rankingPoints} RP, ${mission.goldReward} Ouro, ${mission.bricsReward} BRICS`;
                    missionDiv.innerHTML = `
                        <strong>${mission.title}</strong><br>
                        <span class="description">${mission.description}</span><br>
                        <span class="progress-rewards">${progressText} | ${rewardsText}</span>
                    `;
                    missionsActiveList.appendChild(missionDiv);
                });
            }
            if (completed.length === 0) {
                missionsCompletedList.innerHTML = '<div class="mission-item"><p>Nenhuma missão completada ainda.</p></div>';
            } else {
                completed.forEach(mission => {
                    const missionDiv = document.createElement('div');
                    missionDiv.classList.add('mission-item', 'completed');
                    const rewardsText = `Recompensas: ${mission.rankingPoints} RP, ${mission.goldReward} Ouro, ${mission.bricsReward} BRICS`;
                    missionDiv.innerHTML = `
                        <strong>${mission.title}</strong><br>
                        <span class="description">${mission.description}</span><br>
                        <span class="progress-rewards">COMPLETADA! | ${rewardsText}</span>
                    `;
                    missionsCompletedList.appendChild(missionDiv);
                });
            }
        }
        class SoundSystem {
            constructor() {
                this.sounds = {
                    click: { file: "clique.mp3", volume: 0.7, multiple: true },
                    gameOver: { file: "gameover.mp3", volume: 0.7 },
                    background: { file: "musica.mp3", volume: 0.5, loop: true },
                    levelUp: { file: "nivel.mp3", volume: 0.8 },
                    menu: { file: "telainicio.mp3", volume: 0.4, loop: true },
                    life: { file: "vida.mp3", volume: 0.6, multiple: true }
                };
                this.audioElements = {};
                this.activeLoopingSounds = {};
                this.isAudioEnabled = false;
                this.isMuted = localStorage.getItem('isMuted') === 'true';
            }
            preload() {
                for (const [key, config] of Object.entries(this.sounds)) {
                    const audio = new Audio(config.file);
                    audio.volume = config.volume;
                    audio.loop = config.loop || false;
                    audio.muted = this.isMuted;
                    this.audioElements[key] = audio;
                    audio.load();
                }
            }
            async enableAudioContext() {
                if (this.isAudioEnabled) return;
                try {
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    gainNode.gain.value = 0;
                    oscillator.start(0);
                    oscillator.stop(0.001);
                    this.isAudioEnabled = true;
                    console.log("Contexto de áudio habilitado via AudioContext.");
                    if (startScreen.classList.contains('active') && !this.activeLoopingSounds.menu && !this.isMuted) {
                        this.play("menu");
                    }
                    if (gameActive && !isPaused && !this.activeLoopingSounds.background && !this.isMuted) {
                        this.play("background");
                    }
                } catch (e) {
                    console.warn("Falha ao habilitar contexto de áudio (requer interação do usuário):", e);
                }
            }
            play(key) {
                if (!this.isAudioEnabled && (this.sounds[key].loop || key === "menu" || key === "background")) {
                    return;
                }
                if (this.isMuted) {
                    return;
                }
                try {
                    const config = this.sounds[key];
                    if (!config) {
                        console.warn(`Som com a chave '${key}' não encontrado.`);
                        return;
                    }
                    let audio;
                    if (config.multiple) {
                        audio = new Audio(config.file);
                        audio.volume = config.volume;
                        audio.muted = this.isMuted;
                        audio.play().catch(e => console.warn(`Áudio '${key}' (multiple) não pôde tocar:`, e));
                    } else {
                        audio = this.audioElements[key];
                        if (audio) {
                            if (config.loop) {
                                if (this.activeLoopingSounds[key] && this.activeLoopingSounds[key] !== audio) {
                                    this.activeLoopingSounds[key].pause();
                                    this.activeLoopingSounds[key].currentTime = 0;
                                }
                                this.activeLoopingSounds[key] = audio;
                                audio.loop = true;
                            }
                            audio.currentTime = 0;
                            audio.muted = this.isMuted;
                            audio.play().catch(e => console.warn(`Áudio '${key}' não pôde tocar:`, e));
                        } else {
                            console.warn(`Áudio '${key}' não pré-carregado.`);
                        }
                    }
                } catch (e) {
                    console.error(`Erro ao tocar '${key}':`, e);
                }
            }
            stop(key) {
                const audio = this.audioElements[key];
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
                if (this.activeLoopingSounds[key]) {
                    this.activeLoopingSounds[key].pause();
                    this.activeLoopingSounds[key].currentTime = 0;
                    delete this.activeLoopingSounds[key];
                }
            }
            stopAll() {
                for (const key in this.audioElements) {
                    this.stop(key);
                }
                for (const key in this.activeLoopingSounds) {
                    this.stop(key);
                }
            }
            toggleMute() {
                this.isMuted = !this.isMuted;
                localStorage.setItem('isMuted', this.isMuted);
                muteButton.textContent = this.isMuted ? '🎵 OFF' : '🎵 ON';
                for (const key in this.audioElements) {
                    this.audioElements[key].muted = this.isMuted;
                }
                for (const key in this.activeLoopingSounds) {
                    if (this.activeLoopingSounds[key]) this.activeLoopingSounds[key].muted = this.isMuted;
                }
                if (!this.isMuted && !this.isAudioEnabled) {
                     this.enableAudioContext();
                } else if (this.isMuted) {
                    this.stopAll();
                } else if (!this.isMuted && this.isAudioEnabled) {
                    if (startScreen.classList.contains('active')) {
                        this.play("menu");
                    } else if (gameActive && !isPaused) {
                        this.play("background");
                    }
                }
                return this.isMuted;
            }
            updateMuteButton() {
                muteButton.textContent = this.isMuted ? '🎵 OFF' : '🎵 ON';
            }
        }
        const soundSystem = new SoundSystem();
        soundSystem.preload();
        soundSystem.updateMuteButton();
        let currentUmbrellas = [];
        let currentParticles = [];
        let clouds = [], cacti = [], dunes = [], stars = [], nebulas = [], icebergs = [], snowflakes = [], waterBubbles = [];
        const levels = [
            {
                name: "Céu",
                umbrellaColors: ['#FF5252', '#4285F4', '#FBBC05', '#34A853'],
                spawnRate: 0.015,
                baseSpeed: 2,
                scoreValue: 20,
                nextLevelScore: 1000
            },
            {
                name: "Deserto",
                umbrellaColors: ['#A0522D', '#D2B48C', '#F4A460', '#BDB76B'],
                spawnRate: 0.02,
                baseSpeed: 3,
                scoreValue: 50,
                nextLevelScore: 5000
            },
            {
                name: "Oceano",
                umbrellaColors: ['#00BFFF', '#1E90FF', '#4169E1', '#4682B4'],
                spawnRate: 0.025,
                baseSpeed: 4,
                scoreValue: 100,
                nextLevelScore: 20000
            },
            {
                name: "Gelo",
                umbrellaColors: ['#FFFFFF', '#ADD8E6', '#87CEEB', '#B0E0E6'],
                spawnRate: 0.03,
                baseSpeed: 5,
                scoreValue: 120,
                nextLevelScore: 40000
            },
            {
                name: "Espaço",
                umbrellaColors: ['#ff00ff', '#00ffff', '#ffff00', '#ff00ff'],
                spawnRate: 0.035,
                baseSpeed: 6,
                scoreValue: 150,
                nextLevelScore: 100000
            }
        ];
        const backgroundPresets = {
            'default': "linear-gradient(to bottom, #87CEEB, #B0E0E6)",
            'dark': "linear-gradient(to bottom, #2c3e50, #34495e)",
            'sunset': "linear-gradient(to bottom, #fdc830, #f37335)",
            'forest': "linear-gradient(to bottom, #4CAF50, #8BC34A)"
        };
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (gameActive && !isPaused) {
                initializeLevelElements();
            }
        }
        function applyGameBackground() {
            const currentLevelData = levels[currentLevelIndex];
            if (currentLevelData.name.includes('Espaço')) {
                uiElement.style.textShadow = '0 0 10px #00ffff, 0 0 20px #ff00ff';
            } else {
                uiElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
            }
            document.body.style.background = 'none';
            document.body.style.backgroundImage = 'none';
        }
        function applyMenuBackground() {
            document.body.style.backgroundImage = `url('fundo1.png')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
        }
        function initializeLevelElements() {
            clouds = []; cacti = []; dunes = []; stars = []; nebulas = []; icebergs = []; snowflakes = []; waterBubbles = [];
            const levelData = levels[currentLevelIndex];
            if (levelData.name.includes('Céu')) {
                clouds = Array.from({ length: 5 }, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.4,
                    speed: 0.2 + Math.random() * 0.3,
                    size: 50 + Math.random() * 70,
                    opacity: 0.7 + Math.random() * 0.3
                }));
            } else if (levelData.name.includes('Deserto')) {
                cacti = Array.from({ length: 10 }, () => ({
                    x: Math.random() * canvas.width,
                    y: canvas.height - (30 + Math.random() * 70),
                    height: 30 + Math.random() * 70
                }));
                dunes = Array.from({ length: 3 }, () => ({
                    x: Math.random() * canvas.width,
                    y: canvas.height - (30 + Math.random() * 50),
                    width: 150 + Math.random() * 200,
                    height: 30 + Math.random() * 50,
                    color: `rgba(${255 - Math.random() * 50}, ${215 - Math.random() * 50}, ${0}, 0.8)`
                }));
            } else if (levelData.name.includes('Oceano')) {
                waterBubbles = Array.from({ length: 30 }, () => ({
                    x: Math.random() * canvas.width,
                    y: canvas.height + Math.random() * 100,
                    size: 5 + Math.random() * 15,
                    speed: 1 + Math.random() * 2,
                    opacity: 0.4 + Math.random() * 0.6
                }));
            } else if (levelData.name.includes('Gelo')) {
                icebergs = Array.from({ length: 5 }, () => ({
                    x: Math.random() * canvas.width,
                    y: canvas.height * 0.8 + Math.random() * canvas.height * 0.2,
                    size: 80 + Math.random() * 100,
                    opacity: 0.6 + Math.random() * 0.4
                }));
                snowflakes = Array.from({ length: 50 }, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: 2 + Math.random() * 3,
                    speedY: 0.5 + Math.random() * 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    opacity: 0.6 + Math.random() * 0.4
                }));
            } else if (levelData.name.includes('Espaço')) {
                stars = Array.from({ length: 200 }, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2,
                    opacity: Math.random(),
                    speed: Math.random() * 0.2
                }));
                nebulas = Array.from({ length: 3 }, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.5,
                    radius: 100 + Math.random() * 200,
                    color: `hsla(${Math.random() * 360}, 80%, 60%, 0.1)`,
                    speed: Math.random() * 0.1 - 0.05
                }));
            }
        }
        function createUmbrella() {
            const levelData = levels[currentLevelIndex];
            const color = levelData.umbrellaColors[Math.floor(Math.random() * levelData.umbrellaColors.length)];
            const speed = levelData.baseSpeed + (score / 20000);
            currentUmbrellas.push({
                x: Math.floor(Math.random() * (canvas.width - 70)),
                y: -70,
                speed: speed,
                color: color,
                width: 90,
                height: 100,
            });
        }
        function drawUmbrella(u) {
            const pixelSize = 5;
            const centerX = Math.floor(u.x + u.width / 2);
            const canopyTopY = Math.floor(u.y);
            const canopyBottomY = Math.floor(u.y + u.height * 0.5);
            const handleStartY = canopyBottomY - pixelSize * 2;
            const handleLength = u.height * 0.5;
            const handleThickness = pixelSize;
            const handleColor = '#654321';
            const tipRadius = pixelSize * 1.5;
            ctx.fillStyle = handleColor;
            ctx.fillRect(centerX - Math.floor(handleThickness / 2), handleStartY, handleThickness, handleLength);
            ctx.fillStyle = handleColor;
            ctx.fillRect(centerX - tipRadius, handleStartY + handleLength - pixelSize, pixelSize * 2, pixelSize);
            ctx.fillRect(centerX - tipRadius, handleStartY + handleLength - pixelSize * 2, pixelSize, pixelSize * 2);
            ctx.fillStyle = darkenColor(u.color, 60);
            ctx.fillRect(centerX - pixelSize, canopyTopY, pixelSize * 2, pixelSize * 2);
            const segments = 4;
            const radius = u.width / 2;
            for (let i = 0; i < segments; i++) {
                const angle1 = (i / segments) * Math.PI;
                const angle2 = ((i + 1) / segments) * Math.PI;
                const x1 = centerX - radius * Math.cos(angle1);
                const y1 = canopyBottomY;
                const x2 = centerX - radius * Math.cos(angle2);
                const y2 = canopyBottomY;
                ctx.fillStyle = u.color;
                ctx.beginPath();
                ctx.moveTo(centerX, canopyTopY);
                ctx.lineTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = darkenColor(u.color, 40);
                const segWidth = Math.abs(x2 - x1);
                const segHeight = canopyBottomY - canopyTopY;
                ctx.fillRect(Math.min(x1, x2), canopyBottomY - pixelSize, segWidth, pixelSize);
            }
        }
        function darkenColor(hex, percent) {
            if (!hex || hex.length < 7) return '#000000';
            const f = parseInt(hex.slice(1), 16);
            const R = (f >> 16) * (1 - percent / 100);
            const G = ((f >> 8) & 0x00FF) * (1 - percent / 100);
            const B = (f & 0x0000FF) * (1 - percent / 100);
            return "#" + (0x1000000 + (Math.floor(R) << 16) + (Math.floor(G) << 8) + Math.floor(B)).toString(16).slice(1);
        }
        function updateAndDrawBackgroundElements() {
            const levelData = levels[currentLevelIndex];
            let bgColor = 'skyblue';
            if (currentBackgroundPreset === 'dark') bgColor = '#2c3e50';
            else if (currentBackgroundPreset === 'sunset') bgColor = '#f37335';
            else if (currentBackgroundPreset === 'forest') bgColor = '#4CAF50';
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (levelData.name.includes('Céu')) {
                clouds.forEach(cloud => {
                    cloud.x += cloud.speed;
                    if (cloud.x > canvas.width + cloud.size) cloud.x = -cloud.size;
                    drawPixelCloud(cloud.x, cloud.y, cloud.size, cloud.opacity);
                });
            } else if (levelData.name.includes('Deserto')) {
                dunes.forEach(dune => {
                    drawPixelDune(dune.x, dune.y, dune.width, dune.height, dune.color);
                });
                cacti.forEach(cactus => {
                    drawPixelCactus(cactus.x, cactus.y, cactus.height);
                });
            } else if (levelData.name.includes('Oceano')) {
                drawPixelWaterBubbles();
            } else if (levelData.name.includes('Gelo')) {
                icebergs.forEach(iceberg => {
                    drawPixelIceberg(iceberg.x, iceberg.y, iceberg.size, iceberg.opacity);
                });
                snowflakes.forEach(flake => {
                    drawPixelSnowflake(flake.x, flake.y, flake.size, flake.opacity);
                    flake.y += flake.speedY;
                    flake.x += flake.speedX;
                    if (flake.y > canvas.height) flake.y = -flake.size;
                });
            } else if (levelData.name.includes('Espaço')) {
                drawPixelStars();
                drawPixelNebulas();
            }
            drawVignette();
        }
        function drawVignette() {
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.3,
                canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.8
            );
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        function drawPixelCloud(x, y, size, opacity) {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            const s = size / 10;
            ctx.fillRect(Math.floor(x), Math.floor(y), s * 6, s * 4);
            ctx.fillRect(Math.floor(x + s * 3), Math.floor(y - s * 2), s * 5, s * 3);
            ctx.fillRect(Math.floor(x + s * 6), Math.floor(y), s * 4, s * 5);
        }
        function drawPixelCactus(x, y, height) {
            ctx.fillStyle = '#228B22';
            const h = height / 10;
            ctx.fillRect(Math.floor(x), Math.floor(y), 10, h * 7);
            ctx.fillRect(Math.floor(x - 5), Math.floor(y + h * 3), 10, h * 2);
            ctx.fillRect(Math.floor(x + 5), Math.floor(y + h * 5), 10, h * 2);
        }
        function drawPixelDune(x, y, width, height, color) {
            ctx.fillStyle = color;
            const w = width / 10;
            const h = height / 10;
            ctx.fillRect(Math.floor(x), Math.floor(y), w * 10, h * 10);
            ctx.fillRect(Math.floor(x + w * 2), Math.floor(y - h * 2), w * 6, h * 2);
            ctx.fillRect(Math.floor(x + w * 3), Math.floor(y - h * 3), w * 4, h * 1);
        }
        function drawPixelStars() {
            stars.forEach(star => {
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fillRect(Math.floor(star.x), Math.floor(star.y), Math.floor(star.size), Math.floor(star.size));
                star.y += star.speed;
                if (star.y > canvas.height) star.y = 0;
            });
        }
        function drawPixelNebulas() {
            nebulas.forEach(nebula => {
                ctx.fillStyle = nebula.color.replace(/,\s*([\d.]+)\)/, `, ${nebula.opacity})`);
                ctx.fillRect(Math.floor(nebula.x), Math.floor(nebula.y), nebula.radius * 2, nebula.radius * 1.5);
                nebula.x += nebula.speed;
                if (nebula.x < -nebula.radius * 2) nebula.x = canvas.width + nebula.radius * 2;
            });
        }
        function drawPixelIceberg(x, y, size, opacity) {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            const s = size / 10;
            ctx.fillRect(Math.floor(x), Math.floor(y), s * 10, s * 4);
            ctx.fillRect(Math.floor(x + s * 2), Math.floor(y - s * 3), s * 6, s * 3);
        }
        function drawPixelSnowflake(x, y, size, opacity) {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            const s = Math.floor(size);
            ctx.fillRect(Math.floor(x), Math.floor(y), s, s);
            ctx.fillRect(Math.floor(x - s), Math.floor(y), s, s);
            ctx.fillRect(Math.floor(x + s), Math.floor(y), s, s);
            ctx.fillRect(Math.floor(x), Math.floor(y - s), s, s);
            ctx.fillRect(Math.floor(x), Math.floor(y + s), s, s);
        }
        function drawPixelWaterBubbles() {
            waterBubbles.forEach(bubble => {
                ctx.fillStyle = `rgba(173, 216, 230, ${bubble.opacity})`;
                const s = Math.floor(bubble.size / 2);
                ctx.fillRect(Math.floor(bubble.x), Math.floor(bubble.y), s, s);
                bubble.y -= bubble.speed;
                if (bubble.y < -bubble.size) {
                    bubble.y = canvas.height + Math.random() * 100;
                    bubble.x = Math.random() * canvas.width;
                }
            });
        }
        function checkLevelTransition() {
            const currentLevelData = levels[currentLevelIndex];
            if (score >= currentLevelData.nextLevelScore && currentLevelIndex < levels.length - 1 && !transitionActive) {
                startTransition(currentLevelIndex + 1);
            }
            else if (score >= currentLevelData.nextLevelScore && currentLevelIndex === levels.length - 1 && !transitionActive) {
                endGame(true);
            }
        }
        function startTransition(newLevelIndex) {
            transitionActive = true;
            gameActive = false;
            cancelAnimationFrame(gameLoopRAF);
            const newLevelData = levels[newLevelIndex];
            levelElement.innerHTML = `NÍVEL: ${newLevelData.name.toUpperCase()} | PRÓXIMO: ${newLevelData.nextLevelScore} PONTOS`;
            soundSystem.play("levelUp");
            setTimeout(() => {
                completeTransition(newLevelIndex);
                gameLoopRAF = requestAnimationFrame(gameLoop);
            }, 2000);
        }
        function completeTransition(newLevelIndex) {
            currentLevelIndex = newLevelIndex;
            transitionActive = false;
            transitionProgress = 0;
            gameActive = true;
            const currentLevelData = levels[currentLevelIndex];
            levelElement.innerHTML = `NÍVEL: ${currentLevelData.name.toUpperCase()} | PRÓXIMO: ${currentLevelData.nextLevelScore} PONTOS`;
            currentUmbrellas = [];
            currentParticles = [];
            floatingTexts = [];
            initializeLevelElements();
            updateMissionProgress('exploradorCompleto', null, { levelName: currentLevelData.name });
            updateMissionProgress('conquistadorCosmos', 1, { levelName: currentLevelData.name });
        }
        function endGame(win) {
            gameActive = false;
            isPaused = true;
            cancelAnimationFrame(gameLoopRAF);
            soundSystem.stopAll();
            if (score > highscore) {
                highscore = score;
                localStorage.setItem('highscore', highscore);
            }
            highscoreElement.textContent = highscore;
            updateMissionProgress('pontuadorMestre', score);
            updateMissionProgress('vidaExtra', 1, { livesRemaining: lives });
            if (win) {
                updateMissionProgress('imbativel', 1, { winStatus: true });
                finalScoreWinElement.textContent = `PONTUAÇÃO FINAL: ${score}`;
                gameWinScreen.style.display = 'flex';
                setTimeout(() => gameWinScreen.classList.add('active'), 10);
            } else {
                soundSystem.play("gameOver");
                finalScoreElement.textContent = `PONTUAÇÃO: ${score}`;
                finalLevelElement.textContent = `NÍVEL ALCANÇADO: ${levels[currentLevelIndex].name.toUpperCase()}`;
                gameOverScreen.style.display = 'flex';
                setTimeout(() => gameOverScreen.classList.add('active'), 10);
            }
            document.querySelector('.top-right-controls').style.display = 'none';
            uiElement.style.display = 'none';
            canvas.style.display = 'none';
            missionDisplay.style.display = 'none';
            applyMenuBackground();
        }
        function resetGame() {
            score = 0;
            lives = 5;
            currentLevelIndex = 0;
            transitionActive = false;
            transitionProgress = 0;
            gameActive = true;
            isPaused = false;
            currentUmbrellas = [];
            currentParticles = [];
            floatingTexts = [];
            initializeLevelElements();
            resetPerMatchMissions();
            updateMissionProgress('exploradorCompleto', null, { levelName: 'Céu' });
            gameOverScreen.classList.remove('active');
            gameWinScreen.classList.remove('active');
            pauseScreen.classList.remove('active');
            startScreen.classList.remove('active');
            settingsScreen.classList.remove('active');
            versionSelectScreen.classList.remove('active');
            rankingMissionsSelectScreen.classList.remove('active');
            missionsScreen.classList.remove('active');
            uiElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
            scoreElement.textContent = score;
            livesElement.textContent = lives;
            levelElement.innerHTML = `NÍVEL: ${levels[0].name.toUpperCase()} | PRÓXIMO: ${levels[0].nextLevelScore} PONTOS`;
            highscoreElement.textContent = highscore;
            gameOverScreen.style.display = 'none';
            gameWinScreen.style.display = 'none';
            pauseScreen.style.display = 'none';
            startScreen.style.display = 'none';
            settingsScreen.style.display = 'none';
            versionSelectScreen.style.display = 'none';
            rankingMissionsSelectScreen.style.display = 'none';
            missionsScreen.style.display = 'none';
            canvas.style.display = 'block';
            document.querySelector('.top-right-controls').style.display = 'flex';
            uiElement.style.display = 'flex';
            if (missionsDisplayVisible) {
                missionDisplay.style.display = 'flex';
            }
            applyGameBackground();
            renderActiveMissions();
            soundSystem.stop("menu");
            soundSystem.play("background");
            if (gameLoopRAF) cancelAnimationFrame(gameLoopRAF);
            gameLoopRAF = requestAnimationFrame(gameLoop);
        }
        function returnToStartScreen() {
            gameActive = false;
            isPaused = true;
            cancelAnimationFrame(gameLoopRAF);
            soundSystem.stopAll();
            gameOverScreen.classList.remove('active');
            gameWinScreen.classList.remove('active');
            pauseScreen.classList.remove('active');
            settingsScreen.classList.remove('active');
            versionSelectScreen.classList.remove('active');
            rankingMissionsSelectScreen.classList.remove('active');
            missionsScreen.classList.remove('active');
            gameOverScreen.style.display = 'none';
            gameWinScreen.style.display = 'none';
            pauseScreen.style.display = 'none';
            canvas.style.display = 'none';
            missionsScreen.style.display = 'none';
            document.querySelector('.top-right-controls').style.display = 'none';
            uiElement.style.display = 'none';
            missionDisplay.style.display = 'none';
            startScreen.style.display = 'flex';
            setTimeout(() => startScreen.classList.add('active'), 10);
            applyMenuBackground();
            soundSystem.play("menu");
        }
        function togglePause() {
            soundSystem.play("click");
            isPaused = !isPaused;
            if (isPaused) {
                cancelAnimationFrame(gameLoopRAF);
                soundSystem.stop("background");
                pauseScreen.style.display = 'flex';
                setTimeout(() => pauseScreen.classList.add('active'), 10);
                pauseBtn.textContent = 'RESUME';
                missionsToggleButton.style.display = 'none';
                missionDisplay.style.display = 'none';
            } else {
                gameLoopRAF = requestAnimationFrame(gameLoop);
                soundSystem.play("background");
                pauseScreen.classList.remove('active');
                pauseScreen.addEventListener('transitionend', function handler() {
                    pauseScreen.style.display = 'none';
                    pauseScreen.removeEventListener('transitionend', handler);
                });
                pauseBtn.textContent = 'PAUSE';
                missionsToggleButton.style.display = 'block';
                if (missionsDisplayVisible) {
                    missionDisplay.style.display = 'flex';
                }
            }
        }
        function toggleMissionsDisplay() {
            soundSystem.play("click");
            missionsDisplayVisible = !missionsDisplayVisible;
            if (missionsDisplayVisible) {
                missionDisplay.style.display = 'flex';
                renderActiveMissions();
            } else {
                missionDisplay.style.display = 'none';
            }
        }
        function isClickInsideUmbrella(x, y, u) {
            const hitZoneModifier = (1 - touchSensitivity) * 30;
            const effectiveX = u.x - hitZoneModifier / 2;
            const effectiveY = u.y - hitZoneModifier / 2;
            const effectiveWidth = u.width + hitZoneModifier;
            const effectiveHeight = u.height + hitZoneModifier;
            return (
                x >= effectiveX && x <= effectiveX + effectiveWidth &&
                y >= effectiveY && y <= effectiveY + effectiveHeight
            );
        }
        function handleClick(x, y) {
            if (!gameActive || transitionActive || isPaused) return;
            const levelData = levels[currentLevelIndex];
            for (let i = currentUmbrellas.length - 1; i >= 0; i--) {
                const u = currentUmbrellas[i];
                if (isClickInsideUmbrella(x, y, u)) {
                    soundSystem.play("click");
                    if (navigator.vibrate) navigator.vibrate(50);
                    score += levelData.scoreValue;
                    scoreElement.textContent = score;
                    createFloatingText(`+${levelData.scoreValue}`, u.x + u.width / 2, u.y + u.height / 2);
                    let particleColor = u.color;
                    if (levelData.name.includes('Deserto')) particleColor = '#FFD700';
                    else if (levelData.name.includes('Gelo')) particleColor = '#F0F8FF';
                    else if (levelData.name.includes('Espaço')) particleColor = '#00ffff';
                    createParticles(u.x + u.width/2, u.y + u.height/2, particleColor, 25);
                    updateMissionProgress('colecionadorAgil', 1);
                    updateMissionProgress('pontuadorMestre', levelData.scoreValue);
                    if (levels[currentLevelIndex].name === 'Céu') {
                        updateMissionProgress('novatoCeu', levelData.scoreValue, { levelName: 'Céu' });
                    }
                    if (levels[currentLevelIndex].name === 'Oceano' && defaultMissions.find(m => m.id === 'mergulhadorProfundo').color.includes(u.color)) {
                        updateMissionProgress('mergulhadorProfundo', 1, { clickedColor: u.color });
                    }
                    currentUmbrellas.splice(i, 1);
                    break;
                }
            }
        }
        function createParticles(x, y, color, count = 15) {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 4;
                currentParticles.push({
                    x: x,
                    y: y,
                    radius: 3 + Math.random() * 5,
                    color: color,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 2,
                    life: 50 + Math.random() * 50
                });
            }
        }
        function updateParticles() {
            for (let i = currentParticles.length - 1; i >= 0; i--) {
                const p = currentParticles[i];
                p.x = Math.floor(p.x + p.vx);
                p.y = Math.floor(p.y + p.vy);
                p.vy += 0.05;
                p.life--;
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life / 100;
                ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.floor(p.radius / 2) + 1, Math.floor(p.radius / 2) + 1);
                if (p.life <= 0) {
                    currentParticles.splice(i, 1);
                }
            }
            ctx.globalAlpha = 1;
        }
        function createFloatingText(text, x, y) {
            floatingTexts.push({
                text: text,
                x: x,
                y: y,
                alpha: 1.0,
                vy: -1,
                life: 60
            });
        }
        function updateFloatingTexts() {
            for (let i = floatingTexts.length - 1; i >= 0; i--) {
                const textObj = floatingTexts[i];
                textObj.y += textObj.vy;
                textObj.alpha -= 1.0 / textObj.life;
                ctx.save();
                ctx.globalAlpha = Math.max(0, textObj.alpha);
                ctx.fillStyle = 'white';
                ctx.font = 'bold 20px "Press Start 2P"';
                ctx.textAlign = 'center';
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 0;
                ctx.fillText(textObj.text, Math.floor(textObj.x), Math.floor(textObj.y));
                ctx.restore();
                textObj.life--;
                if (textObj.life <= 0) {
                    floatingTexts.splice(i, 1);
                }
            }
        }
        function gameLoop(timestamp) {
            gameLoopRAF = requestAnimationFrame(gameLoop);
            if (!gameActive || isPaused) return;
            const deltaTime = timestamp - lastTime;
            if (deltaTime < frameInterval) {
                const timeInSeconds = deltaTime / 1000;
                updateMissionProgress('aventureiroDeserto', timeInSeconds, { levelName: levels[currentLevelIndex].name });
                updateMissionProgress('resistenciaGelida', timeInSeconds, { levelName: levels[currentLevelIndex].name });
                return;
            }
            lastTime = timestamp - (deltaTime % frameInterval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateAndDrawBackgroundElements();
            checkLevelTransition();
            if (transitionActive) {
            } else {
                const levelData = levels[currentLevelIndex];
                if (Math.random() < levelData.spawnRate + (score / 300000)) {
                    createUmbrella();
                }
                for (let i = currentUmbrellas.length - 1; i >= 0; i--) {
                    const u = currentUmbrellas[i];
                    u.y += u.speed;
                    drawUmbrella(u);
                    if (u.y > canvas.height + u.height) {
                        currentUmbrellas.splice(i, 1);
                        lives--;
                        soundSystem.play("life");
                        livesElement.textContent = lives;
                        if (lives <= 0) {
                            endGame(false);
                            return;
                        }
                    }
                }
                const timeInSeconds = deltaTime / 1000;
                updateMissionProgress('aventureiroDeserto', timeInSeconds, { levelName: levels[currentLevelIndex].name });
                updateMissionProgress('resistenciaGelida', timeInSeconds, { levelName: levels[currentLevelIndex].name });
            }
            updateParticles();
            updateFloatingTexts();
            scoreElement.textContent = score;
        }
        function getTouchPos(canvasDom, touchEvent) {
            const rect = canvasDom.getBoundingClientRect();
            return {
                x: touchEvent.touches[0].clientX - rect.left,
                y: touchEvent.touches[0].clientY - rect.top
            };
        }
        function handleFirstUserInteraction() {
            soundSystem.enableAudioContext();
            document.removeEventListener('click', handleFirstUserInteraction);
            document.removeEventListener('touchstart', handleFirstUserInteraction);
            console.log("Primeira interação do usuário detectada.");
        }
        document.addEventListener('DOMContentLoaded', () => {
            document.addEventListener('click', handleFirstUserInteraction, { once: true });
            document.addEventListener('touchstart', handleFirstUserInteraction, { once: true });
        });
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            handleClick(e.clientX - rect.left, e.clientY - rect.top);
        });
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touchPos = getTouchPos(canvas, e);
            handleClick(touchPos.x, touchPos.y);
        }, { passive: false });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        restartBtn.addEventListener('click', () => {
            soundSystem.play("click");
            gameOverScreen.classList.remove('active');
            gameOverScreen.addEventListener('transitionend', function handler() {
                gameOverScreen.style.display = 'none';
                gameOverScreen.removeEventListener('transitionend', handler);
                resetGame();
            }, { once: true });
        });
        playAgainWinBtn.addEventListener('click', () => {
            soundSystem.play("click");
            gameWinScreen.classList.remove('active');
            gameWinScreen.addEventListener('transitionend', function handler() {
                gameWinScreen.style.display = 'none';
                gameWinScreen.removeEventListener('transitionend', handler);
                resetGame();
            }, { once: true });
        });
        pauseBtn.addEventListener('click', togglePause);
        resumeBtn.addEventListener('click', togglePause);
        backToStartBtn.addEventListener('click', () => {
            soundSystem.play("click");
            pauseScreen.classList.remove('active');
            pauseScreen.addEventListener('transitionend', function handler() {
                pauseScreen.style.display = 'none';
                pauseScreen.removeEventListener('transitionend', handler);
                returnToStartScreen();
            }, { once: true });
        });
        muteButton.addEventListener('click', () => {
            soundSystem.toggleMute();
        });
        missionsToggleButton.addEventListener('click', toggleMissionsDisplay);
        startButton.addEventListener('click', () => {
            soundSystem.play("click");
            startScreen.classList.remove('active');
            startScreen.addEventListener('transitionend', function handler() {
                startScreen.style.display = 'none';
                startScreen.removeEventListener('transitionend', handler);
                resetGame();
            }, { once: true });
        });
        settingsButton.addEventListener('click', () => {
            soundSystem.play("click");
            soundSystem.stop("menu");
            startScreen.classList.remove('active');
            startScreen.addEventListener('transitionend', function handler() {
                startScreen.style.display = 'none';
                startScreen.removeEventListener('transitionend', handler);
                settingsScreen.style.display = 'flex';
                setTimeout(() => settingsScreen.classList.add('active'), 10);
                applyMenuBackground();
                updateSettingsUI();
            }, { once: true });
        });
        settingsBackBtn.addEventListener('click', () => {
            soundSystem.play("click");
            settingsScreen.classList.remove('active');
            settingsScreen.addEventListener('transitionend', function handler() {
                settingsScreen.style.display = 'none';
                settingsScreen.removeEventListener('transitionend', handler);
                startScreen.style.display = 'flex';
                setTimeout(() => startScreen.classList.add('active'), 10);
                applyMenuBackground();
                soundSystem.play("menu");
            }, { once: true });
        });
        rankingButton.addEventListener('click', () => {
            soundSystem.play("click");
            soundSystem.stop("menu");
            startScreen.classList.remove('active');
            startScreen.addEventListener('transitionend', function handler() {
                startScreen.style.display = 'none';
                startScreen.removeEventListener('transitionend', handler);
                rankingMissionsSelectScreen.style.display = 'flex';
                setTimeout(() => rankingMissionsSelectScreen.classList.add('active'), 10);
                applyMenuBackground();
            }, { once: true });
        });
        rankingGeneralBtn.addEventListener('click', () => {
            soundSystem.play("click");
            window.location.href = 'ranking.html';
        });
        viewMissionsBtn.addEventListener('click', () => {
            soundSystem.play("click");
            rankingMissionsSelectScreen.classList.remove('active');
            rankingMissionsSelectScreen.addEventListener('transitionend', function handler() {
                rankingMissionsSelectScreen.style.display = 'none';
                rankingMissionsSelectScreen.removeEventListener('transitionend', handler);
                missionsScreen.style.display = 'flex';
                setTimeout(() => missionsScreen.classList.add('active'), 10);
                renderAllMissions();
            }, { once: true });
        });
        rankingMissionsBackBtn.addEventListener('click', () => {
            soundSystem.play("click");
            rankingMissionsSelectScreen.classList.remove('active');
            rankingMissionsSelectScreen.addEventListener('transitionend', function handler() {
                rankingMissionsSelectScreen.style.display = 'none';
                rankingMissionsSelectScreen.removeEventListener('transitionend', handler);
                startScreen.style.display = 'flex';
                setTimeout(() => startScreen.classList.add('active'), 10);
                applyMenuBackground();
                soundSystem.play("menu");
            }, { once: true });
        });
        missionsBackBtn.addEventListener('click', () => {
            soundSystem.play("click");
            missionsScreen.classList.remove('active');
            missionsScreen.addEventListener('transitionend', function handler() {
                missionsScreen.style.display = 'none';
                missionsScreen.removeEventListener('transitionend', handler);
                rankingMissionsSelectScreen.style.display = 'flex';
                setTimeout(() => rankingMissionsSelectScreen.classList.add('active'), 10);
                applyMenuBackground();
            }, { once: true });
        });
        versionsButton.addEventListener('click', () => {
            soundSystem.play("click");
            soundSystem.stop("menu");
            startScreen.classList.remove('active');
            startScreen.addEventListener('transitionend', function handler() {
                startScreen.style.display = 'none';
                startScreen.removeEventListener('transitionend', handler);
                versionSelectScreen.style.display = 'flex';
                setTimeout(() => versionSelectScreen.classList.add('active'), 10);
                applyMenuBackground();
            }, { once: true });
        });
        versionBackBtn.addEventListener('click', () => {
            soundSystem.play("click");
            versionSelectScreen.classList.remove('active');
            versionSelectScreen.addEventListener('transitionend', function handler() {
                versionSelectScreen.style.display = 'none';
                versionSelectScreen.removeEventListener('transitionend', handler);
                startScreen.style.display = 'flex';
                setTimeout(() => startScreen.classList.add('active'), 10);
                applyMenuBackground();
                soundSystem.play("menu");
            }, { once: true });
        });
        silverButton.addEventListener('click', () => {
            soundSystem.play("click");
            alert('Você clicou em Prata! (Esta versão não está implementada neste arquivo)');
        });
        goldButton.addEventListener('click', () => {
            soundSystem.play("click");
            alert('Você clicou em Ouro! (Esta versão não está implementada neste arquivo)');
        });
        emeraldButton.addEventListener('click', () => {
            soundSystem.play("click");
            alert('Você clicou em Esmeralda! (Esta versão não está implementada neste arquivo)');
        });
        diamondButton.addEventListener('click', () => {
            soundSystem.play("click");
            window.location.href = 'index2.html';
        });
        function updateSettingsUI() {
            touchSensitivitySlider.value = touchSensitivity;
            sensitivityValueSpan.textContent = touchSensitivity.toFixed(1);
            updateColorSwatchSelection();
        }
        function updateColorSwatchSelection() {
            colorSwatches.forEach(swatch => {
                swatch.classList.remove('selected');
                if (swatch.dataset.color === currentBackgroundPreset) {
                    swatch.classList.add('selected');
                }
            });
        }
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                soundSystem.play("click");
                const colorPreset = swatch.dataset.color;
                currentBackgroundPreset = colorPreset;
                localStorage.setItem('backgroundPreset', currentBackgroundPreset);
                updateColorSwatchSelection();
            });
        });
        touchSensitivitySlider.addEventListener('input', (e) => {
            touchSensitivity = parseFloat(e.target.value);
            localStorage.setItem('touchSensitivity', touchSensitivity);
            sensitivityValueSpan.textContent = touchSensitivity.toFixed(1);
        });
        function initGameOnLoad() {
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            loadAchievementData();
            highscoreElement.textContent = highscore;
            document.querySelector('.top-right-controls').style.display = 'none';
            uiElement.style.display = 'none';
            missionDisplay.style.display = 'none';
            missionCompleteNotification.style.display = 'none';
            applyMenuBackground();
            updateSettingsUI();
            renderActiveMissions();
            renderAllMissions();
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                splashScreen.addEventListener('transitionend', function handler() {
                    splashScreen.style.display = 'none';
                    startScreen.style.display = 'flex';
                    setTimeout(() => startScreen.classList.add('active'), 10);
                    soundSystem.play("menu");
                    splashScreen.removeEventListener('transitionend', handler);
                }, {once: true});
            }, 1500);
        }
        window.addEventListener('load', initGameOnLoad);
        
        // Novo script para o botão de anúncio
        document.getElementById("rewardAdBtn").addEventListener("click", function() {
            window.open("https://www.profitableratecpm.com/me8gtddjg?key=1ca7f0a664499d7d9a40ea7b134e7f0f", "_blank");
            score += 2000;
            scoreElement.innerText = score;
            alert("🎉 Você ganhou 2000 moedas!");
        });
