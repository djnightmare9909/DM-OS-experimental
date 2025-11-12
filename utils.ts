/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ChatSession, GameSettings, Message, CharacterSheetData, Achievement, NPCState, WorldData } from './types';

/**
 * Takes any object and safely migrates it into a valid ChatSession object.
 * This is the core of the app's backwards compatibility and data integrity strategy.
 * It provides default values for any missing fields and attempts to coerce incorrect data types.
 * @param session An object of unknown structure, potentially an old or incomplete chat session.
 * @returns A fully-formed, valid ChatSession object.
 */
export function migrateAndValidateSession(session: any): ChatSession {
  const newSession: Partial<ChatSession> = {};

  newSession.id = typeof session.id === 'string' ? session.id : `chat-${Date.now()}-${Math.random()}`;
  newSession.title = typeof session.title === 'string' && session.title.trim() !== '' ? session.title : 'Untitled Adventure';
  newSession.createdAt = typeof session.createdAt === 'number' ? session.createdAt : Date.now();
  newSession.isPinned = typeof session.isPinned === 'boolean' ? session.isPinned : false;

  if (Array.isArray(session.messages)) {
    newSession.messages = session.messages.filter(m =>
      typeof m === 'object' && m !== null &&
      typeof m.sender === 'string' &&
      typeof m.text === 'string'
    ) as Message[];
  } else {
    newSession.messages = [];
  }

  newSession.adminPassword = typeof session.adminPassword === 'string' ? session.adminPassword : undefined;
  newSession.personaId = typeof session.personaId === 'string' ? session.personaId : 'purist';

  if (typeof session.characterSheet === 'object' && session.characterSheet !== null) {
    newSession.characterSheet = session.characterSheet as CharacterSheetData;
  } else if (typeof session.characterSheet === 'string') {
    newSession.characterSheet = session.characterSheet;
  } else {
    newSession.characterSheet = undefined;
  }

  newSession.inventory = typeof session.inventory === 'string' ? session.inventory : '';
  newSession.characterImageUrl = typeof session.characterImageUrl === 'string' ? session.characterImageUrl : '';
  newSession.questLog = typeof session.questLog === 'string' ? session.questLog : '';
  
  if (Array.isArray(session.npcList)) {
    newSession.npcList = session.npcList.filter((npc: any) => 
        typeof npc === 'object' && npc !== null &&
        typeof npc.name === 'string' &&
        typeof npc.description === 'string' &&
        typeof npc.relationship === 'string'
    ) as NPCState[];
  } else {
    newSession.npcList = [];
  }


  if (Array.isArray(session.achievements)) {
    newSession.achievements = session.achievements.filter(a =>
      typeof a === 'object' && a !== null &&
      typeof a.name === 'string' &&
      typeof a.description === 'string'
    ) as Achievement[];
  } else {
    newSession.achievements = [];
  }

  const defaultSettings: GameSettings = {
    // Fix: Removed 'difficulty' as it is not a known property in GameSettings type.
    tone: 'heroic',
    narration: 'descriptive',
  };
  if (typeof session.settings === 'object' && session.settings !== null) {
    newSession.settings = { ...defaultSettings, ...session.settings };
  } else {
    newSession.settings = defaultSettings;
  }

  // Validate worldData
  if (typeof session.worldData === 'object' && session.worldData !== null &&
      Array.isArray(session.worldData.map) &&
      typeof session.worldData.playerStart === 'object' &&
      typeof session.worldData.worldDescription === 'string') {
    newSession.worldData = session.worldData as WorldData;
  } else {
    newSession.worldData = undefined;
  }

  newSession.inCombat = typeof session.inCombat === 'boolean' ? session.inCombat : false;

  if (typeof session.combatState === 'object' && session.combatState !== null &&
      Array.isArray(session.combatState.turnOrder) &&
      typeof session.combatState.currentTurnIndex === 'number' &&
      typeof session.combatState.round === 'number') {
    newSession.combatState = session.combatState;
  } else {
    newSession.combatState = undefined;
  }

  // Fix: Add migration for new properties from game setup flow.
  const validPhases = ['guided', 'character_creation', 'narrator_selection', 'world_creation', 'quick_start_selection', 'quick_start_password'];
  if ((typeof session.creationPhase === 'string' && validPhases.includes(session.creationPhase)) || session.creationPhase === false) {
      newSession.creationPhase = session.creationPhase;
  } else {
      newSession.creationPhase = undefined;
  }

  if (Array.isArray(session.quickStartChars)) {
      newSession.quickStartChars = session.quickStartChars;
  } else {
      newSession.quickStartChars = undefined;
  }

  return newSession as ChatSession;
}