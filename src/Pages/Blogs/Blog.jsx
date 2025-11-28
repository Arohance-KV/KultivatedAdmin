"use client";
"use no memo";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllBlogs,
  createBlogAsync,
  updateBlogAsync,
  deleteBlogAsync,
} from "../../redux/BlogSlice";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import EmailEditor from "react-email-editor";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../ui/table";

import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "../../ui/dropdown-menu";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  featuredImage: z.string().optional(),
  featuredImageFile: z.any().optional(),
  blogContent: z.object({
    design: z.any(),
    markup: z.string(),
  }),
});

export default function Blogs() {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blogs);

  const BRAND = "#c28356";

  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);

  const emailEditorRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      featuredImage: "",
      featuredImageFile: null,
      blogContent: { design: {}, markup: "" },
    },
  });

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  const startEditBlog = (blog) => {
    setEditingBlog(blog);

    form.reset({
      title: blog.title,
      featuredImage: blog.blogImgUrl?.url || "",
      featuredImageFile: null,
      blogContent: blog.blogContent || { design: {}, markup: "" },
    });

    setImagePreview(blog.blogImgUrl?.url || "");
    setFileToUpload(null);
    setShowModal(true);

    setTimeout(() => {
      if (emailEditorRef.current) {
        emailEditorRef.current.editor.loadDesign(blog.blogContent.design);
      }
    }, 500);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="font-medium text-gray-800">{row.getValue("title")}</div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return (
            <span className="text-gray-500 text-sm">
              {date.toLocaleDateString()}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-lg"
              >
                ⋮
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Manage</DropdownMenuLabel>

              <DropdownMenuItem onSelect={() => startEditBlog(row.original)}>
                <PencilIcon className="mr-2 w-4 h-4" /> Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => {
                  if (confirm("Delete this blog?")) {
                    dispatch(deleteBlogAsync(row.original._id));
                  }
                }}
              >
                <TrashIcon className="mr-2 w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [dispatch]
  );

  const table = useReactTable({
    data: blogs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onSubmit = async (values) => {
    try {
      const exportData = await new Promise((resolve, reject) => {
        if (!emailEditorRef.current) {
          reject(new Error("Editor not loaded"));
        }
        emailEditorRef.current.editor.exportHtml((data) => resolve(data));
      });

      const { design, html } = exportData;

      const formData = new FormData();
      formData.append("blogName", values.title);
      formData.append("title", values.title);
      formData.append("designData", JSON.stringify(design));
      formData.append("markup", html);

      if (fileToUpload) {
        formData.append("blogImage", fileToUpload);
      }

      if (editingBlog) {
        await dispatch(
          updateBlogAsync({ id: editingBlog._id, updates: formData })
        ).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await dispatch(createBlogAsync({ formData })).unwrap();
        toast.success("Blog created successfully");
      }

      setShowModal(false);
      setEditingBlog(null);
      form.reset();
      setFileToUpload(null);
      setImagePreview("");
    } catch (err) {
      toast.error(err.message || "Failed to save blog.");
    }
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      form.setValue("featuredImage", previewUrl);
    }
  };

  return (
    <>
      <div
        className="p-8"
        style={{
          background: "linear-gradient(135deg, #f2e8df, #ffffff)",
          minHeight: "100vh",
        }}
      >
        {/* GLASS HEADING */}
        <div
          className="flex justify-between items-center mb-8 p-5 rounded-2xl shadow-xl border"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(14px)",
            borderColor: "rgba(255,255,255,0.35)",
          }}
        >
          <div>
            <h1 className="text-4xl font-bold text-[#c28356] drop-shadow-sm tracking-wide">
              Blogs
            </h1>
            <p className="text-gray-600 mt-1">Manage blog articles</p>
          </div>

          <Button
            onClick={() => {
              form.reset();
              setEditingBlog(null);
              setImagePreview("");
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-md"
            style={{ background: BRAND }}
          >
            <PlusIcon className="h-4 w-4" /> New Blog
          </Button>
        </div>

        {/* GLASS TABLE */}
        <div
          className="rounded-2xl shadow-xl border p-4 overflow-x-auto"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(14px)",
            borderColor: "rgba(255,255,255,0.35)",
          }}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  style={{ background: "rgba(255,255,255,0.45)" }}
                >
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      className="font-semibold text-gray-700"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-white/40 transition"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-12 text-gray-500"
                  >
                    No blogs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* GLASS MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger />

        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(16px)",
            borderColor: "rgba(255,255,255,0.4)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#c28356]">
              {editingBlog ? "Edit Blog" : "Create Blog"}
            </DialogTitle>
            <DialogDescription>
              Fill the information below to{" "}
              {editingBlog ? "update" : "create"} your blog.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            {/* Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Label className="font-medium">Blog Title *</Label>
                  <Input {...field} className="mt-1" />

                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Image Upload */}
            <div>
              <Label className="font-medium mb-1 block">
                Banner Image {!editingBlog && "*"}
              </Label>

              <label
                className="flex flex-col items-center justify-center w-full h-36 bg-white/60 border rounded-xl shadow cursor-pointer hover:bg-white/80 transition"
                style={{ backdropFilter: "blur(10px)" }}
              >
                <span className="text-gray-600 mb-1">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageChange}
                />
              </label>

              {imagePreview && (
                <img
                  src={imagePreview}
                  className="h-32 w-48 mt-3 rounded-lg shadow object-cover border"
                />
              )}
            </div>

            {/* Blog Content */}
            <div>
              <Label className="font-medium">Blog Content *</Label>
              <div className="mt-2 border rounded-xl shadow-sm overflow-hidden">
                <EmailEditor ref={emailEditorRef} minHeight={450} />
              </div>
            </div>

            {/* Buttons */}
            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                className="px-6"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="px-6 text-white"
                style={{ background: BRAND }}
              >
                {loading
                  ? "Saving..."
                  : editingBlog
                  ? "Update Blog"
                  : "Create Blog"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
