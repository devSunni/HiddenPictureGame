export class ThemeManager {
    constructor() {
        this.themes = [];
    }

    async loadThemes() {
        // In a real app, fetch from json. For now, mock it.
        this.themes = [
            { id: 'messy-room', name: 'Messy Room' },
            { id: 'fantasy-forest', name: 'Fantasy Forest' },
            { id: 'cyber-city', name: 'Cyber City' }
        ];
        return this.themes;
    }

    getThemes() {
        return this.themes;
    }
}
