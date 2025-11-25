// src/components/admin/Product.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  clearProductMessages,
  uploadProductImage,
} from "../../redux/ProductSlice";

const BRAND = "#c46c39";

const initialForm = {
  // BASIC
  productId: "",
  name: "",
  description: "",
  gender: "Unisex",
  isActive: true,

  // CATEGORY / COLLECTION
  categoryIdsInput: "",
  subCategoryIdsInput: "",
  collectionIdsInput: "",

  // CUSTOMIZATION
  hasColorOptions: false,
  colors: [], // { name, hexCode, file, imageUrl, imagePublicId, uploading }
  hasSizeOptions: false,
  sizesInput: "", // "6,7,8"
  hasStoneTypeOptions: false,
  stoneTypes: [], // { type, label, isAvailable }

  // WEIGHTS & COUNTS
  goldWeight: "",
  diamondWeight: "",
  netWeight: "",
  solitareWeight: "",
  noOfSolitaires: "",
  noOfMultiDiamonds: "",
  multiDiamondWeight: "",
  totalKaratsInput: "", // "9,14,18"
  noOfPointers: "",
  pointersWeight: "",
  gemStoneWeightSol: "",
  gemStoneWeightPointer: "",
  quantitySold: "",

  // DESIGN
  shapeOfSolitare: "",
  shapeOfMultiDiamonds: "",
  shapeOfPointers: "",
  gemStoneColourInput: "", // "Blue,Green"

  // FLAGS
  isPendantFixed: false,
  containsGemstone: false,
  isMrpProduct: false,

  // IMAGES
  images: [], // { file, url, publicId, uploading }

  // VARIANTS
  variants: [], // { karat, stoneType, sku, price, stock, grossWeight, isAvailable }
};

const steps = [
  "Basic Details",
  "Categories",
  "Customization Options",
  "Weights & Counts",
  "Design & Flags",
  "Images",
  "Variants",
];

