/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { getChatHistory, getCurrentChat, getUISettings } from './state';
import type { Message, ChatSession, CharacterSheetData, Achievement, NPCState } from './types';
import { dmPersonas } from './gemini';

// =================================================================================
// DOM ELEMENT SELECTORS
// =================================================================================

export const chatContainer = document.getElementById('chat-container') as HTMLElement;
export const chatForm = document.getElementById('chat-form') as HTMLFormElement;
export const chatInput = document.getElementById('chat-input') as HTMLTextAreaElement;
export const sendButton = chatForm.querySelector('button[type="submit"]') as HTMLButtonElement;
export const menuBtn = document.getElementById('menu-btn') as HTMLButtonElement;
export const newChatBtn = document.getElementById('new-chat-btn') as HTMLButtonElement;
export const enterDungeonDelverBtn = document.getElementById('enter-dungeon-delver-btn') as HTMLButtonElement;
export const gameViewport = document.getElementById('game-viewport') as HTMLCanvasElement;
export const textConsoleArea = document.getElementById('text-console-area') as HTMLElement;
export const sidebar = document.getElementById('sidebar') as HTMLElement;
export const overlay = document.getElementById('overlay') as HTMLElement;
export const chatHistoryContainer = document.getElementById('chat-history-container') as HTMLElement;
export const pinnedChatsList = document.getElementById('pinned-chats-list') as HTMLUListElement;
export const recentChatsList = document.getElementById('recent-chats-list') as HTMLUListElement;
const ttsTemplate = document.getElementById('tts-controls-template') as HTMLTemplateElement;
export const exportAllBtn = document.getElementById('export-all-btn') as HTMLButtonElement;
export const importAllBtn = document.getElementById('import-all-btn') as HTMLButtonElement;
export const importAllFileInput = document.getElementById('import-all-file-input') as HTMLInputElement;
export const contextForm = document.getElementById('context-form') as HTMLFormElement;
export const contextInput = document.getElementById('context-input') as HTMLInputElement;
export const contextList = document.getElementById('context-list') as HTMLUListElement;
export const contextManager = document.getElementById('context-manager') as HTMLElement;
export const contextHeader = document.getElementById('context-header') as HTMLElement;
export const quickActionsBar = document.getElementById('quick-actions-bar') as HTMLElement;
export const inventoryBtn = document.getElementById('inventory-btn') as HTMLButtonElement;
export const inventoryPopup = document.getElementById('inventory-popup') as HTMLElement;
export const inventoryPopupContent = document.getElementById('inventory-popup-content') as HTMLElement;
export const closeInventoryBtn = document.getElementById('close-inventory-btn') as HTMLButtonElement;
export const refreshInventoryBtn = document.getElementById('refresh-inventory-btn') as HTMLButtonElement;
export const helpBtn = document.getElementById('help-btn') as HTMLButtonElement;
export const helpModal = document.getElementById('help-modal') as HTMLElement;
export const closeHelpBtn = document.getElementById('close-help-btn') as HTMLButtonElement;
export const dndHelpBtn = document.getElementById('dnd-help-btn') as HTMLButtonElement;
export const dndHelpModal = document.getElementById('dnd-help-modal') as HTMLElement;
export const closeDndHelpBtn = document.getElementById('close-dnd-help-btn') as HTMLButtonElement;
export const renameModal = document.getElementById('rename-modal') as HTMLElement;
export const renameForm = document.getElementById('rename-form') as HTMLFormElement;
export const renameInput = document.getElementById('rename-input') as HTMLInputElement;
export const closeRenameBtn = document.getElementById('close-rename-btn') as HTMLButtonElement;
export const deleteConfirmModal = document.getElementById('delete-confirm-modal') as HTMLElement;
export const closeDeleteConfirmBtn = document.getElementById('close-delete-confirm-btn') as HTMLButtonElement;
export const cancelDeleteBtn = document.getElementById('cancel-delete-btn') as HTMLButtonElement;
export const confirmDeleteBtn = document.getElementById('confirm-delete-btn') as HTMLButtonElement;
export const deleteChatName = document.getElementById('delete-chat-name') as HTMLElement;
export const diceRollerBtn = document.getElementById('dice-roller-btn') as HTMLButtonElement;
export const diceModal = document.getElementById('dice-modal') as HTMLElement;
export const closeDiceBtn = document.getElementById('close-dice-btn') as HTMLButtonElement;
export const diceGrid = document.getElementById('dice-grid') as HTMLElement;
// Fix: Add missing exports for dice roller UI elements.
export const diceResultsLog = document.getElementById('dice-results-log') as HTMLElement;
export const diceTotalValue = document.getElementById('dice-total-value') as HTMLElement;
export const clearResultsBtn = document.getElementById('clear-results-btn') as HTMLButtonElement;
export const logbookBtn = document.getElementById('logbook-btn') as HTMLButtonElement;
export const logbookModal = document.getElementById('logbook-modal') as HTMLElement;
export const closeLogbookBtn = document.getElementById('close-logbook-btn') as HTMLButtonElement;
export const logbookNav = document.querySelector('.logbook-nav') as HTMLElement;
export const logbookPanes = document.querySelectorAll('.logbook-pane') as NodeListOf<HTMLElement>;
export const characterSheetDisplay = document.getElementById('character-sheet-display') as HTMLElement;
export const updateSheetBtn = document.getElementById('update-sheet-btn') as HTMLButtonElement;
export const inventoryDisplay = document.getElementById('inventory-display') as HTMLElement;
export const updateInventoryBtn = document.getElementById('update-inventory-btn') as HTMLButtonElement;
export const questsDisplay = document.getElementById('quests-display') as HTMLElement;
export const updateQuestsBtn = document.getElementById('update-quests-btn') as HTMLButtonElement;
export const npcsDisplay = document.getElementById('npcs-display') as HTMLElement;
export const updateNpcsBtn = document.getElementById('update-npcs-btn') as HTMLButtonElement;
export const achievementsDisplay = document.getElementById('achievements-display') as HTMLElement;
export const updateAchievementsBtn = document.getElementById('update-achievements-btn') as HTMLButtonElement;
export const generateImageBtn = document.getElementById('generate-image-btn') as HTMLButtonElement;
export const characterImageDisplay = document.getElementById('character-image-display') as HTMLImageElement;
export const characterImagePlaceholder = document.getElementById('character-image-placeholder') as HTMLElement;
export const characterImageLoading = document.getElementById('character-image-loading') as HTMLElement;
export const fontSizeControls = document.getElementById('font-size-controls') as HTMLElement;
export const enterToSendToggle = document.getElementById('setting-enter-send') as HTMLInputElement;
export const experimentalUploadToggle = document.getElementById('setting-experimental-upload') as HTMLInputElement;
export const changeUiBtn = document.getElementById('change-ui-btn') as HTMLButtonElement;
export const themeModal = document.getElementById('theme-modal') as HTMLElement;
export const closeThemeBtn = document.getElementById('close-theme-btn') as HTMLButtonElement;
export const themeGrid = document.getElementById('theme-grid') as HTMLElement;
export const chatOptionsMenu = document.getElementById('chat-options-menu') as HTMLUListElement;
export const combatTracker = document.getElementById('combat-tracker') as HTMLElement;
export const combatTrackerHeader = document.getElementById('combat-tracker-header') as HTMLElement;
export const welcomeModal = document.getElementById('update-welcome-modal') as HTMLElement;
export const closeWelcomeBtn = document.getElementById('close-welcome-btn') as HTMLButtonElement;
export const fileUploadBtn = document.getElementById('file-upload-btn') as HTMLButtonElement;
export const fileUploadInput = document.getElementById('file-upload-input') as HTMLInputElement;
export const worldGenOverlay = document.getElementById('world-gen-overlay') as HTMLElement;
export const worldCreationView = document.getElementById('world-creation-view') as HTMLElement;
export const worldCreationForm = document.getElementById('world-creation-form') as HTMLFormElement;
export const cancelWorldCreationBtn = document.getElementById('cancel-world-creation-btn') as HTMLButtonElement;

