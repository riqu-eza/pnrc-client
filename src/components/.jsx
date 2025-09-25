<main className="p-3 max-w-4xl mx-auto">
<h1 className="text-3xl font-semibold text-center my-7">
  Create a Listing
</h1>
<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
  <div className="flex flex-col gap-4 flex-1">
    <input
      type="text"
      placeholder="Name"
      className="border p-3 rounded-lg"
      id="name"
      maxLength="62"
      minLength="5"
      required
      onChange={handleChange}
      value={formData.name}
    />
    <input
      type="text"
      placeholder="email"
      className="border p-3 rounded-lg"
      id="email"
      required
      onChange={handleChange}
      value={formData.email}
    />
    {/* <PhoneInput
    id="contact"
    placeholder="Enter phone number"
    value={formData.contact}
    onChange={handleChange}
    defaultCountry="UG" 
    >

    </PhoneInput> */}
    <input
      type="number"
      placeholder="Contact"
      className="border p-3 rounded-lg"
      id="contact"
      maxLength="62"
      minLength="10"
      required
      onChange={handleChange}
      value={formData.contact}
    />

    <textarea
      type="text"
      placeholder="Description"
      className="border p-3 rounded-lg"
      id="description"
      required
      onChange={handleChange}
      value={formData.description}
    />
    <input
      type="text"
      placeholder="Address"
      className="border p-3 rounded-lg"
      id="address"
      required
      onChange={handleChange}
      value={formData.address}
    />
    <div className="county-selector">
      <select
        value={formData.selectedCounty}
        onChange={handleCountyChange}
      >
        <option value="">Select resort-city</option>
        {countiesInKenya.map((county, index) => (
          <option key={index} value={county.newcity}>
            {county.newcity}
          </option>
        ))}
      </select>
      {/* <p>Selected County: {selectedCounty}</p> */}
    </div>
    <div>
      <select
        value={formData.selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value="">Select Category</option>
        {Object.keys(categoriesData).map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      {formData.selectedCategory && (
        <div>
          <select
            value={formData.selectedSubcategory}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
          >
            <option value="">Select Subcategory</option>
            {categoriesData[formData.selectedCategory]?.map(
              (subcategory, index) => (
                <option key={index} value={subcategory}>
                  {subcategory}
                </option>
              )
            )}
          </select>
        </div>
      )}
    </div>
  </div>

  <div className="flex flex-col gap-4 flex-1">
  <input

      onChange={handleChange}
      value={formData.productName}
      className="p-2 border border-gray-300 rounded w-full"
      placeholder="Product Name"
    type="text"
    id="productName"
  />
  <textarea
      onChange={handleChange}
      value={formData.productdescription}
      className="p-3 border border-gray-300 rounded w-full"
      placeholder="Product description"
      id="productdescription"
    />
    <input
      onChange={handleChange}
      value={formData.productprice}
      className="p-3 border border-gray-300 rounded w-full"
      placeholder="Product price"
      type="number"
      id="productprice"

    />
    <div className="flex gap-4">
      <input
        onChange={(e) => setFiles(e.target.files)}
        className="p-3 border border-gray-300 rounded w-full"
        type="file"
        id="images"
        accept="image/*"
        multiple
      />
      <button
        disabled={uploading}
        type="button"
        onClick={handleImageSubmit}
        className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
      >
        {uploading ? "uploading" : "upload"}
      </button>
    </div>
    <p className="text-red-700 text-sm">
      {imageUploadError && imageUploadError}
    </p>
    {formData.imageUrls.length > 0 &&
      formData.imageUrls.map((url, index) => (
        <div
          key={url}
          className="flex justify-between p-3 border items-center"
        >
          <img
            src={url}
            alt="listing image"
            className="w-20 h-20 object-contain rounded-lg"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
          >
            Delete
          </button>
        </div>
      ))}
    <div className="relative">
      <button type="button" onClick={handleLocationChange}>
        Pin location
      </button>
    </div>



    <button
      disabled={loading || uploading}
      className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
    >
      {loading ? "Creating..." : "Create listing"}
    </button>
    {error && <p className="text-red-700 text-sm">{error}</p>}
  </div>
  {/* <div className="flex flex-col gap-4 flex-1">
    <textarea
      onChange={(e) => setProductName(e.target.value)}
      value={formData.productName}
      className="p-3 border border-gray-300 rounded w-full"
      placeholder="Product Name"
    />
    <div className="flex gap-4 items-center">
      <input
        onChange={(e) => setFiles(e.target.files)}
        className="hidden"
        type="file"
        id="images"
        accept="image/*"
        multiple
      />
      <label
        htmlFor="images"
        className="p-3 border border-gray-300 rounded cursor-pointer"
      >
        Choose Product Image
      </label>
      {formData.imageUrls.length > 0 &&
        formData.imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt="listing image"
            className="w-20 h-20 object-contain rounded-lg"
          />
        ))}
    </div>
    <input
      onChange={(e) => setPrice(e.target.value)}
      value={formData.productprice}
      className="p-3 border border-gray-300 rounded w-full"
      type="number"
      placeholder="Price"
    />
    <textarea
      onChange={(e) => setDescription(e.target.value)}
      value={formData.productdescription}
      className="p-3 border border-gray-300 rounded w-full"
      placeholder="Product Description"
    />
    <button
      disabled={loading || uploading}
      className="p-3 bg-slate-700 text-black rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
    >
      {loading ? "Creating..." : "Create Listing"}
    </button>
    {error && <p className="text-red-700 text-sm">{error}</p>}
  </div> */}

</form>
</main>