const Product = () => {
  const dispatch = useDispatch();
  const { products, loading, error, success } = useSelector(
    (state) => state.products
  );

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => dispatch(clearProductMessages()), 1500);
      return () => clearTimeout(t);
    }
  }, [success, dispatch]);

  // Extract publicId from Cloudinary URL
  const extractPublicId = (url) => {
    if (!url) return "";
    const match = url.match(/\/upload\/v\d+\/(.+)\.(\w+)$/);
    return match ? match[1] : "";
  };

  // Helpers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addColor = () => {
    setForm((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          name: "",
          hexCode: "#FFD700",
          file: null,
          imageUrl: "",
          imagePublicId: "",
          uploading: false,
        },
      ],
    }));
  };

  const updateColor = (idx, key, value) => {
    setForm((prev) => {
      const updated = [...prev.colors];
      updated[idx] = { ...updated[idx], [key]: value };
      return { ...prev, colors: updated };
    });
  };

  const handleColorImageUpload = async (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => {
      const colors = [...prev.colors];
      colors[idx].uploading = true;
      colors[idx].file = file;
      return { ...prev, colors };
    });

    try {
      const result = await dispatch(uploadProductImage(file)).unwrap();
      const url = result[0];
      const publicId = extractPublicId(url);

      setForm((prev) => {
        const colors = [...prev.colors];
        colors[idx].imageUrl = url;
        colors[idx].imagePublicId = publicId;
        colors[idx].file = null;
        colors[idx].uploading = false;
        return { ...prev, colors };
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setForm((prev) => {
        const colors = [...prev.colors];
        colors[idx].uploading = false;
        colors[idx].file = null;
        return { ...prev, colors };
      });
      // Optionally show error toast
    }
  };

  const removeColor = (idx) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx),
    }));
  };

  const addStoneType = () => {
    setForm((prev) => ({
      ...prev,
      stoneTypes: [
        ...prev.stoneTypes,
        { type: "regular_diamond", label: "", isAvailable: true },
      ],
    }));
  };

  const updateStoneType = (idx, key, value) => {
    setForm((prev) => {
      const updated = [...prev.stoneTypes];
      updated[idx] = { ...updated[idx], [key]: value };
      return { ...prev, stoneTypes: updated };
    });
  };

  const removeStoneType = (idx) => {
    setForm((prev) => ({
      ...prev,
      stoneTypes: prev.stoneTypes.filter((_, i) => i !== idx),
    }));
  };

  const addImage = () => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { file: null, url: "", publicId: "", uploading: false }],
    }));
  };

  const handleImageUpload = async (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => {
      const images = [...prev.images];
      images[idx].uploading = true;
      images[idx].file = file;
      return { ...prev, images };
    });

    try {
      const result = await dispatch(uploadProductImage(file)).unwrap();
      const url = result[0];
      const publicId = extractPublicId(url);

      setForm((prev) => {
        const images = [...prev.images];
        images[idx].url = url;
        images[idx].publicId = publicId;
        images[idx].file = null;
        images[idx].uploading = false;
        return { ...prev, images };
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setForm((prev) => {
        const images = [...prev.images];
        images[idx].uploading = false;
        images[idx].file = null;
        return { ...prev, images };
      });
      // Optionally show error toast
    }
  };

  const removeImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          karat: 14,
          stoneType: "regular_diamond",
          sku: "",
          price: "",
          stock: "",
          grossWeight: "",
          isAvailable: true,
        },
      ],
    }));
  };

  const updateVariant = (idx, key, value) => {
    setForm((prev) => {
      const updated = [...prev.variants];
      updated[idx] = { ...updated[idx], [key]: value };
      return { ...prev, variants: updated };
    });
  };

  const removeVariant = (idx) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  const nextStep = () => {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const parseCSV = (str) =>
    str
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  const toNumber = (v) => (v === "" || v === null ? 0 : Number(v));

  const buildPayload = () => {
    return {
      productId: form.productId,
      name: form.name,
      description: form.description,
      gender: form.gender,
      isActive: form.isActive,

      categoryIds: parseCSV(form.categoryIdsInput),
      subCategoryIds: parseCSV(form.subCategoryIdsInput),
      collectionIds: parseCSV(form.collectionIdsInput),

      customizationOptions: {
        hasColorOptions: form.hasColorOptions,
        colors: form.colors
          .filter((c) => c.imageUrl && c.imagePublicId)
          .map((c) => ({
            name: c.name,
            hexCode: c.hexCode,
            imageUrls: [{ url: c.imageUrl, publicId: c.imagePublicId }],
          })),
        hasSizeOptions: form.hasSizeOptions,
        sizes: parseCSV(form.sizesInput),
        hasStoneTypeOptions: form.hasStoneTypeOptions,
        stoneTypes: form.stoneTypes.map((s) => ({
          type: s.type,
          label: s.label,
          isAvailable: !!s.isAvailable,
        })),
      },

      goldWeight: toNumber(form.goldWeight),
      diamondWeight: toNumber(form.diamondWeight),
      netWeight: toNumber(form.netWeight),
      solitareWeight: toNumber(form.solitareWeight),
      noOfSolitaires: toNumber(form.noOfSolitaires),
      noOfMultiDiamonds: toNumber(form.noOfMultiDiamonds),
      multiDiamondWeight: toNumber(form.multiDiamondWeight),
      totalKarats: parseCSV(form.totalKaratsInput).map((k) => Number(k)),
      noOfPointers: toNumber(form.noOfPointers),
      pointersWeight: toNumber(form.pointersWeight),
      gemStoneWeightSol: toNumber(form.gemStoneWeightSol),
      gemStoneWeightPointer: toNumber(form.gemStoneWeightPointer),
      quantitySold: toNumber(form.quantitySold),

      shapeOfSolitare: form.shapeOfSolitare,
      shapeOfMultiDiamonds: form.shapeOfMultiDiamonds,
      shapeOfPointers: form.shapeOfPointers,
      gemStoneColour: parseCSV(form.gemStoneColourInput),

      isPendantFixed: form.isPendantFixed,
      containsGemstone: form.containsGemstone,
      isMrpProduct: form.isMrpProduct,

      imageUrl: form.images
        .filter((i) => i.url && i.publicId)
        .map((i) => ({ url: i.url, publicId: i.publicId })),

      variants: form.variants.map((v) => ({
        karat: Number(v.karat),
        stoneType: v.stoneType,
        sku: v.sku,
        price: toNumber(v.price),
        stock: toNumber(v.stock),
        grossWeight: toNumber(v.grossWeight),
        isAvailable: !!v.isAvailable,
      })),
    };
  };

  const handleSubmit = async () => {
    const payload = buildPayload();

    if (editId) {
      await dispatch(updateProduct({ id: editId, body: payload }));
    } else {
      await dispatch(createProduct(payload));
    }
    await dispatch(getAllProducts());
    setForm(initialForm);
    setEditId(null);
    setStep(0);
  };

  const handleEdit = (p) => {
    setForm({
      // BASIC
      productId: p.productId || "",
      name: p.name || "",
      description: p.description || "",
      gender: p.gender || "Unisex",
      isActive: p.isActive ?? true,

      // CATEGORY / COLLECTION
      categoryIdsInput: (p.categoryIds || []).join(","),
      subCategoryIdsInput: (p.subCategoryIds || []).join(","),
      collectionIdsInput: (p.collectionIds || []).join(","),

      // CUSTOMIZATION
      hasColorOptions: p.customizationOptions?.hasColorOptions ?? false,
      colors:
        p.customizationOptions?.colors?.map((c) => ({
          name: c.name,
          hexCode: c.hexCode || "#FFD700",
          file: null,
          imageUrl: c.imageUrls?.[0]?.url || "",
          imagePublicId: c.imageUrls?.[0]?.publicId || "",
          uploading: false,
        })) || [],
      hasSizeOptions: p.customizationOptions?.hasSizeOptions ?? false,
      sizesInput: (p.customizationOptions?.sizes || []).join(","),
      hasStoneTypeOptions: p.customizationOptions?.hasStoneTypeOptions ?? false,
      stoneTypes:
        p.customizationOptions?.stoneTypes?.map((s) => ({
          type: s.type,
          label: s.label,
          isAvailable: s.isAvailable,
        })) || [],

      // WEIGHTS & COUNTS
      goldWeight: p.goldWeight ?? "",
      diamondWeight: p.diamondWeight ?? "",
      netWeight: p.netWeight ?? "",
      solitareWeight: p.solitareWeight ?? "",
      noOfSolitaires: p.noOfSolitaires ?? "",
      noOfMultiDiamonds: p.noOfMultiDiamonds ?? "",
      multiDiamondWeight: p.multiDiamondWeight ?? "",
      totalKaratsInput: (p.totalKarats || []).join(","),
      noOfPointers: p.noOfPointers ?? "",
      pointersWeight: p.pointersWeight ?? "",
      gemStoneWeightSol: p.gemStoneWeightSol ?? "",
      gemStoneWeightPointer: p.gemStoneWeightPointer ?? "",
      quantitySold: p.quantitySold ?? "",

      // DESIGN
      shapeOfSolitare: p.shapeOfSolitare || "",
      shapeOfMultiDiamonds: p.shapeOfMultiDiamonds || "",
      shapeOfPointers: p.shapeOfPointers || "",
      gemStoneColourInput: (p.gemStoneColour || []).join(","),

      // FLAGS
      isPendantFixed: p.isPendantFixed ?? false,
      containsGemstone: p.containsGemstone ?? false,
      isMrpProduct: p.isMrpProduct ?? false,

      // IMAGES
      images:
        (p.imageUrl || []).map((img) => ({
          file: null,
          url: img.url,
          publicId: img.publicId,
          uploading: false,
        })) || [],

      // VARIANTS
      variants:
        (p.variants || []).map((v) => ({
          karat: v.karat,
          stoneType: v.stoneType || "regular_diamond",
          sku: v.sku,
          price: v.price,
          stock: v.stock,
          grossWeight: v.grossWeight,
          isAvailable: v.isAvailable,
        })) || [],
    });

    setEditId(p._id);
    setStep(0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    await dispatch(deleteProduct(id));
    dispatch(getAllProducts());
  };

  // STEP CONTENTS
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product ID"
              name="productId"
              value={form.productId}
              onChange={handleChange}
              required
            />
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextArea
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="md:col-span-2"
            />
            <Select
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={["Male", "Female", "Unisex"]}
            />
            <Toggle
              label="Active Product"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Category IDs (comma-separated ObjectIds)"
              name="categoryIdsInput"
              value={form.categoryIdsInput}
              onChange={handleChange}
            />
            <Input
              label="Sub Category IDs (comma-separated ObjectIds)"
              name="subCategoryIdsInput"
              value={form.subCategoryIdsInput}
              onChange={handleChange}
            />
            <Input
              label="Collection IDs (comma-separated ObjectIds)"
              name="collectionIdsInput"
              value={form.collectionIdsInput}
              onChange={handleChange}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* Color Options */}
            <CardSection title="Color Options">
              <Toggle
                label="Enable Color Options"
                name="hasColorOptions"
                checked={form.hasColorOptions}
                onChange={handleChange}
              />
              {form.hasColorOptions && (
                <>
                  <button
                    type="button"
                    onClick={addColor}
                    className="mt-3 px-3 py-1.5 text-sm rounded border"
                  >
                    + Add Color
                  </button>
                  <div className="mt-4 grid gap-4">
                    {form.colors.map((c, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-4 gap-3 border rounded p-3"
                      >
                        <Input
                          label="Name"
                          value={c.name}
                          onChange={(e) =>
                            updateColor(idx, "name", e.target.value)
                          }
                        />
                        <Input
                          label="Hex Code"
                          value={c.hexCode}
                          onChange={(e) =>
                            updateColor(idx, "hexCode", e.target.value)
                          }
                        />
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Color Image
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleColorImageUpload(idx, e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          {c.uploading && (
                            <p className="text-xs text-blue-600 mt-1">Uploading...</p>
                          )}
                          {c.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={c.imageUrl}
                                alt="Color preview"
                                className="w-16 h-16 object-cover rounded"
                              />
                              <p className="text-xs text-gray-500 mt-1 truncate max-w-[120px]">
                                {c.imageUrl}
                              </p>
                              <p className="text-xs text-gray-400">
                                ID: {c.imagePublicId}
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeColor(idx)}
                          className="text-red-600 text-sm mt-1 md:col-span-4 text-left"
                        >
                          Remove Color
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardSection>

            {/* Size Options */}
            <CardSection title="Size Options">
              <Toggle
                label="Enable Size Options"
                name="hasSizeOptions"
                checked={form.hasSizeOptions}
                onChange={handleChange}
              />
              {form.hasSizeOptions && (
                <Input
                  label="Sizes (comma-separated, e.g. 6,7,8,9)"
                  name="sizesInput"
                  value={form.sizesInput}
                  onChange={handleChange}
                  className="mt-3"
                />
              )}
            </CardSection>

            {/* Stone Type Options */}
            <CardSection title="Stone Type Options">
              <Toggle
                label="Enable Stone Type Options"
                name="hasStoneTypeOptions"
                checked={form.hasStoneTypeOptions}
                onChange={handleChange}
              />
              {form.hasStoneTypeOptions && (
                <>
                  <button
                    type="button"
                    onClick={addStoneType}
                    className="mt-3 px-3 py-1.5 text-sm rounded border"
                  >
                    + Add Stone Type
                  </button>
                  <div className="mt-4 grid gap-4">
                    {form.stoneTypes.map((s, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-4 gap-3 border rounded p-3"
                      >
                        <Select
                          label="Type"
                          value={s.type}
                          onChange={(e) =>
                            updateStoneType(idx, "type", e.target.value)
                          }
                          options={[
                            "regular_diamond",
                            "gemstone",
                            "colored_diamond",
                          ]}
                        />
                        <Input
                          label="Label"
                          value={s.label}
                          onChange={(e) =>
                            updateStoneType(idx, "label", e.target.value)
                          }
                        />
                        <Toggle
                          label="Available"
                          checked={s.isAvailable}
                          onChange={(e) =>
                            updateStoneType(
                              idx,
                              "isAvailable",
                              e.target.checked
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removeStoneType(idx)}
                          className="text-red-600 text-sm mt-1 md:col-span-4 text-left"
                        >
                          Remove Stone Type
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardSection>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Gold Weight"
              name="goldWeight"
              type="number"
              value={form.goldWeight}
              onChange={handleChange}
            />
            <Input
              label="Diamond Weight"
              name="diamondWeight"
              type="number"
              value={form.diamondWeight}
              onChange={handleChange}
            />
            <Input
              label="Net Weight"
              name="netWeight"
              type="number"
              required
              value={form.netWeight}
              onChange={handleChange}
            />
            <Input
              label="Solitaire Weight"
              name="solitareWeight"
              type="number"
              value={form.solitareWeight}
              onChange={handleChange}
            />
            <Input
              label="No. of Solitaires"
              name="noOfSolitaires"
              type="number"
              value={form.noOfSolitaires}
              onChange={handleChange}
            />
            <Input
              label="No. of Multi Diamonds"
              name="noOfMultiDiamonds"
              type="number"
              value={form.noOfMultiDiamonds}
              onChange={handleChange}
            />
            <Input
              label="Multi Diamond Weight"
              name="multiDiamondWeight"
              type="number"
              value={form.multiDiamondWeight}
              onChange={handleChange}
            />
            <Input
              label="Total Karats (comma-separated, e.g. 9,14,18)"
              name="totalKaratsInput"
              value={form.totalKaratsInput}
              onChange={handleChange}
            />
            <Input
              label="Pointers Weight"
              name="pointersWeight"
              type="number"
              value={form.pointersWeight}
              onChange={handleChange}
            />
            <Input
              label="No. of Pointers"
              name="noOfPointers"
              type="number"
              value={form.noOfPointers}
              onChange={handleChange}
            />
            <Input
              label="Gemstone Weight (Solitaire)"
              name="gemStoneWeightSol"
              type="number"
              value={form.gemStoneWeightSol}
              onChange={handleChange}
            />
            <Input
              label="Gemstone Weight (Pointers)"
              name="gemStoneWeightPointer"
              type="number"
              value={form.gemStoneWeightPointer}
              onChange={handleChange}
            />
            <Input
              label="Quantity Sold (optional)"
              name="quantitySold"
              type="number"
              value={form.quantitySold}
              onChange={handleChange}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <CardSection title="Design Attributes">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Shape of Solitaire"
                  name="shapeOfSolitare"
                  value={form.shapeOfSolitare}
                  onChange={handleChange}
                />
                <Input
                  label="Shape of Multi Diamonds"
                  name="shapeOfMultiDiamonds"
                  value={form.shapeOfMultiDiamonds}
                  onChange={handleChange}
                />
                <Input
                  label="Shape of Pointers"
                  name="shapeOfPointers"
                  value={form.shapeOfPointers}
                  onChange={handleChange}
                />
                <Input
                  label="Gem Stone Colours (comma-separated)"
                  name="gemStoneColourInput"
                  value={form.gemStoneColourInput}
                  onChange={handleChange}
                  className="md:col-span-3"
                />
              </div>
            </CardSection>

            <CardSection title="Flags">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Toggle
                  label="Pendant Fixed"
                  name="isPendantFixed"
                  checked={form.isPendantFixed}
                  onChange={handleChange}
                />
                <Toggle
                  label="Contains Gemstone"
                  name="containsGemstone"
                  checked={form.containsGemstone}
                  onChange={handleChange}
                />
                <Toggle
                  label="MRP Product"
                  name="isMrpProduct"
                  checked={form.isMrpProduct}
                  onChange={handleChange}
                />
              </div>
            </CardSection>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <button
              type="button"
              onClick={addImage}
              className="px-3 py-1.5 text-sm rounded border"
            >
              + Add Image
            </button>
            <div className="grid gap-4">
              {form.images.map((img, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded p-3"
                >
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(idx, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    {img.uploading && (
                      <p className="text-xs text-blue-600 mt-1">Uploading...</p>
                    )}
                    {img.url && (
                      <div className="mt-2">
                        <img
                          src={img.url}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">
                          {img.url}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {img.publicId}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <button
              type="button"
              onClick={addVariant}
              className="px-3 py-1.5 text-sm rounded border"
            >
              + Add Variant
            </button>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border mt-3">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 border">Karat</th>
                    <th className="px-3 py-2 border">Stone Type</th>
                    <th className="px-3 py-2 border">SKU</th>
                    <th className="px-3 py-2 border">Price</th>
                    <th className="px-3 py-2 border">Stock</th>
                    <th className="px-3 py-2 border">Gross Weight</th>
                    <th className="px-3 py-2 border">Available</th>
                    <th className="px-3 py-2 border"></th>
                  </tr>
                </thead>
                <tbody>
                  {form.variants.map((v, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={v.karat}
                          onChange={(e) =>
                            updateVariant(idx, "karat", e.target.value)
                          }
                        >
                          <option value={9}>9</option>
                          <option value={14}>14</option>
                          <option value={18}>18</option>
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={v.stoneType}
                          onChange={(e) =>
                            updateVariant(idx, "stoneType", e.target.value)
                          }
                        >
                          <option value="regular_diamond">
                            regular_diamond
                          </option>
                          <option value="gemstone">gemstone</option>
                          <option value="colored_diamond">
                            colored_diamond
                          </option>
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={v.sku}
                          onChange={(e) =>
                            updateVariant(idx, "sku", e.target.value)
                          }
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          className="w-full border rounded px-2 py-1"
                          value={v.price}
                          onChange={(e) =>
                            updateVariant(idx, "price", e.target.value)
                          }
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          className="w-full border rounded px-2 py-1"
                          value={v.stock}
                          onChange={(e) =>
                            updateVariant(idx, "stock", e.target.value)
                          }
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          className="w-full border rounded px-2 py-1"
                          value={v.grossWeight}
                          onChange={(e) =>
                            updateVariant(idx, "grossWeight", e.target.value)
                          }
                        />
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={v.isAvailable}
                          onChange={(e) =>
                            updateVariant(idx, "isAvailable", e.target.checked)
                          }
                        />
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="text-red-600 text-xs"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {form.variants.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center text-gray-400 py-3"
                      >
                        No variants added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 7: {
        const payload = buildPayload();
        return (
          <div className="space-y-4 text-sm">
            <CardSection title="Overview">
              <pre className="bg-gray-50 p-3 rounded max-h-80 overflow-auto text-xs">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </CardSection>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800">
            Product Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage jewellery products with full customization.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-800 text-sm">
          ✔ Operation successful
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-2 rounded bg-red-100 text-red-800 text-sm">
          ❌ {error?.errors?.[0]?.message || "Something went wrong"}
        </div>
      )}

      {/* Wizard */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
        {/* Stepper */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            {steps.map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep(idx)}
                  className={`text-xs md:text-sm px-3 py-1.5 rounded-full border transition ${
                    idx === step
                      ? "border-transparent text-white"
                      : "border-gray-300 text-gray-600 bg-white"
                  }`}
                  style={{
                    backgroundColor: idx === step ? BRAND : undefined,
                  }}
                >
                  {idx + 1}. {label}
                </button>
                {idx < steps.length - 1 && (
                  <span className="hidden md:inline text-gray-300">›</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">{renderStep()}</div>

        {/* Controls */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <div className="text-xs text-gray-500">
            Step {step + 1} of {steps.length}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-1.5 text-sm rounded border border-gray-300 bg-white"
              >
                Back
              </button>
            )}
            {step < steps.length - 1 && (
              <button
                type="button"
                onClick={nextStep}
                style={{ backgroundColor: BRAND }}
                className="px-4 py-1.5 text-sm rounded text-white"
              >
                Next
              </button>
            )}
            {step === steps.length - 1 && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{ backgroundColor: BRAND }}
                className="px-4 py-1.5 text-sm rounded text-white disabled:opacity-60"
              >
                {editId ? "Update Product" : "Create Product"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Existing products */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Existing Products
        </h3>
        {loading && <p className="text-gray-500 text-sm">Loading...</p>}
        {!loading && products?.length === 0 && (
          <p className="text-gray-400 text-sm">No products found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products?.map((p) => (
            <div
              key={p._id}
              className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-base font-semibold text-gray-800">
                    {p.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {p.productId} • {p.gender || "Unisex"}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    p.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {p.description}
              </p>
              <p className="text-xs text-gray-500">
                Net Weight: {p.netWeight}g • Variants: {p.variants?.length || 0}
              </p>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* Reusable small components */

const Input = ({ label, className = "", ...rest }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c46c39] focus:border-transparent text-sm"
      {...rest}
    />
  </div>
);

const TextArea = ({ label, className = "", ...rest }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c46c39] focus:border-transparent text-sm"
      {...rest}
    />
  </div>
);

const Select = ({ label, options, className = "", ...rest }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c46c39] focus:border-transparent text-sm bg-white"
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const Toggle = ({ label, name, checked, onChange }) => (
  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition ${
          checked ? "bg-[#c46c39]" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
    </div>
    {label}
  </label>
);

const CardSection = ({ title, children }) => (
  <div className="border rounded-lg p-4 bg-white">
    <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
    {children}
  </div>
);

export default Product;