class PexelsVideoGallery {
    constructor() {
        this.currentPage = 1;
        this.perPage = 12;
        this.currentCategory = 'all';
        this.loading = false;
        this.hasMore = true;
        this.apiKey = 'GIL4MLa6NgujdwLczbkxjNxdFnSpPqLv6sse6jtTLfI25HHAixBo7rTj';
        this.initializeGallery();
    }

    async initializeGallery() {
        this.setupEventListeners();
        await this.loadVideos('all');
    }

    setupEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.video-filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.currentTarget.getAttribute('data-filter');
                this.handleCategoryChange(category);
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreVideosBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreVideos());
        }

        // Search functionality
        const searchButton = document.getElementById('videoSearchButton');
        const searchInput = document.getElementById('videoSearchInput');
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

    async handleCategoryChange(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        this.hasMore = true;
        document.querySelectorAll('.video-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            }
        });
        document.getElementById('videoGallery').innerHTML = '';
        await this.loadVideos(category);
    }

    async handleSearch(query) {
        if (!query.trim()) return;
        this.currentPage = 1;
        this.hasMore = true;
        document.getElementById('videoGallery').innerHTML = '';
        await this.searchVideos(query);
    }

    async loadVideos(category) {
        if (this.loading || !this.hasMore) return;
        this.loading = true;

        try {
            let url = `https://api.pexels.com/videos/search?page=${this.currentPage}&per_page=${this.perPage}`;
            if (category && category !== 'all') {
                url += `&query=${category}`;
            } else {
                url += '&query=nature'; // Default query for 'all' category
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': this.apiKey
                }
            });

            const data = await response.json();
            this.hasMore = data.videos.length === this.perPage;
            this.displayVideos(data.videos);
        } catch (error) {
            console.error('Error loading videos:', error);
        } finally {
            this.loading = false;
        }
    }

    async searchVideos(query) {
        if (this.loading || !this.hasMore) return;
        this.loading = true;

        try {
            const response = await fetch(
                `https://api.pexels.com/videos/search?query=${query}&page=${this.currentPage}&per_page=${this.perPage}`,
                {
                    headers: {
                        'Authorization': this.apiKey
                    }
                }
            );

            const data = await response.json();
            this.hasMore = data.videos.length === this.perPage;
            this.displayVideos(data.videos);
        } catch (error) {
            console.error('Error searching videos:', error);
        } finally {
            this.loading = false;
        }
    }

    displayVideos(videos) {
        const gallery = document.getElementById('videoGallery');
        
        videos.forEach(video => {
            const videoFile = video.video_files.find(file => file.quality === 'hd' && file.file_type === 'video/mp4') || 
                            video.video_files.find(file => file.quality === 'sd' && file.file_type === 'video/mp4');
            if (!videoFile) return;

            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6 mb-4';
            
            col.innerHTML = `
                <div class="card video-card h-100">
                    <div class="video-wrapper">
                        <video class="card-video" controls poster="${video.image}">
                            <source src="${videoFile.link}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div class="card-body">
                        <h5 class="video-title">${video.user.name}'s Video</h5>
                        <div class="video-info">
                            <span>Duration: ${Math.floor(video.duration)}s</span>
                            <span>•</span>
                            <span>Quality: ${videoFile.quality.toUpperCase()}</span>
                        </div>
                        <a href="${videoFile.link}" class="download-btn" download target="_blank">
                            Download Video
                        </a>
                    </div>
                </div>
            `;
            
            gallery.appendChild(col);
        });
    }

    async loadMoreVideos() {
        this.currentPage++;
        if (this.currentCategory === 'all') {
            await this.loadVideos();
        } else {
            await this.loadVideos(this.currentCategory);
        }
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PexelsVideoGallery();
});
