const PEXELS_API_KEY = 'GIL4MLa6NgujdwLczbkxjNxdFnSpPqLv6sse6jtTLfI25HHAixBo7rTj';

class PexelsFeatured {
    constructor() {
        this.initializeFeatured();
    }

    async initializeFeatured() {
        await Promise.all([
            this.loadFeaturedPhotos(),
            this.loadFeaturedVideo()
        ]);
    }

    async loadFeaturedPhotos() {
        try {
            const queries = ['professional photography', 'landscape nature', 'portrait professional'];
            const photos = await Promise.all(
                queries.map(query => this.fetchPhoto(query))
            );

            const featuredGrid = document.querySelector('.featured-grid');
            
            // Photography Card
            this.createFeaturedCard(featuredGrid, {
                image: photos[0].src.large,
                photographer: photos[0].photographer,
                title: 'Photography',
                text: 'Explore our collection of stunning photographs.',
                link: 'photos.html',
                buttonText: 'View Gallery',
                photographerUrl: photos[0].photographer_url
            });

            // Video Card with Photo Background
            this.createFeaturedCard(featuredGrid, {
                image: photos[1].src.large,
                photographer: photos[1].photographer,
                title: 'Videography',
                text: 'Watch our latest video productions.',
                link: 'videos.html',
                buttonText: 'Watch Videos',
                photographerUrl: photos[1].photographer_url
            });

            // Support Card with Photo Background
            this.createFeaturedCard(featuredGrid, {
                image: photos[2].src.large,
                photographer: photos[2].photographer,
                title: 'Support Our Work',
                text: 'Help us continue creating amazing content.',
                link: 'donate.html',
                buttonText: 'Donate Now',
                photographerUrl: photos[2].photographer_url
            });

        } catch (error) {
            console.error('Error loading featured photos:', error);
        }
    }

    async fetchPhoto(query) {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
            {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            }
        );
        const data = await response.json();
        return data.photos[0];
    }

    createFeaturedCard(container, { image, photographer, title, text, link, buttonText, photographerUrl }) {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        
        col.innerHTML = `
            <div class="card h-100 featured-card">
                <div class="card-img-wrapper">
                    <img src="${image}" class="card-img-top" alt="${title}">
                    <div class="photographer-credit">
                        Photo by <a href="${photographerUrl}" target="_blank" rel="noopener">${photographer}</a> on Pexels
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${text}</p>
                    <a href="${link}" class="btn btn-outline-primary">${buttonText}</a>
                </div>
            </div>
        `;
        
        container.appendChild(col);
    }
}

// Initialize featured content when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PexelsFeatured();
});
