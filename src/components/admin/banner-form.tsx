
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
  DialogDescription,
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

const formSchema = z.object({
  altText: z.string().min(1, 'Alt text is required'),
  linkUrl: z.string().min(1, 'Link URL is required.'),
  imageUrl: z.string().url('Must be a valid image URL'),
});

export type BannerFormValues = z.infer<typeof formSchema>;


interface BannerFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: BannerFormValues) => void;
  banner: Banner | null;
}

export function BannerForm({ isOpen, onOpenChange, onSubmit, banner }: BannerFormProps) {
  const defaultValues = {
    altText: banner?.altText || '',
    linkUrl: banner?.linkUrl || '',
    imageUrl: banner?.imageUrl || '',
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
          <DialogDescription>
            Fill out the form below to {banner ? 'update the' : 'create a new'} banner. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                     <Input
                      {...field}
                      placeholder="https://example.com/image.png"
                    />
                  </FormControl>
                  <FormMessage />
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