// =================================================================================
// UI TOGGLES
// =================================================================================

export function toggleSidebar() { document.body.classList.toggle('sidebar-open'); }
export function closeSidebar() { document.body.classList.remove('sidebar-open'); }
export function openModal(modal: HTMLElement) { modal.style.display = 'flex'; }
export function closeModal(modal: HTMLElement) { modal.style.display = 'none'; }
export function showWorldGenOverlay() { worldGenOverlay.style.display = 'flex'; }
export function hideWorldGenOverlay() { worldGenOverlay.style.display = 'none'; }


// =================================================================================
// UI RENDERING
// =================================================================================

export function applyUISettings() {
  const settings = getUISettings();
  document.body.className = document.body.className.replace(/font-size-\w+/g, '');
  document.body.classList.add(`font-size-${settings.fontSize}`);
  (document.getElementById('font-size-controls')?.querySelector(`[data-size="${settings.fontSize}"]`) as HTMLButtonElement)?.classList.add('active');
  enterToSendToggle.checked = settings.enterToSend;
  experimentalUploadToggle.checked = settings.experimentalUploadLimit;
}

export function renderChatHistory() {
  const history = getChatHistory();
  const currentChatId = getCurrentChat()?.id;
  pinnedChatsList.innerHTML = '';
  recentChatsList.innerHTML = '';

  const sortedHistory = [...history].sort((a, b) => b.createdAt - a.createdAt);
  const pinned = sortedHistory.filter(s => s.isPinned);
  const recent = sortedHistory.filter(s => !s.isPinned);

  const createItem = (session: ChatSession) => {
    const li = document.createElement('li');
    li.className = `chat-history-item ${session.id === currentChatId ? 'active' : ''}`;
    li.dataset.id = session.id;
    li.innerHTML = `
      <span class="chat-title">${session.title}</span>
      <button class="options-btn" aria-label="Chat options">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
      </button>`;
    li.querySelector('.options-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openChatOptionsMenu(e.currentTarget as HTMLElement, session.id);
    });
    return li;
  };

  pinned.forEach(s => pinnedChatsList.appendChild(createItem(s)));
  recent.forEach(s => recentChatsList.appendChild(createItem(s)));
  (document.getElementById('pinned-chats') as HTMLElement).style.display = pinned.length > 0 ? 'block' : 'none';
}

