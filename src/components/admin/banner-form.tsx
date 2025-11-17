
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useEffect, useRef } from 'react';

// Simple Banner type for this component
interface Banner {
    id: string;
    imageUrl: string;
    altText: string;
    linkUrl: string;
}

// Zod schema for file validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z.object({
  altText: z.string().min(1, 'Alt text is required'),
  linkUrl: z.string().url('Must be a valid URL'),
  image: z.custom<FileList>()
    .refine(files => files === null || files.length === 1, 'An image is required.')
    .refine(files => files === null || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      files => files === null || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ).nullable().optional(),
});

export type BannerFormValues = z.infer<typeof formSchema>;


interface BannerFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: BannerFormValues) => void;
  banner: Banner | null;
}

export function BannerForm({ isOpen, onOpenChange, onSubmit, banner }: BannerFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultValues = {
    altText: banner?.altText || '',
    linkUrl: banner?.linkUrl || '',
    image: null,
  };

  const formSchemaWithContext = formSchema.refine(
    (data) => !!banner || (data.image && data.image.length > 0), {
    message: "An image is required.",
    path: ["image"],
  });

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchemaWithContext),
    defaultValues,
  });

  useEffect(() => {
    form.reset({
        altText: banner?.altText || '',
        linkUrl: banner?.linkUrl || '',
        image: null
    });
     if (isOpen && fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, [banner, isOpen, form]);

  const handleSubmit = (values: BannerFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{banner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Banner Image</FormLabel>
                  <FormControl>
                     <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => onChange(e.target.files)}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                   {banner && (
                     <p className="text-sm text-muted-foreground">
                        Current image is preserved. Upload a new file only if you want to replace it.
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="altText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Text</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Weekend Sale" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="/products/some-product-id"/>
                  </FormControl>
                  <FormMessage />
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
