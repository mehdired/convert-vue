<script setup lang="ts">
import { Head, useForm } from "@inertiajs/vue3";
import { ref, type PropType } from "vue";
import Button from "~/components/ui/button/Button.vue";
import Card from "~/components/ui/card/Card.vue";
import CardContent from "~/components/ui/card/CardContent.vue";
import CardHeader from "~/components/ui/card/CardHeader.vue";
import CardTitle from "~/components/ui/card/CardTitle.vue";
import Label from "~/components/ui/label/Label.vue";
import RadioGroup from "~/components/ui/radio-group/RadioGroup.vue";
import RadioGroupItem from "~/components/ui/radio-group/RadioGroupItem.vue";
import Slider from "~/components/ui/slider/Slider.vue";
import type { ConvertedImage } from "../../types/types";

defineProps({
	convertedImage: Array as PropType<ConvertedImage[]>,
	zipUrl: String,
});

type FormType = {
	files: File[] | [];
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

function onUpdateQuality(value: number[] | undefined) {
	if (value && value.length > 0) {
		quality.value = value[0];
		form.quality = value[0];
	}
}
</script>

<template>
	<Head title="Homepage" />
	<div class="flex flex-col gap-4 items-center justify-center h-screen">
		<Card
			class="flex flex-col gap-4 items-center justify-center p-6 w-full max-w-[500px]"
		>
			<form
				method="post"
				action="/"
				@submit.prevent="submit"
				class="w-full"
			>
				<CardHeader class="text-center">
					<CardTitle>Convert Image</CardTitle>
				</CardHeader>
				<CardContent
					class="flex flex-col gap-4 items-center justify-center"
				>
					<RadioGroup name="format" :default-value="form.format">
						<div class="flex items-center gap-2">
							<RadioGroupItem value="webp" id="webp" />
							<Label for="webp">WebP</Label>
						</div>
						<div class="flex items-center gap-2">
							<RadioGroupItem value="avif" id="avif" />
							<Label for="avif">AVIF</Label>
						</div>
						<span v-if="form.errors.format">
							{{ form.errors.format }}
						</span>
					</RadioGroup>
					<div class="w-full">
						<Label
							for="file"
							class="flex items-center justify-center w-full cursor-pointer border border-dashed border-gray-300 rounded-md p-2 text-center h-[100px]"
						>
							Drop file here
						</Label>
						<input
							multiple
							type="file"
							name="file"
							id="file"
							@input="onChangeFile"
							class="absolute opacity-0"
							accept="image/jpeg, image/png, image/webp"
						/>
						<span v-if="form.errors.files">
							{{ form.errors.files }}
						</span>
					</div>
					<div class="w-full">
						<p class="text-xs text-center text-gray-500">
							Quality: {{ quality }}
						</p>
						<Slider
							:model-value="[quality]"
							:min="0"
							:max="100"
							:step="10"
							:default-value="[quality]"
							@update:model-value="onUpdateQuality"
						/>
					</div>
					<ul
						class="w-full"
						v-for="file in form.files"
						v-if="!convertedImage"
					>
						<li class="text-xs text-gray-500">
							{{ file.name }}
						</li>
					</ul>
					<ul v-for="image in convertedImage" class="w-full" v-else>
						<li>
							<a
								:href="image.url"
								download
								class="text-xs w-full text-gray-500 flex justify-between items-center"
							>
								<span>{{ image.name }}</span>
								<span>Download</span>
							</a>
						</li>
					</ul>
					<div v-if="zipUrl">
						<a
							:href="zipUrl"
							download
							class="text-xs text-gray-500"
						>
							Download all images (ZIP)
						</a>
					</div>
					<div>
						<Button
							class="cursor-pointer"
							:disabled="form.processing || !form.files"
							>Send</Button
						>
					</div>
				</CardContent>
			</form>
		</Card>
	</div>
</template>
