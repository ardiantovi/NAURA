'use client';

import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot } from 'firebase/storage';
import { useAuth } from '@/firebase'; // Assuming useAuth provides the initialized Firebase app
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, CheckCircle, AlertCircle, Copy } from 'lucide-react';

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [downloadURL, setDownloadURL] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { auth } = useAuth(); // Get the auth instance which contains the app

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDownloadURL('');
      setError('');
      setUploadProgress(0);
    }
  };

  const handleUpload = () => {
    if (!file || !auth) {
      setError('Please select a file and ensure you are logged in.');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    // Note: Image compression would ideally happen here using a client-side library.
    // Since we cannot add new libraries, we proceed with the original file.

    const storage = getStorage(auth.app);
    const storageRef = ref(storage, `uploads/${new Date().getTime()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (uploadError) => {
        console.error("Upload failed:", uploadError);
        // Handle specific Firebase Storage errors
        switch (uploadError.code) {
          case 'storage/unauthorized':
            setError('Permission denied. Please check your Storage security rules.');
            break;
          case 'storage/canceled':
            setError('Upload was canceled.');
            break;
          default:
            setError('An unknown error occurred during upload.');
            break;
        }
        setIsUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setDownloadURL(url);
        } catch (e) {
          setError('Failed to get download URL.');
        }
        setIsUploading(false);
        setFile(null); // Clear file input after successful upload
      }
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(downloadURL).then(() => {
      // Maybe show a small success toast/message here in a real app
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-6 w-6" />
          Firebase Image Uploader
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input id="picture" type="file" onChange={handleFileChange} accept="image/*" disabled={isUploading} />
        </div>

        {file && !isUploading && !downloadURL && (
            <Button onClick={handleUpload} className="w-full">
                Upload &quot;{file.name}&quot;
            </Button>
        )}

        {isUploading && (
          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">Uploading...</p>
            <Progress value={uploadProgress} />
            <p className="text-sm text-center font-mono">{Math.round(uploadProgress)}%</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {downloadURL && (
          <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
            <AlertTitle className="text-green-800 dark:text-green-300">Upload Successful!</AlertTitle>
            <AlertDescription>
              <div className="flex items-center justify-between gap-2 mt-2">
                <Input
                  readOnly
                  value={downloadURL}
                  className="text-xs flex-grow bg-white dark:bg-card"
                />
                <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy URL">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
