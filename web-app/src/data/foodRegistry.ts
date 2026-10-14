export interface FoodCommodity {
  id: string;
  name: string;
  group: 'FRUITS' | 'VEGETABLES' | 'GRAINS_AND_CEREALS' | 'PULSES_AND_LEGUMES' | 'SPICES' | 'OTHER_FOODS';
  adulterants: string[];
  status: 'SUPPORTED_ACTIVE_IN_EDGE_MODEL' | 'PLANNED_REQUIRES_DATASET_TRAINING';
  description?: string;
}

export const FOOD_GROUPS: Record<string, { title: string; count: number; description: string }> = {
  FRUITS: {
    title: 'Fruits',
    count: 21,
    description: 'Screened for calcium carbide, acetylene forced ripening, and artificial waxing.'
  },
  VEGETABLES: {
    title: 'Vegetables',
    count: 19,
    description: 'Screened for malachite green dye baths, copper sulfate, and heavy metal washes.'
  },
  GRAINS_AND_CEREALS: {
    title: 'Grains & Cereals',
    count: 9,
    description: 'Screened for talc polishing, plastic grains, chalk dust, and ergot fungus.'
  },
  PULSES_AND_LEGUMES: {
    title: 'Pulses & Legumes',
    count: 8,
    description: 'Screened for toxic Khesari dal mixing, lead chromate, and metanil yellow.'
  },
  SPICES: {
    title: 'Spices',
    count: 11,
    description: 'Screened for Sudan Red dye, brick powder, metanil yellow, and exhausted seeds.'
  },
  OTHER_FOODS: {
    title: 'Other Foods',
    count: 10,
    description: 'Screened for detergent, urea, starch, HFCS corn syrup, and argemone oil.'
  }
};

