
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot } from 'firebase/storage';
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

  const handleFormSubmit = (values: ProductFormValues) => {
     if (!firestore || !auth) return;
     
     setIsFormOpen(false);
     
     const files = values.images as FileList | undefined;
     if (!files || files.length === 0) {
        saveProductData(values, values.existingImages || []);
        return;
     }

     const storage = getStorage();
     const toastId = `upload-${Date.now()}`;

     let totalBytes = 0;
     Array.from(files).forEach(file => totalBytes += file.size);
     let totalBytesTransferred = 0;

     toast({
         id: toastId,
         title: `Uploading ${files.length} image(s)...`,
         description: 'Please wait.',
         progress: 0,
     });

     const uploadPromises = Array.from(files).map(file => {
         const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
         const uploadTask = uploadBytesResumable(storageRef, file);

         return new Promise<string>((resolve, reject) => {
             uploadTask.on('state_changed',
                 (snapshot: UploadTaskSnapshot) => {
                    // This specific upload's progress. We will calculate total progress below.
                 },
                 reject,
                 async () => {
                     const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                     resolve(downloadURL);
                 }
             );
             // A bit of a hack to track total progress across multiple uploads
             uploadTask.on('state_changed', (snapshot: UploadTaskSnapshot) => {
                // This listener is just to update the total progress
                // We find the delta and add it to the total
             });
             const progressTracker = (snapshot: UploadTaskSnapshot) => {
                const recentBytes = snapshot.bytesTransferred;
                // This isn't perfect, but gives a reasonable progress feel
                // A better approach would need to track each upload's progress individually
             };
             // A simpler way to update progress is to just update on each state_changed event
             uploadTask.on('state_changed', (snapshot) => {
                let currentTotal = 0;
                // this is not a perfect science as we don't know which promise has updated
                // we sum up the bytes transferred from all tasks on every update
                
                // Let's try a simpler approach. Sum up total transferred and update.
                // This is not perfect, so we'll just track total and update based on that.
             });
         });
     });

    // Let's use a more robust way to track progress
    const allUploadTasks = Array.from(files).map(file => {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        return uploadBytesResumable(storageRef, file);
    });

    allUploadTasks.forEach(task => {
        task.on('state_changed', (snapshot) => {
            const totalTransferred = allUploadTasks.reduce((acc, t) => acc + t.snapshot.bytesTransferred, 0);
            const totalSize = allUploadTasks.reduce((acc, t) => acc + t.snapshot.totalBytes, 0);
            if (totalSize > 0) {
              const progress = (totalTransferred / totalSize) * 100;
              toast({
                  id: toastId,
                  title: `Uploading ${files.length} image(s)...`,
                  progress: progress,
              });
            }
        });
    });

    const allPromises = allUploadTasks.map(task => new Promise<string>((resolve, reject) => {
        task.then(async snapshot => {
            const downloadURL = await getDownloadURL(snapshot.ref);
            resolve(downloadURL);
        }).catch(reject);
    }));
     
     Promise.all(allPromises).then(imageUrls => {
         toast({ id: toastId, title: 'Upload complete!', description: 'Saving product data...', progress: 100 });
         saveProductData(values, imageUrls);
         setTimeout(() => dismiss(toastId), 2000); // Dismiss after 2 seconds
     }).catch(error => {
         console.error("Error uploading files:", error);
         toast({
             id: toastId,
             variant: "destructive",
             title: "Upload Failed",
             description: "Could not upload images.",
         });
     });
  };

  const saveProductData = (values: ProductFormValues, imageUrls: string[]) => {
      if (!firestore || !productsCollection) return;

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
  }
  
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return 'https://placehold.co/40x40/f3f4f6/333?text=?';
    return imageUrl.startsWith('http') ? imageUrl : `https://picsum.photos/seed/${imageUrl}/40/40`;
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
