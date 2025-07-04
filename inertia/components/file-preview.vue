<script setup lang="ts">
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { X, Download, FileImage } from "lucide-vue-next";

interface FilePreviewProps {
  files: File[];
  convertedImages?: Array<{ name: string; url: string }>;
  zipUrl?: string | null;
  onRemoveFile?: (index: number) => void;
}

defineProps<FilePreviewProps>();
defineEmits<{
  removeFile: [index: number];
}>();
</script>

<template>
  <!-- Selected files before conversion -->
  <Card v-if="files.length > 0 && !convertedImages?.length" class="w-full">
    <CardContent class="p-4">
      <div class="flex items-center gap-2 mb-3">
        <FileImage class="h-4 w-4" />
        <h3 class="font-medium">Selected files ({{ files.length }})</h3>
      </div>

      <div class="space-y-2">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <FileImage class="h-4 w-4 text-gray-500" />
            <span class="text-sm truncate">{{ file.name }}</span>
            <Badge variant="secondary" class="text-xs">
              {{ (file.size / 1024 / 1024).toFixed(1) }}MB
            </Badge>
          </div>

          <Button
            v-if="onRemoveFile"
            variant="ghost"
            size="sm"
            @click="$emit('removeFile', index)"
            class="h-6 w-6 p-0"
          >
            <X class="h-3 w-3" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card v-if="convertedImages?.length" class="w-full">
    <CardContent class="p-4">
      <div class="flex items-center gap-2 mb-3">
        <Download class="h-4 w-4 text-green-600" />
        <h3 class="font-medium text-green-600">
          Conversion completed ({{ convertedImages.length }} file{{
            convertedImages.length > 1 ? "s" : ""
          }})
        </h3>
      </div>

      <div class="space-y-2">
        <div
          v-for="image in convertedImages"
          :key="image.name"
          class="flex items-center justify-between p-2 bg-green-50 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <FileImage class="h-4 w-4 text-green-600" />
            <span class="text-sm truncate">{{ image.name }}</span>
            <Badge variant="outline" class="text-xs text-green-600">
              Converted
            </Badge>
          </div>

          <Button variant="outline" size="sm" asChild>
            <a :href="image.url" download class="flex items-center gap-1">
              <Download class="h-3 w-3" />
              Download
            </a>
          </Button>
        </div>
      </div>

      <div v-if="zipUrl" class="mt-4 pt-3 border-t">
        <Button variant="default" class="w-full" asChild>
          <a
            :href="zipUrl"
            download
            class="flex items-center justify-center gap-2"
          >
            <Download class="h-4 w-4" />
            Download all (ZIP)
          </a>
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
