package com.nutriscanai.app.data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Central Food Category Registry holding 78 commodities across 6 groups.
 */
public class FoodCategoryRegistry {

    public static class FoodItem {
        public String id;
        public String name;
        public String group;
        public String[] adulterants;
        public boolean isActiveInEdgeModel;

        public FoodItem(String id, String name, String group, String[] adulterants, boolean isActiveInEdgeModel) {
            this.id = id;
            this.name = name;
            this.group = group;
            this.adulterants = adulterants;
            this.isActiveInEdgeModel = isActiveInEdgeModel;
        }
    }

    private static final List<FoodItem> ITEMS = new ArrayList<>();

    static {
        // Active Edge Models
        ITEMS.add(new FoodItem("milk", "Milk", "OTHER_FOODS", new String[]{"Detergent", "Urea", "Starch", "Water dilution"}, true));
        ITEMS.add(new FoodItem("honey", "Honey", "OTHER_FOODS", new String[]{"Corn syrup (HFCS)", "Invert sugar", "Jaggery"}, true));
        ITEMS.add(new FoodItem("turmeric", "Turmeric", "SPICES", new String[]{"Metanil yellow dye", "Lead chromate", "Chalk powder"}, true));
        ITEMS.add(new FoodItem("chilli_powder", "Chilli Powder", "SPICES", new String[]{"Sudan Red dye", "Brick powder", "Rhodamine B"}, true));
        ITEMS.add(new FoodItem("black_pepper", "Black Pepper", "SPICES", new String[]{"Papaya seeds", "Light berries"}, true));
        ITEMS.add(new FoodItem("mustard_seeds", "Mustard Seeds", "SPICES", new String[]{"Argemone mexicana seeds"}, true));
        ITEMS.add(new FoodItem("cooking_oil", "Cooking Oil", "OTHER_FOODS", new String[]{"Argemone oil", "Mineral oil"}, true));

        // Fruits (Planned)
        String[] fruits = {"Apple", "Banana", "Orange", "Mango", "Grapes", "Strawberry", "Blueberry", "Pomegranate",
                "Watermelon", "Pineapple", "Papaya", "Guava", "Lemon", "Pear", "Dragon Fruit", "Jackfruit",
                "Coconut", "Kiwi", "Peach", "Plum", "Avocado"};
        for (String f : fruits) {
            ITEMS.add(new FoodItem(f.toLowerCase().replace(" ", "_"), f, "FRUITS", new String[]{"Calcium carbide", "Artificial wax"}, false));
        }

        // Vegetables (Planned)
        String[] vegs = {"Tomato", "Carrot", "Potato", "Onion", "Garlic", "Spinach", "Broccoli", "Cabbage",
                "Cauliflower", "Cucumber", "Brinjal", "Capsicum", "Green Chilli", "Beetroot", "Radish", "Pumpkin",
                "Bitter Gourd", "Okra", "Sweet Potato"};
        for (String v : vegs) {
            ITEMS.add(new FoodItem(v.toLowerCase().replace(" ", "_"), v, "VEGETABLES", new String[]{"Malachite green dye", "Copper sulfate"}, false));
        }

        // Grains and Cereals (Planned)
        String[] grains = {"Rice", "Wheat", "Maize", "Oats", "Barley", "Millet", "Ragi", "Sorghum", "Quinoa"};
        for (String g : grains) {
            ITEMS.add(new FoodItem(g.toLowerCase().replace(" ", "_"), g, "GRAINS_AND_CEREALS", new String[]{"Talc polish", "Chalk dust"}, false));
        }

        // Pulses and Legumes (Planned)
        String[] pulses = {"Chickpeas", "Green Gram", "Black Gram", "Red Lentils", "Kidney Beans", "Soybeans", "Peas", "Toor Dal"};
        for (String p : pulses) {
            ITEMS.add(new FoodItem(p.toLowerCase().replace(" ", "_"), p, "PULSES_AND_LEGUMES", new String[]{"Khesari dal substitution", "Metanil yellow"}, false));
        }
    }

    public static List<FoodItem> getAllItems() {
        return Collections.unmodifiableList(ITEMS);
    }
}
