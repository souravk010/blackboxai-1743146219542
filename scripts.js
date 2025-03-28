// Load and process property data
async function loadProperties() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    return data.properties;
  } catch (error) {
    console.error('Error loading property data:', error);
    return [];
  }
}

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  const properties = await loadProperties();
  console.log('Loaded properties:', properties);
  
  // Render properties to the page
  const propertyListings = document.getElementById('propertyListings');
  
  properties.forEach(property => {
    const card = document.createElement('div');
    card.className = 'rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg property-card';
    card.dataset.type = property.type;
    card.dataset.price = property.price;
    card.dataset.rating = property.rating;
    
    card.innerHTML = `
      <div class="relative">
        <img src="${property.image}" 
             alt="${property.title}" 
             class="w-full h-64 object-cover rounded-xl">
        <button class="absolute top-3 right-3 text-gray-700 favorite-btn">
          <i class="far fa-heart text-2xl"></i>
        </button>
      </div>
      <div class="mt-3">
        <div class="flex justify-between">
          <h3 class="font-semibold">${property.title}</h3>
          <div class="flex items-center">
            <i class="fas fa-star text-sm"></i>
            <span class="ml-1 text-sm">${property.rating}</span>
          </div>
        </div>
        <p class="text-gray-500 text-sm">10 miles away</p>
        <p class="text-gray-500 text-sm">Available dates</p>
        <p class="mt-1"><span class="font-semibold">$${property.price}</span> night</p>
      </div>
    `;
    
    propertyListings.appendChild(card);
  });

  // Reinitialize favorite buttons after rendering
    // Mobile menu toggle
    document.getElementById('mobileMenuButton').addEventListener('click', function() {
        const menu = document.getElementById('mobileMenu');
        menu.classList.toggle('hidden');
    });

    // User menu dropdown
    const userMenu = document.createElement('div');
    userMenu.className = 'hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20';
    userMenu.innerHTML = `
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Trips</a>
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Wishlists</a>
        <div class="border-t border-gray-200"></div>
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log out</a>
    `;
    document.querySelector('.flex.items-center.space-x-2.border').appendChild(userMenu);
    
    document.querySelector('.flex.items-center.space-x-2.border').addEventListener('click', function() {
        userMenu.classList.toggle('hidden');
    });

    // Global image error handling
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            const fallbacks = {
                'Modern loft interior': 'https://images.unsplash.com/photo-1554469384-e58fac16e23a',
                'Beachfront villa exterior': 'https://images.unsplash.com/photo-1519046904884-53103b34b206',
                'Cozy mountain cabin interior': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
                'Modern city apartment': 'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
                'Lakeside cottage': 'https://images.unsplash.com/photo-1475855581690-80accde3ae2b',
                'Luxury penthouse': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
            };
            if (fallbacks[img.alt]) {
                this.src = fallbacks[img.alt] + '?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
            } else {
                this.src = 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
            }
        };
    });

    // Favorite functionality
    document.querySelectorAll('.far.fa-heart').forEach(heart => {
        heart.addEventListener('click', function() {
            this.classList.toggle('far');
            this.classList.toggle('fas');
            this.classList.toggle('text-red-500');
        });
    });

    // Filter functionality
    const filterSelects = document.querySelectorAll('.filter-select');
    const resetBtn = document.getElementById('resetFilters');
    const propertyCards = document.querySelectorAll('.property-card');

    function applyFilters() {
        const filters = {
            type: document.querySelector('[data-filter="type"]').value,
            price: document.querySelector('[data-filter="price"]').value,
            rating: document.querySelector('[data-filter="rating"]').value
        };

        propertyCards.forEach(card => {
            const type = card.dataset.type;
            const price = parseFloat(card.dataset.price);
            const rating = parseFloat(card.dataset.rating);

            const typeMatch = filters.type === 'all' || type === filters.type;
            const priceMatch = filters.price === 'all' || 
                (filters.price === '0-150' && price <= 150) ||
                (filters.price === '150-250' && price > 150 && price <= 250) ||
                (filters.price === '250+' && price > 250);
            const ratingMatch = filters.rating === 'all' || 
                (filters.rating === '4.5+' && rating >= 4.5) ||
                (filters.rating === '4.8+' && rating >= 4.8);

            if (typeMatch && priceMatch && ratingMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterSelects.forEach(select => {
        select.addEventListener('change', applyFilters);
    });

    resetBtn.addEventListener('click', function() {
        filterSelects.forEach(select => {
            select.value = 'all';
        });
        applyFilters();
    });
});
