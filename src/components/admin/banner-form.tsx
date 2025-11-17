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
import { useEffect } from 'react';

// Simple Banner type for this component
interface Banner {
    id: string;
    imageUrl: string;
    altText: string;
    linkUrl: string;
}

const formSchema = z.object({
  image: z.any().optional(), // Allow file or existing URL string
  altText: z.string().min(1, 'Alt text is required'),
  linkUrl: z.string().url('Must be a valid URL'),
});

export type BannerFormValues = z.infer<typeof formSchema> & { imageUrl?: string };


interface BannerFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: BannerFormValues) => void;
  banner: Banner | null;
}

export function BannerForm({ isOpen, onOpenChange, onSubmit, banner }: BannerFormProps) {
  const defaultValues = {
    imageUrl: banner?.imageUrl || '',
    altText: banner?.altText || '',
    linkUrl: banner?.linkUrl || '',
    image: undefined,
  };

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset({
        altText: banner?.altText || '',
        linkUrl: banner?.linkUrl || '',
        imageUrl: banner?.imageUrl || '',
        image: undefined,
    });
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                    />
                  </FormControl>
                  <FormMessage />
                  {banner?.imageUrl && !field.value && (
                    <p className="text-sm text-muted-foreground mt-2">Current image will be kept. Upload a new file to replace it.</p>
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
