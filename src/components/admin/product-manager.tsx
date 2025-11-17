
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import type { Product } from '@/lib/types';
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
import { ProductForm, ProductFormValues } from './product-form';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function ProductManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const firestore = useFirestore();
  const auth = useAuth();
  const { toast, dismiss } = useToast();

  const productsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );
  const { data: products, isLoading } = useCollection<Product>(productsCollection);

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete && firestore) {
      const docRef = doc(firestore, 'products', productToDelete.id);
      deleteDocumentNonBlocking(docRef);
      toast({ title: 'Product Deleted' });
    }
    setIsAlertOpen(false);
    setProductToDelete(null);
  };

 const uploadImages = async (files: FileList): Promise<string[]> => {
    if (!auth) throw new Error('Authentication not available');
    const storage = getStorage(auth.app);
    
    const { id: overallToastId, update: updateOverallToast } = toast({
        title: 'Uploading Images...',
        description: `0% - Starting to upload ${files.length} images.`,
        progress: 0,
    });

    const uploadPromises = Array.from(files).map(file => {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise<string>((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // This is just for one file, overall progress will be calculated later
                },
                (error) => reject(error),
                () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
            );
        });
    });

    // This is a simple way to show progress. For multiple files, we just average it.
    // A more complex implementation could weigh by file size.
    const allTasks = Promise.all(uploadPromises);
    
    const interval = setInterval(() => {
        const individualProgress = (uploadPromises as any).map((p: any) => p.progress || 0);
        const totalProgress = individualProgress.reduce((acc: number, p: number) => acc + p, 0) / files.length;
        updateOverallToast({ id: overallToastId, progress: totalProgress, description: `${Math.round(totalProgress)}% complete` });
    }, 200);

    try {
        const downloadedUrls = await allTasks;
        clearInterval(interval);
        dismiss(overallToastId);
        toast({
            title: 'Upload Successful',
            description: `All ${files.length} images uploaded.`,
            duration: 3000,
        });
        return downloadedUrls;
    } catch (error: any) {
        clearInterval(interval);
        dismiss(overallToastId);
        toast({
            title: 'Upload Failed',
            description: error.message || 'An error occurred during upload.',
            variant: 'destructive',
        });
        throw error;
    }
};

  const handleFormSubmit = async (values: ProductFormValues) => {
    if (!firestore || !productsCollection) return;

    setIsFormOpen(false);
    
    try {
        let imageUrls: string[] = selectedProduct?.images || [];

        if (values.images && values.images.length > 0) {
            imageUrls = await uploadImages(values.images);
        } else if (!selectedProduct) {
             toast({ title: 'Error', description: 'At least one image is required for a new product.', variant: 'destructive'});
             return;
        }

        const productData = {
            name: values.name,
            description: values.description,
            price: values.price,
            brand: values.brand,
            images: imageUrls,
            category: 'Audio', // Default category
            specs: selectedProduct?.specs || {},
        };

        if (selectedProduct) {
            const docRef = doc(firestore, 'products', selectedProduct.id);
            updateDocumentNonBlocking(docRef, productData);
            toast({ title: 'Product Updated Successfully' });
        } else {
            addDocumentNonBlocking(productsCollection, productData);
            toast({ title: 'Product Added Successfully' });
        }
    } catch (error) {
        console.error("Failed to save product:", error);
        // The uploadImages function already shows a toast on failure.
    }
  };
  
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return 'https://placehold.co/40x40/f3f4f6/333?text=?';
    return imageUrl;
  };

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products</CardTitle>
            <Button onClick={handleAdd} size="sm">
              <PlusCircle className="mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))}
              {products && products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{formatRupiah(product.price)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleEdit(product)}>
                          <Edit className="mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDelete(product)} className="text-destructive">
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
      
      <ProductForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              &quot;{productToDelete?.name}&quot;.
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
