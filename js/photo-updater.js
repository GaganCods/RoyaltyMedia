// Cache key constants
const CACHE_KEYS = {
    LAST_UPDATE: 'lastPhotoUpdate',
    FEATURED_PHOTOS: 'featuredPhotos',
    CATEGORY_PHOTOS: 'categoryPhotos',
};

class PhotoUpdater {
    constructor() {
        this.categories = ['nature', 'people', 'architecture', 'travel', 'technology', 'food'];
        this.photosPerCategory = 24;
        this.checkAndUpdatePhotos();
    }

    async checkAndUpdatePhotos() {
        const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
        const today = new Date().toDateString();

        if (lastUpdate !== today) {
            await this.updateAllPhotos();
            localStorage.setItem(CACHE_KEYS.LAST_UPDATE, today);
        }
    }

    async updateAllPhotos() {
        try {
            // Update featured photos
            const featuredPhotos = await this.fetchPhotos('professional photography', 5);
            localStorage.setItem(CACHE_KEYS.FEATURED_PHOTOS, JSON.stringify(featuredPhotos));

            // Update category photos
            const categoryPhotos = {};
            for (const category of this.categories) {
                const photos = await this.fetchPhotos(category, this.photosPerCategory);
                categoryPhotos[category] = photos;
            }
            localStorage.setItem(CACHE_KEYS.CATEGORY_PHOTOS, JSON.stringify(categoryPhotos));

            return true;
        } catch (error) {
            console.error('Error updating photos:', error);
            return false;
        }
    }

    async fetchPhotos(query, perPage) {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}&page=1`, {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            }
        );
        const data = await response.json();
        return data.photos;
    }

    static getFeaturedPhotos() {
        const photos = localStorage.getItem(CACHE_KEYS.FEATURED_PHOTOS);
        return photos ? JSON.parse(photos) : null;
    }

    static getCategoryPhotos(category) {
        const photos = localStorage.getItem(CACHE_KEYS.CATEGORY_PHOTOS);
        if (!photos) return null;
        
        const categoryPhotos = JSON.parse(photos);
        return category === 'all' ? categoryPhotos : categoryPhotos[category];
    }
}

// Initialize photo updater when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotoUpdater();
});
