const PEXELS_API_KEY = 'GIL4MLa6NgujdwLczbkxjNxdFnSpPqLv6sse6jtTLfI25HHAixBo7rTj';

class PexelsGallery {
    constructor() {
        this.currentPage = 1;
        this.perPage = 30;
        this.currentCategory = 'curated';
        this.loading = false;
        this.hasMore = true;
        this.apiKey = PEXELS_API_KEY;
        this.photos = [];
        this.currentPhotoIndex = 0;
        this.categoryEndpoints = {
            'curated': 'curated',
            'nature': 'nature-photography',
            'people': 'people-photography',
            'architecture': 'architecture-photography',
            'travel': 'travel-photography',
            'animals': 'animals-photography',
            'food': 'food-photography'
        };
        this.initializeGallery();
    }

    async initializeGallery() {
        this.setupEventListeners();
        await this.loadFeaturedPhoto();
        await this.loadImages('curated');
    }

    setupEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.currentTarget.getAttribute('data-filter');
                this.handleCategoryChange(category);
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreImages());
            // Add intersection observer for infinite scroll
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !this.loading) {
                    this.loadMoreImages();
                }
            }, { threshold: 0.5 });
            observer.observe(loadMoreBtn);
        }

        // Search functionality
        const searchButton = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                this.handleSearch(searchInput.value);
            });
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(searchInput.value);
                }
            });
        }
    }

    async loadFeaturedPhoto() {
        try {
            const response = await fetch('https://api.pexels.com/v1/curated?per_page=1', {
                headers: {
                    'Authorization': this.apiKey
                }
            });

            const data = await response.json();
            if (data.photos && data.photos.length > 0) {
                const photo = data.photos[0];
                const featuredContainer = document.getElementById('featured-photo');
                if (featuredContainer) {
                    featuredContainer.innerHTML = `
                        <img src="${photo.src.large2x}" alt="${photo.alt || 'Featured Photo'}" class="img-fluid">
                        <div class="featured-photo-info">
                            <h3>Featured Photo</h3>
                            <p>By ${photo.photographer}</p>
                            <a href="${photo.photographer_url}" target="_blank" class="photographer-link">
                                <i class="fas fa-external-link-alt"></i> View Profile
                            </a>
                            <button class="download-btn" data-url="${photo.src.original}" data-photographer="${photo.photographer}">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                    `;
                    const downloadBtn = featuredContainer.querySelector('.download-btn');
                    downloadBtn.addEventListener('click', (e) => {
                        const url = e.target.dataset.url;
                        const photographer = e.target.dataset.photographer;
                        this.downloadImage(url, photographer);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading featured photo:', error);
        }
    }

    async loadImages(category, query = '') {
        if (this.loading || !this.hasMore) return;
        this.loading = true;

        try {
            let url;
            if (query) {
                // Search query
                url = `https://api.pexels.com/v1/search?query=${query}&page=${this.currentPage}&per_page=${this.perPage}`;
            } else if (category === 'curated') {
                // Curated photos
                url = `https://api.pexels.com/v1/curated?page=${this.currentPage}&per_page=${this.perPage}`;
            } else {
                // Category-specific photos using collections
                const categorySlug = this.categoryEndpoints[category] || category;
                url = `https://api.pexels.com/v1/search?query=${categorySlug}&page=${this.currentPage}&per_page=${this.perPage}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': this.apiKey
                }
            });

            const data = await response.json();
            
            if (data.photos && data.photos.length > 0) {
                this.hasMore = data.photos.length === this.perPage;
                this.displayImages(data.photos);
                this.currentPage++;
            } else {
                this.hasMore = false;
                if (this.currentPage === 1) {
                    document.getElementById('gallery').innerHTML = '<div class="no-results">No photos found</div>';
                }
            }
        } catch (error) {
            console.error('Error loading images:', error);
            this.showNotification('Failed to load images. Please try again.', 'error');
        } finally {
            this.loading = false;
            document.getElementById('loadMoreBtn').style.display = this.hasMore ? 'block' : 'none';
        }
    }

    displayImages(photos) {
        const gallery = document.getElementById('gallery');
        const template = photos.map(photo => `
            <div class="gallery-item" data-aos="fade-up">
                <div class="photo-card" data-photo='${JSON.stringify(photo)}'>
                    <img src="${photo.src.large}" 
                         alt="${photo.alt || 'Pexels Photo'}" 
                         loading="lazy"
                         class="gallery-img">
                    <div class="photo-overlay">
                        <div class="photographer-info">
                            <a href="${photo.photographer_url}" target="_blank" class="photographer-name">
                                <i class="fas fa-camera"></i> ${photo.photographer}
                            </a>
                        </div>
                        <div class="photo-actions">
                            <button class="btn btn-light btn-sm" onclick="window.open('${photo.url}', '_blank')">
                                <i class="fas fa-external-link-alt"></i>
                            </button>
                            <button class="btn btn-light btn-sm download-btn" 
                                    data-url="${photo.src.original}" 
                                    data-photographer="${photo.photographer}">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        if (this.currentPage === 1) {
            gallery.innerHTML = template;
            this.photos = photos;
        } else {
            gallery.insertAdjacentHTML('beforeend', template);
            this.photos = [...this.photos, ...photos];
        }

        // Add click listeners for popup
        gallery.querySelectorAll('.photo-card').forEach((card, index) => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.photo-actions')) {
                    const startIndex = this.currentPage === 1 ? index : this.photos.length - photos.length + index;
                    this.openPhotoPopup(startIndex);
                }
            });
        });

        // Add click listeners to download buttons
        gallery.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.currentTarget.dataset.url;
                const photographer = e.currentTarget.dataset.photographer;
                this.downloadImage(url, photographer);
                e.stopPropagation();
            });
        });
    }

    openPhotoPopup(index) {
        this.currentPhotoIndex = index;
        const photo = this.photos[index];
        
        // Create popup overlay if it doesn't exist
        let overlay = document.querySelector('.photo-popup-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'photo-popup-overlay';
            document.body.appendChild(overlay);
        }
        
        overlay.innerHTML = `
            <div class="popup-content">
                <button class="popup-close">&times;</button>
                <div class="popup-image-container">
                    <img src="${photo.src.large2x}" class="popup-image" alt="${photo.alt || 'Photo'}">
                    <button class="nav-btn prev-btn" ${index === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="nav-btn next-btn" ${index === this.photos.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="popup-info">
                    <div class="photographer-details">
                        <h3>
                            <i class="fas fa-camera"></i>
                            <a href="${photo.photographer_url}" target="_blank">${photo.photographer}</a>
                        </h3>
                        <p class="photo-dimensions">${photo.width} × ${photo.height}</p>
                    </div>
                    <div class="popup-actions">
                        <button class="btn btn-light" onclick="window.open('${photo.url}', '_blank')">
                            <i class="fas fa-external-link-alt"></i> View on Pexels
                        </button>
                        <button class="btn btn-primary download-btn" 
                                data-url="${photo.src.original}" 
                                data-photographer="${photo.photographer}">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Add event listeners
        const closeBtn = overlay.querySelector('.popup-close');
        const prevBtn = overlay.querySelector('.prev-btn');
        const nextBtn = overlay.querySelector('.next-btn');
        const downloadBtn = overlay.querySelector('.download-btn');

        closeBtn.addEventListener('click', () => this.closePhotoPopup());
        prevBtn.addEventListener('click', () => this.navigatePopup('prev'));
        nextBtn.addEventListener('click', () => this.navigatePopup('next'));
        downloadBtn.addEventListener('click', (e) => {
            const url = e.currentTarget.dataset.url;
            const photographer = e.currentTarget.dataset.photographer;
            this.downloadImage(url, photographer);
        });

        // Close on background click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closePhotoPopup();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    navigatePopup(direction) {
        const newIndex = direction === 'prev' 
            ? Math.max(0, this.currentPhotoIndex - 1)
            : Math.min(this.photos.length - 1, this.currentPhotoIndex + 1);
        
        if (newIndex !== this.currentPhotoIndex) {
            this.openPhotoPopup(newIndex);
        }
    }

    handleKeyPress(e) {
        const overlay = document.querySelector('.photo-popup-overlay');
        if (!overlay) return;

        switch(e.key) {
            case 'ArrowLeft':
                this.navigatePopup('prev');
                break;
            case 'ArrowRight':
                this.navigatePopup('next');
                break;
            case 'Escape':
                this.closePhotoPopup();
                break;
        }
    }

    closePhotoPopup() {
        const overlay = document.querySelector('.photo-popup-overlay');
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 300);
        }
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    async handleCategoryChange(category) {
        if (this.loading) return;

        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            }
        });

        // Reset and load new category
        this.currentPage = 1;
        this.currentCategory = category;
        this.hasMore = true;
        this.photos = []; // Clear photos array
        document.getElementById('gallery').innerHTML = '';
        await this.loadImages(category);
    }

    async handleSearch(query) {
        if (!query.trim() || this.loading) return;

        // Show loading state
        document.getElementById('gallery').innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        
        this.currentPage = 1;
        this.currentCategory = 'search';
        this.hasMore = true;
        this.photos = []; // Clear photos array
        
        // Remove active state from category buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        await this.loadImages('search', query.trim());
    }

    async downloadImage(url, photographer) {
        try {
            // Show loading notification
            this.showNotification('Starting download...', 'info');
            
            // Fetch the image
            const response = await fetch(url);
            const blob = await response.blob();
            
            // Create blob URL
            const blobUrl = window.URL.createObjectURL(blob);
            
            // Create temporary link and trigger download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${photographer.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            
            this.showNotification('Download started!', 'success');
        } catch (error) {
            console.error('Error downloading image:', error);
            this.showNotification('Failed to download image. Please try again.', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('active'), 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async loadMoreImages() {
        if (!this.loading && this.hasMore) {
            this.currentPage++; // Increment page before loading more
            await this.loadImages(this.currentCategory);
        }
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PexelsGallery();
});
