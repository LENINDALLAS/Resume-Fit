import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Message } from "primereact/message";
import { FileText, Upload, X } from "lucide-react";
import {
  ALLOWED_RESUME_EXTENSIONS,
  ALLOWED_RESUME_MIME_TYPES,
  jobDescriptionSchema,
  VALIDATION_LIMITS,
} from "@resume-fit/shared";
import { useAppDispatch, useAnalysis } from "../../hooks";
import { createAnalysis, resetAnalysis } from "../../store";
import { ScoreModal } from "./scoreModal";

const formSchema = z.object({ jobDescription: jobDescriptionSchema });
type FormValues = z.infer<typeof formSchema>;

function isAllowedResumeFile(file: File): boolean {
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  return (
    (ALLOWED_RESUME_EXTENSIONS as readonly string[]).includes(extension) &&
    (ALLOWED_RESUME_MIME_TYPES as readonly string[]).includes(file.type)
  );
}

export function ResumeUpload() {
  const dispatch = useAppDispatch();
  const { analysis, isLoading, error } = useAnalysis();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  function processFile(file: File | null) {
    if (!file) return;

    if (!isAllowedResumeFile(file)) {
      setFileError("Please upload a PDF or DOCX file.");
      setResumeFile(null);
      return;
    }

    if (file.size > VALIDATION_LIMITS.maxResumeFileSizeBytes) {
      setFileError("Resume file is too large.");
      setResumeFile(null);
      return;
    }

    setFileError(null);
    setResumeFile(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (isLoading) return;
    processFile(event.dataTransfer.files?.[0] ?? null);
  }

  function handleRemoveFile(event: React.MouseEvent) {
    event.stopPropagation();
    setResumeFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(values: FormValues) {
    if (!resumeFile) {
      setFileError("Resume is required.");
      return;
    }

    await dispatch(createAnalysis({ jobDescription: values.jobDescription, resume: resumeFile }));
  }

  function handleAnalyzeAnother() {
    dispatch(resetAnalysis());
    setResumeFile(null);
  }

  if (analysis) {
    return <ScoreModal analysis={analysis} onAnalyzeAnother={handleAnalyzeAnother} />;
  }

  return (
    <div className="popup-content">
      <h2 style={{ marginTop: 0 }}>Resume Analysis</h2>

      {error && <Message severity="error" text={error} style={{ width: "100%", marginBottom: 12 }} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field-group">
          <label htmlFor="jobDescription">Job Description</label>
          <InputTextarea
            id="jobDescription"
            rows={6}
            autoResize
            {...register("jobDescription")}
            aria-invalid={!!errors.jobDescription}
          />
          {errors.jobDescription && <span className="field-error">{errors.jobDescription.message}</span>}
        </div>

        <div className="field-group">
          <label htmlFor="resume">Resume (PDF or DOCX)</label>

          <div
            className={[
              "file-drop-zone",
              resumeFile ? "has-file" : "",
              fileError ? "has-error" : "",
              isDragging ? "dragging" : "",
              isLoading ? "is-disabled" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!isLoading) fileInputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (!isLoading) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            aria-label="Choose a resume file"
          >
            <input
              ref={fileInputRef}
              id="resume"
              type="file"
              accept=".pdf,.docx"
              onChange={(event) => processFile(event.target.files?.[0] ?? null)}
              disabled={isLoading}
              style={{ display: "none" }}
            />

            {resumeFile ? (
              <div className="file-drop-selected">
                <FileText size={20} />
                <span className="file-drop-name">{resumeFile.name}</span>
                <button
                  type="button"
                  className="file-drop-remove"
                  onClick={handleRemoveFile}
                  aria-label="Remove selected file"
                  disabled={isLoading}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="file-drop-empty">
                <Upload size={20} />
                <span>Click to browse or drag &amp; drop</span>
                <span className="text-secondary" style={{ fontSize: "0.78rem" }}>
                  PDF or DOCX, up to 5MB
                </span>
              </div>
            )}
          </div>

          {fileError && <span className="field-error">{fileError}</span>}
        </div>

        <Button
          type="submit"
          label={isLoading ? "Analyzing..." : "Analyze Resume"}
          icon={<Upload size={16} style={{ marginRight: 6 }} />}
          disabled={isLoading}
          style={{ width: "100%" }}
        />
      </form>
    </div>
  );
}
