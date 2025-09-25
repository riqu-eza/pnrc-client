import { useState } from 'react';
import SubcategoryForm from './SubcategoryForm';
import categoriesData from '../utility/CategoryData';

// eslint-disable-next-line react/prop-types
const CategoryForm = ({ setCategories }) => {
  const [categories, setLocalCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleAddCategory = () => {
    if (selectedCategory) {
      setLocalCategories((prev) => [
        ...prev,
        { category: selectedCategory, subcategories: [] }, // Initialize with empty subcategories
      ]);
      setSelectedCategory('');
    }
  };

  const updateSubcategories = (index, subcategories) => {
    const newCategories = [...categories];
    newCategories[index].subcategories = subcategories;  // Update subcategories at the correct index
    setLocalCategories(newCategories);  // Update local state
    setCategories(newCategories);  // Pass updated categories to parent component
  };

  return (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Categories</h3>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select a Category</option>
        {Object.keys(categoriesData).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleAddCategory}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Add Category
      </button>

      <div className="space-y-4">
        {categories.map((cat, index) => (
          <SubcategoryForm
            key={index}
            category={cat.category}
            subcategories={cat.subcategories}
            availableSubcategories={categoriesData[cat.category]}  
            setSubcategories={(subs) => updateSubcategories(index, subs)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryForm;
