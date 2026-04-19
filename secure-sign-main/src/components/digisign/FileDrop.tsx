import { Upload, FileText, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FileDropProps {
  file: File | null;
  onFile: (file: File | null) => void;
  label?: string;
  accept?: string;
  className?: string;
}

export const FileDrop = ({
  file,
  onFile,
  label = "Drop a file here, or click to browse",
  accept,
  className,
}: FileDropProps) => {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (files && files[0]) onFile(files[0]);
    },
    [onFile],
  );

  if (file) {
    return (
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-4",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onFile(null)}
          className="rounded-md p-2 text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/20 p-8 text-center transition-smooth hover:border-primary/60 hover:bg-secondary/40",
        drag && "border-primary bg-primary/5",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Upload className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">Files never leave your browser</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </button>
  );
};
