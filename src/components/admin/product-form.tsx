
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useRef } from 'react';
import { brands } from '@/lib/data';

// Zod schema for file validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be positive'),
  brand: z.string().min(1, 'Brand is required'),
  images: z.custom<FileList>()
    .refine(files => files === null || (files && files.length > 0), 'At least one image is required.')
    .refine(files => files === null || Array.from(files).every(file => file.size <= MAX_FILE_SIZE), `Max file size is 5MB.`)
    .refine(
      files => files === null || Array.from(files).every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ).nullable().optional(),
});

export type ProductFormValues = z.infer<typeof formSchema>;


interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: ProductFormValues) => void;
  product: Product | null;
}

export function ProductForm({ isOpen, onOpenChange, onSubmit, product }: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultValues = {
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    brand: product?.brand || '',
    images: null,
  };
  
  const formSchemaWithContext = formSchema.refine(data => !!product || (data.images && data.images.length > 0), {
    message: "At least one image is required.",
    path: ["images"],
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchemaWithContext),
    defaultValues,
  });

  useEffect(() => {
    form.reset({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      brand: product?.brand || '',
      images: null,
    });
    // Reset file input when dialog opens
    if (isOpen && fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, [product, isOpen, form]);


  const handleSubmit = (values: ProductFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.name}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="images"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => onChange(e.target.files)}
                      {...rest}
                    />
                  </FormControl>
                   <FormMessage />
                  {product && (
                     <p className="text-sm text-muted-foreground">
                        Current images are preserved. Upload new files only if you want to replace them.
                    </p>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
