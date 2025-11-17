'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Trash, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BannerForm, BannerFormValues } from './banner-form';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';


// Simple Banner type for this component
interface Banner {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl: string;
  startDate?: string;
  endDate?: string;
  priority?: number;
}

export default function BannerManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  const firestore = useFirestore();
  const { toast, dismiss } = useToast();

  const bannersCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'banners') : null),
    [firestore]
  );
  const { data: banners, isLoading } = useCollection<Banner>(bannersCollection);

  const handleAdd = () => {
    setSelectedBanner(null);
    setIsFormOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsFormOpen(true);
  };

  const handleDelete = (banner: Banner) => {
    setBannerToDelete(banner);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (bannerToDelete && firestore) {
      try {
        const docRef = doc(firestore, 'banners', bannerToDelete.id);
        await deleteDoc(docRef);
        toast({ title: 'Banner Deleted' });
      } catch (error: any) {
        toast({ title: 'Error Deleting Banner', description: error.message, variant: 'destructive' });
      }
    }
    setIsAlertOpen(false);
    setBannerToDelete(null);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, `banners/${Date.now()}_${file.name}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleFormSubmit = async (values: BannerFormValues) => {
    if (!firestore || !bannersCollection) {
        toast({ title: 'Error', description: 'Firestore is not initialized.', variant: 'destructive'});
        return;
    }
    
    setIsFormOpen(false);
    
    const { id: toastId } = toast({
        title: 'Saving banner...',
        description: 'Your banner is being saved.',
    });

    try {
        let imageUrl: string;

        if (values.image && values.image.length > 0) {
            imageUrl = await uploadImage(values.image[0]);
        } else if (selectedBanner) {
            imageUrl = selectedBanner.imageUrl;
        } else {
            toast({ title: 'Error', description: 'An image is required for a new banner.', variant: 'destructive'});
            dismiss(toastId);
            return;
        }

        const bannerData = {
            altText: values.altText,
            linkUrl: values.linkUrl,
            imageUrl: imageUrl,
            startDate: selectedBanner?.startDate || new Date().toISOString(),
            endDate: selectedBanner?.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // 1 year from now
            priority: selectedBanner?.priority || 0,
        };

        if (selectedBanner) {
            const docRef = doc(firestore, 'banners', selectedBanner.id);
            await updateDoc(docRef, bannerData);
            toast({ title: 'Banner Updated' });
        } else {
            await addDoc(bannersCollection, bannerData);
            toast({ title: 'Banner Added' });
        }
        dismiss(toastId);

    } catch(error: any) {
      console.error("Failed to save banner", error);
      toast({
        title: 'Save Failed',
        description: error.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
      dismiss(toastId);
    }
  };


  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return 'https://placehold.co/80x40/f3f4f6/333?text=?';
    return imageUrl;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Banners</CardTitle>
            <Button onClick={handleAdd} size="sm">
              <PlusCircle className="mr-2" />
              Add Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Image</TableHead>
                <TableHead>Alt Text</TableHead>
                <TableHead>Link URL</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                [...Array(2)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))}
              {banners && banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <Image
                      src={getImageUrl(banner.imageUrl)}
                      alt={banner.altText}
                      width={80}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{banner.altText}</TableCell>
                  <TableCell>{banner.linkUrl}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleEdit(banner)}>
                          <Edit className="mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDelete(banner)} className="text-destructive">
                           <Trash className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <BannerForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        banner={selectedBanner}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the banner
              &quot;{bannerToDelete?.altText}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
