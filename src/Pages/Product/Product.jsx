// --- Product.jsx (Glassmorphism UI Matching Collection & Category) ---
// NOTE: All logic remains 100% unchanged. Only UI (markup + classes + layout) upgraded.

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

// BRAND COLOR
const BRAND = "#c28356"; // updated to match your new theme

// ---- ORIGINAL INITIAL FORM (UNCHANGED) ----
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
  colors: [],
  hasSizeOptions: false,
  sizesInput: "",
  hasStoneTypeOptions: false,
  stoneTypes: [],

  // WEIGHTS & COUNTS
  goldWeight: "",
  diamondWeight: "",
  netWeight: "",
  solitareWeight: "",
  noOfSolitaires: "",
  noOfMultiDiamonds: "",
  multiDiamondWeight: "",
  totalKaratsInput: "",
  noOfPointers: "",
  pointersWeight: "",
  gemStoneWeightSol: "",
  gemStoneWeightPointer: "",
  quantitySold: "",

  // DESIGN
  shapeOfSolitare: "",
  shapeOfMultiDiamonds: "",
  shapeOfPointers: "",
  gemStoneColourInput: "",

  // FLAGS
  isPendantFixed: false,
  containsGemstone: false,
  isMrpProduct: false,

  // IMAGES
  images: [],

  // VARIANTS
  variants: [],
};

