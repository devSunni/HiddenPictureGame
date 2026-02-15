export class LevelLoader {
    async loadLevel(themeId, levelId) {
        try {
            const response = await fetch(`/data/${themeId}-${levelId}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (e) {
            console.error('Failed to load level:', e);
            return null;
        }
    }
}