export function openChatOptionsMenu(button: HTMLElement, sessionId: string) {
    const rect = button.getBoundingClientRect();
    chatOptionsMenu.style.display = 'block';
    chatOptionsMenu.style.top = `${rect.bottom}px`;
    chatOptionsMenu.style.left = `${rect.left}px`;
    chatOptionsMenu.dataset.sessionId = sessionId;
    
    chatOptionsMenu.innerHTML = `
        <li data-action="pin">${getChatHistory().find(s=>s.id === sessionId)?.isPinned ? 'Unpin' : 'Pin'}</li>
        <li data-action="rename">Rename</li>
        <li data-action="export">Export</li>
        <li data-action="delete" class="danger-action">Delete</li>
    `;

    // Add a one-time click listener to the document to close the menu
    const closeMenu = (e: MouseEvent) => {
        if (!chatOptionsMenu.contains(e.target as Node)) {
            closeChatOptionsMenu();
        }
    };
    // Use a timeout to prevent the same click event from closing it immediately
    setTimeout(() => {
      document.addEventListener('click', closeMenu, { once: true });
    }, 0);
}

export function closeChatOptionsMenu() {
    chatOptionsMenu.style.display = 'none';
}

export function appendMessage(message: Message): HTMLElement {
  if (message.hidden) {
    // Return a dummy element for hidden messages so the caller doesn't crash
    return document.createElement('div');
  }

  const messageContainer = document.createElement('div');
  const messageEl = document.createElement('div');
  messageEl.classList.add('message', message.sender);
  messageEl.innerHTML = message.text; // Use innerHTML to render potential Markdown

  if (message.sender === 'user') {
    messageContainer.classList.add('message-user-container');
    messageContainer.appendChild(messageEl);
  } else if (message.sender === 'model') {
    messageContainer.classList.add('message-model-container');
    const ttsControls = ttsTemplate.content.cloneNode(true);
    messageContainer.appendChild(messageEl);
    messageContainer.appendChild(ttsControls);
  } else {
    // System or Error messages
    messageContainer.classList.add('message-system-container');
    if (message.text.includes('Rolling')) {
        messageEl.classList.add('system-roll');
    }
    messageContainer.appendChild(messageEl);
  }
  
  chatContainer.appendChild(messageContainer);
  // Smart scrolling
  const shouldScroll = chatContainer.scrollHeight - chatContainer.clientHeight <= chatContainer.scrollTop + 150;
  if (shouldScroll) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  return messageContainer;
}

export function appendFileProcessingMessage(fileName: string): HTMLElement {
    const messageContainer = document.createElement('div');
    const messageEl = document.createElement('div');
    messageEl.classList.add('message', 'system-file', 'loading');
    messageEl.innerHTML = `<span>Processing <strong>${fileName}</strong>...</span>`;

    messageContainer.classList.add('message-system-container');
    messageContainer.appendChild(messageEl);
    
    chatContainer.appendChild(messageContainer);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    return messageEl;
}

export function renderMessages(messages: Message[]) {
  chatContainer.innerHTML = '';
  messages.forEach(appendMessage);
}

