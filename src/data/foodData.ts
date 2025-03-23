
import { CsvData } from '@/types';

// CSV data in structured format
export const foodCsvData: CsvData[] = [
  {
    Name: "Beef Gyro Bowl",
    Location: "North",
    Sub_Location: "HALAL CART- AVAILABLE 2PM-10PM",
    Time: "Lunch",
    Longitude: "-77.866049",
    Latitude: "40.802696",
    Allergens: "['Dairy', ' Eggs', ' Soy', ' Wheat/Gluten', ' Sesame']",
    Full_Ingredients: "Beef Gyro Bowl (Turmeric Basmati Rice (Basmati Rice, Water, Canola Oil, Garlic, Turmeric, Cinnamon, Salt), Gyro (halal beef, cereal, (corn, wheat, rye flours), water, lamb, spices, monosodium glutamate, dehydrated onion, dehydrated garlic, maltodextrin), salt, lemon juice concentrate, breadcrumbs (wheat flour, dextrose, salt, yeast), soy protein concentrate, spice (onion powder, garlic powder), soybean oil. ), Tzatziki Dip (Cucumbers, Vegetarian Plain Yogurt (cultured skim milk, cream, pectin, sugar), Sour Cream (cultured milk and cream, non-fat dry milk, locust bean gum, carrageenan with dextrose ), Lemon Juice (water, concentrated lemon juice, sodium bisulfite, sodium benzoate, lemon oil), Apple Cider Vinegar (apple cider vinegar (water, 5% acidity)), Olive Oil, Mint, Salt, Garlic, Black Pepper), Shredded Lettuce (Lettuce), Naan Bread (Naan Bread (unbleached unbromated enriched flour (niacin, reduced iron, thiamin, riboflavin, folic acid), water and soybean oil, contains 2% or less of: calcium proprionate (a preservative), dextrose, fumaric acid, guar gum, lactic acid, maltodextrin, monocalcium phsophate, natural flavors, salt, sesame flour, sodium bicarbonate, sorbic acid, soy flour, soy protein concentrate, sugar, vegetable mono and diglycerides, wheat enzymes, whole wheat flour, yeast, organic olive oil, sunflower oil, leavening (, xanthan gum, vinegar, ascorbic acid butter milk, canola oil, eggs, sugar, baking powder, ghee, dextrin, vegetable oil, thiamine mononitrate, oat fiber, pyrophosphate )), Diced Tomatoes (Tomatoes))",
    Embedding: "[ 1.458772    0.523057    1.032122    1.3857886   0.81429714  0.8534923  1.6789116  -1.5604829   0.6437137   0.5130611  -0.3211302   0.6654718 -0.23116347 -1.2812496  -0.62589306  0.554978   -0.12525101  0.17251714 -0.6911587   0.33267054  2.1037908  -0.23075368 -0.6746779   1.9050956  0.9873268   2.1070874   0.8796924   1.167655    0.8102086  -0.25712374 -1.3270152  -0.5792527   1.560487    0.01219973 -0.28354037  2.7097838  1.541131    1.4861652   0.08173865  0.81143045 -0.9833151  -0.6635944 -1.9702522   0.74797183 -0.45552614 -2.22747    -0.7140543  -0.7174535  0.5877655  -0.78849494  1.7946235   0.9608868   0.07993834  0.05872396 -1.35667     0.45770264 -0.8815893   0.272851   -0.5416725  -0.7750549  0.43418583  1.3819361   1.6650151   1.6404651  -0.06145239  1.9611471 -1.564478   -0.6619181   0.9221312  -1.8881862   0.23312199 -2.1688256  0.08255116 -0.01750468 -1.2574841  -0.6626318  -1.9610441  -1.778732  0.5932092   0.154455    0.90763694 -0.14451694 -1.5780455  -1.2885857 -1.5164812   1.8322053   0.4988096   0.34416234  0.10695233 -1.6759199  0.20301177  1.0754325   0.8159808   0.9277081  -0.9544613   1.487322  2.239354    0.6153277  -0.9494604  -0.7839992 ]",
    Price: "10.99"
  },
  {
    Name: "Veggie Bowl",
    Location: "South",
    Sub_Location: "Fresh Greens",
    Time: "All Day",
    Longitude: "-77.863256",
    Latitude: "40.797845",
    Allergens: "[]",
    Full_Ingredients: "Mixed greens, avocado, carrots, cucumber, cherry tomatoes, quinoa, chickpeas, lemon tahini dressing (tahini, lemon juice, olive oil, garlic, salt, pepper)",
    Embedding: "[ 0.45877253 -0.52305734  0.03212233  0.38578892  0.8142971   0.8534923  0.67891162 -0.56048292  0.6437137   0.5130611  -0.3211302   0.6654718 -0.2311635  -0.28124958 -0.62589306  0.554978   -0.12525101  0.17251714 -0.6911587   0.33267054  0.10379082 -0.23075368 -0.6746779   0.90509564 0.9873268   0.10708738  0.8796924   0.167655    0.8102086  -0.25712374 -0.32701525 -0.5792527   0.56048703  0.01219973 -0.28354037  0.7097838  0.54113096  0.48616517  0.08173865  0.81143045 -0.9833151  -0.6635944 -0.97025216  0.74797183 -0.45552614 -0.22747004 -0.7140543  -0.7174535  0.5877655  -0.78849494  0.79462349  0.9608868   0.07993834  0.05872396 -0.35667002  0.45770264 -0.8815893   0.272851   -0.5416725  -0.7750549  0.43418583  0.38193607  0.66501504  0.64046514 -0.06145239  0.9611471 -0.56447804 -0.6619181   0.9221312  -0.88818622  0.23312199 -0.16882562 0.08255116 -0.01750468 -0.25748408 -0.6626318  -0.9610441  -0.77873201 0.5932092   0.154455    0.90763694 -0.14451694 -0.57804549 -0.28858566 -0.51648122  0.83220529  0.4988096   0.34416234  0.10695233 -0.67591989 0.20301177  0.0754325   0.81598079  0.9277081  -0.9544613   0.487322   0.2393543   0.6153277  -0.9494604  -0.78399915]",
    Price: "8.99"
  },
  {
    Name: "Margherita Pizza",
    Location: "Central",
    Sub_Location: "Pizza Station",
    Time: "Lunch,Dinner",
    Longitude: "-77.862105",
    Latitude: "40.798321",
    Allergens: "['Dairy', 'Wheat/Gluten']",
    Full_Ingredients: "Pizza dough (wheat flour, water, yeast, salt, olive oil), tomato sauce (tomatoes, garlic, basil, salt), fresh mozzarella cheese, fresh basil leaves, olive oil",
    Embedding: "[ 0.58772534  0.52305741  0.03212233  0.38578892  0.1429714   0.8534923  0.67891162 -0.56048292  0.6437137   0.5130611  -0.3211302   0.6654718 -0.2311635  -0.28124958 -0.62589306  0.554978   -0.12525101  0.17251714 -0.6911587   0.33267054  0.10379082 -0.23075368 -0.6746779   0.90509564 0.9873268   0.10708738  0.8796924   0.167655    0.8102086  -0.25712374 -0.32701525 -0.5792527   0.56048703  0.01219973 -0.28354037  0.7097838  0.54113096  0.48616517  0.08173865  0.81143045 -0.9833151  -0.6635944 -0.97025216  0.74797183 -0.45552614 -0.22747004 -0.7140543  -0.7174535  0.5877655  -0.78849494  0.79462349  0.9608868   0.07993834  0.05872396 -0.35667002  0.45770264 -0.8815893   0.272851   -0.5416725  -0.7750549  0.43418583  0.38193607  0.66501504  0.64046514 -0.06145239  0.9611471 -0.56447804 -0.6619181   0.9221312  -0.88818622  0.23312199 -0.16882562 0.08255116 -0.01750468 -0.25748408 -0.6626318  -0.9610441  -0.77873201 0.5932092   0.154455    0.90763694 -0.14451694 -0.57804549 -0.28858566 -0.51648122  0.83220529  0.4988096   0.34416234  0.10695233 -0.67591989 0.20301177  0.0754325   0.81598079  0.9277081  -0.9544613   0.487322   0.2393543   0.6153277  -0.9494604  -0.78399915]",
    Price: "7.50"
  },
  {
    Name: "Chicken Caesar Wrap",
    Location: "West",
    Sub_Location: "Deli Station",
    Time: "Lunch",
    Longitude: "-77.868123",
    Latitude: "40.799456",
    Allergens: "['Dairy', 'Eggs', 'Wheat/Gluten']",
    Full_Ingredients: "Grilled chicken breast, romaine lettuce, parmesan cheese, caesar dressing (vegetable oil, water, parmesan cheese, vinegar, egg yolk, salt, garlic, lemon juice, spices), flour tortilla",
    Embedding: "[ 0.45877253  0.5230574   1.0321223   1.3857889   0.81429714  0.8534923  1.6789116  -1.5604829   0.6437137   0.5130611  -0.3211302   0.6654718 -0.23116347 -1.2812496  -0.62589306  0.554978   -0.12525101  0.17251714 -0.6911587   0.33267054  2.1037908  -0.23075368 -0.6746779   1.9050956  0.9873268   2.1070874   0.8796924   1.167655    0.8102086  -0.25712374 -1.3270152  -0.5792527   1.560487    0.01219973 -0.28354037  2.7097838  1.541131    1.4861652   0.08173865  0.81143045 -0.9833151  -0.6635944 -1.9702522   0.74797183 -0.45552614 -2.22747    -0.7140543  -0.7174535  0.5877655  -0.78849494  1.7946235   0.9608868   0.07993834  0.05872396 -1.35667     0.45770264 -0.8815893   0.272851   -0.5416725  -0.7750549  0.43418583  1.3819361   1.6650151   1.6404651  -0.06145239  1.9611471 -1.564478   -0.6619181   0.9221312  -1.8881862   0.23312199 -2.1688256  0.08255116 -0.01750468 -1.2574841  -0.6626318  -1.9610441  -1.778732   0.5932092   0.154455    0.90763694 -0.14451694 -1.5780455  -1.2885857 -1.5164812   1.8322053   0.4988096   0.34416234  0.10695233 -1.6759199  0.20301177  1.0754325   0.8159808   0.9277081  -0.9544613   1.487322   2.239354    0.6153277  -0.9494604  -0.7839992 ]",
    Price: "9.49"
  }
  // Add more food items as needed
];
