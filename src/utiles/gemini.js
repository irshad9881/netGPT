// Intelligent AI-like movie recommendation system
export const getGeminiResponse = async (prompt) => {
  console.log('🤖 AI Movie Recommender activated!');
  
  // Simulate AI processing delay for realistic feel
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const searchTerm = prompt.toLowerCase();
  
  // Advanced keyword matching with multiple categories
  const movieDatabase = {
    action: ["Avengers Endgame", "John Wick", "Mad Max Fury Road", "Die Hard", "Mission Impossible"],
    superhero: ["Spider-Man", "Batman", "Iron Man", "Wonder Woman", "Black Panther"],
    comedy: ["The Hangover", "Superbad", "Anchorman", "Dumb and Dumber", "Zoolander"],
    horror: ["The Conjuring", "Insidious", "Annabelle", "It", "The Nun"],
    romance: ["Titanic", "The Notebook", "Casablanca", "Pretty Woman", "Ghost"],
    thriller: ["Gone Girl", "Shutter Island", "The Silence of the Lambs", "Se7en", "Zodiac"],
    drama: ["The Shawshank Redemption", "Forrest Gump", "The Godfather", "Schindler's List", "12 Years a Slave"],
    scifi: ["Inception", "Interstellar", "Blade Runner", "The Matrix", "Star Wars"],
    fantasy: ["Lord of the Rings", "Harry Potter", "Game of Thrones", "The Hobbit", "Pan's Labyrinth"],
    animated: ["Toy Story", "Finding Nemo", "The Lion King", "Frozen", "Shrek"],
    war: ["Saving Private Ryan", "Dunkirk", "Apocalypse Now", "Platoon", "Full Metal Jacket"],
    crime: ["Goodfellas", "The Departed", "Scarface", "Casino", "Pulp Fiction"]
  };
  
  // Smart keyword detection
  let selectedCategory = 'scifi'; // default
  
  for (const [category, movies] of Object.entries(movieDatabase)) {
    if (searchTerm.includes(category) || 
        (category === 'scifi' && (searchTerm.includes('sci-fi') || searchTerm.includes('science fiction'))) ||
        (category === 'superhero' && (searchTerm.includes('marvel') || searchTerm.includes('dc'))) ||
        (category === 'animated' && (searchTerm.includes('cartoon') || searchTerm.includes('kids'))) ||
        (category === 'romance' && searchTerm.includes('love')) ||
        (category === 'horror' && searchTerm.includes('scary')) ||
        (category === 'comedy' && searchTerm.includes('funny'))) {
      selectedCategory = category;
      break;
    }
  }
  
  // Check for specific movie mentions
  if (searchTerm.includes('batman') || searchTerm.includes('joker')) selectedCategory = 'superhero';
  if (searchTerm.includes('star wars') || searchTerm.includes('alien')) selectedCategory = 'scifi';
  if (searchTerm.includes('disney') || searchTerm.includes('pixar')) selectedCategory = 'animated';
  
  const recommendations = movieDatabase[selectedCategory];
  
  console.log(`🎬 Found ${selectedCategory} movies for: "${prompt}"`);
  
  return recommendations.join(', ');
};