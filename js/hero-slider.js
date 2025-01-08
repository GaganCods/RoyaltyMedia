const PEXELS_API_KEY = 'GIL4MLa6NgujdwLczbkxjNxdFnSpPqLv6sse6jtTLfI25HHAixBo7rTj';

class HeroSlider {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.interval = 5000; // Change image every 5 seconds
        this.heroImage = document.getElementById('heroImage');
        this.loadingOverlay = document.querySelector('.hero-loading');
        this.init();
    }

    async init() {
        try {
            // Categories for hero images
            const categories = [
                'professional photography',
                'landscape photography',
                'portrait photography',
                'event photography',
                'nature photography'
            ];

            // Fetch images for each category
            const responses = await Promise.all(
                categories.map(category =>
                    fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(category)}&per_page=1&orientation=landscape`, {
                        headers: {
                            'Authorization': PEXELS_API_KEY
                        }
                    })
                )
            );

            // Process responses
            const data = await Promise.all(responses.map(res => res.json()));
            this.images = data
                .flatMap(result => result.photos)
                .map(photo => ({
                    url: photo.src.landscape,
                    photographer: photo.photographer,
                    photographerUrl: photo.photographer_url
                }));

            // Start the slideshow
            if (this.images.length > 0) {
                this.showImage(0);
                this.startSlideshow();
            }
        } catch (error) {
            console.error('Error loading hero images:', error);
            this.handleError();
        }
    }

    showImage(index) {
        if (!this.heroImage || !this.images[index]) return;

        // Create new image to preload
        const img = new Image();
        
        img.onload = () => {
            // Update hero image
            this.heroImage.style.opacity = '0';
            
            setTimeout(() => {
                this.heroImage.src = img.src;
                this.heroImage.style.opacity = '1';
                
                // Update photographer info
                const photographerInfo = document.querySelector('.hero-photographer');
                if (photographerInfo) {
                    photographerInfo.innerHTML = `
                        Photo by <a href="${this.images[index].photographerUrl}" 
                        target="_blank" rel="noopener">${this.images[index].photographer}</a>
                    `;
                }
            }, 300);
        };

        img.onerror = () => {
            console.error('Error loading image:', this.images[index].url);
            this.nextImage();
        };

        img.src = this.images[index].url;
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(this.currentIndex);
    }

    startSlideshow() {
        setInterval(() => this.nextImage(), this.interval);
    }

    handleError() {
        if (this.heroImage) {
            this.heroImage.src = 'images/fallback-hero.jpg';
        }
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'none';
        }
    }
}

// Initialize hero slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlider();
});