export const FOOD_COMMODITIES: FoodCommodity[] = [
  // FRUITS (21)
  { id: 'apple', name: 'Apple', group: 'FRUITS', adulterants: ['Artificial wax coating', 'Diphenylamine'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'banana', name: 'Banana', group: 'FRUITS', adulterants: ['Calcium carbide ripening', 'Ethephon overdose'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'orange', name: 'Orange', group: 'FRUITS', adulterants: ['Citrus Red No. 2 dye', 'Wax dip'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'mango', name: 'Mango', group: 'FRUITS', adulterants: ['Calcium carbide / Acetylene gas'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'grapes', name: 'Grapes', group: 'FRUITS', adulterants: ['Copper sulfate wash', 'Pesticide run-off'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'strawberry', name: 'Strawberry', group: 'FRUITS', adulterants: ['Rhodamine B dye injection'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'blueberry', name: 'Blueberry', group: 'FRUITS', adulterants: ['Synthetic dye immersion', 'Sulfites'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'pomegranate', name: 'Pomegranate', group: 'FRUITS', adulterants: ['Red dye injection', 'Water pumping'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'watermelon', name: 'Watermelon', group: 'FRUITS', adulterants: ['Erythrosine dye injection', 'Saccharin'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'pineapple', name: 'Pineapple', group: 'FRUITS', adulterants: ['Syrup soaking', 'Calcium carbide'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'papaya', name: 'Papaya', group: 'FRUITS', adulterants: ['Chemical forced ripening', 'Waxing'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'guava', name: 'Guava', group: 'FRUITS', adulterants: ['Malachite green dip for sheen'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'lemon', name: 'Lemon', group: 'FRUITS', adulterants: ['Mineral oil polishing', 'Yellow azo dyes'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'pear', name: 'Pear', group: 'FRUITS', adulterants: ['Industrial wax', 'Sulfur fumigation'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'dragon_fruit', name: 'Dragon Fruit', group: 'FRUITS', adulterants: ['Artificial peel color enhancers'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'jackfruit', name: 'Jackfruit', group: 'FRUITS', adulterants: ['Sulfur bleaching of pods'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'coconut', name: 'Coconut', group: 'FRUITS', adulterants: ['Hydrogen peroxide bleaching'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'kiwi', name: 'Kiwi', group: 'FRUITS', adulterants: ['Forced ethylene ripening'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'peach', name: 'Peach', group: 'FRUITS', adulterants: ['Synthetic wax coating'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'plum', name: 'Plum', group: 'FRUITS', adulterants: ['Artificial color dips'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'avocado', name: 'Avocado', group: 'FRUITS', adulterants: ['Chemical shelf-life extenders'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },

  // VEGETABLES (19)
  { id: 'tomato', name: 'Tomato', group: 'VEGETABLES', adulterants: ['Ethephon ripening', 'Erythrosine red wash'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'carrot', name: 'Carrot', group: 'VEGETABLES', adulterants: ['Red lead dye polishing'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'potato', name: 'Potato', group: 'VEGETABLES', adulterants: ['Clay coating for weight fraud', 'Solanine'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'onion', name: 'Onion', group: 'VEGETABLES', adulterants: ['Sulfur treatment', 'Black mold'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'garlic', name: 'Garlic', group: 'VEGETABLES', adulterants: ['Chlorine bleaching', 'Fumigants'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'spinach', name: 'Spinach', group: 'VEGETABLES', adulterants: ['Malachite green dye soak'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'broccoli', name: 'Broccoli', group: 'VEGETABLES', adulterants: ['Green dye freshener bath'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'cabbage', name: 'Cabbage', group: 'VEGETABLES', adulterants: ['Formaldehyde preservative spray'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'cauliflower', name: 'Cauliflower', group: 'VEGETABLES', adulterants: ['Sodium bisulfite bleaching'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'cucumber', name: 'Cucumber', group: 'VEGETABLES', adulterants: ['Copper sulfate wash'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'brinjal', name: 'Brinjal', group: 'VEGETABLES', adulterants: ['Methyl violet dye dip'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'capsicum', name: 'Capsicum', group: 'VEGETABLES', adulterants: ['Paraffin wax sheen', 'Copper green'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'green_chilli', name: 'Green Chilli', group: 'VEGETABLES', adulterants: ['Malachite green dye dip'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'beetroot', name: 'Beetroot', group: 'VEGETABLES', adulterants: ['Synthetic magenta dye injection'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'radish', name: 'Radish', group: 'VEGETABLES', adulterants: ['Hydrosulfite bleaching'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'pumpkin', name: 'Pumpkin', group: 'VEGETABLES', adulterants: ['Lead oxide yellow coloring'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'bitter_gourd', name: 'Bitter Gourd', group: 'VEGETABLES', adulterants: ['Malachite green / copper immersion'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'okra', name: 'Okra', group: 'VEGETABLES', adulterants: ['Malachite green emerald dye'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'sweet_potato', name: 'Sweet Potato', group: 'VEGETABLES', adulterants: ['Rhodamine B dye wash'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },

  // GRAINS AND CEREALS (9)
  { id: 'rice', name: 'Rice', group: 'GRAINS_AND_CEREALS', adulterants: ['Plastic grains', 'Liquid paraffin', 'Talc polish'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'wheat', name: 'Wheat', group: 'GRAINS_AND_CEREALS', adulterants: ['Ergot fungus grains', 'Chalk powder'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'maize', name: 'Maize', group: 'GRAINS_AND_CEREALS', adulterants: ['Aflatoxin mold', 'Lead chromate dye'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'oats', name: 'Oats', group: 'GRAINS_AND_CEREALS', adulterants: ['Barley husk dilution', 'Talc'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'barley', name: 'Barley', group: 'GRAINS_AND_CEREALS', adulterants: ['Extraneous grit', 'Fungicide powder'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'millet', name: 'Millet', group: 'GRAINS_AND_CEREALS', adulterants: ['Sand dilution', 'Brown coal-tar dye'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'ragi', name: 'Ragi', group: 'GRAINS_AND_CEREALS', adulterants: ['Coal-tar dye', 'Fine sand'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'sorghum', name: 'Sorghum', group: 'GRAINS_AND_CEREALS', adulterants: ['Foreign weed seeds', 'Chalk powder'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'quinoa', name: 'Quinoa', group: 'GRAINS_AND_CEREALS', adulterants: ['Broken amaranth seeds', 'Starch'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },

  // PULSES AND LEGUMES (8)
  { id: 'chickpeas', name: 'Chickpeas', group: 'PULSES_AND_LEGUMES', adulterants: ['Toxic Khesari dal substitution'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'green_gram', name: 'Green Gram (Moong)', group: 'PULSES_AND_LEGUMES', adulterants: ['Malachite green dye wash'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'black_gram', name: 'Black Gram (Urad)', group: 'PULSES_AND_LEGUMES', adulterants: ['Soapstone polishing', 'Talc'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'red_lentils', name: 'Red Lentils (Masoor)', group: 'PULSES_AND_LEGUMES', adulterants: ['Lead chromate', 'Red earth dye'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'kidney_beans', name: 'Kidney Beans (Rajma)', group: 'PULSES_AND_LEGUMES', adulterants: ['Metanil yellow dye polishing'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'soybeans', name: 'Soybeans', group: 'PULSES_AND_LEGUMES', adulterants: ['Non-edible seed pellets', 'Excess moisture'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'peas', name: 'Peas', group: 'PULSES_AND_LEGUMES', adulterants: ['Malachite green immersion dye'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'toor_dal', name: 'Toor Dal (Arhar)', group: 'PULSES_AND_LEGUMES', adulterants: ['Metanil yellow carcinogenic dye', 'Khesari dal'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },

  // SPICES (11) - ACTIVE EDGE MODELS
  { id: 'turmeric', name: 'Turmeric', group: 'SPICES', adulterants: ['Metanil yellow dye', 'Lead chromate', 'Chalk powder', 'Starch'], status: 'SUPPORTED_ACTIVE_IN_EDGE_MODEL' },
  { id: 'chilli_powder', name: 'Chilli Powder', group: 'SPICES', adulterants: ['Sudan Red dye', 'Brick powder', 'Rhodamine B', 'Sawdust'], status: 'SUPPORTED_ACTIVE_IN_EDGE_MODEL' },
  { id: 'black_pepper', name: 'Black Pepper', group: 'SPICES', adulterants: ['Papaya seeds', 'Light berries', 'Mineral oil sheen'], status: 'SUPPORTED_ACTIVE_IN_EDGE_MODEL' },
  { id: 'cumin', name: 'Cumin', group: 'SPICES', adulterants: ['Charcoal dust on grass seeds'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'coriander', name: 'Coriander', group: 'SPICES', adulterants: ['Horse feed husk', 'Sulfur fumigation'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'mustard_seeds', name: 'Mustard Seeds', group: 'SPICES', adulterants: ['Argemone mexicana seeds (toxic)'], status: 'SUPPORTED_ACTIVE_IN_EDGE_MODEL' },
  { id: 'cardamom', name: 'Cardamom', group: 'SPICES', adulterants: ['Talcum bleaching', 'Dye on exhausted pods'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'cloves', name: 'Cloves', group: 'SPICES', adulterants: ['Exhausted/distilled cloves'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'cinnamon', name: 'Cinnamon', group: 'SPICES', adulterants: ['Cassia bark (toxic coumarin)'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'fennel_seeds', name: 'Fennel Seeds', group: 'SPICES', adulterants: ['Malachite green dye bath'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'fenugreek', name: 'Fenugreek', group: 'SPICES', adulterants: ['Extraneous dirt', 'Damaged weed seeds'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },

  // OTHER FOODS (10) - ACTIVE EDGE MODELS
  { id: 'milk', name: 'Milk', group: 'OTHER_FOODS', adulterants: ['Detergent', 'Urea', 'Starch', 'Synthetic milk', 'Water dilution'], status: 'SUPPORTED_ACTIVE_IN_EDGE_MODEL' },
  { id: 'honey', name: 'Honey', group: 'OTHER_FOODS', adulterants: ['High Fructose Corn Syrup (HFCS)', 'Invert sugar syrup', 'Molasses'], status: 'SUPPORTED_ACTIVE_IN_EDGE_MODEL' },
  { id: 'cooking_oil', name: 'Cooking Oil', group: 'OTHER_FOODS', adulterants: ['Argemone oil', 'Mineral oil', 'Cheap palm oil dilution'], status: 'SUPPORTED_ACTIVE_IN_EDGE_MODEL' },
  { id: 'ghee', name: 'Ghee', group: 'OTHER_FOODS', adulterants: ['Vanaspati (Hydrogenated oil)', 'Animal body fat'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'butter', name: 'Butter', group: 'OTHER_FOODS', adulterants: ['Starch', 'Margarine substitution'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'tea_powder', name: 'Tea Powder', group: 'OTHER_FOODS', adulterants: ['Coal-tar dyes on used leaves', 'Iron filings'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'coffee_powder', name: 'Coffee Powder', group: 'OTHER_FOODS', adulterants: ['Excess chicory (>50%)', 'Date seed powder'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'sugar', name: 'Sugar', group: 'OTHER_FOODS', adulterants: ['Chalk powder', 'Washing soda crystals'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'salt', name: 'Salt', group: 'OTHER_FOODS', adulterants: ['Chalk powder', 'White stone dust'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' },
  { id: 'flour', name: 'Flour (Atta / Maida)', group: 'OTHER_FOODS', adulterants: ['Chalk powder', 'Potassium bromate bleaching'], status: 'PLANNED_REQUIRES_DATASET_TRAINING' }
];
