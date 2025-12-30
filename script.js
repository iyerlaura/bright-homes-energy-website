// Professional JavaScript for Bright Homes Energy Initiative Website

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeSavingsCalculator();
    initializePanelDonationCalculator();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav-menu-open');
            navToggle.classList.toggle('nav-toggle-active');
        });
    }

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('nav-menu-open');
            navToggle.classList.remove('nav-toggle-active');
        });
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Solar savings calculator
function initializeSavingsCalculator() {
    // Create calculator widget if element exists
    const calculatorContainer = document.getElementById('savings-calculator');
    if (calculatorContainer) {
        createSavingsCalculator(calculatorContainer);
    }
    
    // Add interactive elements to impact cards
    addImpactCardInteractivity();
}

function createSavingsCalculator(container) {
    const calculatorHTML = `
        <div class="calculator-widget">
            <h4>Calculate Your Potential Solar Savings</h4>
            <div class="calculator-form">
                <div class="input-group">
                    <label for="monthly-bill">Monthly Electricity Bill ($)</label>
                    <input type="number" id="monthly-bill" placeholder="150" min="50" max="500">
                </div>
                <div class="input-group">
                    <label for="home-size">Home Size (sq ft)</label>
                    <select id="home-size">
                        <option value="1200">Under 1,200</option>
                        <option value="1500" selected>1,200 - 1,800</option>
                        <option value="2000">1,800 - 2,500</option>
                        <option value="2500">Over 2,500</option>
                    </select>
                </div>
                <button type="button" class="btn-primary" id="calculate-savings">Calculate Savings</button>
            </div>
            <div class="calculator-results" id="calculator-results" style="display: none;">
                <div class="result-item">
                    <span class="result-label">Annual Savings:</span>
                    <span class="result-value" id="annual-savings">$0</span>
                </div>
                <div class="result-item">
                    <span class="result-label">25-Year Savings:</span>
                    <span class="result-value" id="total-savings">$0</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Federal Tax Credit:</span>
                    <span class="result-value" id="tax-credit">$0</span>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = calculatorHTML;
    
    // Add calculator functionality
    document.getElementById('calculate-savings').addEventListener('click', calculateSolarSavings);
}

function calculateSolarSavings() {
    const monthlyBill = parseFloat(document.getElementById('monthly-bill').value) || 150;
    const homeSize = parseFloat(document.getElementById('home-size').value) || 1500;
    
    // Georgia-specific calculations based on research data
    const avgKwhPrice = 0.14; // Average Georgia rate
    const monthlyKwh = monthlyBill / avgKwhPrice;
    const systemSizeKw = (monthlyKwh * 12) / 1200; // Approximate system size needed
    
    // Calculate savings (assuming 85% offset)
    const annualSavings = monthlyBill * 12 * 0.85;
    const totalSavings = annualSavings * 25;
    
    // Calculate federal tax credit (30% of system cost)
    const systemCost = systemSizeKw * 3000; // $3/watt average
    const taxCredit = systemCost * 0.30;
    
    // Display results
    document.getElementById('annual-savings').textContent = `$${annualSavings.toLocaleString()}`;
    document.getElementById('total-savings').textContent = `$${totalSavings.toLocaleString()}`;
    document.getElementById('tax-credit').textContent = `$${taxCredit.toLocaleString()}`;
    
    document.getElementById('calculator-results').style.display = 'block';
}

function addImpactCardInteractivity() {
    const impactCards = document.querySelectorAll('.impact-card');
    
    impactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Panel donation calculator
function initializePanelDonationCalculator() {
    const panelSlider = document.getElementById('panel-slider');
    if (!panelSlider) return;
    
    // Calculate price per panel based on project data
    // $1.2M for 63 homes = ~$19,048 per home
    // Average 20 panels per home = ~$952 per panel
    // Using $950 for cleaner calculation
    const PRICE_PER_PANEL = 950;
    
    // Calculate savings per panel based on project data
    // $45,000 savings per family over 25 years
    // Average 20 panels per home
    // Per panel: $45,000 / 20 = $2,250 over 25 years = $90 per year
    const ANNUAL_SAVINGS_PER_PANEL = 90;
    const TOTAL_SAVINGS_PER_PANEL = 2250; // Over 25 years
    
    function updateDonationDisplay() {
        const panelCount = parseInt(panelSlider.value);
        const totalAmount = panelCount * PRICE_PER_PANEL;
        const annualSavings = panelCount * ANNUAL_SAVINGS_PER_PANEL;
        const totalSavings = panelCount * TOTAL_SAVINGS_PER_PANEL;
        
        // Update panel count display
        document.getElementById('panel-count').textContent = panelCount;
        
        // Update donation amount
        document.getElementById('donation-amount').textContent = `$${totalAmount.toLocaleString()}`;
        document.getElementById('price-per-panel').textContent = `$${PRICE_PER_PANEL.toLocaleString()} per panel`;
        
        // Update savings impact
        document.getElementById('annual-savings-impact').textContent = `$${annualSavings.toLocaleString()}`;
        document.getElementById('total-savings-impact').textContent = `$${totalSavings.toLocaleString()}`;
    }
    
    // Initialize display
    updateDonationDisplay();
    
    // Update on slider change
    panelSlider.addEventListener('input', updateDonationDisplay);
}

// Scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate stat numbers
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
                
                // Animate impact stats
                if (entry.target.classList.contains('impact-stat')) {
                    animateNumber(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.stat-item, .impact-card, .module-card, .story-card, .partner-card, .option-card');
    animatedElements.forEach(el => observer.observe(el));
    
    // Observe stat numbers separately
    const statNumbers = document.querySelectorAll('.stat-number, .impact-stat');
    statNumbers.forEach(el => observer.observe(el));
}

function animateNumber(element) {
    const text = element.textContent;
    const originalText = text;
    
    // Extract number and preserve original formatting
    const numberMatch = text.match(/[\d,]+/);
    if (!numberMatch) return;
    
    const number = parseFloat(numberMatch[0].replace(/,/g, ''));
    if (isNaN(number)) return;
    
    // Get prefix and suffix
    const numberStr = numberMatch[0];
    const prefix = text.substring(0, text.indexOf(numberStr));
    const suffix = text.substring(text.indexOf(numberStr) + numberStr.length);
    
    let current = 0;
    const increment = number / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = originalText;
            clearInterval(timer);
        } else {
            const formattedNumber = Math.floor(current).toLocaleString();
            element.textContent = prefix + formattedNumber + suffix;
        }
    }, 40);
}

// Countdown timer for federal tax credit deadline
function initializeTaxCreditCountdown() {
    const deadline = new Date('2025-12-31T23:59:59');
    
    function updateCountdown() {
        const now = new Date();
        const timeLeft = deadline - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            const countdownElement = document.getElementById('tax-credit-countdown');
            if (countdownElement) {
                countdownElement.innerHTML = `
                    <div class="countdown-item">
                        <span class="countdown-number">${days}</span>
                        <span class="countdown-label">Days</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${hours}</span>
                        <span class="countdown-label">Hours</span>
                    </div>
                `;
            }
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 3600000); // Update every hour
}

// Form validation for contact forms
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.classList.add('field-invalid');
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('field-invalid');
}

// Add professional loading states and user feedback
function showLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    return function() {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// Initialize tax credit countdown on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTaxCreditCountdown();
    initializeFormValidation();
});