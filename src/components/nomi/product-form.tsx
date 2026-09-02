"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface ProductFormValues {
  name: string;
  description: string;
}

export interface ProductFormProps {
  values: ProductFormValues;
  onChange: (values: ProductFormValues) => void;
  className?: string;
}

const MAX_DESCRIPTION_LENGTH = 300;

export function ProductForm({ values, onChange, className }: ProductFormProps) {
  const descriptionId = React.useId();
  const nameId = React.useId();

  return (
    <div className={"flex flex-col gap-5 " + (className ?? "")}>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={nameId}
          className="text-sm font-medium text-foreground"
        >
          Product name
        </label>
        <Input
          id={nameId}
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          placeholder="e.g. Ceramic pour-over coffee dripper"
          maxLength={80}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor={descriptionId}
            className="text-sm font-medium text-foreground"
          >
            Product description
          </label>
          <span className="font-mono text-xs text-muted-foreground">
            {values.description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <Textarea
          id={descriptionId}
          value={values.description}
          onChange={(e) =>
            onChange({
              ...values,
              description: e.target.value.slice(0, MAX_DESCRIPTION_LENGTH),
            })
          }
          placeholder="What is it, who's it for, what makes it worth advertising?"
          rows={4}
        />
      </div>
    </div>
  );
}