export function updateLogbook(session: ChatSession | undefined) {
    if (!session) return;
    
    // Character Sheet
    if (typeof session.characterSheet === 'object' && session.characterSheet.name) {
        renderCharacterSheet(session.characterSheet as CharacterSheetData);
    } else if (typeof session.characterSheet === 'string') {
        characterSheetDisplay.innerHTML = `<pre>${session.characterSheet}</pre>`;
    } else {
        characterSheetDisplay.innerHTML = `<div class="sheet-placeholder"><p>No data. Click below to generate your character sheet from the adventure log.</p></div>`;
    }

    // Achievements
    if (session.achievements && session.achievements.length > 0) {
        renderAchievements(session.achievements);
    } else {
        achievementsDisplay.innerHTML = `<div class="logbook-data-container" id="achievements-display"><p>No achievements unlocked yet.</p></div>`;
    }

    // Inventory
    inventoryDisplay.textContent = session.inventory || 'No inventory data. Ask the DM to summarize your inventory.';
    // Quests
    questsDisplay.textContent = session.questLog || 'No quest data. Ask the DM to update your journal.';
    // NPCs
    if (session.npcList && session.npcList.length > 0) {
        renderNpcList(session.npcList);
    } else {
        npcsDisplay.innerHTML = '<p>No NPC data. Ask the DM for a list of characters you\'ve met.</p>';
    }

    // Image
    if (session.characterImageUrl) {
        characterImageDisplay.src = session.characterImageUrl;
        characterImageDisplay.classList.remove('hidden');
        characterImagePlaceholder.classList.add('hidden');
    } else {
        characterImageDisplay.src = '';
        characterImageDisplay.classList.add('hidden');
        characterImagePlaceholder.classList.remove('hidden');
    }
}

