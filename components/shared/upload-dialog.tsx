'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useUpload } from '@/hooks/useUpload';

export function UploadDialog() {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { state, upload } = useUpload();

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }

  async function handleFiles(files: FileList) {
    const file = files[0];
    if (!file) return;
    const jobId = await upload(file);
    if (jobId) router.push(`/processing?jobId=${jobId}`);
  }

  const isLoading = state.status === 'uploading' || state.status === 'starting';

  return (
    <div className="flex items-center gap-2">
      <Link href="/project-intake">
        <Button variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          Add New Company
        </Button>
      </Link>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            Add New Company (Beta)
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg p-8">
          <DialogHeader>
            <DialogTitle className="text-left text-lg font-semibold">Upload document</DialogTitle>
          </DialogHeader>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-4 mb-6 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-solid py-14 transition-colors ${
              isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="rounded-full bg-slate-200 border-2 border-slate-200 p-3">
              <Upload className="h-5 w-5 text-black" />
            </div>

            {isLoading ? (
              <p className="text-sm font-medium text-slate-700">
                {state.status === 'uploading' ? state.progress : 'Starting pipeline…'}
              </p>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-700">
                  Drag and drop files here to upload
                </p>
                <p className="text-xs text-slate-400">
                  or{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-xs text-blue-600 underline underline-offset-2 hover:text-blue-700 cursor-pointer"
                    onClick={() => inputRef.current?.click()}
                  >
                    browse from your computer
                  </Button>
                </p>
                <p className="text-xs text-slate-400">Max file size: 50MB</p>
              </>
            )}

            {state.status === 'error' && (
              <p className="text-xs text-red-500">{state.error}</p>
            )}

            <Input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
