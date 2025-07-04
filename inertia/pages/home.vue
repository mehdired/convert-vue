<script setup lang="ts">
import { Head, useForm } from "@inertiajs/vue3";
import { ref } from "vue";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Slider } from "~/components/ui/slider";
import { Badge } from "~/components/ui/badge";
import FilePreview from "~/components/file-preview.vue";
import ConversionProgress from "~/components/conversion-progress.vue";
import { Upload, AlertCircle, Loader2 } from "lucide-vue-next";
import type { ConvertedImage } from "../../types/types";

interface HomeProps {
  convertedImages?: ConvertedImage[];
  zipUrl?: string | null;
  error?: string | null;
}

defineProps<HomeProps>();

type FormType = {
  files: File[];
  format: string;
  quality: number;
};

const quality = ref(80);

const form = useForm<FormType>({
  files: [],
  format: "webp",
  quality: quality.value,
});

async function submit() {
  form.quality = quality.value;
  form.post("/", {
    preserveScroll: true,
  });
}

function onChangeFile(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files) {
    form.files = [...form.files, ...Array.from(files)];
  }
}

function removeFile(index: number) {
  form.files.splice(index, 1);
}

function onUpdateQuality(value: number[] | undefined) {
  if (value && value.length > 0) {
    quality.value = value[0];
    form.quality = value[0];
  }
}
</script>

<template>
  <Head title="Image Converter" />
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <!-- Main title -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Image Converter</h1>
        <p class="text-gray-600">
          Convert your images to WebP or AVIF format to optimize their size
        </p>
      </div>

      <!-- Error alert -->
      <Alert v-if="error" variant="destructive" class="mb-6">
        <AlertCircle class="h-4 w-4" />
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <!-- Main form -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Upload class="h-5 w-5" />
            Conversion Settings
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <form @submit.prevent="submit" class="space-y-6">
            <!-- Format selection -->
            <div class="space-y-3">
              <Label class="text-base font-medium">Output format</Label>
              <RadioGroup v-model="form.format" class="flex gap-6">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="webp" id="webp" />
                  <Label for="webp">WebP</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="avif" id="avif" />
                  <Label for="avif">AVIF</Label>
                </div>
              </RadioGroup>
              <span v-if="form.errors.format" class="text-sm text-red-600">
                {{ form.errors.format }}
              </span>
            </div>

            <!-- Quality -->
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <Label class="text-base font-medium">Quality</Label>
                <Badge variant="secondary">{{ quality }}%</Badge>
              </div>
              <Slider
                :model-value="[quality]"
                :min="1"
                :max="100"
                :step="5"
                @update:model-value="onUpdateQuality"
                class="w-full"
              />
              <p class="text-xs text-gray-500">
                Higher quality means larger file size
              </p>
            </div>

            <!-- Drop zone -->
            <div class="space-y-3">
              <Label class="text-base font-medium">Select images</Label>
              <div class="relative">
                <Label
                  for="file"
                  class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div
                    class="flex flex-col items-center justify-center pt-5 pb-6"
                  >
                    <Upload class="w-8 h-8 mb-2 text-gray-400" />
                    <p class="text-sm text-gray-500">
                      <span class="font-medium">Click to select</span> or drag
                      and drop your images here
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                  </div>
                </Label>
                <input
                  multiple
                  type="file"
                  name="files"
                  id="file"
                  @change="onChangeFile"
                  class="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/jpeg,image/png,image/webp"
                />
              </div>
              <span v-if="form.errors.files" class="text-sm text-red-600">
                {{ form.errors.files }}
              </span>
            </div>

            <!-- Submit button -->
            <Button
              type="submit"
              :disabled="form.processing || form.files.length === 0"
              class="w-full"
              size="lg"
            >
              <Upload v-if="!form.processing" class="w-4 h-4 mr-2" />
              <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
              {{
                form.processing
                  ? "Converting..."
                  : `Convert ${form.files.length} image${form.files.length > 1 ? "s" : ""}`
              }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Progress indicator -->
      <ConversionProgress
        :is-processing="form.processing"
        :files-count="form.files.length"
      />

      <!-- File preview -->
      <FilePreview
        :files="form.files"
        :converted-images="convertedImages"
        :zip-url="zipUrl"
        :on-remove-file="removeFile"
        @remove-file="removeFile"
      />
    </div>
  </div>
</template>
