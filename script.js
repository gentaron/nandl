document.addEventListener('DOMContentLoaded', function() {
    // Gallery setup
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const imageCounter = document.getElementById('imageCounter');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    let currentImageIndex = 0;
    let images = [];
    
    // Image data with descriptions
    const imageDescriptions = [
        "Ninny showcasing her incredible strength and determination",
        "Lillie demonstrating her graceful combat techniques",
        "The dynamic duo preparing for their next heroic mission",
        "Ninny's signature pose radiating confidence and power",
        "Lillie's elegant stance displaying her strategic mindset"
    ];
    
    // Generate images array (excluding removed numbers: 19, 26, 28, 32)
    const excludedNumbers = [19, 26, 28, 32];
    let collectibleIndex = 1;
    
    for (let i = 1; i <= 52; i++) {
        if (!excludedNumbers.includes(i)) {
            let character, characterDescription;
            
            // Ninny is numbers 2-9, all others are Lillie
            if (i >= 2 && i <= 9) {
                character = "Ninny";
                characterDescription = "Ninny's powerful posterior captured from behind, showcasing her athletic curves and confident stance";
            } else {
                character = "Lillie";
                characterDescription = "Lillie's elegant backside featured in detailed rear-view composition, highlighting her graceful form and heroic silhouette";
            }
            
            images.push({
                src: `landn (${i}).png`,
                title: `${character} - #${collectibleIndex}`,
                description: `${characterDescription} - Collectible #${collectibleIndex}`,
                character: character,
                collectibleNumber: collectibleIndex
            });
            collectibleIndex++;
        }
    }
    
    // Create gallery items
    function createGallery() {
        gallery.innerHTML = '';
        images.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${image.src}" alt="${image.title}" loading="lazy">
                <div class="overlay">
                    <h4>${image.title}</h4>
                    <p>Collectible #${image.collectibleNumber}</p>
                </div>
            `;
            
            galleryItem.addEventListener('click', () => openModal(index));
            gallery.appendChild(galleryItem);
        });
    }
    
    // Open modal
    function openModal(index) {
        currentImageIndex = index;
        const image = images[index];
        modalImage.src = image.src;
        modalTitle.textContent = image.title;
        modalDescription.textContent = image.description;
        imageCounter.textContent = `${index + 1} of ${images.length}`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Preload adjacent images for smoother navigation
        preloadAdjacentImages(index);
    }
    
    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Navigate images
    function navigateImage(direction) {
        if (direction === 'next') {
            currentImageIndex = (currentImageIndex + 1) % images.length;
        } else {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        }
        openModal(currentImageIndex);
    }
    
    // Preload adjacent images
    function preloadAdjacentImages(index) {
        const preloadIndexes = [
            (index - 1 + images.length) % images.length,
            (index + 1) % images.length
        ];
        
        preloadIndexes.forEach(i => {
            const img = new Image();
            img.src = images[i].src;
        });
    }
    
    // View mode switching
    function switchView(viewMode) {
        viewButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        gallery.className = `gallery ${viewMode}-view`;
        
        // Add smooth transition effect
        gallery.style.opacity = '0.5';
        setTimeout(() => {
            gallery.style.opacity = '1';
        }, 200);
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', () => navigateImage('prev'));
    nextBtn.addEventListener('click', () => navigateImage('next'));
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    navigateImage('prev');
                    break;
                case 'ArrowRight':
                    navigateImage('next');
                    break;
            }
        }
    });
    
    // View mode buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewMode = this.dataset.view;
            switchView(viewMode);
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for lazy loading and animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add loading animation
    function addLoadingAnimation() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(item);
        });
    }
    
    // Initialize gallery
    createGallery();
    
    // Add loading animation after gallery is created
    setTimeout(addLoadingAnimation, 100);
    
    // Interactive Slider Functionality
    initInteractiveSlider();
    
    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    modal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    modal.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                navigateImage('next');
            } else {
                navigateImage('prev');
            }
        }
    }
    
    // Error handling for missing images
    images.forEach((image, index) => {
        const img = new Image();
        img.onerror = function() {
            console.warn(`Image not found: ${image.src}`);
            // You could replace with a placeholder image here
        };
        img.src = image.src;
    });
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    
    // Add stats counter animation
    function animateCounters() {
        const stats = document.querySelectorAll('.stat');
        stats.forEach(stat => {
            if (stat.textContent.includes('48')) {
                let count = 0;
                const target = 48;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        count = target;
                        clearInterval(timer);
                    }
                    stat.textContent = stat.textContent.replace(/\d+/, Math.floor(count));
                }, 30);
            }
        });
    }
    
    // Trigger counter animation when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.collection-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Interactive Slider Initialization
    function initInteractiveSlider() {
        const sliderTrack = document.getElementById('sliderTrack');
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        const indicatorsContainer = document.getElementById('slideIndicators');
        const slides = document.querySelectorAll('.showcase-slide');
        const ninnyContainer = document.getElementById('ninnyImages');
        const lillieContainer = document.getElementById('lillieImages');
        
        if (!sliderTrack || !prevBtn || !nextBtn || !indicatorsContainer || slides.length === 0) {
            return; // Elements not found, skip initialization
        }
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Get random images for characters
        function getRandomImages(characterImages, count = 2) {
            const shuffled = [...characterImages].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        }
        
        // Filter images by character
        const ninnyImages = images.filter(img => img.character === 'Ninny');
        const lillieImages = images.filter(img => img.character === 'Lillie');
        
        // Create showcase image element
        function createShowcaseImage(image) {
            return `
                <div class="showcase-image">
                    <img src="${image.src}" alt="${image.title}" loading="lazy">
                    <span class="image-label">#${image.collectibleNumber}</span>
                </div>
            `;
        }
        
        // Update showcase images
        function updateShowcaseImages() {
            if (ninnyContainer) {
                const randomNinnyImages = getRandomImages(ninnyImages, 2);
                ninnyContainer.innerHTML = randomNinnyImages.map(createShowcaseImage).join('');
            }
            
            if (lillieContainer) {
                const randomLillieImages = getRandomImages(lillieImages, 2);
                lillieContainer.innerHTML = randomLillieImages.map(createShowcaseImage).join('');
            }
        }
        
        // Create slide indicators
        function createIndicators() {
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('div');
                indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
                indicator.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(indicator);
            }
        }
        
        // Update slider position
        function updateSliderPosition() {
            const translateX = -currentSlide * 25; // 25% per slide
            sliderTrack.style.transform = `translateX(${translateX}%)`;
            
            // Update indicators
            document.querySelectorAll('.indicator').forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Navigation functions
        function goToSlide(slideIndex) {
            if (slideIndex >= 0 && slideIndex < totalSlides) {
                currentSlide = slideIndex;
                
                // Update random images when entering character slides
                const currentSlideElement = slides[currentSlide];
                if (currentSlideElement.dataset.character) {
                    updateShowcaseImages();
                }
                
                updateSliderPosition();
            }
        }
        
        function nextSlide() {
            const nextIndex = (currentSlide + 1) % totalSlides;
            goToSlide(nextIndex);
        }
        
        function prevSlide() {
            const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(prevIndex);
        }
        
        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Touch/swipe support for slider
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSliderSwipe();
        });
        
        function handleSliderSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    prevSlide();
                }
            }
        }
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (sliderTrack.getBoundingClientRect().top < window.innerHeight && 
                sliderTrack.getBoundingClientRect().bottom > 0) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        prevSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        nextSlide();
                        break;
                }
            }
        });
        
        // Initialize slider
        createIndicators();
        updateShowcaseImages();
        updateSliderPosition();
        
        // Add image error handling
        function addImageErrorHandling() {
            const showcaseImages = document.querySelectorAll('.showcase-image img');
            showcaseImages.forEach(img => {
                img.onerror = function() {
                    console.warn(`Showcase image not found: ${this.src}`);
                    this.style.display = 'none';
                };
            });
        }
        
        // Call error handling after each image update
        const originalUpdateShowcaseImages = updateShowcaseImages;
        updateShowcaseImages = function() {
            originalUpdateShowcaseImages();
            setTimeout(addImageErrorHandling, 100);
        };
    }
});