export function renderCharacterSheet(sheet: CharacterSheetData) {
    if (!sheet || !sheet.name) {
      characterSheetDisplay.innerHTML = '<div class="sheet-placeholder"><p>Could not parse character sheet data.</p></div>';
      return;
    }
    const { name, race, class: charClass, level, abilityScores, armorClass, hitPoints, speed, skills, featuresAndTraits } = sheet;

    const skillsHtml = skills.map(skill => `
        <li class="skill-item">
            <span class="skill-prof ${skill.proficient ? 'proficient' : ''}"></span>
            <span class="skill-name">${skill.name}</span>
        </li>
    `).join('');

    characterSheetDisplay.innerHTML = `
        <div class="sheet-header">
            <div>
                <div class="sheet-char-name">${name}</div>
                <div class="sheet-char-details">Level ${level} ${race} ${charClass}</div>
            </div>
        </div>
        <div class="sheet-main-content">
            <div class="sheet-stats-column">
                <div class="sheet-core-stats">
                    ${Object.entries(abilityScores).map(([key, value]) => `
                        <div class="stat-box">
                            <div class="stat-box-label">${key}</div>
                            <div class="stat-box-score">${value.score}</div>
                            <div class="stat-box-mod">${value.modifier}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="sheet-combat-stats">
                    <div class="stat-box">
                        <div class="stat-box-label">Armor Class</div>
                        <div class="stat-box-score">${armorClass}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-box-label">Hit Points</div>
                        <div class="stat-box-score">${hitPoints.current}/${hitPoints.max}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-box-label">Speed</div>
                        <div class="stat-box-score">${speed}</div>
                    </div>
                </div>
            </div>
            <div class="sheet-features-column">
                <div class="sheet-skills-column">
                    <h4>Skills</h4>
                    <ul class="sheet-skills-list">${skillsHtml}</ul>
                </div>
                <div class="sheet-features">
                    <h4>Features & Traits</h4>
                    <ul>${featuresAndTraits.map(f => `<li>${f}</li>`).join('')}</ul>
                </div>
            </div>
        </div>
    `;
}

export function renderNpcList(npcs: NPCState[]) {
    npcsDisplay.innerHTML = '';
    const list = document.createElement('ul');
    list.className = 'achievements-list'; // Re-use styling
    npcs.forEach(npc => {
        const item = document.createElement('li');
        item.className = 'achievement-item'; // Re-use styling
        item.innerHTML = `
            <div class="achievement-details">
                <h4 class="achievement-name">${npc.name} <span class="npc-relationship">(${npc.relationship})</span></h4>
                <p class="achievement-desc">${npc.description}</p>
            </div>
        `;
        list.appendChild(item);
    });
    npcsDisplay.appendChild(list);
}


export function renderAchievements(achievements: Achievement[]) {
    achievementsDisplay.innerHTML = '';
    const list = document.createElement('ul');
    list.className = 'achievements-list';
    achievements.forEach(ach => {
        const item = document.createElement('li');
        item.className = 'achievement-item';
        item.innerHTML = `
            <div class="achievement-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div class="achievement-details">
                <h4 class="achievement-name">${ach.name}</h4>
                <p class="achievement-desc">${ach.description}</p>
            </div>
        `;
        list.appendChild(item);
    });
    achievementsDisplay.appendChild(list);
}


export function renderQuickStartChoices(chars: CharacterSheetData[]) {
  const grid = document.createElement('div');
  grid.className = 'quick-start-grid';
  chars.forEach((char, index) => {
    const card = document.createElement('div');
    card.className = 'quick-start-card';
    card.dataset.charIndex = index.toString();
    card.innerHTML = `
        <h3 class="quick-start-name">${char.name}</h3>
        <p class="quick-start-race-class">${char.race} ${char.class}</p>
        <p class="quick-start-desc">${char.backstory}</p>
    `;
    grid.appendChild(card);
  });
  chatContainer.appendChild(grid);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

export function renderSetupChoices() {
    const grid = document.createElement('div');
    grid.className = 'narrator-selection-grid';
    
    // Narrator Personas
    let personaHtml = '<div class="narrator-choice-group"><h4>Choose Your DM Persona</h4>';
    dmPersonas.forEach(p => {
        personaHtml += `
            <button class="narrator-choice-btn" data-type="persona" data-value="${p.id}">
                <div class="choice-title">${p.name}</div>
                <div class="choice-desc">${p.description}</div>
            </button>`;
    });
    personaHtml += '</div>';

    // Tone Choices
    const toneHtml = `
        <div class="narrator-choice-group">
            <h4>Choose Your Tone</h4>
            <button class="narrator-choice-btn" data-type="tone" data-value="heroic">
                <div class="choice-title">Heroic Fantasy</div>
                <div class="choice-desc">A classic tale of good vs. evil, epic quests, and powerful heroes.</div>
            </button>
            <button class="narrator-choice-btn" data-type="tone" data-value="gritty">
                <div class="choice-title">Gritty Realism</div>
                <div class="choice-desc">A darker world where choices are hard, morality is grey, and survival is not guaranteed.</div>
            </button>
            <button class="narrator-choice-btn" data-type="tone" data-value="comedic">
                <div class="choice-title">Comedic Adventure</div>
                <div class="choice-desc">A lighthearted romp full of absurd situations, witty banter, and chaotic fun.</div>
            </button>
        </div>`;

    // Narration Style
    const narrationHtml = `
        <div class="narrator-choice-group">
            <h4>Choose Narration Style</h4>
            <button class="narrator-choice-btn" data-type="narration" data-value="concise">
                <div class="choice-title">Concise</div>
                <div class="choice-desc">Fast-paced and to the point. Focuses on action and dialogue.</div>
            </button>
            <button class="narrator-choice-btn" data-type="narration" data-value="descriptive">
                <div class="choice-title">Descriptive</div>
                <div class="choice-desc">Paints a rich picture of the world with sensory details. A balanced approach.</div>
            </button>
            <button class="narrator-choice-btn" data-type="narration" data-value="cinematic">
                <div class="choice-title">Cinematic</div>
                <div class="choice-desc">Highly detailed and evocative, focusing on mood, emotion, and dramatic flair.</div>
            </button>
        </div>`;
    
    grid.innerHTML = personaHtml + toneHtml + narrationHtml;
    chatContainer.appendChild(grid);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

export function renderUserContext(context: string[]) {
  contextList.innerHTML = '';
  if (context.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No context added yet.';
    li.style.color = 'var(--text-secondary-color)';
    li.style.fontSize = '0.9rem';
    contextList.appendChild(li);
    return;
  }
  context.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'context-item';
    li.innerHTML = `
      <span>${item}</span>
      <button class="delete-context-btn" data-index="${index}" aria-label="Delete context item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    `;
    contextList.appendChild(li);
  });
}

export function updateCombatTracker(enemies: { name: string; status: string }[]) {
    const enemyList = document.getElementById('combat-enemy-list') as HTMLUListElement;
    if (!enemyList) return;

    if (enemies.length === 0) {
        combatTracker.classList.add('hidden');
        return;
    }

    enemyList.innerHTML = '';
    enemies.forEach(enemy => {
        const li = document.createElement('li');
        li.className = 'combat-enemy-item';
        // Sanitize status string for CSS class
        const statusClass = `status-${enemy.status.replace(/\s/g, '.')}`;
        li.innerHTML = `
            <span class="name">${enemy.name}</span>
            <span class="status ${statusClass}">${enemy.status}</span>
        `;
        enemyList.appendChild(li);
    });

    combatTracker.classList.remove('hidden');
    combatTracker.classList.add('expanded'); // Auto-expand when combat starts
}
