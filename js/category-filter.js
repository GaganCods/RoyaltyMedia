document.addEventListener('DOMContentLoaded', function() {
    // Get all filter buttons and footer links
    const categories = ['all', 'nature', 'people', 'architecture', 'animals'];
    
    categories.forEach(category => {
        const filterBtn = document.getElementById(`${category}Filter`);
        const footerLink = document.getElementById(`${category}FilterLink`);
        
        // Add click event to filter button
        filterBtn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
            // Apply filter
            applyFilter(category);
        });
        
        // Add click event to footer link
        footerLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Trigger click on corresponding filter button
            filterBtn.click();
            // Smooth scroll to filter section
            document.querySelector('.filter-section').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    function applyFilter(category) {
        const gallery = document.getElementById('gallery');
        const items = gallery.getElementsByClassName('gallery-item');
        
        Array.from(items).forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
});
