<script setup lang="ts">
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import { Loader2 } from "lucide-vue-next";

interface ConversionProgressProps {
  isProcessing: boolean;
  filesCount: number;
}

defineProps<ConversionProgressProps>();
</script>

<template>
  <div v-if="isProcessing" class="w-full space-y-3">
    <div class="flex items-center justify-center gap-2">
      <Loader2 class="h-4 w-4 animate-spin" />
      <span class="text-sm font-medium">Converting images...</span>
      <Badge variant="secondary"
        >{{ filesCount }} file{{ filesCount > 1 ? "s" : "" }}</Badge
      >
    </div>

    <Progress :model-value="undefined" class="w-full" />

    <p class="text-xs text-center text-gray-500">
      Please wait while your images are being converted
    </p>
  </div>
</template>