// 7 Steps (unchanged)
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
  const { products, error, success } = useSelector(
    (state) => state.products
  );

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  /* ---------------------- LOAD PRODUCTS ---------------------- */
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => dispatch(clearProductMessages()), 1500);
      return () => clearTimeout(t);
    }
  }, [success, dispatch]);

  /* ---------------------- HELPERS: INPUT ---------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------------------- COLOR LOGIC (UNCHANGED) ---------------------- */
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

  const extractPublicId = (url) => {
    if (!url) return "";
    const match = url.match(/\/upload\/v\d+\/(.+)\.(\w+)$/);
    return match ? match[1] : "";
  };

  const handleColorImageUpload = async (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // set uploading flag
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
        colors[idx].uploading = false;
        colors[idx].imageUrl = url;
        colors[idx].imagePublicId = publicId;
        colors[idx].file = null;
        return { ...prev, colors };
      });
    } catch {
      setForm((prev) => {
        const colors = [...prev.colors];
        colors[idx].uploading = false;
        return { ...prev, colors };
      });
    }
  };

  const removeColor = (idx) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx),
    }));
  };

  /* ---------------------- STONE TYPES (UNCHANGED) ---------------------- */
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

  /* ---------------------- IMAGES ---------------------- */
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
        images[idx].uploading = false;
        images[idx].url = url;
        images[idx].publicId = publicId;
        images[idx].file = null;
        return { ...prev, images };
      });
    } catch {
      setForm((prev) => {
        const images = [...prev.images];
        images[idx].uploading = false;
        return { ...prev, images };
      });
    }
  };

  const removeImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  /* ---------------------- VARIANTS ---------------------- */
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
      const upd = [...prev.variants];
      upd[idx] = { ...upd[idx], [key]: value };
      return { ...prev, variants: upd };
    });
  };

  const removeVariant = (idx) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => idx !== i),
    }));
  };

  /* ---------------------- STEP CONTROLS ---------------------- */
  const nextStep = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  /* ---------------------- PAYLOAD ---------------------- */
  const parseCSV = (str) =>
    str.split(",").map((x) => x.trim()).filter(Boolean);

  const toNumber = (v) => (v === "" ? 0 : Number(v));

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
        colors: form.colors.map((c) => ({
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
      noOfSolitaires: toNumber(form.noOfSilitaires),
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

      imageUrl: form.images.map((i) => ({
        url: i.url,
        publicId: i.publicId,
      })),

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

  /* ---------------------- SUBMIT ---------------------- */
  const handleSubmit = async () => {
    const payload = buildPayload();

    if (editId) {
      await dispatch(updateProduct({ id: editId, body: payload }));
    } else {
      await dispatch(createProduct(payload));
    }

    await dispatch(getAllProducts());
    setForm(initialForm);
    setStep(0);
    setEditId(null);
  };

  /* ---------------------- EDIT PRODUCT ---------------------- */
  const handleEdit = (p) => {
    setForm({
      productId: p.productId || "",
      name: p.name || "",
      description: p.description || "",
      gender: p.gender || "Unisex",
      isActive: p.isActive ?? true,

      categoryIdsInput: (p.categoryIds || []).join(","),
      subCategoryIdsInput: (p.subCategoryIds || []).join(","),
      collectionIdsInput: (p.collectionIds || []).join(","),

      hasColorOptions: p.customizationOptions?.hasColorOptions || false,
      colors:
        p.customizationOptions?.colors?.map((c) => ({
          name: c.name,
          hexCode: c.hexCode || "#FFD700",
          file: null,
          imageUrl: c.imageUrls?.[0]?.url || "",
          imagePublicId: c.imageUrls?.[0]?.publicId || "",
          uploading: false,
        })) || [],

      hasSizeOptions: p.customizationOptions?.hasSizeOptions || false,
      sizesInput: (p.customizationOptions?.sizes || []).join(","),

      hasStoneTypeOptions: p.customizationOptions?.hasStoneTypeOptions || false,
      stoneTypes:
        p.customizationOptions?.stoneTypes?.map((s) => ({
          type: s.type,
          label: s.label,
          isAvailable: !!s.isAvailable,
        })) || [],

      goldWeight: p.goldWeight || "",
      diamondWeight: p.diamondWeight || "",
      netWeight: p.netWeight || "",
      solitareWeight: p.solitareWeight || "",
      noOfSolitaires: p.noOfSolitaires || "",
      noOfMultiDiamonds: p.noOfMultiDiamonds || "",
      multiDiamondWeight: p.multiDiamondWeight || "",
      totalKaratsInput: (p.totalKarats || []).join(","),
      noOfPointers: p.noOfPointers || "",
      pointersWeight: p.pointersWeight || "",
      gemStoneWeightSol: p.gemStoneWeightSol || "",
      gemStoneWeightPointer: p.gemStoneWeightPointer || "",
      quantitySold: p.quantitySold || "",

      shapeOfSolitare: p.shapeOfSolitare || "",
      shapeOfMultiDiamonds: p.shapeOfMultiDiamonds || "",
      shapeOfPointers: p.shapeOfPointers || "",
      gemStoneColourInput: (p.gemStoneColour || []).join(","),

      isPendantFixed: p.isPendantFixed || false,
      containsGemstone: p.containsGemstone || false,
      isMrpProduct: p.isMrpProduct || false,

      images:
        (p.imageUrl || []).map((i) => ({
          file: null,
          url: i.url,
          publicId: i.publicId,
          uploading: false,
        })) || [],

      variants:
        (p.variants || []).map((v) => ({
          karat: v.karat,
          stoneType: v.stoneType,
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

  /* ---------------------- DELETE PRODUCT ---------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await dispatch(deleteProduct(id));
    dispatch(getAllProducts());
  };

  /* ---------------------- STEP CONTENT (UI UPGRADED) ---------------------- */
  const renderStep = () => {
    return (
      <div
        className="p-6 rounded-2xl shadow-xl border"
        style={{
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.25)",
        }}
      >
        {/* ORIGINAL CONTENT PER STEP  (we wrap it in glass box) */}
        {renderStepContent()}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      // ---- BASIC DETAILS ----
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Product ID" name="productId" value={form.productId} onChange={handleChange} />
            <Input label="Name" name="name" value={form.name} onChange={handleChange} />
            <TextArea
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
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

      // ---- CATEGORIES ----
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Category IDs (comma-separated)"
              name="categoryIdsInput"
              value={form.categoryIdsInput}
              onChange={handleChange}
            />
            <Input
              label="Sub Category IDs (comma-separated)"
              name="subCategoryIdsInput"
              value={form.subCategoryIdsInput}
              onChange={handleChange}
            />
            <Input
              label="Collection IDs (comma-separated)"
              name="collectionIdsInput"
              value={form.collectionIdsInput}
              onChange={handleChange}
              className="md:col-span-2"
            />
          </div>
        );

      // ---- CUSTOMIZATION ----
      case 2:
        return (
          <div className="space-y-6">
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
                    className="mt-3 px-4 py-2 rounded-xl bg-white shadow border text-sm"
                  >
                    + Add Color
                  </button>

                  <div className="mt-4 grid gap-4">
                    {form.colors.map((c, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border bg-white/70 shadow"
                      >
                        <Input
                          label="Color Name"
                          value={c.name}
                          onChange={(e) => updateColor(idx, "name", e.target.value)}
                        />

                        <Input
                          label="Hex Code"
                          value={c.hexCode}
                          onChange={(e) => updateColor(idx, "hexCode", e.target.value)}
                        />

                        <div>
                          <label className="text-sm font-medium text-gray-700">Image</label>
                          <input
                            type="file"
                            className="mt-1 w-full px-3 py-2 border rounded-md"
                            onChange={(e) => handleColorImageUpload(idx, e)}
                          />
                          {c.uploading && <p className="text-xs text-blue-600">Uploading...</p>}
                          {c.imageUrl && (
                            <img src={c.imageUrl} className="w-20 h-20 rounded mt-2 shadow" />
                          )}
                        </div>

                        <button
                          className="text-red-600 text-sm mt-2"
                          onClick={() => removeColor(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardSection>

            {/* SIZE OPTIONS */}
            <CardSection title="Size Options">
              <Toggle
                label="Enable Size Options"
                name="hasSizeOptions"
                checked={form.hasSizeOptions}
                onChange={handleChange}
              />
              {form.hasSizeOptions && (
                <Input
                  className="mt-3"
                  label="Sizes (comma-separated)"
                  name="sizesInput"
                  value={form.sizesInput}
                  onChange={handleChange}
                />
              )}
            </CardSection>

            {/* STONE TYPES */}
            <CardSection title="Stone Type Options">
              <Toggle
                label="Enable Stone Types"
                name="hasStoneTypeOptions"
                checked={form.hasStoneTypeOptions}
                onChange={handleChange}
              />

              {form.hasStoneTypeOptions && (
                <>
                  <button
                    type="button"
                    onClick={addStoneType}
                    className="mt-3 px-4 py-2 rounded-xl bg-white shadow border text-sm"
                  >
                    + Add Stone Type
                  </button>

                  <div className="grid gap-4 mt-4">
                    {form.stoneTypes.map((s, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-xl bg-white/70 shadow"
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
                            updateStoneType(idx, "isAvailable", e.target.checked)
                          }
                        />

                        <button
                          className="text-red-600 text-sm"
                          onClick={() => removeStoneType(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardSection>
          </div>
        );

      // ---- WEIGHTS & COUNTS ----
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Gold Weight" name="goldWeight" value={form.goldWeight} onChange={handleChange} />
            <Input label="Diamond Weight" name="diamondWeight" value={form.diamondWeight} onChange={handleChange} />
            <Input label="Net Weight" name="netWeight" value={form.netWeight} onChange={handleChange} />
            <Input label="Solitaire Weight" name="solitareWeight" value={form.solitareWeight} onChange={handleChange} />
            <Input label="No. Solitaires" name="noOfSolitaires" value={form.noOfSolitaires} onChange={handleChange} />
            <Input label="No. Multi Diamonds" name="noOfMultiDiamonds" value={form.noOfMultiDiamonds} onChange={handleChange} />
            <Input label="Multi Diamond Weight" name="multiDiamondWeight" value={form.multiDiamondWeight} onChange={handleChange} />
            <Input label="Total Karats (CSV)" name="totalKaratsInput" value={form.totalKaratsInput} onChange={handleChange} />
            <Input label="Pointers Weight" name="pointersWeight" value={form.pointersWeight} onChange={handleChange} />
            <Input label="No. Pointers" name="noOfPointers" value={form.noOfPointers} onChange={handleChange} />
            <Input label="Gemstone Sol." name="gemStoneWeightSol" value={form.gemStoneWeightSol} onChange={handleChange} />
            <Input label="Gemstone Pointer" name="gemStoneWeightPointer" value={form.gemStoneWeightPointer} onChange={handleChange} />
            <Input label="Quantity Sold" name="quantitySold" value={form.quantitySold} onChange={handleChange} />
          </div>
        );

      // ---- DESIGN & FLAGS ----
      case 4:
        return (
          <div className="space-y-6">
            <CardSection title="Design Attributes">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="Shape (Solitaire)" name="shapeOfSolitare" value={form.shapeOfSolitare} onChange={handleChange} />
                <Input label="Shape (Multi Diamonds)" name="shapeOfMultiDiamonds" value={form.shapeOfMultiDiamonds} onChange={handleChange} />
                <Input label="Shape (Pointers)" name="shapeOfPointers" value={form.shapeOfPointers} onChange={handleChange} />
                <Input label="Gemstone Colours CSV" className="md:col-span-3" name="gemStoneColourInput" value={form.gemStoneColourInput} onChange={handleChange} />
              </div>
            </CardSection>

            <CardSection title="Flags">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Toggle label="Pendant Fixed" name="isPendantFixed" checked={form.isPendantFixed} onChange={handleChange} />
                <Toggle label="Contains Gemstone" name="containsGemstone" checked={form.containsGemstone} onChange={handleChange} />
                <Toggle label="MRP Product" name="isMrpProduct" checked={form.isMrpProduct} onChange={handleChange} />
              </div>
            </CardSection>
          </div>
        );

      // ---- IMAGES ----
      case 5:
        return (
          <div className="space-y-6">
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-white text-sm border rounded-xl shadow"
            >
              + Add Image
            </button>

            <div className="grid gap-4">
              {form.images.map((img, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-white/70 shadow grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Upload Image</label>
                    <input type="file" onChange={(e) => handleImageUpload(idx, e)} className="mt-2 border px-3 py-2 rounded-md" />
                    {img.uploading && <p className="text-xs text-blue-600">Uploading...</p>}
                    {img.url && <img src={img.url} className="w-20 h-20 mt-2 rounded shadow" />}
                  </div>

                  <div className="flex items-end">
                    <button className="text-red-600 text-sm" onClick={() => removeImage(idx)}>
                      Remove Image
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ---- VARIANTS ----
      case 6:
        return (
          <div className="space-y-6">
            <button type="button" onClick={addVariant} className="px-4 py-2 bg-white border rounded-xl shadow text-sm">
              + Add Variant
            </button>

            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-xl overflow-hidden bg-white/70 shadow text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border px-3 py-2">Karat</th>
                    <th className="border px-3 py-2">Stone Type</th>
                    <th className="border px-3 py-2">SKU</th>
                    <th className="border px-3 py-2">Price</th>
                    <th className="border px-3 py-2">Stock</th>
                    <th className="border px-3 py-2">Gross Weight</th>
                    <th className="border px-3 py-2">Available</th>
                    <th className="border px-3 py-2"></th>
                  </tr>
                </thead>

                <tbody>
                  {form.variants.map((v, idx) => (
                    <tr key={idx} className="border">
                      <td className="border px-2">
                        <select
                          className="border rounded px-2 py-1 w-full"
                          value={v.karat}
                          onChange={(e) => updateVariant(idx, "karat", e.target.value)}
                        >
                          <option>9</option>
                          <option>14</option>
                          <option>18</option>
                        </select>
                      </td>

                      <td className="border px-2">
                        <select
                          className="border rounded px-2 py-1 w-full"
                          value={v.stoneType}
                          onChange={(e) => updateVariant(idx, "stoneType", e.target.value)}
                        >
                          <option>regular_diamond</option>
                          <option>gemstone</option>
                          <option>colored_diamond</option>
                        </select>
                      </td>

                      <td className="border px-2">
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={v.sku}
                          onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                        />
                      </td>

                      <td className="border px-2">
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full"
                          value={v.price}
                          onChange={(e) => updateVariant(idx, "price", e.target.value)}
                        />
                      </td>

                      <td className="border px-2">
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full"
                          value={v.stock}
                          onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                        />
                      </td>

                      <td className="border px-2">
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full"
                          value={v.grossWeight}
                          onChange={(e) => updateVariant(idx, "grossWeight", e.target.value)}
                        />
                      </td>

                      <td className="border px-2 text-center">
                        <input
                          type="checkbox"
                          checked={v.isAvailable}
                          onChange={(e) =>
                            updateVariant(idx, "isAvailable", e.target.checked)
                          }
                        />
                      </td>

                      <td className="border px-2 text-center">
                        <button
                          className="text-red-600"
                          onClick={() => removeVariant(idx)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}

                  {form.variants.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-gray-500 py-4">
                        No variants added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ---------------------- UI LAYOUT ---------------------- */

  return (
    <div
      className="p-8"
      style={{
        background: "linear-gradient(135deg, #f2e8df, #ffffff)",
        minHeight: "100vh",
      }}
    >
      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold text-[#c28356] tracking-wide drop-shadow-sm">
            Product Management
          </h2>
          <p className="text-sm text-gray-600">Manage all jewellery products</p>
        </div>

        {/* Our brand button style */}
        <button
          className="px-6 py-3 rounded-xl text-white font-semibold shadow-md"
          style={{ background: BRAND }}
          onClick={() => {
            setForm(initialForm);
            setStep(0);
            setEditId(null);
          }}
        >
          + Add New Product
        </button>
      </div>

      {/* SUCCESS / ERROR */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 border rounded-xl shadow">
          ✔ {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border rounded-xl shadow">
          ❌ {error?.errors?.[0]?.message || "Something went wrong"}
        </div>
      )}

      {/* STEPPER (Glassmorphism) */}
      <div
        className="rounded-2xl shadow-xl border mb-8"
        style={{
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.25)",
        }}
      >
        <div className="px-6 py-4 border-b">
          <div className="flex flex-wrap gap-3">
            {steps.map((label, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <button
                  className={`px-4 py-2 rounded-full text-sm shadow ${
                    idx === step
                      ? "text-white"
                      : "bg-white text-gray-800"
                  }`}
                  style={{
                    background: idx === step ? BRAND : "white",
                  }}
                  onClick={() => setStep(idx)}
                >
                  {idx + 1}. {label}
                </button>

                {idx < steps.length - 1 && (
                  <span className="text-gray-400">›</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="p-6">{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-white/50 rounded-b-2xl">
          <div className="text-xs text-gray-600">
            Step {step + 1} of {steps.length}
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                className="px-4 py-2 rounded-xl bg-white shadow border text-sm"
                onClick={prevStep}
              >
                Back
              </button>
            )}

            {step < steps.length - 1 && (
              <button
                className="px-4 py-2 rounded-xl text-white text-sm shadow"
                style={{ background: BRAND }}
                onClick={nextStep}
              >
                Next
              </button>
            )}

            {step === steps.length - 1 && (
              <button
                className="px-4 py-2 rounded-xl text-white text-sm shadow"
                style={{ background: BRAND }}
                onClick={handleSubmit}
              >
                {editId ? "Update Product" : "Create Product"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* EXISTING PRODUCTS - Glassmorphism Cards */}
      <h3 className="text-2xl font-bold text-gray-800 mb-3">Existing Products</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products?.map((p) => (
          <div
            key={p._id}
            className="p-5 rounded-2xl shadow-xl border hover:shadow-2xl transition"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            <h4 className="font-bold text-lg text-gray-800">{p.name}</h4>
            <p className="text-xs text-gray-600">{p.productId}</p>
            <p className="text-sm line-clamp-2 text-gray-600 mt-2">{p.description}</p>

            <div className="text-xs mt-3 text-gray-700">
              Net Weight: {p.netWeight} g  
              <br />
              Variants: {p.variants?.length || 0}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="text-[#c28356] font-medium hover:underline"
                onClick={() => handleEdit(p)}
              >
                Edit
              </button>
              <button
                className="text-red-600 font-medium hover:underline"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------- SMALL COMPONENTS (Glassmorphism Inputs) -------- */

const Input = ({ label, className = "", ...rest }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      {...rest}
      className="w-full px-4 py-2 border rounded-xl bg-white/60 shadow-sm focus:ring-2 focus:ring-[#c28356] outline-none"
    />
  </div>
);

const TextArea = ({ label, className = "", ...rest }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      {...rest}
      className="w-full px-4 py-2 border rounded-xl bg-white/60 shadow-sm focus:ring-2 focus:ring-[#c28356] outline-none"
    ></textarea>
  </div>
);

const Select = ({ label, options, className = "", ...rest }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      {...rest}
      className="w-full px-4 py-2 border rounded-xl bg-white/60 shadow-sm focus:ring-2 focus:ring-[#c28356] outline-none"
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const Toggle = ({ label, name, checked, onChange }) => (
  <label className="flex items-center gap-3 text-sm text-gray-700 select-none cursor-pointer">
    <div className="relative w-10 h-5 bg-gray-300 rounded-full">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <div
        className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5 shadow"
        style={{ background: "white" }}
      ></div>
      <div
        className="absolute inset-0 rounded-full peer-checked:bg-[#c28356] transition"
      ></div>
    </div>
    {label}
  </label>
);

const CardSection = ({ title, children }) => (
  <div
    className="p-4 rounded-xl border shadow bg-white/70"
    style={{ borderColor: "rgba(255,255,255,0.4)" }}
  >
    <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
    {children}
  </div>
);

export default Product;
